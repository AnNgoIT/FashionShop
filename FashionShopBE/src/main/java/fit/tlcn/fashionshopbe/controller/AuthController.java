package fit.tlcn.fashionshopbe.controller;

import fit.tlcn.fashionshopbe.dto.GenericResponse;
import fit.tlcn.fashionshopbe.dto.LoginRequest;
import fit.tlcn.fashionshopbe.dto.RegisterRequest;
import fit.tlcn.fashionshopbe.dto.TokenRequest;
import fit.tlcn.fashionshopbe.security.JwtTokenProvider;
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
}
