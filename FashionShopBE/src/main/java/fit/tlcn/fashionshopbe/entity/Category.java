package fit.tlcn.fashionshopbe.entity;

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
@Table(name = "category")
public class Category {
    @Id
    @Column(columnDefinition = "varchar(32)")
    private String category_id;

    @Column(columnDefinition = "nvarchar(max) not null")
    @NotBlank
    private String name;

    @ManyToOne
    @JoinColumn(name = "parentId")
    private Category parent;

    @Column(columnDefinition = "varchar(max) not null")
    @NotBlank
    private String image;

    @CreationTimestamp
    private ZonedDateTime createdAt;

    @UpdateTimestamp
    private ZonedDateTime updatedAt;

    @Column(columnDefinition = "bit default 0")
    private Boolean isDeleted;
}
