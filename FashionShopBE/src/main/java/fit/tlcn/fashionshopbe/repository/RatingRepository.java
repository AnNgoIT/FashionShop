package fit.tlcn.fashionshopbe.repository;

import fit.tlcn.fashionshopbe.entity.Product;
import fit.tlcn.fashionshopbe.entity.Rating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RatingRepository extends JpaRepository<Rating, Integer> {
    List<Rating> findByOrderItem_ProductItem_Parent(Product product);
}
