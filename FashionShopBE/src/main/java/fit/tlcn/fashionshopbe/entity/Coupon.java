package fit.tlcn.fashionshopbe.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.util.Date;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "coupon")
public class Coupon {
    @Id
    @Column(columnDefinition = "varchar(32)")
    private String couponId;

    @ManyToOne
    @JoinColumn(name = "bannerId")
    @JsonBackReference
    private Banner banner;

    @Column(nullable = false)
    private Date startAt;

    @Column(nullable = false)
    private Date expireAt;

    @Column(columnDefinition = "float not null")
    private Float discount;

    private Boolean checkCoupon = false;

    @ManyToMany
    @JoinTable(name = "coupon_category", joinColumns = @JoinColumn(name = "couponId"),
            inverseJoinColumns = @JoinColumn(name = "categoryId"))
    @JsonBackReference
    private Set<Category> categories;

    @CreationTimestamp
    private Date createdAt;

    @UpdateTimestamp
    private Date updatedAt;

    private Boolean isActive = true;
}
