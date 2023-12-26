package fit.tlcn.fashionshopbe.service;

import fit.tlcn.fashionshopbe.dto.CreateCategoryRequest;
import fit.tlcn.fashionshopbe.dto.GenericResponse;
import fit.tlcn.fashionshopbe.dto.UpdateCategoryRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

public interface CategoryService {
    ResponseEntity<GenericResponse> createCategory(CreateCategoryRequest request);

    ResponseEntity<GenericResponse> updateCategory(Integer categoryId, UpdateCategoryRequest updateCategoryRequest);

    ResponseEntity<GenericResponse> getAllCategories();

    ResponseEntity<GenericResponse> getCategory(Integer categoryId);
}
