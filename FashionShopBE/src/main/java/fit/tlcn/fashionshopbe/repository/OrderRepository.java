package fit.tlcn.fashionshopbe.repository;

import fit.tlcn.fashionshopbe.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderRepository extends JpaRepository<Order, Integer> {
}
