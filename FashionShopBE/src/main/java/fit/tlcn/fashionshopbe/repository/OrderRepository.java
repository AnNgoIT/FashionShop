package fit.tlcn.fashionshopbe.repository;

import fit.tlcn.fashionshopbe.constant.Status;
import fit.tlcn.fashionshopbe.entity.Order;
import fit.tlcn.fashionshopbe.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Integer> {
    List<Order> findAllByCustomer(User user);

    Optional<Order> findByOrderIdAndCustomer(Integer orderId, User user);

    @Query("SELECT o FROM Order o WHERE" +
            ":status IS NULL OR o.status = :status " +
            "ORDER BY " +
            "CASE WHEN o.status = 'NOT_PROCESSED' OR o.status = 'PROCESSING' THEN o.updatedAt END ASC, " +
            "CASE WHEN o.status = 'SHIPPING' OR o.status ='DELIVERED' OR o.status ='CANCELLED' THEN o.updatedAt END DESC")
    List<Order> findAllByStatusCheck(Status status);
}
