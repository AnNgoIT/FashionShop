package fit.tlcn.fashionshopbe.controller;

import fit.tlcn.fashionshopbe.dto.GenericResponse;
import fit.tlcn.fashionshopbe.dto.ProductResponse;
import fit.tlcn.fashionshopbe.dto.StyleValueResponse;
import fit.tlcn.fashionshopbe.entity.Product;
import fit.tlcn.fashionshopbe.entity.Style;
import fit.tlcn.fashionshopbe.entity.StyleValue;
import fit.tlcn.fashionshopbe.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/v1/products")
public class ProductController {
    @Autowired
    ProductRepository productRepository;

    @GetMapping("")
    public ResponseEntity<GenericResponse> getAll() {
        List<Product> productList = productRepository.findAllByIsActiveIsTrueAndIsSellingIsTrue();

        List<ProductResponse> productResponseList = new ArrayList<>();
        for(Product product: productList){
            ProductResponse productResponse = new ProductResponse();
            productResponse.setProductId(product.getProductId());
            productResponse.setName(product.getName());
            productResponse.setDescription(product.getDescription());
            productResponse.setImage(product.getImage());
            productResponse.setCategoryName(product.getCategory().getName());
            productResponse.setBrandName(product.getBrand().getName());
            productResponse.setTotalQuantity(product.getTotalQuantity());
            productResponse.setTotalSold(product.getTotalSold());
            productResponse.setPriceMin(product.getPriceMin());
            productResponse.setPromotionalPriceMin(product.getPromotionalPriceMin());
            productResponse.setRating(product.getRating());

            List<String> styleNames = new ArrayList<>();
            for(Style style: product.getCategory().getStyles()){
                styleNames.add(style.getName());
            }
            productResponse.setStyleNames(styleNames);

            List<String> styleValueNames = new ArrayList<>();
            for(StyleValue styleValue: product.getStyleValues()){
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
            productResponse.setCategoryName(product.getCategory().getName());
            productResponse.setBrandName(product.getBrand().getName());
            productResponse.setTotalQuantity(product.getTotalQuantity());
            productResponse.setTotalSold(product.getTotalSold());
            productResponse.setPriceMin(product.getPriceMin());
            productResponse.setPromotionalPriceMin(product.getPromotionalPriceMin());
            productResponse.setRating(product.getRating());

            List<String> styleNames = new ArrayList<>();
            for(Style style: product.getCategory().getStyles()){
                styleNames.add(style.getName());
            }
            productResponse.setStyleNames(styleNames);

            List<String> styleValueNames = new ArrayList<>();
            for(StyleValue styleValue: product.getStyleValues()){
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

    @PostMapping("/styleValues/")
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
}