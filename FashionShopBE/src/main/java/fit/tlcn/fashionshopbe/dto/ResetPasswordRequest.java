package fit.tlcn.fashionshopbe.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.validator.constraints.Length;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ResetPasswordRequest {
    @NotBlank(message = "email is required")
    @Email
    private String email;

    @NotBlank(message = "OTP is required")
    @Length(min = 6, max = 6)
    private String otp;

    @NotBlank(message = "Please enter new password!")
    @Size(min = 8, max = 32, message = "New password must be between 8 and 32 characters")
    private String newPassword;

    @NotBlank(message = "Please confirm new password!")
    private String confirmPassword;
}
