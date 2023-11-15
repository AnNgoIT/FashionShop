package fit.tlcn.fashionshopbe.dto;

import fit.tlcn.fashionshopbe.constant.Gender;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileUpdateRequest {
    private String fullname;

    private String phone;

    private Date dob;

    private Gender gender;

    private String address;

    private MultipartFile avatar;

    private String eWallet;
}
