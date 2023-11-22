package fit.tlcn.fashionshopbe.repository;

import fit.tlcn.fashionshopbe.constant.Nation;
import fit.tlcn.fashionshopbe.entity.Brand;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BrandRepository extends JpaRepository<Brand, Integer> {
    Optional<Brand> findByName(String name);

    List<Brand> findAllByIsActiveIsTrue();

    Optional<Brand> findByBrandIdAndIsActiveIsTrue(Integer brandId);

    Optional<Brand> findByNameAndIsActiveIsTrue(String brandName);
}
