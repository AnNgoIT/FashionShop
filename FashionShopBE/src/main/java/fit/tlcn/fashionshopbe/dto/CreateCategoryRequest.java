package fit.tlcn.fashionshopbe.dto;

import fit.tlcn.fashionshopbe.entity.Category;
import jakarta.persistence.Column;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CreateCategoryRequest {
    @NotBlank(message = "Name is required")
    private String name;

    private Integer parentId;

    @NotBlank(message = "Icon is required")
    private String icon;
}
