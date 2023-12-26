package fit.tlcn.fashionshopbe.entity;

import fit.tlcn.fashionshopbe.constant.TransactionType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "\"transaction\"")
public class Transaction {
    @Id
    @Column(columnDefinition = "nvarchar(15)")
    private String transactionId;

    @ManyToOne
    @JoinColumn(name = "orderId", unique = true)
    private Order order;

    @Enumerated(EnumType.STRING)
    private TransactionType transactionType;

    @Column(columnDefinition = "float not null")
    private Float amount;

    @Column(columnDefinition = "nvarchar(254) not null")
    private String content;

    @CreationTimestamp
    private Date createdAt;
}
