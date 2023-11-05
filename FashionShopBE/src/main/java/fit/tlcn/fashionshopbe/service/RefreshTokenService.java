package fit.tlcn.fashionshopbe.service;

import fit.tlcn.fashionshopbe.dto.GenericResponse;
import fit.tlcn.fashionshopbe.entity.RefreshToken;
import fit.tlcn.fashionshopbe.entity.User;
import org.springframework.http.ResponseEntity;

public interface RefreshTokenService {
    <S extends RefreshToken> S save(S entity);

    ResponseEntity<GenericResponse> refreshAccessToken(String refreshToken);

    void revokeRefreshToken(User user);

    ResponseEntity<GenericResponse> logout(String refreshToken);

}
