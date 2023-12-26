package fit.tlcn.fashionshopbe.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonGetter;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "delivery")
public class Delivery {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer deliveryId;

    @OneToOne
    @JoinColumn(name = "orderId")
    @JsonBackReference
    private Order order;

    @ManyToOne
    @JoinColumn(name = "shipperId")
    @JsonBackReference
    private User shipper;

    @Column(columnDefinition = "nvarchar(max)")
    private String note;

    private Boolean isReceived = false;

    private Boolean isDelivered = false;

    @CreationTimestamp
    private Date createdAt;

    @UpdateTimestamp
    private Date updatedAt;

    @JsonGetter("orderId")
    public Integer getOrderId() {
        return this.order.getOrderId();
    }

    @JsonGetter("shipperId")
    public String getShipperId() {
        return this.shipper.getUserId();
    }

    @JsonGetter("shipperName")
    public String getShipperName() {
        return this.shipper.getFullname();
    }

    @JsonGetter("shipperEmail")
    public String getShipperEmail() {
        return this.shipper.getEmail();
    }

    @JsonGetter("recipientName")
    public String getRecipientName() {
        return this.order.getFullName();
    }

    @JsonGetter("address")
    public String getAddress() {
        return this.order.getAddress();
    }

    @JsonGetter("phone")
    public String getPhone() {
        return this.order.getPhone();
    }

    @JsonGetter("checkoutStatus")
    public Boolean getCheckoutStatus() {
        return this.order.getCheckout();
    }

    @JsonGetter("totalAmount")
    public Float getTotalAmount() {
        return this.order.getTotalAmount();
    }
}
