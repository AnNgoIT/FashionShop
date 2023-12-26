package fit.tlcn.fashionshopbe.dto;

import fit.tlcn.fashionshopbe.entity.OrderItem;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.util.Date;
import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RatingResponse {
    private Map<String, Object> styleValueByStyles;

    private String content;

    private Integer star;

    private String fullname;

    private String image;

    private Date createdAt;

}
