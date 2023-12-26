package fit.tlcn.fashionshopbe.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UpdateStyleRequest {
    @NotBlank(message = "Name is required")
    private String name;
}
