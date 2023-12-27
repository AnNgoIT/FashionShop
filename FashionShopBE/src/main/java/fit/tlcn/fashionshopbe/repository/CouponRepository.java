package fit.tlcn.fashionshopbe.repository;

import fit.tlcn.fashionshopbe.entity.Category;
import fit.tlcn.fashionshopbe.entity.Coupon;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CouponRepository extends JpaRepository<Coupon, String> {
    List<Coupon> findAllByCategoriesContainingAndCheckCouponIsTrue(Category category);
}
