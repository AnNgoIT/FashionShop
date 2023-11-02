package fit.tlcn.fashionshopbe.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UpdateCategoryStatusRequest {
    @NotBlank(message = "Status is required")
    private Boolean isActive;
}
