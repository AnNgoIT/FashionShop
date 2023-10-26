//package fit.tlcn.fashionshopbe.entity;
//
//import jakarta.persistence.*;
//import lombok.AllArgsConstructor;
//import lombok.Getter;
//import lombok.NoArgsConstructor;
//import lombok.Setter;
//import org.hibernate.annotations.CreationTimestamp;
//
//import java.time.ZonedDateTime;
//
//@Getter
//@Setter
//@NoArgsConstructor
//@AllArgsConstructor
//@Entity
//@Table(name = "chatBox")
//public class Chatbox {
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Integer chatBox_id;
//
//    @ManyToOne
//    @JoinColumn(name = "creator_id")
//    private User creator;
//
//    @CreationTimestamp
//    private ZonedDateTime createdAt;
//}
