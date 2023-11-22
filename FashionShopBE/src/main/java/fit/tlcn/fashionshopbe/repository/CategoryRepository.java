package fit.tlcn.fashionshopbe.repository;

import fit.tlcn.fashionshopbe.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Integer> {
    List<Category> findAllByIsActiveIsTrue();

    Optional<Category> findByCategoryIdAndIsActiveIsTrue(Integer categoryId);

    Optional<Category> findByName(String name);

    Optional<Category> findByNameAndIsActiveIsTrue(String categoryName);
}
