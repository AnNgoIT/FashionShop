package fit.tlcn.fashionshopbe.service;

import fit.tlcn.fashionshopbe.entity.EmailVerification;

import java.util.Optional;

public interface EmailVerificationService {
    void sendOtp(String email);

    Optional<EmailVerification> findByEmail(String email);

    void deleteExpiredOtp();

    boolean verifyOtp(String email, String otp);
}
