package fit.tlcn.fashionshopbe.service.impl;

import com.cloudinary.Cloudinary;
import fit.tlcn.fashionshopbe.constant.PaymentMethod;
import fit.tlcn.fashionshopbe.constant.Status;
import fit.tlcn.fashionshopbe.constant.TransactionType;
import fit.tlcn.fashionshopbe.dto.*;
import fit.tlcn.fashionshopbe.entity.*;
import fit.tlcn.fashionshopbe.repository.*;
import fit.tlcn.fashionshopbe.security.JwtTokenProvider;
import fit.tlcn.fashionshopbe.service.CloudinaryService;
import fit.tlcn.fashionshopbe.service.RefreshTokenService;
import fit.tlcn.fashionshopbe.service.UserService;
import fit.tlcn.fashionshopbe.service.VNPayService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class UserServiceImpl implements UserService {
    @Autowired
    UserRepository userRepository;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    BCryptPasswordEncoder passwordEncoder;

    @Autowired
    JwtTokenProvider jwtTokenProvider;

    @Autowired
    RefreshTokenService refreshTokenService;

    @Autowired
    CloudinaryService cloudinaryService;

    @Autowired
    ProductItemRepository productItemRepository;

    @Autowired
    CartItemRepository cartItemRepository;

    @Autowired
    CartRepository cartRepository;

    @Autowired
    OrderRepository orderRepository;

    @Autowired
    OrderItemRepository orderItemRepository;

    @Autowired
    ProductRepository productRepository;

    @Autowired
    VNPayService vnPayService;

    @Autowired
    DeliveryRepository deliveryRepository;

    @Autowired
    TransactionRepository transactionRepository;

    @Autowired
    RatingRepository ratingRepository;

    private static final String PHONE_NUMBER_REGEX = "^(\\+\\d{1,3}[- ]?)?\\d{10}$";

    @Override
    public ResponseEntity<GenericResponse> registerUser(RegisterRequest registerRequest) {
        try {
            Optional<User> userOptionalEmail = userRepository.findByEmail(registerRequest.getEmail());
            if (userOptionalEmail.isPresent()) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body(
                        GenericResponse.builder()
                                .success(false)
                                .message("Email already in use")
                                .result("Conflict")
                                .statusCode(HttpStatus.CONFLICT.value())
                                .build()
                );
            }

            if (!isValidPhoneNumber(registerRequest.getPhone())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                        GenericResponse.builder()
                                .success(false)
                                .message("Invalid phone number format")
                                .result("Bad request")
                                .statusCode(HttpStatus.BAD_REQUEST.value())
                                .build()
                );
            }

            Optional<User> userOptionalPhone = userRepository.findByPhone(registerRequest.getPhone());
            if (userOptionalPhone.isPresent()) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body(
                        GenericResponse.builder()
                                .success(false)
                                .message("Phone number already in use")
                                .result("Conflict")
                                .statusCode(HttpStatus.CONFLICT.value())
                                .build()
                );
            }

            if (!registerRequest.getConfirmPassword().equals(registerRequest.getPassword())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                        GenericResponse.builder()
                                .success(false)
                                .message("Password and Confirm Password don't match")
                                .result("Bad request")
                                .statusCode(HttpStatus.BAD_REQUEST.value())
                                .build()
                );
            }

            User user = new User();
            user.setFullname(registerRequest.getFullname());
            user.setEmail(registerRequest.getEmail());
            user.setPhone(registerRequest.getPhone());
            user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
            user.setRole(roleRepository.findByName("CUSTOMER"));

            userRepository.save(user);

            UserResponse userResponse = new UserResponse();
            userResponse.setUserId(user.getUserId());
            userResponse.setFullname(user.getFullname());
            userResponse.setEmail(user.getEmail());
            userResponse.setPhone(user.getPhone());
            userResponse.setIsVerified(user.getIsVerified());
            userResponse.setDob(user.getDob());
            userResponse.setGender(user.getGender());
            userResponse.setRole(user.getRole().getName());
            userResponse.setAddress(user.getAddress());
            userResponse.setAvatar(user.getAvatar());
            userResponse.setEWallet(user.getEWallet());
            userResponse.setCreatedAt(user.getCreatedAt());
            userResponse.setUpdatedAt(user.getUpdatedAt());
            userResponse.setIsActive(user.getIsActive());

            return ResponseEntity.status(HttpStatus.OK).body(
                    GenericResponse.builder()
                            .success(true)
                            .message("Information submitted successfully")
                            .result(userResponse)
                            .statusCode(HttpStatus.OK.value())
                            .build()
            );

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    GenericResponse.builder()
                            .success(false)
                            .message(e.getMessage())
                            .result("Internal server error")
                            .statusCode(HttpStatus.INTERNAL_SERVER_ERROR.value())
                            .build()
            );
        }
    }

    @Override
    public ResponseEntity<GenericResponse> login(LoginRequest loginRequest) {
        try {
            Optional<User> userOptional = userRepository.findByEmailAndIsVerifiedIsTrueAndIsActiveIsTrue(loginRequest.getEmail());
            if (userOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                        GenericResponse.builder()
                                .success(false)
                                .message("The account does not exist or has been banned")
                                .result("Not found")
                                .statusCode(HttpStatus.NOT_FOUND.value())
                                .build());
            }

            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));
            SecurityContextHolder.getContext().setAuthentication(authentication);

            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            String accessToken = jwtTokenProvider.generateAccessToken(userDetails);
            RefreshToken refreshToken = new RefreshToken();
            String token = jwtTokenProvider.generateRefreshToken(userDetails);
            refreshToken.setToken(token);
            refreshToken.setUser(userOptional.get());
            //invalid all refreshToken before
            refreshTokenService.revokeRefreshToken(userOptional.get());
            refreshTokenService.save(refreshToken);
            Map<String, String> tokenMap = new HashMap<>();
            tokenMap.put("accessToken", accessToken);
            tokenMap.put("refreshToken", token);

            User user = userOptional.get();
            user.setLastLoginAt(new Date());
            userRepository.save(user);

            return ResponseEntity.ok().body(GenericResponse.builder()
                    .success(true)
                    .message("Login successfully")
                    .result(tokenMap)
                    .statusCode(HttpStatus.OK.value())
                    .build());

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    GenericResponse.builder()
                            .success(false)
                            .message(e.getMessage())
                            .result("Email or Password is incorrect. Please type again!")
                            .statusCode(HttpStatus.INTERNAL_SERVER_ERROR.value())
                            .build()
            );
        }
    }

    @Override
    public ResponseEntity<GenericResponse> updateUserProfile(UserProfileUpdateRequest request, String emailFromToken) {
        try {
            Optional<User> userOptional = userRepository.findByEmail(emailFromToken);
            if (userOptional.isPresent()) {
                User user = userOptional.get();
                if (request.getFullname() != null) {
                    user.setFullname(request.getFullname());
                }

                if (request.getPhone() != null && !request.getPhone().equals(user.getPhone())) {
                    if (!isValidPhoneNumber(request.getPhone())) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                                GenericResponse.builder()
                                        .success(false)
                                        .message("Invalid phone number format")
                                        .result("Bad request")
                                        .statusCode(HttpStatus.BAD_REQUEST.value())
                                        .build()
                        );
                    }

                    Optional<User> userOptionalPhone = userRepository.findByPhone(request.getPhone());
                    if (userOptionalPhone.isPresent()) {
                        return ResponseEntity.status(HttpStatus.CONFLICT).body(
                                GenericResponse.builder()
                                        .success(false)
                                        .message("Phone number already in use")
                                        .result("Conflict")
                                        .statusCode(HttpStatus.CONFLICT.value())
                                        .build()
                        );
                    }

                    user.setPhone(request.getPhone());
                }

                if (request.getDob() != null) {
                    user.setDob(request.getDob());
                }

                if (request.getGender() != null) {
                    user.setGender(request.getGender());
                }

                if (request.getAddress() != null) {
                    user.setAddress(request.getAddress());
                }

                if (request.getAvatar() != null) {
                    if (user.getAvatar() != null && user.getAvatar().contains("https://res.cloudinary.com/dhkkwz2fo/image/upload")) {
                        cloudinaryService.deleteAvatar(user.getAvatar());
                    }
                    String avatarUrl = cloudinaryService.uploadUserAvatar(request.getAvatar());
                    user.setAvatar(avatarUrl);
                }

                if (request.getEWallet() != null) {
                    user.setEWallet(request.getEWallet());
                }


                userRepository.save(user);

                UserResponse userResponse = new UserResponse();
                userResponse.setUserId(user.getUserId());
                userResponse.setFullname(user.getFullname());
                userResponse.setEmail(user.getEmail());
                userResponse.setPhone(user.getPhone());
                userResponse.setIsVerified(user.getIsVerified());
                userResponse.setDob(user.getDob());
                userResponse.setGender(user.getGender());
                userResponse.setRole(user.getRole().getName());
                userResponse.setAddress(user.getAddress());
                userResponse.setAvatar(user.getAvatar());
                userResponse.setEWallet(user.getEWallet());
                userResponse.setCreatedAt(user.getCreatedAt());
                userResponse.setUpdatedAt(user.getUpdatedAt());
                userResponse.setIsActive(user.getIsActive());

                return ResponseEntity.status(HttpStatus.OK).body(
                        GenericResponse.builder()
                                .success(true)
                                .message("Profile successfully updated")
                                .result(userResponse)
                                .statusCode(HttpStatus.OK.value())
                                .build()
                );

            } else {
                return ResponseEntity.status(401)
                        .body(GenericResponse.builder()
                                .success(false)
                                .message("Unauthorized")
                                .result("Invalid token")
                                .statusCode(HttpStatus.UNAUTHORIZED.value())
                                .build());
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    GenericResponse.builder()
                            .success(false)
                            .message(e.getMessage())
                            .result("Internal server error")
                            .statusCode(HttpStatus.INTERNAL_SERVER_ERROR.value())
                            .build()
            );
        }
    }

    @Override
    public ResponseEntity<GenericResponse> changePassword(ChangePasswordRequest request, String emailFromToken) {
        try {
            Optional<User> userOptional = userRepository.findByEmail(emailFromToken);
            if (userOptional.isPresent()) {
                User user = userOptional.get();
                if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                            .body(GenericResponse.builder()
                                    .success(false)
                                    .message("You entered current password incorrectly")
                                    .result("Bad request")
                                    .statusCode(HttpStatus.BAD_REQUEST.value())
                                    .build());
                }

                if (request.getNewPassword().equals(request.getCurrentPassword())) {
                    return ResponseEntity.status(HttpStatus.CONFLICT)
                            .body(GenericResponse.builder()
                                    .success(false)
                                    .message("New password must be different from the current password")
                                    .result("Conflict")
                                    .statusCode(HttpStatus.CONFLICT.value())
                                    .build());
                }

                if (!request.getConfirmPassword().equals(request.getNewPassword())) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                            .body(GenericResponse.builder()
                                    .success(false)
                                    .message("New password and confirm password does not match")
                                    .result("Bad request")
                                    .statusCode(HttpStatus.BAD_REQUEST.value())
                                    .build());
                }

                user.setPassword(passwordEncoder.encode(request.getNewPassword()));
                userRepository.save(user);
                return ResponseEntity.status(HttpStatus.OK)
                        .body(GenericResponse.builder()
                                .success(true)
                                .message("Change password successfully")
                                .result("OK")
                                .statusCode(HttpStatus.OK.value())
                                .build());
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(GenericResponse.builder()
                                .success(false)
                                .message("Unauthorized")
                                .result("Invalid token")
                                .statusCode(HttpStatus.UNAUTHORIZED.value())
                                .build());
            }

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    GenericResponse.builder()
                            .success(false)
                            .message(e.getMessage())
                            .result("Internal server error")
                            .statusCode(HttpStatus.INTERNAL_SERVER_ERROR.value())
                            .build()
            );
        }
    }

    @Override
    public ResponseEntity<GenericResponse> getUserProfile(String emailFromToken) {
        try {
            Optional<User> userOptional = userRepository.findByEmail(emailFromToken);
            if (userOptional.isPresent()) {
                User user = userOptional.get();

                UserResponse userResponse = new UserResponse();
                userResponse.setUserId(user.getUserId());
                userResponse.setFullname(user.getFullname());
                userResponse.setEmail(user.getEmail());
                userResponse.setPhone(user.getPhone());
                userResponse.setIsVerified(user.getIsVerified());
                userResponse.setDob(user.getDob());
                userResponse.setGender(user.getGender());
                userResponse.setRole(user.getRole().getName());
                userResponse.setAddress(user.getAddress());
                userResponse.setAvatar(user.getAvatar());
                userResponse.setEWallet(user.getEWallet());
                userResponse.setCreatedAt(user.getCreatedAt());
                userResponse.setUpdatedAt(user.getUpdatedAt());
                userResponse.setIsActive(user.getIsActive());

                return ResponseEntity.status(HttpStatus.OK).body(
                        GenericResponse.builder()
                                .success(true)
                                .message("Get your profile successfully")
                                .result(userResponse)
                                .statusCode(HttpStatus.OK.value())
                                .build()
                );

            } else {
                return ResponseEntity.status(401)
                        .body(GenericResponse.builder()
                                .success(false)
                                .message("Unauthorized")
                                .result("Invalid token")
                                .statusCode(HttpStatus.UNAUTHORIZED.value())
                                .build());
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    GenericResponse.builder()
                            .success(false)
                            .message(e.getMessage())
                            .result("Internal server error")
                            .statusCode(HttpStatus.INTERNAL_SERVER_ERROR.value())
                            .build()
            );
        }
    }

    @Override
    public ResponseEntity<GenericResponse> addToCart(AddToCartRequest request, String emailFromToken) {
        try {
            Optional<User> userOptional = userRepository.findByEmail(emailFromToken);
            if (userOptional.isPresent()) {
                Optional<ProductItem> productItemOptional = productItemRepository.findById(request.getProductItemId());
                if (productItemOptional.isEmpty()) {
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                            GenericResponse.builder()
                                    .success(true)
                                    .message("Not found product item")
                                    .result("Not found")
                                    .statusCode(HttpStatus.NOT_FOUND.value())
                                    .build()
                    );
                }

                Optional<CartItem> cartItemOptional = cartItemRepository.findByProductItem(productItemOptional.get());

                if (cartItemOptional.isPresent()) {
                    CartItem cartItem = cartItemOptional.get();
                    if ((cartItem.getQuantity() + request.getQuantity()) <= (cartItem.getProductItem().getQuantity() - cartItem.getProductItem().getSold())) {
                        cartItem.setQuantity((cartItem.getQuantity() + request.getQuantity()));
                    } else {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                                GenericResponse.builder()
                                        .success(false)
                                        .message("Total quantity must be less than or equal to the inventory")
                                        .result("Bad request")
                                        .statusCode(HttpStatus.BAD_REQUEST.value())
                                        .build()
                        );
                    }
                    cartItemRepository.save(cartItem);
                    Map<String, Object> map = new HashMap<>();
                    map.put("cartItemId", cartItem.getCartItemId());
                    map.put("cartId", cartItem.getCart().getCardId());
                    map.put("userId", cartItem.getCart().getUser().getUserId());
                    map.put("productItemId", cartItem.getProductItem().getProductItemId());
                    List<String> styleValueNames = new ArrayList<>();
                    for (StyleValue styleValue : cartItem.getProductItem().getStyleValues()) {
                        styleValueNames.add(styleValue.getName());
                    }
                    map.put("styleValues", styleValueNames);
                    map.put("productId", cartItem.getProductItem().getParent().getProductId());
                    map.put("productName", cartItem.getProductItem().getParent().getName());
                    map.put("image", cartItem.getProductItem().getImage());
                    map.put("productPrice", cartItem.getProductItem().getPrice());
                    map.put("productPromotionalPrice", cartItem.getProductItem().getPromotionalPrice());
                    map.put("quantity", cartItem.getQuantity());

                    return ResponseEntity.status(HttpStatus.OK).body(
                            GenericResponse.builder()
                                    .success(true)
                                    .message("Add to cart successfully")
                                    .result(map)
                                    .statusCode(HttpStatus.OK.value())
                                    .build()
                    );
                } else {
                    CartItem cartItem = new CartItem();
                    Cart cart = cartRepository.findByUser(userOptional.get());
                    cartItem.setCart(cart);
                    cartItem.setProductItem(productItemOptional.get());
                    if (request.getQuantity() <= (cartItem.getProductItem().getQuantity() - cartItem.getProductItem().getSold())) {
                        cartItem.setQuantity(request.getQuantity());
                    } else {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                                GenericResponse.builder()
                                        .success(false)
                                        .message("Quantity must be less than or equal to the inventory")
                                        .result("Bad request")
                                        .statusCode(HttpStatus.BAD_REQUEST.value())
                                        .build()
                        );
                    }

                    cart.setQuantity(cart.getQuantity() + 1);
                    cartItemRepository.save(cartItem);
                    cartRepository.save(cart);

                    Map<String, Object> map = new HashMap<>();
                    map.put("cartItemId", cartItem.getCartItemId());
                    map.put("cartId", cartItem.getCart().getCardId());
                    map.put("userId", cartItem.getCart().getUser().getUserId());
                    map.put("productItemId", cartItem.getProductItem().getProductItemId());
                    List<String> styleValueNames = new ArrayList<>();
                    for (StyleValue styleValue : cartItem.getProductItem().getStyleValues()) {
                        styleValueNames.add(styleValue.getName());
                    }
                    map.put("styleValues", styleValueNames);
                    map.put("productId", cartItem.getProductItem().getParent().getProductId());
                    map.put("productName", cartItem.getProductItem().getParent().getName());
                    map.put("image", cartItem.getProductItem().getImage());
                    map.put("productPrice", cartItem.getProductItem().getPrice());
                    map.put("productPromotionalPrice", cartItem.getProductItem().getPromotionalPrice());
                    map.put("quantity", cartItem.getQuantity());

                    return ResponseEntity.status(HttpStatus.OK).body(
                            GenericResponse.builder()
                                    .success(true)
                                    .message("Add to cart successfully")
                                    .result(map)
                                    .statusCode(HttpStatus.OK.value())
                                    .build()
                    );
                }
            } else {
                return ResponseEntity.status(401)
                        .body(GenericResponse.builder()
                                .success(false)
                                .message("Unauthorized")
                                .result("Invalid token")
                                .statusCode(HttpStatus.UNAUTHORIZED.value())
                                .build());
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    GenericResponse.builder()
                            .success(false)
                            .message(e.getMessage())
                            .result("Internal server error")
                            .statusCode(HttpStatus.INTERNAL_SERVER_ERROR.value())
                            .build()
            );
        }
    }

    @Override
    public ResponseEntity<GenericResponse> getCart(String emailFromToken) {
        try {
            Optional<User> userOptional = userRepository.findByEmail(emailFromToken);
            if (userOptional.isPresent()) {
                Cart cart = cartRepository.findByUser(userOptional.get());
                List<CartItem> cartItemList = cartItemRepository.findByCart(cart);
                Map<String, Object> map = new HashMap<>();
                List<CartItemResponse> cartItemResponseList = new ArrayList<>();
                if (!cartItemList.isEmpty()) {
                    for (CartItem cartItem : cartItemList) {
                        CartItemResponse cartItemResponse = new CartItemResponse();
                        cartItemResponse.setCartItemId(cartItem.getCartItemId());
                        cartItemResponse.setProductItemId(cartItem.getProductItem().getProductItemId());
                        cartItemResponse.setProductName(cartItem.getProductItem().getParent().getName());
                        cartItemResponse.setImage(cartItem.getProductItem().getImage());
                        List<String> styleValueNames = new ArrayList<>();
                        for (StyleValue styleValue : cartItem.getProductItem().getStyleValues()) {
                            styleValueNames.add(styleValue.getName());
                        }
                        cartItemResponse.setStyleValues(styleValueNames);
                        cartItemResponse.setQuantity(cartItem.getQuantity());
                        cartItemResponse.setProductPrice(cartItem.getProductItem().getPrice());
                        cartItemResponse.setProductPromotionalPrice(cartItem.getProductItem().getPromotionalPrice());
                        cartItemResponse.setAmount(cartItem.getProductItem().getPromotionalPrice() * cartItem.getQuantity());

                        cartItemResponseList.add(cartItemResponse);
                    }
                }
                map.put("cartItems", cartItemResponseList);
                map.put("cartId", cart.getCardId());
                map.put("Quantity of cart items in cart", cart.getQuantity());

                return ResponseEntity.status(HttpStatus.OK).body(
                        GenericResponse.builder()
                                .success(true)
                                .message("This is your cart's information")
                                .result(map)
                                .statusCode(HttpStatus.OK.value())
                                .build()
                );

            } else {
                return ResponseEntity.status(401)
                        .body(GenericResponse.builder()
                                .success(false)
                                .message("Unauthorized")
                                .result("Invalid token")
                                .statusCode(HttpStatus.UNAUTHORIZED.value())
                                .build());
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    GenericResponse.builder()
                            .success(false)
                            .message(e.getMessage())
                            .result("Internal server error")
                            .statusCode(HttpStatus.INTERNAL_SERVER_ERROR.value())
                            .build()
            );
        }
    }

    @Override
    public ResponseEntity<GenericResponse> getCartItem(Integer cartItemId, String emailFromToken) {
        try {
            Optional<CartItem> cartItemOptional = cartItemRepository.findByCartItemIdAndCart_User_Email(cartItemId, emailFromToken);
            if (cartItemOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                        GenericResponse.builder()
                                .success(false)
                                .message("Not found cart item")
                                .result("Not found")
                                .statusCode(HttpStatus.NOT_FOUND.value())
                                .build()
                );
            }
            CartItem cartItem = cartItemOptional.get();

            CartItemResponse cartItemResponse = new CartItemResponse();
            cartItemResponse.setCartItemId(cartItem.getCartItemId());
            cartItemResponse.setProductItemId(cartItem.getProductItem().getProductItemId());
            cartItemResponse.setProductName(cartItem.getProductItem().getParent().getName());
            cartItemResponse.setImage(cartItem.getProductItem().getImage());
            List<String> styleValueNames = new ArrayList<>();
            for (StyleValue styleValue : cartItem.getProductItem().getStyleValues()) {
                styleValueNames.add(styleValue.getName());
            }
            cartItemResponse.setStyleValues(styleValueNames);
            cartItemResponse.setQuantity(cartItem.getQuantity());
            cartItemResponse.setProductPrice(cartItem.getProductItem().getPrice());
            cartItemResponse.setProductPromotionalPrice(cartItem.getProductItem().getPromotionalPrice());
            cartItemResponse.setAmount(cartItem.getProductItem().getPromotionalPrice() * cartItem.getQuantity());

            return ResponseEntity.status(HttpStatus.OK).body(
                    GenericResponse.builder()
                            .success(true)
                            .message("This is information of cart item")
                            .result(cartItemResponse)
                            .statusCode(HttpStatus.OK.value())
                            .build()
            );


        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    GenericResponse.builder()
                            .success(false)
                            .message(e.getMessage())
                            .result("Internal server error")
                            .statusCode(HttpStatus.INTERNAL_SERVER_ERROR.value())
                            .build()
            );
        }
    }

    @Override
    public ResponseEntity<GenericResponse> updateCartItem(Integer cartItemId, UpdateCartItemRequest request, String emailFromToken) {
        try {
            Optional<CartItem> cartItemOptional = cartItemRepository.findByCartItemIdAndCart_User_Email(cartItemId, emailFromToken);
            if (cartItemOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                        GenericResponse.builder()
                                .success(false)
                                .message("Not found cart item")
                                .result("Not found")
                                .statusCode(HttpStatus.NOT_FOUND.value())
                                .build()
                );
            }
            CartItem cartItem = cartItemOptional.get();
            if (request.getQuantity() <= (cartItem.getProductItem().getQuantity() - cartItem.getProductItem().getSold())) {
                cartItem.setQuantity(request.getQuantity());
            } else {
                Integer inventory = cartItem.getProductItem().getQuantity() - cartItem.getProductItem().getSold();
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                        GenericResponse.builder()
                                .success(false)
                                .message("Quantity must be less than or equal to the inventory")
                                .result(inventory)
                                .statusCode(HttpStatus.BAD_REQUEST.value())
                                .build()
                );
            }
            cartItemRepository.save(cartItem);

            CartItemResponse cartItemResponse = new CartItemResponse();
            cartItemResponse.setCartItemId(cartItem.getCartItemId());
            cartItemResponse.setProductItemId(cartItem.getProductItem().getProductItemId());
            cartItemResponse.setProductName(cartItem.getProductItem().getParent().getName());
            List<String> styleValueNames = new ArrayList<>();
            for (StyleValue styleValue : cartItem.getProductItem().getStyleValues()) {
                styleValueNames.add(styleValue.getName());
            }
            cartItemResponse.setStyleValues(styleValueNames);
            cartItemResponse.setQuantity(cartItem.getQuantity());
            cartItemResponse.setProductPrice(cartItem.getProductItem().getPrice());
            cartItemResponse.setProductPromotionalPrice(cartItem.getProductItem().getPromotionalPrice());
            cartItemResponse.setAmount(cartItem.getProductItem().getPromotionalPrice() * cartItem.getQuantity());

            return ResponseEntity.status(HttpStatus.OK).body(
                    GenericResponse.builder()
                            .success(true)
                            .message("Updated cart item successfully")
                            .result(cartItemResponse)
                            .statusCode(HttpStatus.OK.value())
                            .build()
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    GenericResponse.builder()
                            .success(false)
                            .message(e.getMessage())
                            .result("Internal server error")
                            .statusCode(HttpStatus.INTERNAL_SERVER_ERROR.value())
                            .build()
            );
        }
    }

    @Override
    public ResponseEntity<GenericResponse> deleteCartItem(Integer cartItemId, String emailFromToken) {
        try {
            Optional<CartItem> cartItemOptional = cartItemRepository.findByCartItemIdAndCart_User_Email(cartItemId, emailFromToken);
            if (cartItemOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                        GenericResponse.builder()
                                .success(false)
                                .message("Not found cart item")
                                .result("Not found")
                                .statusCode(HttpStatus.NOT_FOUND.value())
                                .build()
                );
            }
            CartItem cartItem = cartItemOptional.get();
            Cart cart = cartItem.getCart();
            cartItemRepository.delete(cartItem);
            cart.setQuantity(cart.getQuantity() - 1);
            cartRepository.save(cart);

            return ResponseEntity.status(HttpStatus.OK).body(
                    GenericResponse.builder()
                            .success(true)
                            .message("Deleted cart item successfully")
                            .result("OK")
                            .statusCode(HttpStatus.OK.value())
                            .build()
            );


        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    GenericResponse.builder()
                            .success(false)
                            .message(e.getMessage())
                            .result("Internal server error")
                            .statusCode(HttpStatus.INTERNAL_SERVER_ERROR.value())
                            .build()
            );
        }
    }

    @Override
    public ResponseEntity<GenericResponse> deleteAllCartItemsInCart(String emailFromToken) {
        try {
            List<CartItem> cartItemList = cartItemRepository.findByCart_User_Email(emailFromToken);
            if (!cartItemList.isEmpty()) {
                Cart cart = cartRepository.findByUser_Email(emailFromToken);
                cartItemRepository.deleteAllByCart(cart);
                cart.setQuantity(0);
                cartRepository.save(cart);

                return ResponseEntity.status(HttpStatus.OK).body(
                        GenericResponse.builder()
                                .success(true)
                                .message("Deleted all cart items in cart successfully")
                                .result("OK")
                                .statusCode(HttpStatus.OK.value())
                                .build()
                );
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(GenericResponse.builder()
                                .success(false)
                                .message("Cart is empty")
                                .result("Bad request")
                                .statusCode(HttpStatus.BAD_REQUEST.value())
                                .build());
            }

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    GenericResponse.builder()
                            .success(false)
                            .message(e.getMessage())
                            .result("Internal server error")
                            .statusCode(HttpStatus.INTERNAL_SERVER_ERROR.value())
                            .build()
            );
        }
    }

    @Override
    public ResponseEntity<GenericResponse> order(String emailFromToken, OrderRequest request) {
        try {
            Optional<User> userOptional = userRepository.findByEmail(emailFromToken);
            if (userOptional.isPresent()) {
                List<CartItem> cartItemList = new ArrayList<>();
                for (Integer cartItemId : request.getCartItemIds()) {
                    Optional<CartItem> cartItemOptional = cartItemRepository.findByCartItemIdAndCart_User_Email(cartItemId, emailFromToken);
                    if (cartItemOptional.isEmpty()) {
                        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                                GenericResponse.builder()
                                        .success(false)
                                        .message("cartItemId " + cartItemId + " does not exist")
                                        .result("Not found")
                                        .statusCode(HttpStatus.NOT_FOUND.value())
                                        .build()
                        );
                    }

                    cartItemList.add(cartItemOptional.get());
                }

                if (!isValidPhoneNumber(request.getPhone())) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                            GenericResponse.builder()
                                    .success(false)
                                    .message("Invalid phone number format")
                                    .result("Bad request")
                                    .statusCode(HttpStatus.BAD_REQUEST.value())
                                    .build()
                    );
                }

                Order order = new Order();
                order.setCustomer(userOptional.get());
                order.setShippingCost(Float.valueOf(request.getShippingCost()));

                Float totalAmount = Float.valueOf(0);
                for (CartItem cartItem : cartItemList) {
                    totalAmount = totalAmount + (cartItem.getProductItem().getPromotionalPrice() * cartItem.getQuantity());
                }
                totalAmount = totalAmount + order.getShippingCost();
                order.setTotalAmount(totalAmount);

                Cart cart = cartItemList.get(0).getCart();//Để ở vị trí này sẽ giúp tránh lỗi không nhập bất kì cartItemId nào

                order.setFullName(request.getFullName());
                order.setPhone(request.getPhone());
                order.setAddress(request.getAddress());
                order.setStatus(Status.NOT_PROCESSED);
                order.setPaymentMethod(request.getPaymentMethod());
                orderRepository.save(order);

                for (CartItem cartItem : cartItemList) {
                    OrderItem orderItem = new OrderItem();
                    orderItem.setOrder(order);
                    orderItem.setProductItem(cartItem.getProductItem());
                    orderItem.setQuantity(cartItem.getQuantity());
                    orderItem.setAmount(cartItem.getProductItem().getPromotionalPrice() * cartItem.getQuantity());

                    orderItemRepository.save(orderItem);
                }

                int count = cartItemList.size();
                for (CartItem cartItem : cartItemList) {
                    cartItemRepository.delete(cartItem);
                }

                cart.setQuantity(cart.getQuantity() - count);
                cartRepository.save(cart);

                Map<String, Object> map = new HashMap<>();
                map.put("content", order);

                List<OrderItem> orderItemList = orderItemRepository.findAllByOrder(order);
                List<Integer> orderItemIds = new ArrayList<>();
                for (OrderItem orderItem : orderItemList) {
                    orderItemIds.add(orderItem.getOrderItemId());
                }
                map.put("orderItemIds", orderItemIds);

                return ResponseEntity.status(HttpStatus.OK).body(
                        GenericResponse.builder()
                                .success(true)
                                .message("Order successfully")
                                .result(map)
                                .statusCode(HttpStatus.OK.value())
                                .build()
                );

            } else {
                return ResponseEntity.status(401)
                        .body(GenericResponse.builder()
                                .success(false)
                                .message("Unauthorized")
                                .result("Invalid token")
                                .statusCode(HttpStatus.UNAUTHORIZED.value())
                                .build());
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    GenericResponse.builder()
                            .success(false)
                            .message(e.getMessage())
                            .result("Internal server error")
                            .statusCode(HttpStatus.INTERNAL_SERVER_ERROR.value())
                            .build()
            );
        }
    }

    @Override
    public ResponseEntity<GenericResponse> getUserRole(String emailFromToken) {
        try {
            Optional<User> userOptional = userRepository.findByEmail(emailFromToken);
            if (userOptional.isPresent()) {
                return ResponseEntity.status(HttpStatus.OK).body(
                        GenericResponse.builder()
                                .success(true)
                                .message("Get your role successfully")
                                .result(userOptional.get().getRole().getName())
                                .statusCode(HttpStatus.OK.value())
                                .build()
                );

            } else {
                return ResponseEntity.status(401)
                        .body(GenericResponse.builder()
                                .success(false)
                                .message("Unauthorized")
                                .result("Invalid token")
                                .statusCode(HttpStatus.UNAUTHORIZED.value())
                                .build());
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    GenericResponse.builder()
                            .success(false)
                            .message(e.getMessage())
                            .result("Internal server error")
                            .statusCode(HttpStatus.INTERNAL_SERVER_ERROR.value())
                            .build()
            );
        }
    }

    @Override
    public ResponseEntity<GenericResponse> getAllOrdersOfCustomer(String emailFromToken) {
        try {
            Optional<User> userOptional = userRepository.findByEmail(emailFromToken);
            if (userOptional.isPresent()) {
                List<Order> orderList = orderRepository.findAllByCustomerOrderByUpdatedAtDesc(userOptional.get());

                Map<String, Object> map = new HashMap<>();
                map.put("content", orderList);
                map.put("totalElements", orderList.size());

                return ResponseEntity.status(HttpStatus.OK).body(
                        GenericResponse.builder()
                                .success(true)
                                .message("Get all your orders successfully")
                                .result(map)
                                .statusCode(HttpStatus.OK.value())
                                .build()
                );

            } else {
                return ResponseEntity.status(401)
                        .body(GenericResponse.builder()
                                .success(false)
                                .message("Unauthorized")
                                .result("Invalid token")
                                .statusCode(HttpStatus.UNAUTHORIZED.value())
                                .build());
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    GenericResponse.builder()
                            .success(false)
                            .message(e.getMessage())
                            .result("Internal server error")
                            .statusCode(HttpStatus.INTERNAL_SERVER_ERROR.value())
                            .build()
            );
        }
    }

    @Override
    public ResponseEntity<GenericResponse> getOneOrderOfCustomer(Integer orderId, String emailFromToken) {
        try {
            Optional<User> userOptional = userRepository.findByEmail(emailFromToken);
            if (userOptional.isPresent()) {
                Optional<Order> orderOptional = orderRepository.findByOrderIdAndCustomer(orderId, userOptional.get());
                if (orderOptional.isEmpty()) {
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                            GenericResponse.builder()
                                    .success(false)
                                    .message("You don't have orderId: " + orderId)
                                    .result("Not found")
                                    .statusCode(HttpStatus.NOT_FOUND.value())
                                    .build()
                    );
                }

                List<OrderItem> orderItemList = orderItemRepository.findAllByOrder(orderOptional.get());

                List<OrderItemResponse> orderItemResponseList = new ArrayList<>();
                for (OrderItem orderItem : orderItemList) {
                    OrderItemResponse orderItemResponse = new OrderItemResponse();
                    orderItemResponse.setOrderItemId(orderItem.getOrderItemId());
                    orderItemResponse.setProductItemId(orderItem.getProductItem().getProductItemId());
                    orderItemResponse.setProductName(orderItem.getProductItem().getParent().getName());
                    orderItemResponse.setImage(orderItem.getProductItem().getImage());
                    List<String> styleValueNames = new ArrayList<>();
                    for (StyleValue styleValue : orderItem.getProductItem().getStyleValues()) {
                        styleValueNames.add(styleValue.getName());
                    }
                    orderItemResponse.setStyleValues(styleValueNames);
                    orderItemResponse.setQuantity(orderItem.getQuantity());
                    orderItemResponse.setProductPrice(orderItem.getProductItem().getPrice());
                    orderItemResponse.setProductPromotionalPrice(orderItem.getProductItem().getPromotionalPrice());
                    orderItemResponse.setAmount(orderItem.getAmount());

                    orderItemResponseList.add(orderItemResponse);
                }

                Order order = orderOptional.get();
                Map<String, Object> map = new HashMap<>();
                map.put("customerId", order.getCustomer().getUserId());
                map.put("order", order);
                map.put("orderItems", orderItemResponseList);
                map.put("totalOrderItems", orderItemResponseList.size());

                return ResponseEntity.status(HttpStatus.OK).body(
                        GenericResponse.builder()
                                .success(true)
                                .message("Get this order successfully")
                                .result(map)
                                .statusCode(HttpStatus.OK.value())
                                .build()
                );

            } else {
                return ResponseEntity.status(401)
                        .body(GenericResponse.builder()
                                .success(false)
                                .message("Unauthorized")
                                .result("Invalid token")
                                .statusCode(HttpStatus.UNAUTHORIZED.value())
                                .build());
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    GenericResponse.builder()
                            .success(false)
                            .message(e.getMessage())
                            .result("Internal server error")
                            .statusCode(HttpStatus.INTERNAL_SERVER_ERROR.value())
                            .build()
            );
        }
    }

    @Override
    public ResponseEntity<GenericResponse> createShipperAccount(CreateShipperAccountRequest request) {
        try {
            Optional<User> userOptionalEmail = userRepository.findByEmail(request.getEmail());
            if (userOptionalEmail.isPresent()) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body(
                        GenericResponse.builder()
                                .success(false)
                                .message("Email already in use")
                                .result("Conflict")
                                .statusCode(HttpStatus.CONFLICT.value())
                                .build()
                );
            }

            if (!isValidPhoneNumber(request.getPhone())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                        GenericResponse.builder()
                                .success(false)
                                .message("Invalid phone number format")
                                .result("Bad request")
                                .statusCode(HttpStatus.BAD_REQUEST.value())
                                .build()
                );
            }

            Optional<User> userOptionalPhone = userRepository.findByPhone(request.getPhone());
            if (userOptionalPhone.isPresent()) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body(
                        GenericResponse.builder()
                                .success(false)
                                .message("Phone number already in use")
                                .result("Conflict")
                                .statusCode(HttpStatus.CONFLICT.value())
                                .build()
                );
            }

            if (!request.getConfirmPassword().equals(request.getPassword())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                        GenericResponse.builder()
                                .success(false)
                                .message("Password and Confirm Password don't match")
                                .result("Bad request")
                                .statusCode(HttpStatus.BAD_REQUEST.value())
                                .build()
                );
            }

            User user = new User();
            user.setFullname(request.getFullname());
            user.setEmail(request.getEmail());
            user.setPhone(request.getPhone());
            user.setAddress(request.getAddress());
            user.setPassword(passwordEncoder.encode(request.getPassword()));
            user.setRole(roleRepository.findByName("SHIPPER"));
            user.setIsVerified(true);

            userRepository.save(user);

            UserResponse userResponse = new UserResponse();
            userResponse.setUserId(user.getUserId());
            userResponse.setFullname(user.getFullname());
            userResponse.setEmail(user.getEmail());
            userResponse.setPhone(user.getPhone());
            userResponse.setIsVerified(user.getIsVerified());
            userResponse.setDob(user.getDob());
            userResponse.setGender(user.getGender());
            userResponse.setRole(user.getRole().getName());
            userResponse.setAddress(user.getAddress());
            userResponse.setAvatar(user.getAvatar());
            userResponse.setEWallet(user.getEWallet());
            userResponse.setCreatedAt(user.getCreatedAt());
            userResponse.setUpdatedAt(user.getUpdatedAt());
            userResponse.setIsActive(user.getIsActive());

            return ResponseEntity.status(HttpStatus.OK).body(
                    GenericResponse.builder()
                            .success(true)
                            .message("Created shipper account successfully")
                            .result(userResponse)
                            .statusCode(HttpStatus.OK.value())
                            .build()
            );

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    GenericResponse.builder()
                            .success(false)
                            .message(e.getMessage())
                            .result("Internal server error")
                            .statusCode(HttpStatus.INTERNAL_SERVER_ERROR.value())
                            .build()
            );
        }
    }

    @Override
    public ResponseEntity<GenericResponse> cancelOrderWithStatusNOT_PROCESSED(Integer orderId, String emailFromToken) {
        try {
            Optional<User> userOptional = userRepository.findByEmail(emailFromToken);
            if (userOptional.isPresent()) {
                Optional<Order> orderOptional = orderRepository.findByOrderIdAndCustomer(orderId, userOptional.get());
                if (orderOptional.isEmpty()) {
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                            GenericResponse.builder()
                                    .success(false)
                                    .message("You don't have orderId: " + orderId)
                                    .result("Not found")
                                    .statusCode(HttpStatus.NOT_FOUND.value())
                                    .build()
                    );
                }

                Order order = orderOptional.get();

                if (order.getStatus() != Status.NOT_PROCESSED) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                            GenericResponse.builder()
                                    .success(false)
                                    .message("Only orders with the status NOT_PROCESSED can be cancel order with status NOT_PROCESSED")
                                    .result("Bad request")
                                    .statusCode(HttpStatus.BAD_REQUEST.value())
                                    .build()
                    );
                }

                order.setStatus(Status.CANCELLED);
                orderRepository.save(order);

                return ResponseEntity.status(HttpStatus.OK).body(
                        GenericResponse.builder()
                                .success(true)
                                .message("Cancel order successfully")
                                .result(order)
                                .statusCode(HttpStatus.OK.value())
                                .build()
                );

            } else {
                return ResponseEntity.status(401)
                        .body(GenericResponse.builder()
                                .success(false)
                                .message("Unauthorized")
                                .result("Invalid token")
                                .statusCode(HttpStatus.UNAUTHORIZED.value())
                                .build());
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    GenericResponse.builder()
                            .success(false)
                            .message(e.getMessage())
                            .result("Internal server error")
                            .statusCode(HttpStatus.INTERNAL_SERVER_ERROR.value())
                            .build()
            );
        }
    }

    @Override
    public ResponseEntity<GenericResponse> getOrdersByStatusOfCustomer(Status status, String emailFromToken) {
        try {
            Optional<User> userOptional = userRepository.findByEmail(emailFromToken);
            if (userOptional.isPresent()) {
                List<Order> orderList = orderRepository.findAllByCustomerAndStatusOrderByUpdatedAtDesc(userOptional.get(), status);

                Map<String, Object> map = new HashMap<>();
                map.put("content", orderList);
                map.put("totalElements", orderList.size());

                return ResponseEntity.status(HttpStatus.OK).body(
                        GenericResponse.builder()
                                .success(true)
                                .message("Your orders with status " + status + ": ")
                                .result(map)
                                .statusCode(HttpStatus.OK.value())
                                .build()
                );

            } else {
                return ResponseEntity.status(401)
                        .body(GenericResponse.builder()
                                .success(false)
                                .message("Unauthorized")
                                .result("Invalid token")
                                .statusCode(HttpStatus.UNAUTHORIZED.value())
                                .build());
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    GenericResponse.builder()
                            .success(false)
                            .message(e.getMessage())
                            .result("Internal server error")
                            .statusCode(HttpStatus.INTERNAL_SERVER_ERROR.value())
                            .build()
            );
        }
    }

    @Override
    public ResponseEntity<GenericResponse> checkoutEWallet(String emailFromToken, Integer orderId) {
        try {
            Optional<User> userOptional = userRepository.findByEmail(emailFromToken);
            if (userOptional.isPresent()) {
                Optional<Order> orderOptional = orderRepository.findByOrderIdAndCustomer(orderId, userOptional.get());
                if (orderOptional.isEmpty()) {
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                            GenericResponse.builder()
                                    .success(false)
                                    .message("You don't have orderId: " + orderId)
                                    .result("Not found")
                                    .statusCode(HttpStatus.NOT_FOUND.value())
                                    .build()
                    );
                }

                Order order = orderOptional.get();

                if (order.getStatus() != Status.NOT_PROCESSED || order.getPaymentMethod() == PaymentMethod.COD) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                            GenericResponse.builder()
                                    .success(false)
                                    .message("Only orders with the status NOT_PROCESSED and payment method E_WALLET can be checkout eWallet")
                                    .result("Bad request")
                                    .statusCode(HttpStatus.BAD_REQUEST.value())
                                    .build()
                    );
                }
                String paymentUrl = vnPayService.getPaymentPayUrl(orderId, order.getTotalAmount());

                return ResponseEntity.status(HttpStatus.OK).body(
                        GenericResponse.builder()
                                .success(true)
                                .message("Get paymentPayUrl successfully")
                                .result(paymentUrl)
                                .statusCode(HttpStatus.OK.value())
                                .build()
                );

            } else {
                return ResponseEntity.status(401)
                        .body(GenericResponse.builder()
                                .success(false)
                                .message("Unauthorized")
                                .result("Invalid token")
                                .statusCode(HttpStatus.UNAUTHORIZED.value())
                                .build());
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    GenericResponse.builder()
                            .success(false)
                            .message(e.getMessage())
                            .result("Internal server error")
                            .statusCode(HttpStatus.INTERNAL_SERVER_ERROR.value())
                            .build()
            );
        }
    }

    @Override
    public ResponseEntity<GenericResponse> getAllDeliveriesOfShipper(String emailFromToken) {
        try {
            Optional<User> userOptional = userRepository.findByEmail(emailFromToken);
            if (userOptional.isPresent()) {
                User user = userOptional.get();
                List<Delivery> deliveryList = deliveryRepository.findAllByShipperOrderByUpdatedAtDesc(user);

                Map<String, Object> map = new HashMap<>();
                map.put("deliveryList", deliveryList);
                map.put("totalElements", deliveryList.size());
                return ResponseEntity.status(HttpStatus.OK).body(
                        GenericResponse.builder()
                                .success(true)
                                .message("Get all deliveries of shipper successfully")
                                .result(map)
                                .statusCode(HttpStatus.OK.value())
                                .build()
                );

            } else {
                return ResponseEntity.status(401)
                        .body(GenericResponse.builder()
                                .success(false)
                                .message("Unauthorized")
                                .result("Invalid token")
                                .statusCode(HttpStatus.UNAUTHORIZED.value())
                                .build());
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    GenericResponse.builder()
                            .success(false)
                            .message(e.getMessage())
                            .result("Internal server error")
                            .statusCode(HttpStatus.INTERNAL_SERVER_ERROR.value())
                            .build()
            );
        }
    }

    @Override
    public ResponseEntity<GenericResponse> getAllNotReceivedDeliveriesOfShipper(String emailFromToken) {
        try {
            Optional<User> userOptional = userRepository.findByEmail(emailFromToken);
            if (userOptional.isPresent()) {
                User user = userOptional.get();
                List<Delivery> deliveryList = deliveryRepository.findAllByShipperAndIsReceivedIsFalseAndIsDeliveredIsFalseOrderByCreatedAt(user);

                Map<String, Object> map = new HashMap<>();
                map.put("deliveryList", deliveryList);
                map.put("totalElements", deliveryList.size());
                return ResponseEntity.status(HttpStatus.OK).body(
                        GenericResponse.builder()
                                .success(true)
                                .message("Get all not received deliveries of shipper successfully")
                                .result(map)
                                .statusCode(HttpStatus.OK.value())
                                .build()
                );

            } else {
                return ResponseEntity.status(401)
                        .body(GenericResponse.builder()
                                .success(false)
                                .message("Unauthorized")
                                .result("Invalid token")
                                .statusCode(HttpStatus.UNAUTHORIZED.value())
                                .build());
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    GenericResponse.builder()
                            .success(false)
                            .message(e.getMessage())
                            .result("Internal server error")
                            .statusCode(HttpStatus.INTERNAL_SERVER_ERROR.value())
                            .build()
            );
        }
    }

    @Override
    public ResponseEntity<GenericResponse> receive(String emailFromToken, Integer deliveryId) {
        try {
            Optional<User> userOptional = userRepository.findByEmail(emailFromToken);
            if (userOptional.isPresent()) {
                User user = userOptional.get();
                Optional<Delivery> deliveryOptional = deliveryRepository.findByDeliveryIdAndShipper(deliveryId, user);
                if (deliveryOptional.isEmpty()) {
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                            GenericResponse.builder()
                                    .success(false)
                                    .message("You don't have deliveryId: " + deliveryId)
                                    .result("Not found")
                                    .statusCode(HttpStatus.NOT_FOUND.value())
                                    .build()
                    );
                }

                Delivery delivery = deliveryOptional.get();
                if (delivery.getIsReceived().equals(true)) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                            GenericResponse.builder()
                                    .success(false)
                                    .message("Delivery was received")
                                    .result("Bad request")
                                    .statusCode(HttpStatus.BAD_REQUEST.value())
                                    .build()
                    );
                }

                delivery.setIsReceived(true);
                deliveryRepository.save(delivery);

                return ResponseEntity.status(HttpStatus.OK).body(
                        GenericResponse.builder()
                                .success(true)
                                .message("Shipper received delivery successfully")
                                .result(delivery)
                                .statusCode(HttpStatus.OK.value())
                                .build()
                );

            } else {
                return ResponseEntity.status(401)
                        .body(GenericResponse.builder()
                                .success(false)
                                .message("Unauthorized")
                                .result("Invalid token")
                                .statusCode(HttpStatus.UNAUTHORIZED.value())
                                .build());
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    GenericResponse.builder()
                            .success(false)
                            .message(e.getMessage())
                            .result("Internal server error")
                            .statusCode(HttpStatus.INTERNAL_SERVER_ERROR.value())
                            .build()
            );
        }
    }

    @Override
    public ResponseEntity<GenericResponse> getAllReceivedAndNotDeliveredDeliveriesOfShipper(String emailFromToken) {
        try {
            Optional<User> userOptional = userRepository.findByEmail(emailFromToken);
            if (userOptional.isPresent()) {
                User user = userOptional.get();
                List<Delivery> deliveryList = deliveryRepository.findAllByShipperAndIsReceivedIsTrueAndIsDeliveredIsFalseOrderByUpdatedAt(user);

                Map<String, Object> map = new HashMap<>();
                map.put("deliveryList", deliveryList);
                map.put("totalElements", deliveryList.size());
                return ResponseEntity.status(HttpStatus.OK).body(
                        GenericResponse.builder()
                                .success(true)
                                .message("Get all received and not delivered deliveries of shipper successfully")
                                .result(map)
                                .statusCode(HttpStatus.OK.value())
                                .build()
                );

            } else {
                return ResponseEntity.status(401)
                        .body(GenericResponse.builder()
                                .success(false)
                                .message("Unauthorized")
                                .result("Invalid token")
                                .statusCode(HttpStatus.UNAUTHORIZED.value())
                                .build());
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    GenericResponse.builder()
                            .success(false)
                            .message(e.getMessage())
                            .result("Internal server error")
                            .statusCode(HttpStatus.INTERNAL_SERVER_ERROR.value())
                            .build()
            );
        }
    }

    @Override
    public ResponseEntity<GenericResponse> deliver(String emailFromToken, Integer deliveryId) {
        try {
            Optional<User> userOptional = userRepository.findByEmail(emailFromToken);
            if (userOptional.isPresent()) {
                User user = userOptional.get();
                Optional<Delivery> deliveryOptional = deliveryRepository.findByDeliveryIdAndShipper(deliveryId, user);
                if (deliveryOptional.isEmpty()) {
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                            GenericResponse.builder()
                                    .success(false)
                                    .message("You don't have deliveryId: " + deliveryId)
                                    .result("Not found")
                                    .statusCode(HttpStatus.NOT_FOUND.value())
                                    .build()
                    );
                }

                Delivery delivery = deliveryOptional.get();
                if (delivery.getIsReceived().equals(false)) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                            GenericResponse.builder()
                                    .success(false)
                                    .message("Only delivery was received can be deliver")
                                    .result("Bad request")
                                    .statusCode(HttpStatus.BAD_REQUEST.value())
                                    .build()
                    );
                }

                if (delivery.getIsDelivered().equals(true)) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                            GenericResponse.builder()
                                    .success(false)
                                    .message("Delivery was delivered")
                                    .result("Bad request")
                                    .statusCode(HttpStatus.BAD_REQUEST.value())
                                    .build()
                    );
                }

                Order order = delivery.getOrder();
                if (order.getPaymentMethod() == PaymentMethod.COD) { //COD là chưa thanh toán trc, E_WALLET thì rồi
                    Transaction transaction = new Transaction();
                    transaction.setTransactionId("COD00" + order.getOrderId());
                    transaction.setOrder(order);
                    transaction.setTransactionType(TransactionType.PAY);
                    transaction.setAmount(order.getTotalAmount());
                    transaction.setContent("Thanh toan don hang: " + order.getOrderId());
                    transactionRepository.save(transaction);

                    order.setCheckout(true);
                }
                delivery.setIsDelivered(true);
                deliveryRepository.save(delivery);

                order.setStatus(Status.DELIVERED);
                orderRepository.save(order);
                return ResponseEntity.status(HttpStatus.OK).body(
                        GenericResponse.builder()
                                .success(true)
                                .message("The customer has successfully received the order")
                                .result(delivery)
                                .statusCode(HttpStatus.OK.value())
                                .build()
                );

            } else {
                return ResponseEntity.status(401)
                        .body(GenericResponse.builder()
                                .success(false)
                                .message("Unauthorized")
                                .result("Invalid token")
                                .statusCode(HttpStatus.UNAUTHORIZED.value())
                                .build());
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    GenericResponse.builder()
                            .success(false)
                            .message(e.getMessage())
                            .result("Internal server error")
                            .statusCode(HttpStatus.INTERNAL_SERVER_ERROR.value())
                            .build()
            );
        }
    }

    @Override
    public ResponseEntity<GenericResponse> getOneDeliveryOfShipper(String emailFromToken, Integer deliveryId) {
        try {
            Optional<User> userOptional = userRepository.findByEmail(emailFromToken);
            if (userOptional.isPresent()) {
                User user = userOptional.get();
                Optional<Delivery> deliveryOptional = deliveryRepository.findByDeliveryIdAndShipper(deliveryId, user);
                if (deliveryOptional.isEmpty()) {
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                            GenericResponse.builder()
                                    .success(false)
                                    .message("You don't have deliveryId: " + deliveryId)
                                    .result("Not found")
                                    .statusCode(HttpStatus.NOT_FOUND.value())
                                    .build()
                    );
                }

                Delivery delivery = deliveryOptional.get();
                Order order = delivery.getOrder();
                List<OrderItem> orderItemList = orderItemRepository.findAllByOrder(order);

                List<OrderItemResponse> orderItemResponseList = new ArrayList<>();
                for (OrderItem orderItem : orderItemList) {
                    OrderItemResponse orderItemResponse = new OrderItemResponse();
                    orderItemResponse.setOrderItemId(orderItem.getOrderItemId());
                    orderItemResponse.setProductItemId(orderItem.getProductItem().getProductItemId());
                    orderItemResponse.setProductName(orderItem.getProductItem().getParent().getName());
                    orderItemResponse.setImage(orderItem.getProductItem().getImage());
                    List<String> styleValueNames = new ArrayList<>();
                    for (StyleValue styleValue : orderItem.getProductItem().getStyleValues()) {
                        styleValueNames.add(styleValue.getName());
                    }
                    orderItemResponse.setStyleValues(styleValueNames);
                    orderItemResponse.setQuantity(orderItem.getQuantity());
                    orderItemResponse.setProductPrice(orderItem.getProductItem().getPrice());
                    orderItemResponse.setProductPromotionalPrice(orderItem.getProductItem().getPromotionalPrice());
                    orderItemResponse.setAmount(orderItem.getAmount());

                    orderItemResponseList.add(orderItemResponse);
                }

                Map<String, Object> map = new HashMap<>();
                map.put("delivery", delivery);
                map.put("order", order);
                map.put("orderItems", orderItemResponseList);
                map.put("totalOrderItems", orderItemResponseList.size());
                return ResponseEntity.status(HttpStatus.OK).body(
                        GenericResponse.builder()
                                .success(true)
                                .message("Get delivery successfully")
                                .result(map)
                                .statusCode(HttpStatus.OK.value())
                                .build()
                );

            } else {
                return ResponseEntity.status(401)
                        .body(GenericResponse.builder()
                                .success(false)
                                .message("Unauthorized")
                                .result("Invalid token")
                                .statusCode(HttpStatus.UNAUTHORIZED.value())
                                .build());
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    GenericResponse.builder()
                            .success(false)
                            .message(e.getMessage())
                            .result("Internal server error")
                            .statusCode(HttpStatus.INTERNAL_SERVER_ERROR.value())
                            .build()
            );
        }
    }

    @Override
    public ResponseEntity<GenericResponse> getAllDeliveredDeliveriesOfShipper(String emailFromToken) {
        try {
            Optional<User> userOptional = userRepository.findByEmail(emailFromToken);
            if (userOptional.isPresent()) {
                User user = userOptional.get();
                List<Delivery> deliveryList = deliveryRepository.findAllByShipperAndIsReceivedIsTrueAndIsDeliveredIsTrueOrderByUpdatedAtDesc(user);

                Map<String, Object> map = new HashMap<>();
                map.put("deliveryList", deliveryList);
                map.put("totalElements", deliveryList.size());
                return ResponseEntity.status(HttpStatus.OK).body(
                        GenericResponse.builder()
                                .success(true)
                                .message("Get all delivered deliveries of shipper successfully")
                                .result(map)
                                .statusCode(HttpStatus.OK.value())
                                .build()
                );

            } else {
                return ResponseEntity.status(401)
                        .body(GenericResponse.builder()
                                .success(false)
                                .message("Unauthorized")
                                .result("Invalid token")
                                .statusCode(HttpStatus.UNAUTHORIZED.value())
                                .build());
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    GenericResponse.builder()
                            .success(false)
                            .message(e.getMessage())
                            .result("Internal server error")
                            .statusCode(HttpStatus.INTERNAL_SERVER_ERROR.value())
                            .build()
            );
        }
    }

    @Override
    public ResponseEntity<GenericResponse> getAllUsersByRoleName(String roleName) {
        try {
            Role role = roleRepository.findByName(roleName);
            if (role == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                        GenericResponse.builder()
                                .success(false)
                                .message("Invalid input data")
                                .result("Bad request")
                                .statusCode(HttpStatus.BAD_REQUEST.value())
                                .build());
            }

            List<User> userList = userRepository.findAllByRole_NameOrderByCreatedAtDesc(roleName);
            Map<String, Object> map = new HashMap<>();
            map.put("userList", userList);
            map.put("totalElements", userList.size());
            return ResponseEntity.status(HttpStatus.OK).body(
                    GenericResponse.builder()
                            .success(true)
                            .message("Get all users by role " + roleName + " successfully")
                            .result(map)
                            .statusCode(HttpStatus.OK.value())
                            .build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    GenericResponse.builder()
                            .success(false)
                            .message(e.getMessage())
                            .result("Internal server error")
                            .statusCode(HttpStatus.INTERNAL_SERVER_ERROR.value())
                            .build()
            );
        }
    }

    @Override
    public ResponseEntity<GenericResponse> getUserByUserId(String userId) {
        try {
            Optional<User> userOptional = userRepository.findById(userId);
            if (userOptional.isPresent()) {
                return ResponseEntity.status(HttpStatus.OK).body(
                        GenericResponse.builder()
                                .success(true)
                                .message("Get user by userId: " + userId + " successfully")
                                .result(userOptional.get())
                                .statusCode(HttpStatus.OK.value())
                                .build()
                );

            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(GenericResponse.builder()
                                .success(false)
                                .message("Invalid input data")
                                .result("Bad request")
                                .statusCode(HttpStatus.BAD_REQUEST.value())
                                .build());
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    GenericResponse.builder()
                            .success(false)
                            .message(e.getMessage())
                            .result("Internal server error")
                            .statusCode(HttpStatus.INTERNAL_SERVER_ERROR.value())
                            .build()
            );
        }
    }

    @Override
    public ResponseEntity<GenericResponse> followProduct(String emailFromToken, Integer productId) {
        try {
            Optional<User> userOptional = userRepository.findByEmail(emailFromToken);
            if (userOptional.isPresent()) {
                Optional<Product> productOptional = productRepository.findById(productId);
                if (productOptional.isEmpty()) {
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                            GenericResponse.builder()
                                    .success(false)
                                    .message("Not found product")
                                    .result("Not found")
                                    .statusCode(HttpStatus.NOT_FOUND.value())
                                    .build()
                    );
                }
                User user = userOptional.get();
                Product product = productOptional.get();
                Set<User> userSet = product.getFollowers();
                userSet.add(user);
                product.setFollowers(userSet);
                productRepository.save(product);

                return ResponseEntity.status(HttpStatus.OK).body(
                        GenericResponse.builder()
                                .success(true)
                                .message("Follow product successfully")
                                .result("OK")
                                .statusCode(HttpStatus.OK.value())
                                .build()
                );

            } else {
                return ResponseEntity.status(401)
                        .body(GenericResponse.builder()
                                .success(false)
                                .message("Unauthorized")
                                .result("Invalid token")
                                .statusCode(HttpStatus.UNAUTHORIZED.value())
                                .build());
            }

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    GenericResponse.builder()
                            .success(false)
                            .message(e.getMessage())
                            .result("Internal server error")
                            .statusCode(HttpStatus.INTERNAL_SERVER_ERROR.value())
                            .build()
            );
        }
    }

    @Override
    public ResponseEntity<GenericResponse> unfollowProduct(String emailFromToken, Integer productId) {
        try {
            Optional<User> userOptional = userRepository.findByEmail(emailFromToken);
            if (userOptional.isPresent()) {
                Optional<Product> productOptional = productRepository.findById(productId);
                if (productOptional.isEmpty()) {
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                            GenericResponse.builder()
                                    .success(false)
                                    .message("Not found product")
                                    .result("Not found")
                                    .statusCode(HttpStatus.NOT_FOUND.value())
                                    .build()
                    );
                }
                User user = userOptional.get();
                Product product = productOptional.get();
                Set<User> userSet = product.getFollowers();
                userSet.remove(user);
                product.setFollowers(userSet);
                productRepository.save(product);

                return ResponseEntity.status(HttpStatus.OK).body(
                        GenericResponse.builder()
                                .success(true)
                                .message("Unfollow product successfully")
                                .result("OK")
                                .statusCode(HttpStatus.OK.value())
                                .build()
                );

            } else {
                return ResponseEntity.status(401)
                        .body(GenericResponse.builder()
                                .success(false)
                                .message("Unauthorized")
                                .result("Invalid token")
                                .statusCode(HttpStatus.UNAUTHORIZED.value())
                                .build());
            }

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    GenericResponse.builder()
                            .success(false)
                            .message(e.getMessage())
                            .result("Internal server error")
                            .statusCode(HttpStatus.INTERNAL_SERVER_ERROR.value())
                            .build()
            );
        }
    }

    @Override
    public ResponseEntity<GenericResponse> ratingOrderItem(String emailFromToken, Integer orderItemId, CreateRatingRequest request) {
        try {
            Optional<User> userOptional = userRepository.findByEmail(emailFromToken);
            if (userOptional.isPresent()) {
                User user = userOptional.get();
                Optional<OrderItem> orderItemOptional = orderItemRepository.findByOrderItemIdAndOrder_Customer(orderItemId, user);
                if (orderItemOptional.isEmpty()) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                            GenericResponse.builder()
                                    .success(false)
                                    .message("You don't have orderItemId: " + orderItemId)
                                    .result("Bad request")
                                    .statusCode(HttpStatus.BAD_REQUEST.value())
                                    .build()
                    );
                }

                OrderItem orderItem = orderItemOptional.get();

                Rating rating = new Rating();
                rating.setOrderItem(orderItem);
                rating.setContent(request.getContent());
                rating.setStar(request.getStar());
                ratingRepository.save(rating);

                Product product = orderItem.getProductItem().getParent();
                List<Rating> ratingList = ratingRepository.findByOrderItem_ProductItem_Parent(product);
                if (!ratingList.isEmpty()) {
                    Float productRating = Float.valueOf(0);
                    for (Rating r : ratingList) {
                        productRating += r.getStar();
                    }
                    productRating = productRating / ratingList.size();
                    product.setRating(productRating);
                } else {
                    product.setRating(Float.valueOf(rating.getStar()));
                }
                productRepository.save(product);

                return ResponseEntity.status(HttpStatus.OK).body(
                        GenericResponse.builder()
                                .success(true)
                                .message("Rating for orderItem successfully")
                                .result("OK")
                                .statusCode(HttpStatus.OK.value())
                                .build()
                );

            } else {
                return ResponseEntity.status(401)
                        .body(GenericResponse.builder()
                                .success(false)
                                .message("Unauthorized")
                                .result("Invalid token")
                                .statusCode(HttpStatus.UNAUTHORIZED.value())
                                .build());
            }

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    GenericResponse.builder()
                            .success(false)
                            .message(e.getMessage())
                            .result("Internal server error")
                            .statusCode(HttpStatus.INTERNAL_SERVER_ERROR.value())
                            .build()
            );
        }
    }

    @Override
    public ResponseEntity<GenericResponse> checkFollow(String emailFromToken, Integer productId) {
        try {
            Optional<User> userOptional = userRepository.findByEmail(emailFromToken);
            if (userOptional.isPresent()) {
                Optional<Product> productOptional = productRepository.findById(productId);
                if (productOptional.isEmpty()) {
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                            GenericResponse.builder()
                                    .success(false)
                                    .message("Not found product")
                                    .result("Not found")
                                    .statusCode(HttpStatus.NOT_FOUND.value())
                                    .build()
                    );
                }

                User user = userOptional.get();
                Product product = productOptional.get();
                Set<User> userSet = product.getFollowers();
                Boolean check = userSet.contains(user);

                return ResponseEntity.status(HttpStatus.OK).body(
                        GenericResponse.builder()
                                .success(true)
                                .message("Check follow")
                                .result(check)
                                .statusCode(HttpStatus.OK.value())
                                .build()
                );

            } else {
                return ResponseEntity.status(401)
                        .body(GenericResponse.builder()
                                .success(false)
                                .message("Unauthorized")
                                .result("Invalid token")
                                .statusCode(HttpStatus.UNAUTHORIZED.value())
                                .build());
            }

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    GenericResponse.builder()
                            .success(false)
                            .message(e.getMessage())
                            .result("Internal server error")
                            .statusCode(HttpStatus.INTERNAL_SERVER_ERROR.value())
                            .build()
            );
        }
    }

    @Override
    public ResponseEntity<GenericResponse> getAllShippersByAddress(String address) {
        try {
            List<User> userList = userRepository.findAllByRole_NameAndAddress("SHIPPER", address);
            Map<String, Object> map = new HashMap<>();
            map.put("userList", userList);
            map.put("totalElement", userList.size());
            return ResponseEntity.status(HttpStatus.OK).body(
                    GenericResponse.builder()
                            .success(true)
                            .message("Get all shippers in " + address + " successfully")
                            .result(map)
                            .statusCode(HttpStatus.OK.value())
                            .build()
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    GenericResponse.builder()
                            .success(false)
                            .message(e.getMessage())
                            .result("Internal server error")
                            .statusCode(HttpStatus.INTERNAL_SERVER_ERROR.value())
                            .build()
            );
        }
    }

    @Override
    public ResponseEntity<GenericResponse> updateOrderToRated(String emailFromToken, Integer orderId) {
        try {
            Optional<User> userOptional = userRepository.findByEmail(emailFromToken);
            if (userOptional.isPresent()) {
                Optional<Order> orderOptional = orderRepository.findByOrderIdAndCustomer(orderId, userOptional.get());

                if (orderOptional.isEmpty()) {
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                            GenericResponse.builder()
                                    .success(false)
                                    .message("You don't have orderId " + orderId)
                                    .result("Not found")
                                    .statusCode(HttpStatus.NOT_FOUND.value())
                                    .build()
                    );
                }

                Order order = orderOptional.get();

                if (order.getStatus() != Status.DELIVERED) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                            GenericResponse.builder()
                                    .success(false)
                                    .message("Only orders with the status DELIVERED can be updated order to rated")
                                    .result("Bad request")
                                    .statusCode(HttpStatus.BAD_REQUEST.value())
                                    .build()
                    );
                }

                if (order.getIsRated().equals(true)) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                            GenericResponse.builder()
                                    .success(false)
                                    .message("Order has been updated to rated")
                                    .result("Bad request")
                                    .statusCode(HttpStatus.BAD_REQUEST.value())
                                    .build()
                    );
                }

                List<OrderItem> orderItemList = orderItemRepository.findAllByOrder(order);

                for (OrderItem orderItem : orderItemList) {
                    Optional<Rating> ratingOptional = ratingRepository.findByOrderItem(orderItem);
                    if (ratingOptional.isEmpty()) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                                GenericResponse.builder()
                                        .success(false)
                                        .message("Exist order item doesn't rating")
                                        .result("Bad request")
                                        .statusCode(HttpStatus.BAD_REQUEST.value())
                                        .build()
                        );
                    }
                }

                order.setIsRated(true);
                orderRepository.save(order);

                return ResponseEntity.status(HttpStatus.OK).body(
                        GenericResponse.builder()
                                .success(true)
                                .message("Updated order to rated successfully")
                                .result(order)
                                .statusCode(HttpStatus.OK.value())
                                .build()
                );

            } else {
                return ResponseEntity.status(401)
                        .body(GenericResponse.builder()
                                .success(false)
                                .message("Unauthorized")
                                .result("Invalid token")
                                .statusCode(HttpStatus.UNAUTHORIZED.value())
                                .build());
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    GenericResponse.builder()
                            .success(false)
                            .message(e.getMessage())
                            .result("Internal server error")
                            .statusCode(HttpStatus.INTERNAL_SERVER_ERROR.value())
                            .build()
            );
        }
    }

    @Override
    public ResponseEntity<GenericResponse> getRatingOfOrder(String emailFromToken, Integer orderId) {
        try {
            Optional<User> userOptional = userRepository.findByEmail(emailFromToken);
            if (userOptional.isPresent()) {
                Optional<Order> orderOptional = orderRepository.findByOrderIdAndCustomer(orderId, userOptional.get());

                if (orderOptional.isEmpty()) {
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                            GenericResponse.builder()
                                    .success(false)
                                    .message("You don't have orderId " + orderId)
                                    .result("Not found")
                                    .statusCode(HttpStatus.NOT_FOUND.value())
                                    .build()
                    );
                }

                Order order = orderOptional.get();

                if (order.getStatus() != Status.DELIVERED) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                            GenericResponse.builder()
                                    .success(false)
                                    .message("Only orders with the status DELIVERED can be get rating of order")
                                    .result("Bad request")
                                    .statusCode(HttpStatus.BAD_REQUEST.value())
                                    .build()
                    );
                }

                if (order.getIsRated().equals(false)) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                            GenericResponse.builder()
                                    .success(false)
                                    .message("Order hasn't been updated to rated")
                                    .result("Bad request")
                                    .statusCode(HttpStatus.BAD_REQUEST.value())
                                    .build()
                    );
                }

                List<Rating> ratingList = ratingRepository.findAllByOrderItem_Order(order);

                List<RatingResponse> ratingResponseList = new ArrayList<>();
                for (Rating r : ratingList) {
                    RatingResponse ratingResponse = new RatingResponse();
                    Map<String, Object> styleValueByStyles = new HashMap<>();
                    for (StyleValue styleValue : r.getOrderItem().getProductItem().getStyleValues()) {
                        styleValueByStyles.put(styleValue.getStyle().getName(), styleValue.getName());
                    }
                    ratingResponse.setStyleValueByStyles(styleValueByStyles);
                    ratingResponse.setContent(r.getContent());
                    ratingResponse.setStar(r.getStar());
                    //fullname lúc này là tên sản phẩm
                    ratingResponse.setFullname(r.getOrderItem().getProductItem().getParent().getName());
                    ratingResponse.setImage(r.getOrderItem().getOrder().getCustomer().getAvatar());
                    ratingResponse.setCreatedAt(r.getCreatedAt());

                    ratingResponseList.add(ratingResponse);
                }

                return ResponseEntity.status(HttpStatus.OK).body(
                        GenericResponse.builder()
                                .success(true)
                                .message("Get rating of order successfully")
                                .result(ratingResponseList)
                                .statusCode(HttpStatus.OK.value())
                                .build()
                );

            } else {
                return ResponseEntity.status(401)
                        .body(GenericResponse.builder()
                                .success(false)
                                .message("Unauthorized")
                                .result("Invalid token")
                                .statusCode(HttpStatus.UNAUTHORIZED.value())
                                .build());
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    GenericResponse.builder()
                            .success(false)
                            .message(e.getMessage())
                            .result("Internal server error")
                            .statusCode(HttpStatus.INTERNAL_SERVER_ERROR.value())
                            .build()
            );
        }
    }

    private boolean isValidPhoneNumber(String phoneNumber) {
        Pattern pattern = Pattern.compile(PHONE_NUMBER_REGEX);
        Matcher matcher = pattern.matcher(phoneNumber);
        return matcher.matches();
    }
}
