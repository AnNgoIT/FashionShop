package fit.tlcn.fashionshopbe.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CategoryResponse {
    private Integer categoryId;

    private String name;

    private String parentName;

    private String image;

    private List<String> styleNames;

    private Date createdAt;

    private Date updatedAt;

    private Boolean isActive;
}
