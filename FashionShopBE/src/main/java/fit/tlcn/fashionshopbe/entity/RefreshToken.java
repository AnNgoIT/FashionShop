package fit.tlcn.fashionshopbe.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class RefreshToken {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(length = 700)
    private String token;

    private boolean expired;
    private boolean revoked;

    @ManyToOne
    @JoinColumn(name = "userId")
    @JsonBackReference
    private User user;
}
