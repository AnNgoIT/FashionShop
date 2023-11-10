package fit.tlcn.fashionshopbe.service;

import fit.tlcn.fashionshopbe.dto.CreateCategoryRequest;
import fit.tlcn.fashionshopbe.dto.GenericResponse;
import fit.tlcn.fashionshopbe.dto.UpdateCategoryRequest;
import fit.tlcn.fashionshopbe.dto.UpdateCategoryStatusRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

public interface CategoryService {
    ResponseEntity<GenericResponse> createCategory(CreateCategoryRequest request);

    ResponseEntity<GenericResponse> updateCategory(Integer categoryId, UpdateCategoryRequest updateCategoryRequest);

    ResponseEntity<GenericResponse> updateCategoryStatus(Integer categoryId, UpdateCategoryStatusRequest updateCategoryStatusRequest);
}
