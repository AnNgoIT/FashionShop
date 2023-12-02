package fit.tlcn.fashionshopbe.repository;

import fit.tlcn.fashionshopbe.entity.Cart;
import fit.tlcn.fashionshopbe.entity.CartItem;
import fit.tlcn.fashionshopbe.entity.ProductItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Integer> {
    List<CartItem> findByCart(Cart cart);

    Optional<CartItem> findByCartItemIdAndCart_User_Email(Integer cartItemId, String emailFromToken);

    List<CartItem> findByCart_User_Email(String emailFromToken);

    void deleteAllByCart(Cart cart);

    Optional<CartItem> findByProductItem(ProductItem productItem);
}
