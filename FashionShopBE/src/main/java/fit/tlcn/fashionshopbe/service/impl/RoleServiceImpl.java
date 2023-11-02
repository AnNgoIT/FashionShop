package fit.tlcn.fashionshopbe.service.impl;

import fit.tlcn.fashionshopbe.dto.GenericResponse;
import fit.tlcn.fashionshopbe.entity.RefreshToken;
import fit.tlcn.fashionshopbe.service.RefreshTokenService;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public class RoleServiceImpl implements RefreshTokenService {
    @Override
    public <S extends RefreshToken> S save(S entity) {
        return null;
    }

    @Override
    public ResponseEntity<GenericResponse> refreshAccessToken(String refreshToken) {
        return null;
    }

    @Override
    public void revokeRefreshToken(String userId) {

    }

    @Override
    public ResponseEntity<GenericResponse> logout(String refreshToken) {
        return null;
    }
}
