package fit.tlcn.fashionshopbe.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonGetter;
import com.fasterxml.jackson.annotation.JsonIgnore;
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
    @JsonBackReference
    private String password;

    private Boolean isVerified = false;

    private Date dob;

    @Enumerated(EnumType.STRING)
    private Gender gender;

    @ManyToOne
    @JoinColumn(name = "roleId")
    @JsonIgnore
    private Role role;

    @JsonGetter("role")
    public String getUserRole(){
        return this.role.getName();
    }

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

    @JsonBackReference
    private Date lastLoginAt;

    private Boolean isActive = true;

    @Override
    @JsonBackReference
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(role.getName()));
    }

    @Override
    @JsonBackReference
    public String getPassword() {
        return password;
    }

    @Override
    @JsonBackReference
    public String getUsername() {
        return email;
    }

    @Override
    @JsonBackReference
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    @JsonBackReference
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    @JsonBackReference
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    @JsonBackReference
    public boolean isEnabled() {
        return true;
    }
}
