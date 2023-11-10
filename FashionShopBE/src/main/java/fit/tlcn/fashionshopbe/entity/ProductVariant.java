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
@Table(name = "productVariant")
public class ProductVariant {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer productVariantId;

    @ManyToOne
    @JoinColumn(name = "productId")
    private Product parent;

    @Column(columnDefinition = "int not null")
    private Integer quantity;

    private Integer sold = 0;

    @Column(columnDefinition = "varchar(max) not null")
    private String images;

    @Column(columnDefinition = "float not null")
    private Float price;

    @Column(columnDefinition = "float not null")
    private Float promotionalPrice;

    @ManyToMany
    @JoinTable(name = "productVariant_styleValue", joinColumns = @JoinColumn(name = "productVariant_id"),
            inverseJoinColumns = @JoinColumn(name = "styleValue_id"))
    private Set<StyleValue> styleValues;

    @CreationTimestamp
    private Date createdAt;

    @UpdateTimestamp
    private Date updatedAt;
}
