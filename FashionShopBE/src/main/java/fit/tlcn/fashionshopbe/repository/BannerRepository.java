package fit.tlcn.fashionshopbe.repository;

import fit.tlcn.fashionshopbe.entity.Banner;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BannerRepository extends JpaRepository<Banner, Integer> {
}
