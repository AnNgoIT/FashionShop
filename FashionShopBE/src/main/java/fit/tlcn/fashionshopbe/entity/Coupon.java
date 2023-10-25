package fit.tlcn.fashionshopbe.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.ZonedDateTime;
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
    private String coupon_id;

    @ManyToOne
    @JoinColumn(name = "banner_id")
    private Banner banner;

    @Column(nullable = false)
    private ZonedDateTime startAt;

    @Column(nullable = false)
    private ZonedDateTime expireAt;

    @Column(columnDefinition = "float not null")
    private Float discount;

    @ManyToMany
    @JoinTable(name = "product_coupon", joinColumns = @JoinColumn(name = "coupon_id"),
            inverseJoinColumns = @JoinColumn(name = "product_id"))
    private Set<Product> products;

    @CreationTimestamp
    private ZonedDateTime createdAt;

    @UpdateTimestamp
    private ZonedDateTime updatedAt;

    @Column(columnDefinition = "bit default 0")
    private Boolean isDeleted;
}
