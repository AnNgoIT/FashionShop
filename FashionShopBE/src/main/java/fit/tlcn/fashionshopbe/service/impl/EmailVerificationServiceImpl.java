package fit.tlcn.fashionshopbe.service.impl;

import fit.tlcn.fashionshopbe.dto.ResetPasswordRequest;
import fit.tlcn.fashionshopbe.entity.Cart;
import fit.tlcn.fashionshopbe.entity.EmailVerification;
import fit.tlcn.fashionshopbe.entity.User;
import fit.tlcn.fashionshopbe.repository.CartRepository;
import fit.tlcn.fashionshopbe.repository.EmailVerificationRepository;
import fit.tlcn.fashionshopbe.repository.UserRepository;
import fit.tlcn.fashionshopbe.service.EmailVerificationService;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Random;

@Service
public class EmailVerificationServiceImpl implements EmailVerificationService {
    private final int OTP_LENGTH = 6;

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private EmailVerificationRepository emailVerificationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    TemplateEngine templateEngine;

    @Autowired
    CartRepository cartRepository;

    @Autowired
    BCryptPasswordEncoder passwordEncoder;

    @Override
    public void sendOtpVerifyEmail(String email) {
        String otp = generateOtp();
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setTo(email);

            // Load Thymeleaf template
            Context context = new Context();
            context.setVariable("otpCode", otp);
//            context.setVariable("verifyEmail", email);
            String mailContent = templateEngine.process("send-otp-verify-email", context);

            helper.setText(mailContent, true);
            helper.setSubject("ATShop - The email verification code");
            mailSender.send(message);

            LocalDateTime expirationTime = LocalDateTime.now().plusMinutes(2);
            EmailVerification emailVerification = new EmailVerification();
            emailVerification.setEmail(email);
            emailVerification.setOtp(otp);
            emailVerification.setExpirationTime(expirationTime);

            Optional<EmailVerification> existingEmailVerification = findByEmail(email);
            if (existingEmailVerification.isPresent()) {
                emailVerificationRepository.delete(existingEmailVerification.get());
            }

            emailVerificationRepository.save(emailVerification);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        }
    }

    @Override
    public boolean verifyOtpRegister(String email, String otp) {
        Optional<EmailVerification> emailVerification = emailVerificationRepository.findByEmail(email);
        Optional<User> optionalUser = userRepository.findByEmail(email);
        if (optionalUser.isPresent() && emailVerification.isPresent() && LocalDateTime.now().isBefore(emailVerification.get().getExpirationTime()) && emailVerification.get().getOtp().equals(otp)) {
            User user = optionalUser.get();
            user.setIsVerified(true);
            userRepository.save(user);

            Cart cart = new Cart();
            cart.setUser(user);
            cartRepository.save(cart);
            return true;
        }
        return false;
    }

    @Override
    public void sendOtpForgotPassword(String email) {
        String otp = generateOtp();
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setTo(email);

            // Load Thymeleaf template
            Context context = new Context();
            context.setVariable("otpCode", otp);
            String mailContent = templateEngine.process("forgot-password", context);

            helper.setText(mailContent, true);
            helper.setSubject("ATShop - The reset password code");
            mailSender.send(message);

            LocalDateTime expirationTime = LocalDateTime.now().plusMinutes(2);
            EmailVerification emailVerification = new EmailVerification();
            emailVerification.setEmail(email);
            emailVerification.setOtp(otp);
            emailVerification.setExpirationTime(expirationTime);

            Optional<EmailVerification> existingEmailVerification = findByEmail(email);
            if (existingEmailVerification.isPresent()) {
                emailVerificationRepository.delete(existingEmailVerification.get());
            }

            emailVerificationRepository.save(emailVerification);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        }
    }

    @Override
    public boolean resetPassword(ResetPasswordRequest resetPasswordRequest) {
        Optional<EmailVerification> emailVerification = emailVerificationRepository.findByEmail(resetPasswordRequest.getEmail());
        Optional<User> optionalUser = userRepository.findByEmail(resetPasswordRequest.getEmail());
        if (optionalUser.isPresent() &&
                emailVerification.isPresent() &&
                LocalDateTime.now().isBefore(emailVerification.get().getExpirationTime()) &&
                emailVerification.get().getOtp().equals(resetPasswordRequest.getOtp()) &&
                resetPasswordRequest.getConfirmPassword().equals(resetPasswordRequest.getNewPassword())) {
            User user = optionalUser.get();
            user.setPassword(passwordEncoder.encode(resetPasswordRequest.getNewPassword()));

            userRepository.save(user);
            return true;
        }
        return false;
    }

    private String generateOtp() {
        StringBuilder otp = new StringBuilder();
        Random random = new Random();
        for (int i = 0; i < OTP_LENGTH; i++) {
            otp.append(random.nextInt(10));
        }
        return otp.toString();
    }

    @Override
    public Optional<EmailVerification> findByEmail(String email) {
        return emailVerificationRepository.findByEmail(email);
    }

    @Override
    public void deleteExpiredOtp() {
        LocalDateTime now = LocalDateTime.now();
        List<EmailVerification> expiredOtpList = emailVerificationRepository.findByExpirationTimeBefore(now);
        emailVerificationRepository.deleteAll(expiredOtpList);
    }

    @Scheduled(fixedDelay = 600000L) // 10 minutes
    public void cleanupExpiredOtp() {
        deleteExpiredOtp();
    }
}
