package fit.tlcn.fashionshopbe.repository;

import fit.tlcn.fashionshopbe.entity.Order;
import fit.tlcn.fashionshopbe.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Integer> {
    List<Order> findAllByCustomer(User user);

    Optional<Order> findByOrderIdAndCustomer(Integer orderId, User user);
}
