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
//
//@Getter
//@Setter
//@NoArgsConstructor
//@AllArgsConstructor
//@Entity
//@Table(name = "orderItem")
//public class OrderItem {
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Integer orderItem_id;
//
//    @ManyToOne
//    @JoinColumn(name = "order_id")
//    private Order order;
//
//    @ManyToOne
//    @JoinColumn(name = "productVariant_id")
//    private ProductVariant productVariant;
//
//    private Integer quantity;
//
//    @Column(columnDefinition = "float not null")
//    private Float amount;
//
//    @CreationTimestamp
//    private ZonedDateTime createdAt;
//
//    @UpdateTimestamp
//    private ZonedDateTime updatedAt;
//}
