package fit.tlcn.fashionshopbe.repository;

import fit.tlcn.fashionshopbe.entity.Product;
import fit.tlcn.fashionshopbe.entity.ProductItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductItemRepository extends JpaRepository<ProductItem, Integer> {
    List<ProductItem> findAllByParent_ProductId(Integer productId);

    Optional<ProductItem> findBySku(String sku);

    List<ProductItem> findAllByParent(Product product);
}
