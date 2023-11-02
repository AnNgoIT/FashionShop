package fit.tlcn.fashionshopbe.repository;

import fit.tlcn.fashionshopbe.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoleRepository extends JpaRepository<Role, Integer> {
    Role findByName(String customer);
}
