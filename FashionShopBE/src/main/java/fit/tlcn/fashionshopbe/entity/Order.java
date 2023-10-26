//package fit.tlcn.fashionshopbe.entity;
//
//import fit.tlcn.fashionshopbe.constant.Status;
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
//@Table(name = "\"order\"")
//public class Order {
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Integer order_id;
//
//    @ManyToOne
//    @JoinColumn(name = "user_id")
//    private User customer;
//
//    @OneToOne
//    @JoinColumn(name = "delivery_id")
//    private Delivery delivery;
//
//    @Column(columnDefinition = "float not null")
//    private Float amount;
//
//    @Column(columnDefinition = "bit default 0")
//    private Boolean isPaidBefore;
//
//    @Column(columnDefinition = "nvarchar(max) not null")
//    private String address;
//
//    @Column(columnDefinition = "nvarchar(15) not null")
//    private String phone;
//
//    @Enumerated(EnumType.STRING)
//    @Column(nullable = false)
//    private Status status;
//
//    @CreationTimestamp
//    private ZonedDateTime createdAt;
//
//    @UpdateTimestamp
//    private ZonedDateTime updatedAt;
//}
