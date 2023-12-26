package fit.tlcn.fashionshopbe.dto;

import fit.tlcn.fashionshopbe.constant.PaymentMethod;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OrderRequest {
    @NotNull(message = "Cart Items is required")
    private List<Integer> cartItemIds;

    @NotBlank(message = "Fullname is required")
    private String fullName;

    @NotBlank(message = "Phone is required")
    private String phone;

    @NotBlank(message = "Address is required")
    private String address;

    @NotNull(message = "Shipping Cost is required")
    private Integer shippingCost;

    private PaymentMethod paymentMethod;
}
