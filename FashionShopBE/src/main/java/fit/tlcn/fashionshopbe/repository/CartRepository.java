package fit.tlcn.fashionshopbe.repository;

import fit.tlcn.fashionshopbe.entity.Cart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CartRepository extends JpaRepository<Cart, Integer> {
}