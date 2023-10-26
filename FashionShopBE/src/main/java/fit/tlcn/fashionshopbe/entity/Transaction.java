//package fit.tlcn.fashionshopbe.entity;
//
//import fit.tlcn.fashionshopbe.constant.TransactionType;
//import jakarta.persistence.*;
//import lombok.AllArgsConstructor;
//import lombok.Getter;
//import lombok.NoArgsConstructor;
//import lombok.Setter;
//import org.hibernate.annotations.CreationTimestamp;
//
//import java.time.ZonedDateTime;
//
//@Getter
//@Setter
//@NoArgsConstructor
//@AllArgsConstructor
//@Entity
//@Table(name = "\"transaction\"")
//public class Transaction {
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Integer transaction_id;
//
//    @OneToOne
//    @JoinColumn(name = "order_id", unique = true)
//    private Order order;
//
//    @Enumerated(EnumType.STRING)
//    @Column(nullable = false)
//    private TransactionType transactionType;
//
//    @Column(columnDefinition = "nvarchar(254) not null")
//    private String content;
//
//    @CreationTimestamp
//    private ZonedDateTime createdAt;
//}
