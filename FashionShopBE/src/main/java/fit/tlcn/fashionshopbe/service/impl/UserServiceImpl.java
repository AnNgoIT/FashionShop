package fit.tlcn.fashionshopbe.service.impl;

import com.cloudinary.Cloudinary;
import fit.tlcn.fashionshopbe.dto.*;
import fit.tlcn.fashionshopbe.entity.RefreshToken;
import fit.tlcn.fashionshopbe.entity.User;
import fit.tlcn.fashionshopbe.repository.RoleRepository;
import fit.tlcn.fashionshopbe.repository.UserRepository;
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

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
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

    private boolean isValidPhoneNumber(String phoneNumber) {
        Pattern pattern = Pattern.compile(PHONE_NUMBER_REGEX);
        Matcher matcher = pattern.matcher(phoneNumber);
        return matcher.matches();
    }
}
