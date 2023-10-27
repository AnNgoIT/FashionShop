package fit.tlcn.fashionshopbe.service.impl;

import fit.tlcn.fashionshopbe.dto.GenericResponse;
import fit.tlcn.fashionshopbe.entity.RefreshToken;
import fit.tlcn.fashionshopbe.entity.User;
import fit.tlcn.fashionshopbe.repository.RefreshTokenRepository;
import fit.tlcn.fashionshopbe.repository.UserRepository;
import fit.tlcn.fashionshopbe.security.JwtTokenProvider;
import fit.tlcn.fashionshopbe.security.UserDetail;
import fit.tlcn.fashionshopbe.security.UserDetailService;
import fit.tlcn.fashionshopbe.service.RefreshTokenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
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
    UserDetailService userDetailService;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Override
    public <S extends RefreshToken> S save(S entity) {
        return refreshTokenRepository.save(entity);
    }

    @Override
    public ResponseEntity<GenericResponse> refreshAccessToken(String refreshToken) {
        try {
            String userId = jwtTokenProvider.getUserIdFromRefreshToken(refreshToken);
            Optional<User> optionalUser = userRepository.findById(userId);
            if (optionalUser.isPresent() && optionalUser.get().getIsActive()) {
                //List<RefreshToken> refreshTokens = refreshTokenRepository.findAllByUser_UserIdAndExpiredIsFalseAndRevokedIsFalse(userId);
                Optional<RefreshToken> token = refreshTokenRepository.findByUser_UserIdAndExpiredIsFalseAndRevokedIsFalse(userId);
                if (token.isPresent() && jwtTokenProvider.validateToken(token.get().getToken())) {
                    if (!token.get().getToken().equals(refreshToken)) {
                        return ResponseEntity.status(404)
                                .body(GenericResponse.builder()
                                        .success(false)
                                        .message("RefreshToken is not present. Please login again!")
                                        .result("")
                                        .statusCode(HttpStatus.NOT_FOUND.value())
                                        .build());
                    }
                    UserDetail userDetail = (UserDetail) userDetailService.loadUserByUserId(jwtTokenProvider.getUserIdFromRefreshToken(refreshToken));
                    String accessToken = jwtTokenProvider.generateAccessToken(userDetail);
                    Map<String, String> resultMap = new HashMap<>();
                    resultMap.put("accessToken", accessToken);
                    resultMap.put("refreshToken", refreshToken);
                    return ResponseEntity.status(200)
                            .body(GenericResponse.builder()
                                    .success(true)
                                    .message("")
                                    .result(resultMap)
                                    .statusCode(HttpStatus.OK.value())
                                    .build());
                }
            }
            return ResponseEntity.status(401)
                    .body(GenericResponse.builder()
                            .success(false)
                            .message("Unauthorized. Please login again!")
                            .result("")
                            .statusCode(HttpStatus.UNAUTHORIZED.value())
                            .build());
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(GenericResponse.builder()
                            .success(false)
                            .message(e.getMessage())
                            .result("")
                            .statusCode(HttpStatus.INTERNAL_SERVER_ERROR.value())
                            .build());
        }
    }

    @Override
    public void revokeRefreshToken(String userId) {
        try {
            Optional<User> optionalUser = userRepository.findById(userId);
            if (optionalUser.isPresent() && optionalUser.get().getIsActive()) {
                List<RefreshToken> refreshTokens = refreshTokenRepository.findAllByUser_UserIdAndExpiredIsFalseAndRevokedIsFalse(userId);
                if (refreshTokens.isEmpty()) {
                    return;
                }
                refreshTokens.forEach(token -> {
                    token.setRevoked(true);
                    token.setExpired(true);
                });
                refreshTokenRepository.saveAll(refreshTokens);
            }
        } catch (Exception e) {
            e.printStackTrace();
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
}
