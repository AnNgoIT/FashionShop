package fit.tlcn.fashionshopbe.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OrderItemResponse {
    private Integer orderItemId;
    private Integer productItemId;
    private String productName;
    private String image;
    private List<String> styleValues;
    private Integer quantity;
    private Float productPrice;//productItemPrice
    private Float productPromotionalPrice;//productItemPromotionalPrice
    private Float amount;
}
