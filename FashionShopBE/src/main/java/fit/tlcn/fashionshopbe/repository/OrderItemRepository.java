package fit.tlcn.fashionshopbe.repository;

import fit.tlcn.fashionshopbe.entity.Order;
import fit.tlcn.fashionshopbe.entity.OrderItem;
import fit.tlcn.fashionshopbe.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Integer> {
    List<OrderItem> findAllByOrder(Order order);

    Optional<OrderItem> findByOrderItemIdAndOrder_Customer(Integer orderItemId, User user);
}
