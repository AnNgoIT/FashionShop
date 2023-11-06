package fit.tlcn.fashionshopbe.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CreateStyleValueRequest {
    @NotBlank(message = "Name is required")
    private String name;

    @NotNull(message = "Please enter Style correctly!")
    private Integer styleId;
}
