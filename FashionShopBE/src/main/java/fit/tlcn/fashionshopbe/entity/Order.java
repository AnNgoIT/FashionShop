package fit.tlcn.fashionshopbe.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonGetter;
import fit.tlcn.fashionshopbe.constant.Status;
import fit.tlcn.fashionshopbe.constant.TransactionType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "\"order\"")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer orderId;

    @ManyToOne
    @JoinColumn(name = "userId")
    @JsonBackReference
    private User customer;

    @Column(columnDefinition = "float not null")
    private Float totalAmount;

    private Boolean checkout = false;

    @Column(columnDefinition = "nvarchar(max) not null")
    private String fullName;

    @Column(columnDefinition = "nvarchar(15) not null")
    private String phone;

    @Column(columnDefinition = "nvarchar(max) not null")
    private String address;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TransactionType transactionType;

    @CreationTimestamp
    private Date createdAt;

    @UpdateTimestamp
    private Date updatedAt;

    @JsonGetter("customerId")
    public String getCustomerId(){
        return this.customer.getUserId();
    }
}
