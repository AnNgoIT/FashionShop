package fit.tlcn.fashionshopbe.entity;

import fit.tlcn.fashionshopbe.constant.Gender;
import fit.tlcn.fashionshopbe.constant.Role;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.ZonedDateTime;
import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "\"user\"")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String user_id;

    @Column(columnDefinition = "nvarchar(50) not null")
    @NotBlank
    private String fullname;

    @Column(columnDefinition = "varchar(254) not null unique")
    @Email
    private String email;

    @Column(columnDefinition = "varchar(32) not null")
    @NotBlank
    private String password;

    @Column(columnDefinition = "varchar(15) not null unique")
    @NotBlank
    private String phone;

    @Column(columnDefinition = "bit default 0")
    private Boolean isVerified;

    private Date dob;

    @Enumerated(EnumType.STRING)
    private Gender gender;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @NotBlank
    private Role role;

    @Column(columnDefinition = "nvarchar(max)")
    private String address;

    @Column(columnDefinition = "nvarchar(max)")
    private String avatar;

    private BigDecimal eWallet;

    @CreationTimestamp
    private ZonedDateTime createdAt;

    @UpdateTimestamp
    private ZonedDateTime updatedAt;

    @Column(columnDefinition = "bit default 0")
    private Boolean isDeleted;

}
