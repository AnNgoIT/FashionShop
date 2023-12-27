package fit.tlcn.fashionshopbe.repository;

import fit.tlcn.fashionshopbe.entity.Order;
import fit.tlcn.fashionshopbe.entity.OrderItem;
import fit.tlcn.fashionshopbe.entity.Product;
import fit.tlcn.fashionshopbe.entity.Rating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RatingRepository extends JpaRepository<Rating, Integer> {
    List<Rating> findByOrderItem_ProductItem_Parent(Product product);

    Optional<Rating> findByOrderItem(OrderItem orderItem);

    List<Rating> findAllByOrderItem_Order(Order order);
}
