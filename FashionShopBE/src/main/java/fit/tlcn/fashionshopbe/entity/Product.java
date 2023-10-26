//package fit.tlcn.fashionshopbe.entity;
//
//import jakarta.persistence.*;
//import lombok.AllArgsConstructor;
//import lombok.Getter;
//import lombok.NoArgsConstructor;
//import lombok.Setter;
//import org.hibernate.annotations.CreationTimestamp;
//import org.hibernate.annotations.UpdateTimestamp;
//
//import java.time.ZonedDateTime;
//import java.util.Set;
//
//@Getter
//@Setter
//@NoArgsConstructor
//@AllArgsConstructor
//@Entity
//@Table(name = "product")
//public class Product {
//    @Id
//    @Column(columnDefinition = "varchar(32)")
//    private String product_id;
//
//    @Column(columnDefinition = "nvarchar(max) not null")
//    private String name;
//
//    @Column(columnDefinition = "nvarchar(max)")
//    private String description;
//
//    @Column(columnDefinition = "varchar(max) not null")
//    private String images;
//
//    @Column(columnDefinition = "float not null")
//    private Float price;
//
//    @Column(columnDefinition = "float not null")
//    private Float promotionalPrice;
//
//    @Column(columnDefinition = "int not null")
//    private Integer quantity;
//
//    @Column(columnDefinition = "int default 0")
//    private Integer sold;
//
//    @ManyToOne
//    @JoinColumn(name = "category_id")
//    private Category category;
//
//    @ManyToOne
//    @JoinColumn(name = "brand_id")
//    private Brand brand;
//
//    private Float rating;
//
//    @ManyToMany
//    @JoinTable(name = "product_style", joinColumns = @JoinColumn(name = "product_id"),
//            inverseJoinColumns = @JoinColumn(name = "style_id"))
//    private Set<Style> styles;
//
//    @ManyToMany
//    @JoinTable(name = "product_styleValue", joinColumns = @JoinColumn(name = "product_id"),
//            inverseJoinColumns = @JoinColumn(name = "styleValue_id"))
//    private Set<StyleValue> styleValues;
//
//    @ManyToMany(mappedBy = "products")
//    private Set<Coupon> coupons;
//
//    @ManyToMany
//    @JoinTable(name = "userFollowProduct", joinColumns = @JoinColumn(name = "product_id"),
//            inverseJoinColumns = @JoinColumn(name = "user_id"))
//    private Set<User> followers;
//
//    @CreationTimestamp
//    private ZonedDateTime createdAt;
//
//    @UpdateTimestamp
//    private ZonedDateTime updatedAt;
//
//    @Column(columnDefinition = "bit default 1")
//    private Boolean isSelling;
//
//    @Column(columnDefinition = "bit default 0")
//    private Boolean isDeleted;
//}
