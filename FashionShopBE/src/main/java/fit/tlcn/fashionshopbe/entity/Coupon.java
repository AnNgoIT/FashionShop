//package fit.tlcn.fashionshopbe.entity;
//
//import jakarta.persistence.*;
//import lombok.*;
//import org.hibernate.annotations.CreationTimestamp;
//import org.hibernate.annotations.UpdateTimestamp;
//
//import java.time.ZonedDateTime;
//import java.util.Date;
//import java.util.Set;
//
//@Getter
//@Setter
//@NoArgsConstructor
//@AllArgsConstructor
//@Entity
//@Table(name = "coupon")
//public class Coupon {
//    @Id
//    @Column(columnDefinition = "varchar(32)")
//    private String couponId;
//
//    @ManyToOne
//    @JoinColumn(name = "bannerId")
//    private Banner banner;
//
//    @Column(nullable = false)
//    private Date startAt;
//
//    @Column(nullable = false)
//    private Date expireAt;
//
//    @Column(columnDefinition = "float not null")
//    private Float discount;
//
//    @ManyToMany
//    @JoinTable(name = "product_coupon", joinColumns = @JoinColumn(name = "couponId"),
//            inverseJoinColumns = @JoinColumn(name = "productId"))
//    private Set<Product> products;
//
//    @CreationTimestamp
//    private Date createdAt;
//
//    @UpdateTimestamp
//    private Date updatedAt;
//
//    private Boolean isActive = true;
//}
