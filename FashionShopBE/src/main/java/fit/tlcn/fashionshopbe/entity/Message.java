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
//@Table(name = "message")
//public class Message {
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Integer message_id;
//
//    @ManyToOne
//    @JoinColumn(name = "chatBox_id")
//    private Chatbox chatbox;
//
//    @ManyToOne
//    @JoinColumn(name = "senderId")
//    private User sender;
//
//    @Column(columnDefinition = "nvarchar(max) not null")
//    private String content;
//
//    @CreationTimestamp
//    private ZonedDateTime sentAt;
//
//    @Column(columnDefinition = "bit default 0")
//    private Boolean isDeleted;
//}
