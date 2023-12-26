package fit.tlcn.fashionshopbe.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UpdateStyleValueRequest {
    @NotBlank(message = "Name is required")
    private String name;
}
