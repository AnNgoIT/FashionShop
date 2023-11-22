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
public class ProductResponse {
    private Integer productId;

    private String name;

    private String description;

    private String image;

    private Integer categoryId;

    private String categoryName;

    private Integer brandId;

    private String brandName;

    private Integer totalQuantity;

    private Integer totalSold;

    private Float priceMin;

    private Float promotionalPriceMin;

    private Float rating;

    private List<String> styleNames;

    private List<String> styleValueNames;

    private Date createdAt;

    private Date updatedAt;

    private Boolean isSelling;

    private Boolean isActive;
}
