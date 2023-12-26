package fit.tlcn.fashionshopbe.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "chatBox")
public class Chatbox {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer chatBoxId;

    @ManyToOne
    @JoinColumn(name = "creatorId")
    private User creator;

    @CreationTimestamp
    private Date createdAt;
}
