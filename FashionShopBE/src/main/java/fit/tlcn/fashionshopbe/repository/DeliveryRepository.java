package fit.tlcn.fashionshopbe.repository;

import fit.tlcn.fashionshopbe.entity.Delivery;
import fit.tlcn.fashionshopbe.entity.Order;
import fit.tlcn.fashionshopbe.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DeliveryRepository extends JpaRepository<Delivery, Integer> {
    List<Delivery> findAllByShipperOrderByUpdatedAtDesc(User user);

    List<Delivery> findAllByShipperAndIsReceivedIsFalseAndIsDeliveredIsFalseOrderByCreatedAt(User user);

    Optional<Delivery> findByDeliveryIdAndShipper(Integer deliveryId, User user);

    List<Delivery> findAllByShipperAndIsReceivedIsTrueAndIsDeliveredIsFalseOrderByUpdatedAt(User user);

    List<Delivery> findAllByShipperAndIsReceivedIsTrueAndIsDeliveredIsTrueOrderByUpdatedAtDesc(User user);

    Optional<Delivery> findByOrder(Order order);
}
