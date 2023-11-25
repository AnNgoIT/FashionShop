package fit.tlcn.fashionshopbe.service.impl;

import com.cloudinary.Cloudinary;
import fit.tlcn.fashionshopbe.constant.Status;
import fit.tlcn.fashionshopbe.dto.*;
import fit.tlcn.fashionshopbe.entity.*;
import fit.tlcn.fashionshopbe.repository.*;
import fit.tlcn.fashionshopbe.security.JwtTokenProvider;
import fit.tlcn.fashionshopbe.service.CloudinaryService;
import fit.tlcn.fashionshopbe.service.RefreshTokenService;
import fit.tlcn.fashionshopbe.service.UserService;
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

                if (request.getPhone() != null && !request.getPhone().equals(user.getPhone())) {
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
                    if (user.getAvatar() != null) {
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
                map.put("styleValueNames", styleValueNames);
                map.put("productId", cartItem.getProductItem().getParent().getProductId());
                map.put("productName", cartItem.getProductItem().getParent().getName());
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
                map.put("Items in cart", cartItemResponseList);
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
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                        GenericResponse.builder()
                                .success(false)
                                .message("Quantity must be less than or equal to the inventory")
                                .result("Bad request")
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

                Float totalAmount = Float.valueOf(0);
                for (CartItem cartItem : cartItemList) {
                    totalAmount = totalAmount + (cartItem.getProductItem().getPromotionalPrice() * cartItem.getQuantity());
                }
                order.setTotalAmount(totalAmount);

                Cart cart = cartItemList.get(0).getCart();

                order.setFullName(request.getFullName());
                order.setPhone(request.getPhone());
                order.setAddress(request.getAddress());
                order.setStatus(Status.NOT_PROCESSED);
                order.setTransactionType(request.getTransactionType());
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
                map.put("customerId", userOptional.get().getUserId());
                map.put("content", order);

                List<OrderItem> orderItemList = orderItemRepository. findAllByOrder(order);
                List<Integer> orderItemIds = new ArrayList<>();
                for (OrderItem orderItem: orderItemList){
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

    private boolean isValidPhoneNumber(String phoneNumber) {
        Pattern pattern = Pattern.compile(PHONE_NUMBER_REGEX);
        Matcher matcher = pattern.matcher(phoneNumber);
        return matcher.matches();
    }
}
