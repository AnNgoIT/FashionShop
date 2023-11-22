package fit.tlcn.fashionshopbe.controller;

import fit.tlcn.fashionshopbe.dto.GenericResponse;
import fit.tlcn.fashionshopbe.dto.ProductResponse;
import fit.tlcn.fashionshopbe.dto.StyleValueResponse;
import fit.tlcn.fashionshopbe.entity.*;
import fit.tlcn.fashionshopbe.repository.BrandRepository;
import fit.tlcn.fashionshopbe.repository.CategoryRepository;
import fit.tlcn.fashionshopbe.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/v1/products")
public class ProductController {
    @Autowired
    ProductRepository productRepository;

    @Autowired
    CategoryRepository categoryRepository;

    @Autowired
    BrandRepository brandRepository;

    @GetMapping("")
    public ResponseEntity<GenericResponse> getAll(@RequestParam(defaultValue = "") String productName,
                                                  @RequestParam(defaultValue = "") String categoryName,
                                                  @RequestParam(defaultValue = "") String brandName,
                                                  @RequestParam(defaultValue = "0") Float priceFrom,
                                                  @RequestParam(defaultValue = "5000000") Float priceTo) {
        if (!categoryName.isEmpty()) {
            Optional<Category> categoryOptional = categoryRepository.findByNameAndIsActiveIsTrue(categoryName);
            if (categoryOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                        GenericResponse.builder()
                                .success(false)
                                .message("Not found category")
                                .result("Not found")
                                .statusCode(HttpStatus.NOT_FOUND.value())
                                .build());
            }
        }

