package fit.tlcn.fashionshopbe.dto;

import jakarta.annotation.Nullable;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CreateProductRequest {
    @NotBlank(message = "Name is required")
    private String name;

    @Nullable
    private String description;

    private List<MultipartFile> imageFiles;

    @NotNull(message = "Price is required")
    private Float price;

    @NotNull(message = "Quantity is required")
    private Integer quantity;

    @NotNull(message = "Category is required")
    private Integer categoryId;

    @NotNull(message = "Brand is required")
    private Integer brandId;

    @NotNull(message = "Styles is required")
    private Set<Integer> styleIds;

    @NotNull(message = "Style Values is required")
    private Set<Integer> styleValueIds;
}
