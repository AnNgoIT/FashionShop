package fit.tlcn.fashionshopbe.service.impl;

import fit.tlcn.fashionshopbe.dto.CreateCategoryRequest;
import fit.tlcn.fashionshopbe.dto.GenericResponse;
import fit.tlcn.fashionshopbe.dto.UpdateCategoryRequest;
import fit.tlcn.fashionshopbe.dto.UpdateCategoryStatusRequest;
import fit.tlcn.fashionshopbe.entity.Category;
import fit.tlcn.fashionshopbe.repository.CategoryRepository;
import fit.tlcn.fashionshopbe.service.CategoryService;
import fit.tlcn.fashionshopbe.service.CloudinaryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.Optional;

@Service
public class CategoryServiceImpl implements CategoryService {
    @Autowired
    CategoryRepository categoryRepository;

    @Autowired
    CloudinaryService cloudinaryService;

    @Override
    public ResponseEntity<GenericResponse> createCategory(CreateCategoryRequest request) {
        try {
            Optional<Category> categoryOptional = categoryRepository.findByName(request.getName());
            if (categoryOptional.isPresent()) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body(
                        GenericResponse.builder()
                                .success(false)
                                .message("Category already exists")
                                .result("Conflict")
                                .statusCode(HttpStatus.CONFLICT.value())
                                .build()
                );
            }

            Category category = new Category();
            category.setName(request.getName());
            if (request.getParentId() != null) {
                Optional<Category> prcateOptional = categoryRepository.findByCategoryIdAndIsActiveIsTrue(request.getParentId());
                if (prcateOptional.isEmpty()) {
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                            GenericResponse.builder()
                                    .success(false)
                                    .message("This ParentId does not exist")
                                    .result("Not found")
                                    .statusCode(HttpStatus.NOT_FOUND.value())
                                    .build());
                }
                category.setParent(prcateOptional.get());
            }

            if (request.getImageFile() == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                        GenericResponse.builder()
                                .success(false)
                                .message("No Image yet")
                                .result("Bad request")
                                .statusCode(HttpStatus.BAD_REQUEST.value())
                                .build());
            }
            String imgUrl = cloudinaryService.uploadCategoryImage(request.getImageFile());
            category.setImage(imgUrl);


            categoryRepository.save(category);
            return ResponseEntity.status(HttpStatus.OK).body(
                    GenericResponse.builder()
                            .success(true)
                            .message("Category is created successfully")
                            .result(category)
                            .statusCode(HttpStatus.OK.value())
                            .build()
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    GenericResponse.builder()
                            .success(false)
                            .message(e.getMessage())
                            .result("Internal server error")
                            .statusCode(HttpStatus.INTERNAL_SERVER_ERROR.value())
                            .build()
            );
        }
    }

    @Override
    public ResponseEntity<GenericResponse> updateCategory(Integer categoryId, UpdateCategoryRequest updateCategoryRequest) {
        try {
            Optional<Category> categoryOptional = categoryRepository.findByCategoryIdAndIsActiveIsTrue(categoryId);
            if (categoryOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                        GenericResponse.builder()
                                .success(false)
                                .message("Not found category")
                                .result("Not found")
                                .statusCode(HttpStatus.NOT_FOUND.value())
                                .build());
            }

            Category category = categoryOptional.get();
            category.setName(updateCategoryRequest.getName());
            if (updateCategoryRequest.getParentId() != null) {
                Optional<Category> parent = categoryRepository.findByCategoryIdAndIsActiveIsTrue(updateCategoryRequest.getParentId());
                if (parent.isEmpty()) {
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                            GenericResponse.builder()
                                    .success(false)
                                    .message("This ParentId does not exist")
                                    .result("Not found")
                                    .statusCode(HttpStatus.NOT_FOUND.value())
                                    .build());
                }
                category.setParent(parent.get());
            }
            category.setParent(null);

            category.setImage(updateCategoryRequest.getIcon());

            categoryRepository.save(category);
            return ResponseEntity.status(HttpStatus.OK).body(
                    GenericResponse.builder()
                            .success(true)
                            .message("Category is updated successfully")
                            .result(category)
                            .statusCode(HttpStatus.OK.value())
                            .build()
            );

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    GenericResponse.builder()
                            .success(false)
                            .message(e.getMessage())
                            .result("Internal server error")
                            .statusCode(HttpStatus.INTERNAL_SERVER_ERROR.value())
                            .build()
            );
        }
    }

    @Override
    public ResponseEntity<GenericResponse> updateCategoryStatus(Integer categoryId, UpdateCategoryStatusRequest updateCategoryStatusRequest) {
        try {
            Optional<Category> categoryOptional = categoryRepository.findById(categoryId);
            if (categoryOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                        GenericResponse.builder()
                                .success(false)
                                .message("Not found category")
                                .result("Not found")
                                .statusCode(HttpStatus.NOT_FOUND.value())
                                .build());
            }

            Category category = categoryOptional.get();
            category.setIsActive(updateCategoryStatusRequest.getIsActive());

            categoryRepository.save(category);
            return ResponseEntity.status(HttpStatus.OK).body(
                    GenericResponse.builder()
                            .success(true)
                            .message("Status's category is updated successfully")
                            .result(category)
                            .statusCode(HttpStatus.OK.value())
                            .build()
            );

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    GenericResponse.builder()
                            .success(false)
                            .message(e.getMessage())
                            .result("Internal server error")
                            .statusCode(HttpStatus.INTERNAL_SERVER_ERROR.value())
                            .build()
            );
        }
    }
}
