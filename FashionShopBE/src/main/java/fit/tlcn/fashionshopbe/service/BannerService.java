package fit.tlcn.fashionshopbe.service;

import fit.tlcn.fashionshopbe.dto.CreateBannerRequest;
import fit.tlcn.fashionshopbe.dto.GenericResponse;
import org.springframework.http.ResponseEntity;

public interface BannerService {
    ResponseEntity<GenericResponse> createBanner(CreateBannerRequest request);

    ResponseEntity<GenericResponse> getAllBanners();

    ResponseEntity<GenericResponse> getOne(Integer bannerId);
}
