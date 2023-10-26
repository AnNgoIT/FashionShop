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
//@Table(name = "news")
//public class News {
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Integer news_id;
//
//    @ManyToOne
//    @JoinColumn(name = "user_id")
//    private User author;
//
//    @Column(columnDefinition = "nvarchar(max) not null")
//    private String content;
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
