package fit.tlcn.fashionshopbe.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CreateCategoryRequest {
    @NotBlank(message = "Name is required")
    private String name;

    private Integer parentId;

    @NotNull(message = "Image is required")
    private MultipartFile imageFile;

    @NotNull(message = "Styles is required")
    private Set<Integer> styleIds;
}
