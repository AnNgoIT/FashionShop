package fit.tlcn.fashionshopbe.dto;

import jakarta.annotation.Nullable;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UpdateCategoryRequest {
    @NotBlank(message = "Name is required")
    private String name;

    private Integer parentId;

    @NotBlank(message = "Icon is required")
    private String icon;

}
