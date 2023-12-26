package fit.tlcn.fashionshopbe.service;

import fit.tlcn.fashionshopbe.dto.CreateBrandRequest;
import fit.tlcn.fashionshopbe.dto.GenericResponse;
import fit.tlcn.fashionshopbe.dto.UpdateBrandRequest;
import org.springframework.http.ResponseEntity;

public interface BrandService {
    ResponseEntity<GenericResponse> createBrand(CreateBrandRequest request);

    ResponseEntity<GenericResponse> updateBrand(Integer brandId, UpdateBrandRequest request);
}
