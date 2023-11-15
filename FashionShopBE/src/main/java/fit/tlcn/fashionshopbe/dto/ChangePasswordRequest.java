package fit.tlcn.fashionshopbe.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ChangePasswordRequest {
    @NotBlank(message = "Please enter current password correctly!")
    @Size(min = 8, max = 32, message = "Current password must be between 8 and 32 characters")
    private String currentPassword;

    @NotBlank(message = "Please enter new password!")
    @Size(min = 8, max = 32, message = "New password must be between 8 and 32 characters")
    private String newPassword;

    @NotBlank(message = "Please confirm new password!")
    private String confirmPassword;
}
