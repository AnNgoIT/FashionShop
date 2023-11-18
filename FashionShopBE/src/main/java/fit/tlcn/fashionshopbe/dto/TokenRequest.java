package fit.tlcn.fashionshopbe.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TokenRequest {
    private String refreshToken;
}
