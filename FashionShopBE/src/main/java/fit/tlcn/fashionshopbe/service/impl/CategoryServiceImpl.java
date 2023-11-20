package fit.tlcn.fashionshopbe.service.impl;

import fit.tlcn.fashionshopbe.dto.*;
import fit.tlcn.fashionshopbe.entity.Category;
import fit.tlcn.fashionshopbe.entity.Style;
import fit.tlcn.fashionshopbe.repository.CategoryRepository;
import fit.tlcn.fashionshopbe.repository.StyleRepository;
import fit.tlcn.fashionshopbe.service.CategoryService;
import fit.tlcn.fashionshopbe.service.CloudinaryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class CategoryServiceImpl implements CategoryService {
    @Autowired
    CategoryRepository categoryRepository;

    @Autowired
    CloudinaryService cloudinaryService;

    @Autowired
    StyleRepository styleRepository;

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

            Set<Style> styleSet = new HashSet<>();
            for (Integer styleId : request.getStyleIds()
            ) {
                Optional<Style> styleOptional = styleRepository.findByStyleIdAndIsActiveIsTrue(styleId);
                if (styleOptional.isEmpty()) {
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                            GenericResponse.builder()
                                    .success(false)
                                    .message("StyleId: " + styleId + " does not exist")
                                    .result("Not found")
                                    .statusCode(HttpStatus.NOT_FOUND.value())
                                    .build());
                }
                styleSet.add(styleOptional.get());
            }
            category.setStyles(styleSet);

            String imgUrl = cloudinaryService.uploadCategoryImage(request.getImageFile());
            category.setImage(imgUrl);

            categoryRepository.save(category);

            CategoryResponse categoryResponse = new CategoryResponse();
            categoryResponse.setCategoryId(category.getCategoryId());
            categoryResponse.setName(category.getName());
            if (category.getParent() != null) {
                categoryResponse.setParentName(category.getParent().getName());
            } else {
                categoryResponse.setParentName(null);
            }
            categoryResponse.setImage(category.getImage());

            List<String> styleNames = new ArrayList<>();
            for (Style style : category.getStyles()) {
                String styleName = style.getName();
                styleNames.add(styleName);
            }
            categoryResponse.setStyleNames(styleNames);

            categoryResponse.setCreatedAt(category.getCreatedAt());
            categoryResponse.setUpdatedAt(category.getUpdatedAt());
            categoryResponse.setIsActive(category.getIsActive());
            return ResponseEntity.status(HttpStatus.OK).body(
                    GenericResponse.builder()
                            .success(true)
                            .message("Category is created successfully")
                            .result(categoryResponse)
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
