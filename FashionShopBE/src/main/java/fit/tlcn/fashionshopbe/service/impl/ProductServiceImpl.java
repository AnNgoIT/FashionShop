package fit.tlcn.fashionshopbe.service.impl;

import fit.tlcn.fashionshopbe.dto.CreateProductRequest;
import fit.tlcn.fashionshopbe.dto.GenericResponse;
import fit.tlcn.fashionshopbe.entity.*;
import fit.tlcn.fashionshopbe.repository.*;
import fit.tlcn.fashionshopbe.service.CloudinaryService;
import fit.tlcn.fashionshopbe.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class ProductServiceImpl implements ProductService {
    @Autowired
    ProductRepository productRepository;

    @Autowired
    CategoryRepository categoryRepository;

    @Autowired
    BrandRepository brandRepository;

    @Autowired
    StyleValueRepository styleValueRepository;

    @Autowired
    CloudinaryService cloudinaryService;

    @Override
    public ResponseEntity<GenericResponse> createProduct(CreateProductRequest request) {
        try {
            Product product = new Product();
            product.setName(request.getName());
            if (request.getDescription() != null) {
                product.setDescription(request.getDescription());
            }

            Optional<Category> categoryOptional = categoryRepository.findByCategoryIdAndIsActiveIsTrue(request.getCategoryId());
            if (categoryOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                        GenericResponse.builder()
                                .success(false)
                                .message("Category does not exist")
                                .result("Not found")
                                .statusCode(HttpStatus.NOT_FOUND.value())
                                .build());
            }
            product.setCategory(categoryOptional.get());

            Optional<Brand> brandOptional = brandRepository.findByBrandIdAndIsActiveIsTrue(request.getBrandId());
            if (brandOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                        GenericResponse.builder()
                                .success(false)
                                .message("Brand does not exist")
                                .result("Not found")
                                .statusCode(HttpStatus.NOT_FOUND.value())
                                .build());
            }
            product.setBrand(brandOptional.get());

            Set<StyleValue> styleValueSet = new HashSet<>();
            for (Integer styleValueId : request.getStyleValueIds()
            ) {
                Optional<StyleValue> styleValueOptional = styleValueRepository.findByStyleValueIdAndIsActiveIsTrue(styleValueId);
                if (styleValueOptional.isEmpty()) {
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                            GenericResponse.builder()
                                    .success(false)
                                    .message("StyleValueId: " + styleValueId + " does not exist")
                                    .result("Not found")
                                    .statusCode(HttpStatus.NOT_FOUND.value())
                                    .build());
                }
                styleValueSet.add(styleValueOptional.get());
            }
            product.setStyleValues(styleValueSet);

            String image = cloudinaryService.uploadProductImage(request.getImage());
            product.setImage(image);

            productRepository.save(product);

            Map<String, Object> map = new HashMap<>();
            map.put("productId", product.getProductId());

            List<String> styleNames = new ArrayList<>();
            for (Style style : product.getCategory().getStyles()) {
                styleNames.add(style.getName());
            }
            map.put("styleNames", styleNames);

            List<String> styleValueNames = new ArrayList<>();
            for (StyleValue styleValue : product.getStyleValues()) {
                styleValueNames.add(styleValue.getName());
            }
            map.put("styleValueNames", styleValueNames);

            return ResponseEntity.status(HttpStatus.OK).body(
                    GenericResponse.builder()
                            .success(true)
                            .message("Product is created successfully")
                            .result(map)
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
