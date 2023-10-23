package fit.tlcn.fashionshopbe.repository;

import fit.tlcn.fashionshopbe.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, String> {
}
