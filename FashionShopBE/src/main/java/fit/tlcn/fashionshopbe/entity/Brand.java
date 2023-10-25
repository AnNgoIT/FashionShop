package fit.tlcn.fashionshopbe.entity;

import fit.tlcn.fashionshopbe.constant.Nation;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.ZonedDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "brand")
public class Brand {
    @Id
    @Column(columnDefinition = "varchar(32)")
    private String brand_id;

    @Column(columnDefinition = "nvarchar(max) not null")
    @NotBlank
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @NotBlank
    private Nation nation;

    @CreationTimestamp
    private ZonedDateTime createdAt;

    @UpdateTimestamp
    private ZonedDateTime updatedAt;

    @Column(columnDefinition = "bit default 0")
    private Boolean isDeleted;
}
