package fit.tlcn.fashionshopbe.entity;

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
@Table(name = "styleValue")
public class StyleValue {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer styleValueId;

    @Column(columnDefinition = "nvarchar(64) not null unique")
    private String name;

    @ManyToOne
    @JoinColumn(name = "styleId")
    private Style style;

    @CreationTimestamp
    private Date createdAt;

    @UpdateTimestamp
    private Date updatedAt;

    private Boolean isActive = true;
}
