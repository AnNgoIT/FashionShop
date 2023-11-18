package fit.tlcn.fashionshopbe.service.impl;

import fit.tlcn.fashionshopbe.dto.GenericResponse;
import fit.tlcn.fashionshopbe.entity.RefreshToken;
import fit.tlcn.fashionshopbe.entity.User;
import fit.tlcn.fashionshopbe.repository.RefreshTokenRepository;
import fit.tlcn.fashionshopbe.repository.UserRepository;
import fit.tlcn.fashionshopbe.security.CustomUserDetailsService;
import fit.tlcn.fashionshopbe.security.JwtTokenProvider;
import fit.tlcn.fashionshopbe.service.RefreshTokenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class RefreshTokenServiceImpl implements RefreshTokenService {
    @Autowired
    RefreshTokenRepository refreshTokenRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    JwtTokenProvider jwtTokenProvider;

    @Autowired
    CustomUserDetailsService customUserDetailsService;

    @Override
    public <S extends RefreshToken> S save(S entity) {
        return refreshTokenRepository.save(entity);
    }

    @Override
    public ResponseEntity<GenericResponse> refreshAccessToken(String refreshToken) {
        try {
            String email = jwtTokenProvider.getEmailFromJwt(refreshToken);
            Optional<User> optionalUser = userRepository.findByEmailAndIsActiveIsTrue(email);
            if (optionalUser.isPresent() && optionalUser.get().getIsActive()) {
                Optional<RefreshToken> token = refreshTokenRepository.findByUserAndExpiredIsFalseAndRevokedIsFalse(optionalUser.get());
                if (token.isPresent() && jwtTokenProvider.validateToken(token.get().getToken())) {
                    if (!token.get().getToken().equals(refreshToken)) {
                        return ResponseEntity.status(404)
                                .body(GenericResponse.builder()
                                        .success(false)
                                        .message("RefreshToken is not present. Please login again!")
                                        .result("Not found")
                                        .statusCode(HttpStatus.NOT_FOUND.value())
                                        .build());
                    }
                    UserDetails userDetails = customUserDetailsService.loadUserByUsername(email);
                    String accessToken = jwtTokenProvider.generateAccessToken(userDetails);
                    Map<String, String> resultMap = new HashMap<>();
                    resultMap.put("accessToken", accessToken);
                    resultMap.put("refreshToken", refreshToken);
                    return ResponseEntity.status(200)
                            .body(GenericResponse.builder()
                                    .success(true)
                                    .message("OK")
                                    .result(resultMap)
                                    .statusCode(HttpStatus.OK.value())
                                    .build());
                }
            }
            return ResponseEntity.status(401)
                    .body(GenericResponse.builder()
                            .success(false)
                            .message("Unauthorized. Please login again!")
                            .result("Unauthorized")
                            .statusCode(HttpStatus.UNAUTHORIZED.value())
                            .build());
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(GenericResponse.builder()
                            .success(false)
                            .message(e.getMessage())
                            .result("Internal server error")
                            .statusCode(HttpStatus.INTERNAL_SERVER_ERROR.value())
                            .build());
        }
    }

    @Override
    public ResponseEntity<GenericResponse> logout(String refreshToken) {
        try {
            if (jwtTokenProvider.validateToken(refreshToken)) {
                Optional<RefreshToken> optionalRefreshToken = refreshTokenRepository.findByTokenAndExpiredIsFalseAndRevokedIsFalse(refreshToken);
                if (optionalRefreshToken.isPresent()) {
                    optionalRefreshToken.get().setRevoked(true);
                    optionalRefreshToken.get().setExpired(true);
                    refreshTokenRepository.save(optionalRefreshToken.get());
                    SecurityContextHolder.clearContext();
                    return ResponseEntity.status(HttpStatus.OK)
                            .body(GenericResponse.builder()
                                    .success(true)
                                    .message("Logout successfully")
                                    .result("OK")
                                    .statusCode(HttpStatus.OK.value())
                                    .build());
                }
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(GenericResponse.builder()
                                .success(false)
                                .message("Logout failed")
                                .result("Not found refresh token")
                                .statusCode(HttpStatus.NOT_FOUND.value())
                                .build());
            }
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(GenericResponse.builder()
                            .success(false)
                            .message("Logout failed")
                            .result("Unauthorized")
                            .statusCode(HttpStatus.UNAUTHORIZED.value())
                            .build());

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(GenericResponse.builder()
                            .success(false)
                            .message(e.getMessage())
                            .result("Internal server error")
                            .statusCode(HttpStatus.INTERNAL_SERVER_ERROR.value())
                            .build());
        }
    }

    @Override
    public void revokeRefreshToken(User user) {
        List<RefreshToken> refreshTokens = refreshTokenRepository.findAllByUserAndExpiredIsFalseAndRevokedIsFalse(user);
        if (refreshTokens.isEmpty()) {
            return;
        }
        refreshTokens.forEach(token -> {
            token.setRevoked(true);
            token.setExpired(true);
        });
        refreshTokenRepository.saveAll(refreshTokens);
    }
}
