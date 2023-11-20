package fit.tlcn.fashionshopbe.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class StyleValueResponse {
    private Integer styleValueId;

    private String name;

    private String styleName;

    private Date createdAt;

    private Date updatedAt;

    private Boolean isActive;
}
