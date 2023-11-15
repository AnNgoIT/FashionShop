package fit.tlcn.fashionshopbe.controller;

import fit.tlcn.fashionshopbe.dto.*;
import fit.tlcn.fashionshopbe.entity.User;
import fit.tlcn.fashionshopbe.repository.UserRepository;
import fit.tlcn.fashionshopbe.security.JwtTokenProvider;
import fit.tlcn.fashionshopbe.service.EmailVerificationService;
import fit.tlcn.fashionshopbe.service.RefreshTokenService;
import fit.tlcn.fashionshopbe.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {
    @Autowired
    UserService userService;

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    JwtTokenProvider jwtTokenProvider;

    @Autowired
    RefreshTokenService refreshTokenService;

    @Autowired
    EmailVerificationService emailVerificationService;

    @Autowired
    UserRepository userRepository;

    @PostMapping("/register")
    public ResponseEntity<GenericResponse> register(@Valid @RequestBody RegisterRequest registerRequest, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                    GenericResponse.builder()
                            .success(false)
                            .message("Invalid input data")
                            .result(bindingResult.getFieldError().getDefaultMessage())
                            .statusCode(HttpStatus.BAD_REQUEST.value())
                            .build()
            );
        }
        return userService.registerUser(registerRequest);
    }

    @PostMapping("/login")
    @Transactional
    public ResponseEntity<GenericResponse> login(@Valid @RequestBody LoginRequest loginRequest, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                    GenericResponse.builder()
                            .success(false)
                            .message("Invalid input data")
                            .result(bindingResult.getFieldError().getDefaultMessage())
                            .statusCode(HttpStatus.BAD_REQUEST.value())
                            .build()
            );
        }
        return userService.login(loginRequest);
    }

    @PostMapping("/logout")
    public ResponseEntity<GenericResponse> logout(@RequestHeader("Authorization") String authorizationHeader,
                                                  @RequestParam("refreshToken") String refreshToken) {
        String accessToken = authorizationHeader.substring(7);
        if (jwtTokenProvider.getEmailFromJwt(accessToken).equals(jwtTokenProvider.getEmailFromJwt(refreshToken))) {
            return refreshTokenService.logout(refreshToken);

        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(GenericResponse.builder()
                        .success(false)
                        .message("Please login before logout!")
                        .result("Unauthorized")
                        .statusCode(HttpStatus.UNAUTHORIZED.value())
                        .build());
    }

    @PostMapping("/refresh-access-token")
    public ResponseEntity<GenericResponse> refreshAccessToken(@RequestBody TokenRequest tokenRequest) {
        return refreshTokenService.refreshAccessToken(tokenRequest.getRefreshToken());
    }

    @PostMapping("/send-otp-verify-email")
    public ResponseEntity<GenericResponse> sendOtpVerifyEmail(@Valid @RequestBody EmailVerificationRequest emailVerificationRequest, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                    GenericResponse.builder()
                            .success(false)
                            .message("Invalid input data")
                            .result(bindingResult.getFieldError().getDefaultMessage())
                            .statusCode(HttpStatus.BAD_REQUEST.value())
                            .build()
            );
        }

        try {
            emailVerificationService.sendOtpVerifyEmail(emailVerificationRequest.getEmail());
            return ResponseEntity.ok()
                    .body(GenericResponse.builder()
                            .success(true)
                            .message("OTP has been sent to your email")
                            .result("OK")
                            .statusCode(HttpStatus.OK.value())
                            .build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(GenericResponse.builder()
                            .success(false)
                            .message("An error occurred while sending OTP.")
                            .result("Internal Server Error")
                            .statusCode(HttpStatus.INTERNAL_SERVER_ERROR.value())
                            .build());
        }
    }

    @PostMapping("/verify-otp-register")
    public ResponseEntity<GenericResponse> verifyOtpRegister(@Valid @RequestBody VerifyOtpRequest verifyOtpRequest, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                    GenericResponse.builder()
                            .success(false)
                            .message("Invalid input data")
                            .result(bindingResult.getFieldError().getDefaultMessage())
                            .statusCode(HttpStatus.BAD_REQUEST.value())
                            .build()
            );
        }

        boolean isOtpVerified = emailVerificationService.verifyOtpRegister(verifyOtpRequest.getEmail(), verifyOtpRequest.getOtp());

        if (isOtpVerified) {
            return ResponseEntity.ok()
                    .body(GenericResponse.builder()
                            .success(true)
                            .message("OTP verified successfully, You can login")
                            .result("OK")
                            .statusCode(HttpStatus.OK.value())
                            .build());
        } else {
            return ResponseEntity.badRequest()
                    .body(GenericResponse.builder()
                            .success(false)
                            .message("Invalid OTP or expired.")
                            .result("Bad Request")
                            .statusCode(HttpStatus.BAD_REQUEST.value())
                            .build());
        }
    }

    @DeleteMapping("/accounts/unverified/{email}")
    public ResponseEntity<GenericResponse> deleteAccountNotVerify(@PathVariable String email) {
        try {
            Optional<User> userOptional = userRepository.findByEmailAndIsVerifiedIsFalse(email);
            if (userOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(GenericResponse.builder()
                                .success(false)
                                .message("Invalid input data")
                                .result("Bad Request")
                                .statusCode(HttpStatus.BAD_REQUEST.value())
                                .build());
            }

            userRepository.delete(userOptional.get());
            return ResponseEntity.status(HttpStatus.OK)
                    .body(GenericResponse.builder()
                            .success(true)
                            .message("Deleted unverified account successfully")
                            .result("OK")
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

    @PostMapping("/forgot-password")
    public ResponseEntity<GenericResponse> forgotPassword(@Valid @RequestBody EmailVerificationRequest emailVerificationRequest, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                    GenericResponse.builder()
                            .success(false)
                            .message("Invalid input data")
                            .result(bindingResult.getFieldError().getDefaultMessage())
                            .statusCode(HttpStatus.BAD_REQUEST.value())
                            .build()
            );
        }

        try {
            Optional<User> userOptional = userRepository.findByEmailAndIsVerifiedIsTrueAndIsActiveIsTrue(emailVerificationRequest.getEmail());
            if(userOptional.isEmpty()){
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                        GenericResponse.builder()
                                .success(false)
                                .message("The account does not exist or has been banned")
                                .result("Not found")
                                .statusCode(HttpStatus.NOT_FOUND.value())
                                .build()
                );
            }

            emailVerificationService.sendOtpForgotPassword(emailVerificationRequest.getEmail());
            return ResponseEntity.ok()
                    .body(GenericResponse.builder()
                            .success(true)
                            .message("OTP has been sent to your email")
                            .result("OK")
                            .statusCode(HttpStatus.OK.value())
                            .build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(GenericResponse.builder()
                            .success(false)
                            .message("An error occurred while sending OTP.")
                            .result("Internal Server Error")
                            .statusCode(HttpStatus.INTERNAL_SERVER_ERROR.value())
                            .build());
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<GenericResponse> ResetPassword(@Valid @RequestBody ResetPasswordRequest resetPasswordRequest, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                    GenericResponse.builder()
                            .success(false)
                            .message("Invalid input data")
                            .result(bindingResult.getFieldError().getDefaultMessage())
                            .statusCode(HttpStatus.BAD_REQUEST.value())
                            .build()
            );
        }

        boolean isOtpVerified = emailVerificationService.resetPassword(resetPasswordRequest);

        if (isOtpVerified) {
            return ResponseEntity.ok()
                    .body(GenericResponse.builder()
                            .success(true)
                            .message("Reset password successfully")
                            .result("OK")
                            .statusCode(HttpStatus.OK.value())
                            .build());
        } else {
            return ResponseEntity.badRequest()
                    .body(GenericResponse.builder()
                            .success(false)
                            .message("Invalid OTP or expired/New password and confirm password does not match.")
                            .result("Bad Request")
                            .statusCode(HttpStatus.BAD_REQUEST.value())
                            .build());
        }
    }
}
