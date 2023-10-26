package fit.tlcn.fashionshopbe.entity;

import fit.tlcn.fashionshopbe.constant.Gender;
import fit.tlcn.fashionshopbe.constant.Role;
import jakarta.persistence.*;
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
    private String fullname;

    @Column(columnDefinition = "varchar(254) not null unique")
    private String email;

    @Column(columnDefinition = "varchar(15) not null unique")
    private String phone;

    @Column(columnDefinition = "varchar(max) not null")
    private String password;

    private Boolean isVerified = false;

    private Date dob;

    @Enumerated(EnumType.STRING)
    private Gender gender;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
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

    private Boolean isDeleted = false;

    public User(String fullname, String email, String phone, String password, Role role) {
        this.fullname = fullname;
        this.email = email;
        this.phone = phone;
        this.password = password;
        this.role = role;
    }
}
