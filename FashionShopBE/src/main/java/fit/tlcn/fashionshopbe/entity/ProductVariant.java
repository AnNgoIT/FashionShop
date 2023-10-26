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
//@Table(name = "productVariant")
//public class ProductVariant {
//    @Id
//    @Column(columnDefinition = "varchar(48)")
//    private String productVariant_id;
//
//    @ManyToOne
//    @JoinColumn(name = "product_id")
//    private Product parent;
//
//    @Column(columnDefinition = "int not null")
//    private Integer quantity;
//
//    @Column(columnDefinition = "int default 0")
//    private Integer sold;
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
//    @ManyToMany
//    @JoinTable(name = "productVariant_styleValue", joinColumns = @JoinColumn(name = "productVariant_id"),
//            inverseJoinColumns = @JoinColumn(name = "styleValue_id"))
//    private Set<StyleValue> styleValues;
//
//    @CreationTimestamp
//    private ZonedDateTime createdAt;
//
//    @UpdateTimestamp
//    private ZonedDateTime updatedAt;
//}