        if (!brandName.isEmpty()) {
            Optional<Brand> brandOptional = brandRepository.findByNameAndIsActiveIsTrue(brandName);
            if (brandOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                        GenericResponse.builder()
                                .success(false)
                                .message("Not found brand")
                                .result("Not found")
                                .statusCode(HttpStatus.NOT_FOUND.value())
                                .build());
            }
        }

        List<Product> productList = productRepository.findAllByFilter(productName, categoryName, brandName, priceFrom, priceTo);

        List<ProductResponse> productResponseList = new ArrayList<>();
        for (Product product : productList) {
            ProductResponse productResponse = new ProductResponse();
            productResponse.setProductId(product.getProductId());
            productResponse.setName(product.getName());
            productResponse.setDescription(product.getDescription());
            productResponse.setImage(product.getImage());
            productResponse.setCategoryId(product.getCategory().getCategoryId());
            productResponse.setCategoryName(product.getCategory().getName());
            productResponse.setBrandId(product.getBrand().getBrandId());
            productResponse.setBrandName(product.getBrand().getName());
            productResponse.setTotalQuantity(product.getTotalQuantity());
            productResponse.setTotalSold(product.getTotalSold());
            productResponse.setPriceMin(product.getPriceMin());
            productResponse.setPromotionalPriceMin(product.getPromotionalPriceMin());
            productResponse.setRating(product.getRating());

            List<String> styleNames = new ArrayList<>();
            for (Style style : product.getCategory().getStyles()) {
                styleNames.add(style.getName());
            }
            productResponse.setStyleNames(styleNames);

            List<String> styleValueNames = new ArrayList<>();
            for (StyleValue styleValue : product.getStyleValues()) {
                styleValueNames.add(styleValue.getName());
            }
            productResponse.setStyleValueNames(styleValueNames);

            productResponse.setCreatedAt(product.getCreatedAt());
            productResponse.setUpdatedAt(product.getUpdatedAt());
            productResponse.setIsSelling(product.getIsSelling());
            productResponse.setIsActive(product.getIsActive());

            productResponseList.add(productResponse);
        }
        Map<String, Object> map = new HashMap<String, Object>();
        map.put("content", productResponseList);
        map.put("totalElements", productResponseList.size());
        return ResponseEntity.status(HttpStatus.OK).body(
                GenericResponse.builder()
                        .success(true)
                        .message("All Products")
                        .result(map)
                        .statusCode(HttpStatus.OK.value())
                        .build()
        );
    }

    @GetMapping("/{productId}")
    public ResponseEntity<GenericResponse> getOne(@PathVariable Integer productId) {
        try {
            Optional<Product> productOptional = productRepository.findByProductIdAndIsActiveIsTrueAndIsSellingIsTrue(productId);
            if (productOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                        GenericResponse.builder()
                                .success(false)
                                .message("Not found product")
                                .result("Not found")
                                .statusCode(HttpStatus.NOT_FOUND.value())
                                .build());
            }

            Product product = productOptional.get();
            ProductResponse productResponse = new ProductResponse();
            productResponse.setProductId(product.getProductId());
            productResponse.setName(product.getName());
            productResponse.setDescription(product.getDescription());
            productResponse.setImage(product.getImage());
            productResponse.setCategoryId(product.getCategory().getCategoryId());
            productResponse.setCategoryName(product.getCategory().getName());
            productResponse.setBrandId(product.getBrand().getBrandId());
            productResponse.setBrandName(product.getBrand().getName());
            productResponse.setTotalQuantity(product.getTotalQuantity());
            productResponse.setTotalSold(product.getTotalSold());
            productResponse.setPriceMin(product.getPriceMin());
            productResponse.setPromotionalPriceMin(product.getPromotionalPriceMin());
            productResponse.setRating(product.getRating());

            List<String> styleNames = new ArrayList<>();
            for (Style style : product.getCategory().getStyles()) {
                styleNames.add(style.getName());
            }
            productResponse.setStyleNames(styleNames);

            List<String> styleValueNames = new ArrayList<>();
            for (StyleValue styleValue : product.getStyleValues()) {
                styleValueNames.add(styleValue.getName());
            }
            productResponse.setStyleValueNames(styleValueNames);

            productResponse.setCreatedAt(product.getCreatedAt());
            productResponse.setUpdatedAt(product.getUpdatedAt());
            productResponse.setIsSelling(product.getIsSelling());
            productResponse.setIsActive(product.getIsActive());
            return ResponseEntity.status(HttpStatus.OK).body(
                    GenericResponse.builder()
                            .success(true)
                            .message("This is product's information")
                            .result(productResponse)
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

    @GetMapping("/styleValues/")
    public ResponseEntity<GenericResponse> findStyleValuesByProductIdAndStyleName(@RequestParam Integer productId, @RequestParam String styleName) {
        try {
            List<StyleValue> styleValueList = productRepository.findStyleValuesByProductIdAndStyleName(productId, styleName);

            List<StyleValueResponse> styleValueResponseList = new ArrayList<>();
            for (StyleValue styleValue : styleValueList) {
                StyleValueResponse styleValueResponse = new StyleValueResponse();
                styleValueResponse.setStyleValueId(styleValue.getStyleValueId());
                styleValueResponse.setName(styleValue.getName());
                styleValueResponse.setStyleName(styleValue.getStyle().getName());
                styleValueResponse.setCreatedAt(styleValue.getCreatedAt());
                styleValueResponse.setUpdatedAt(styleValue.getUpdatedAt());
                styleValueResponse.setIsActive(styleValue.getIsActive());

                styleValueResponseList.add(styleValueResponse);
            }

            Map<String, Object> map = new HashMap<String, Object>();
            map.put("content", styleValueResponseList);
            map.put("totalElements", styleValueList.size());
            return ResponseEntity.status(HttpStatus.OK).body(
                    GenericResponse.builder()
                            .success(true)
                            .message("All Style Values of " + styleName)
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

    @GetMapping("/{productId}/related-products")
    public ResponseEntity<GenericResponse> findRelatedProducts(@PathVariable Integer productId) {
        try {
            Optional<Product> productOptional = productRepository.findByProductIdAndIsActiveIsTrueAndIsSellingIsTrue(productId);
            if (productOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                        GenericResponse.builder()
                                .success(false)
                                .message("Not found product")
                                .result("Not found")
                                .statusCode(HttpStatus.NOT_FOUND.value())
                                .build());
            }

            Pageable pageable = PageRequest.of(0, 5);
            Page<Product> productPage = productRepository.findAllByCategory_CategoryIdAndBrand_BrandIdAndIsActiveIsTrueAndIsSellingIsTrue(productOptional.get().getCategory().getCategoryId(), productOptional.get().getBrand().getBrandId(), pageable);

            List<ProductResponse> productResponseList = new ArrayList<>();
            for (Product product : productPage.getContent()) {
                if (product.getProductId() != productId) {
                    ProductResponse productResponse = new ProductResponse();
                    productResponse.setProductId(product.getProductId());
                    productResponse.setName(product.getName());
                    productResponse.setDescription(product.getDescription());
                    productResponse.setImage(product.getImage());
                    productResponse.setCategoryId(product.getCategory().getCategoryId());
                    productResponse.setCategoryName(product.getCategory().getName());
                    productResponse.setBrandId(product.getBrand().getBrandId());
                    productResponse.setBrandName(product.getBrand().getName());
                    productResponse.setTotalQuantity(product.getTotalQuantity());
                    productResponse.setTotalSold(product.getTotalSold());
                    productResponse.setPriceMin(product.getPriceMin());
                    productResponse.setPromotionalPriceMin(product.getPromotionalPriceMin());
                    productResponse.setRating(product.getRating());

                    List<String> styleNames = new ArrayList<>();
                    for (Style style : product.getCategory().getStyles()) {
                        styleNames.add(style.getName());
                    }
                    productResponse.setStyleNames(styleNames);

                    List<String> styleValueNames = new ArrayList<>();
                    for (StyleValue styleValue : product.getStyleValues()) {
                        styleValueNames.add(styleValue.getName());
                    }
                    productResponse.setStyleValueNames(styleValueNames);

                    productResponse.setCreatedAt(product.getCreatedAt());
                    productResponse.setUpdatedAt(product.getUpdatedAt());
                    productResponse.setIsSelling(product.getIsSelling());
                    productResponse.setIsActive(product.getIsActive());

                    productResponseList.add(productResponse);
                }
            }

            return ResponseEntity.status(HttpStatus.OK).body(
                    GenericResponse.builder()
                            .success(true)
                            .message("This is related products")
                            .result(productResponseList)
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
