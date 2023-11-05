package fit.tlcn.fashionshopbe.repository;

import fit.tlcn.fashionshopbe.entity.Style;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StyleRepository extends JpaRepository<Style, Integer> {
    Optional<Style> findByName(String name);

    List<Style> findAllByIsActiveIsTrue();

    Optional<Style> findByStyleIdAndIsActiveIsTrue(Integer styleId);
}
