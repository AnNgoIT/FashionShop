package fit.tlcn.fashionshopbe.repository;

import fit.tlcn.fashionshopbe.entity.RefreshToken;
import fit.tlcn.fashionshopbe.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, String> {
    List<RefreshToken> findAllByUserAndExpiredIsFalseAndRevokedIsFalse(User user);
    Optional<RefreshToken> findByUserAndExpiredIsFalseAndRevokedIsFalse(User user);

    Optional<RefreshToken> findByTokenAndExpiredIsFalseAndRevokedIsFalse(String refreshToken);
}
