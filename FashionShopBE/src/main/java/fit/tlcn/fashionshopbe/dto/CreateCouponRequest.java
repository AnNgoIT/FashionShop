package fit.tlcn.fashionshopbe.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CreateCouponRequest {
    @NotBlank(message = "Id is required")
    private String couponId;

    private Integer bannerId;

    @NotNull(message = "Start is required")
    private Date startAt;

    @NotNull(message = "Expire is required")
    private Date expireAt;

    @NotNull(message = "Discount is required")
    @Positive
    private Float discount;

    @NotNull(message = "Categories is required")
    private Set<Integer> categoryIds;
}
