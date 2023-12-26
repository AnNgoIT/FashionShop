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
            if (updateCategoryRequest.getName() != null) {
                if (category.getName().equals(updateCategoryRequest.getName())) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                            GenericResponse.builder()
                                    .success(false)
                                    .message("New category's name must difference from category's name in the present")
                                    .result("Bad request")
                                    .statusCode(HttpStatus.BAD_REQUEST.value())
                                    .build());
                }
                Optional<Category> categoryNameOptional = categoryRepository.findByName(updateCategoryRequest.getName());
                if (categoryNameOptional.isPresent()) {
                    return ResponseEntity.status(HttpStatus.CONFLICT).body(
                            GenericResponse.builder()
                                    .success(false)
                                    .message("This category name already exists")
                                    .result("Conflict")
                                    .statusCode(HttpStatus.CONFLICT.value())
                                    .build()
                    );
                }
                category.setName(updateCategoryRequest.getName());
            }

            if (updateCategoryRequest.getParentId() != null) {
                if (category.getCategoryId().equals(updateCategoryRequest.getParentId())) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                            GenericResponse.builder()
                                    .success(false)
                                    .message("Category parent must difference from it")
                                    .result("Bad request")
                                    .statusCode(HttpStatus.BAD_REQUEST.value())
                                    .build());
                }

                if(category.getParent().getCategoryId().equals(updateCategoryRequest.getParentId())){
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                            GenericResponse.builder()
                                    .success(false)
                                    .message("New category's parent must difference from category's parent in the present")
                                    .result("Bad request")
                                    .statusCode(HttpStatus.BAD_REQUEST.value())
                                    .build());
                }

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

            if (updateCategoryRequest.getImageFile() != null) {
                if (category.getImage() != null) {
                    cloudinaryService.deleteCategoryImage(category.getImage());
                }
                String imagUrl = cloudinaryService.uploadCategoryImage(updateCategoryRequest.getImageFile());
                category.setImage(imagUrl);
            }

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
                            .message("Category was updated successfully")
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
    public ResponseEntity<GenericResponse> getAllCategories() {
        List<Category> categoryList = categoryRepository.findAll();

        List<CategoryResponse> categoryResponseList = new ArrayList<>();
        for (Category category : categoryList) {
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

            categoryResponseList.add(categoryResponse);
        }
        Map<String, Object> map = new HashMap<String, Object>();
        map.put("content", categoryResponseList);
        map.put("totalElements", categoryList.size());
        return ResponseEntity.status(HttpStatus.OK).body(
                GenericResponse.builder()
                        .success(true)
                        .message("Get all categories successfully")
                        .result(map)
                        .statusCode(HttpStatus.OK.value())
                        .build()
        );
    }

    @Override
    public ResponseEntity<GenericResponse> getCategory(Integer categoryId) {
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
                            .message("This is category's information")
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
}
