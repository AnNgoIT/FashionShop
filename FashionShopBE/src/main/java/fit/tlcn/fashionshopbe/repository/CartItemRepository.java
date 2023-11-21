package fit.tlcn.fashionshopbe.repository;

import fit.tlcn.fashionshopbe.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Integer> {
}
