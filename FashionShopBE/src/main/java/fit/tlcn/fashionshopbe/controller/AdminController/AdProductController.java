package fit.tlcn.fashionshopbe.controller.AdminController;

import fit.tlcn.fashionshopbe.dto.CreateProductRequest;
import fit.tlcn.fashionshopbe.dto.GenericResponse;
import fit.tlcn.fashionshopbe.dto.ProductResponse;
import fit.tlcn.fashionshopbe.entity.*;
import fit.tlcn.fashionshopbe.repository.BrandRepository;
import fit.tlcn.fashionshopbe.repository.CategoryRepository;
import fit.tlcn.fashionshopbe.repository.ProductRepository;
import fit.tlcn.fashionshopbe.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("api/v1/users/admin/products")
public class AdProductController {
    @Autowired
    ProductService productService;

    @Autowired
    CategoryRepository categoryRepository;

    @Autowired
    BrandRepository brandRepository;

    @Autowired
    ProductRepository productRepository;

    @PostMapping("")
    public ResponseEntity<GenericResponse> createProduct(@Valid @ModelAttribute CreateProductRequest request, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                    GenericResponse.builder()
                            .success(false)
                            .message("Invalid input data")
                            .result(bindingResult.getFieldError().getDefaultMessage())
                            .statusCode(HttpStatus.BAD_REQUEST.value())
                            .build()
            );
        }

        return productService.createProduct(request);
    }

    @GetMapping("")
    public ResponseEntity<GenericResponse> getAllProducts(){
        List<Product> productList = productRepository.findAllByOrderByCreatedAtDesc();

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
        Map<String, Object> map = new HashMap<>();
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
}
