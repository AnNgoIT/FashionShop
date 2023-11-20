package fit.tlcn.fashionshopbe.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.ZonedDateTime;
import java.util.Date;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "productItem")
public class ProductItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer productItemId;

    @ManyToOne
    @JoinColumn(name = "productId")
    private Product parent;

    @Column(columnDefinition = "int not null")
    private Integer quantity;

    private Integer sold = 0;

    @Column(columnDefinition = "varchar(max) not null")
    private String image;

    @Column(columnDefinition = "float not null")
    private Float price;

    @Column(columnDefinition = "float not null")
    private Float promotionalPrice;

    @ManyToMany
    @JoinTable(name = "productItem_styleValue", joinColumns = @JoinColumn(name = "productItemId"),
            inverseJoinColumns = @JoinColumn(name = "styleValueId"))
    private Set<StyleValue> styleValues;

    @Column(columnDefinition = "varchar(max) not null")
    private String sku;

    @CreationTimestamp
    private Date createdAt;

    @UpdateTimestamp
    private Date updatedAt;
}
