//package fit.tlcn.fashionshopbe.entity;
//
//import jakarta.persistence.*;
//import lombok.AllArgsConstructor;
//import lombok.Getter;
//import lombok.NoArgsConstructor;
//import lombok.Setter;
//import org.hibernate.annotations.CreationTimestamp;
//import org.hibernate.annotations.UpdateTimestamp;
//
//import java.time.ZonedDateTime;
//
//@Getter
//@Setter
//@NoArgsConstructor
//@AllArgsConstructor
//@Entity
//@Table(name = "styleValue")
//public class StyleValue {
//    @Id
//    @Column(columnDefinition = "varchar(32)")
//    private String styleValue_id;
//
//    @ManyToOne
//    @JoinColumn(name = "style_id")
//    private Style style;
//
//    @CreationTimestamp
//    private ZonedDateTime createdAt;
//
//    @UpdateTimestamp
//    private ZonedDateTime updatedAt;
//
//    @Column(columnDefinition = "bit default 0")
//    private Boolean isDeleted;
//}
