package fit.tlcn.fashionshopbe.dto;

import fit.tlcn.fashionshopbe.constant.Gender;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
    private String userId;

    private String fullname;

    private String email;

    private String phone;

    private Boolean isVerified;

    private Date dob;

    private Gender gender;

    private String role;

    private String address;

    private String avatar;

    private String eWallet;

    private Date createdAt;

    private Date updatedAt;

    private Boolean isActive;
}
