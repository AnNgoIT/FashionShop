package fit.tlcn.fashionshopbe.dto;

import lombok.*;

import java.util.Date;
import java.util.List;
import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProductItemResponse {
    private Integer productItemId;

    private Integer parentId;

    private  String parentName;

    private Integer quantity;

    private Integer sold;

    private String image;

    private Float price;

    private Float promotionalPrice;

    private List<String> styleValueNames;

    private Map<String, Object> styleValueByStyles;

    private String sku;

    private Date createdAt;

    private Date updatedAt;
}
