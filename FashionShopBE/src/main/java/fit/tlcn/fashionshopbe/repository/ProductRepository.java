package fit.tlcn.fashionshopbe.repository;

import fit.tlcn.fashionshopbe.entity.Product;
import fit.tlcn.fashionshopbe.entity.StyleValue;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, String> {
    List<Product> findAllByIsActiveIsTrueAndIsSellingIsTrue();

    Optional<Product> findByProductIdAndIsActiveIsTrueAndIsSellingIsTrue(Integer productId);

    @Query("SELECT pv FROM Product p " +
            "JOIN p.styleValues pv " +
            "JOIN pv.style s " +
            "WHERE p.productId = :productId AND s.name = :styleName")
    List<StyleValue> findStyleValuesByProductIdAndStyleName(Integer productId, String styleName);


    Page<Product> findAllByCategory_CategoryIdAndBrand_BrandIdAndIsActiveIsTrueAndIsSellingIsTrue(Integer categoryId, Integer brandId, Pageable pageable);
}
