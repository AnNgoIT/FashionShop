package fit.tlcn.fashionshopbe.repository;

import fit.tlcn.fashionshopbe.entity.Order;
import fit.tlcn.fashionshopbe.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Integer> {
    List<OrderItem> findAllByOrder(Order order);
}
