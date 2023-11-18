package fit.tlcn.fashionshopbe.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.util.Date;
import java.util.List;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "product")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer productId;

    @Column(columnDefinition = "nvarchar(max) not null")
    private String name;

    @Column(columnDefinition = "nvarchar(max)")
    private String description;

    @Column(columnDefinition = "varchar(max) not null")
    private String image;

    @ManyToOne
    @JoinColumn(name = "categoryId")
    private Category category;

    @ManyToOne
    @JoinColumn(name = "brandId")
    private Brand brand;

    private Integer totalQuantity = 0;

    private Integer totalSold = 0;

    private Float priceMin;

    private Float promotionalPriceMin;

    private Float rating;

    @ManyToMany
    @JoinTable(name = "product_styleValue", joinColumns = @JoinColumn(name = "productId"),
            inverseJoinColumns = @JoinColumn(name = "styleValueId"))
    private Set<StyleValue> styleValues;

    @ManyToMany
    @JoinTable(name = "userFollowProduct", joinColumns = @JoinColumn(name = "productId"),
            inverseJoinColumns = @JoinColumn(name = "userId"))
    private Set<User> followers;

    @CreationTimestamp
    private Date createdAt;

    @UpdateTimestamp
    private Date updatedAt;

    private Boolean isSelling = true;

    private Boolean isActive = true;
}
