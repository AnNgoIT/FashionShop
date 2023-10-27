package fit.tlcn.fashionshopbe.service;

import fit.tlcn.fashionshopbe.dto.GenericResponse;
import fit.tlcn.fashionshopbe.entity.RefreshToken;
import org.springframework.http.ResponseEntity;

public interface RefreshTokenService {
    <S extends RefreshToken> S save(S entity);
    ResponseEntity<GenericResponse> refreshAccessToken(String refreshToken);

    void revokeRefreshToken(String userId);

    ResponseEntity<GenericResponse> logout(String refreshToken);

}
