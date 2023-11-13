package fit.tlcn.fashionshopbe.repository;

import fit.tlcn.fashionshopbe.entity.EmailVerification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface EmailVerificationRepository extends JpaRepository<EmailVerification, String> {
    List<EmailVerification> findByExpirationTimeBefore(LocalDateTime expirationTime);
    Optional<EmailVerification> findByEmail(String email);
}
