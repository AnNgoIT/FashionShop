package fit.tlcn.fashionshopbe.service;

import fit.tlcn.fashionshopbe.dto.ResetPasswordRequest;
import fit.tlcn.fashionshopbe.entity.EmailVerification;

import java.util.Optional;

public interface EmailVerificationService {
    void sendOtpVerifyEmail(String email);

    Optional<EmailVerification> findByEmail(String email);

    void deleteExpiredOtp();

    boolean verifyOtpRegister(String email, String otp);

    void sendOtpForgotPassword(String email);

    boolean resetPassword(ResetPasswordRequest resetPasswordRequest);
}
