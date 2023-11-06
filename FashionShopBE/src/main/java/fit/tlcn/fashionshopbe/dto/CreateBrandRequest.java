package fit.tlcn.fashionshopbe.dto;

import fit.tlcn.fashionshopbe.constant.Nation;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CreateBrandRequest {
    @NotBlank(message = "Name is required")
    private String name;

    private Nation nation;
}
