package fit.tlcn.fashionshopbe.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import fit.tlcn.fashionshopbe.constant.Gender;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.math.BigDecimal;
import java.util.Collection;
import java.util.Date;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "\"user\"")
public class User implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String userId;

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

    @ManyToOne
    @JoinColumn(name = "roleId")
    @JsonBackReference
    private Role role;

    @Column(columnDefinition = "nvarchar(max)")
    private String address;

    @Column(columnDefinition = "nvarchar(max)")
    private String avatar;

    @Column(columnDefinition = "varchar(20)")
    private String eWallet;

    @CreationTimestamp
    private Date createdAt;

    @UpdateTimestamp
    private Date updatedAt;

    private Date lastLoginAt;

    private Boolean isActive = true;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(role.getName()));
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
