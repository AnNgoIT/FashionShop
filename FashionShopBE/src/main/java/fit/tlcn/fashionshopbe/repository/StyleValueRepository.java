package fit.tlcn.fashionshopbe.repository;

import fit.tlcn.fashionshopbe.entity.Style;
import fit.tlcn.fashionshopbe.entity.StyleValue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StyleValueRepository extends JpaRepository<StyleValue, Integer> {
    Optional<StyleValue> findByName(String name);

    List<StyleValue> findAllByIsActiveIsTrue();

    Optional<StyleValue> findByStyleValueIdAndIsActiveIsTrue(Integer styleValueId);

    List<StyleValue> findByStyle_NameAndIsActiveIsTrue(String styleName);
}
