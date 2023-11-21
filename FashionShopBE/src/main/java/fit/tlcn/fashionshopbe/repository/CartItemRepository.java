package fit.tlcn.fashionshopbe.repository;

import fit.tlcn.fashionshopbe.entity.Cart;
import fit.tlcn.fashionshopbe.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Integer> {
    List<CartItem> findByCart(Cart cart);
}
