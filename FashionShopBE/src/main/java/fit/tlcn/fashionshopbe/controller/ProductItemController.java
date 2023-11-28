package fit.tlcn.fashionshopbe.controller;

import fit.tlcn.fashionshopbe.dto.GenericResponse;
import fit.tlcn.fashionshopbe.dto.ProductItemResponse;
import fit.tlcn.fashionshopbe.entity.Product;
import fit.tlcn.fashionshopbe.entity.ProductItem;
import fit.tlcn.fashionshopbe.entity.StyleValue;
import fit.tlcn.fashionshopbe.repository.ProductItemRepository;
import fit.tlcn.fashionshopbe.repository.ProductRepository;
import jakarta.websocket.server.PathParam;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.*;

@RestController
@RequestMapping("/api/v1/productItems")
public class ProductItemController {
    @Autowired
    ProductRepository productRepository;

    @Autowired
    ProductItemRepository productItemRepository;

    @GetMapping("/parent/{productId}")
    public ResponseEntity<GenericResponse> findAllByParent(@PathVariable Integer productId) {
        Optional<Product> productOptional = productRepository.findByProductId(productId);
        if (productOptional.isEmpty()){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                    GenericResponse.builder()
                            .success(false)
                            .message("Not found product")
                            .result("Not found")
                            .statusCode(HttpStatus.NOT_FOUND.value())
                            .build());
        }
        List<ProductItem> productItemList = productItemRepository.findAllByParent(productOptional.get());

        List<ProductItemResponse> productItemResponseList = new ArrayList<>();
        for(ProductItem productItem: productItemList){
            ProductItemResponse productItemResponse = new ProductItemResponse();
            productItemResponse.setProductItemId(productItem.getProductItemId());
            productItemResponse.setParentId(productItem.getParent().getProductId());
            productItemResponse.setParentName(productItem.getParent().getName());
            productItemResponse.setQuantity(productItem.getQuantity());
            productItemResponse.setSold(productItem.getSold());
            productItemResponse.setImage(productItem.getImage());
            productItemResponse.setPrice(productItem.getPrice());
            productItemResponse.setPromotionalPrice(productItem.getPromotionalPrice());
            List<String> styleValueNames = new ArrayList<>();
            for (StyleValue styleValue : productItem.getStyleValues()) {
                styleValueNames.add(styleValue.getName());
            }
            productItemResponse.setStyleValueNames(styleValueNames);
            productItemResponse.setSku(productItem.getSku());
            productItemResponse.setCreatedAt(productItem.getCreatedAt());
            productItemResponse.setUpdatedAt(productItem.getUpdatedAt());

            productItemResponseList.add(productItemResponse);
        }
        Map<String, Object> map = new HashMap<String, Object>();
        map.put("content", productItemResponseList);
        map.put("totalElements", productItemResponseList.size());
        return ResponseEntity.status(HttpStatus.OK).body(
                GenericResponse.builder()
                        .success(true)
                        .message("All ProductItems Of: " + productOptional.get().getName())
                        .result(map)
                        .statusCode(HttpStatus.OK.value())
                        .build()
        );
    }

    @GetMapping("/{productItemId}")
    public ResponseEntity<GenericResponse> getOne(@PathVariable Integer productItemId) {
        try {
            Optional<ProductItem> productItemOptional = productItemRepository.findById(productItemId);
            if (productItemOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                        GenericResponse.builder()
                                .success(false)
                                .message("Not found product item")
                                .result("Not found")
                                .statusCode(HttpStatus.NOT_FOUND.value())
                                .build());
            }
            ProductItem productItem = productItemOptional.get();

            ProductItemResponse productItemResponse = new ProductItemResponse();
            productItemResponse.setProductItemId(productItem.getProductItemId());
            productItemResponse.setParentId(productItem.getParent().getProductId());
            productItemResponse.setParentName(productItem.getParent().getName());
            productItemResponse.setQuantity(productItem.getQuantity());
            productItemResponse.setSold(productItem.getSold());
            productItemResponse.setImage(productItem.getImage());
            productItemResponse.setPrice(productItem.getPrice());
            productItemResponse.setPromotionalPrice(productItem.getPromotionalPrice());
            List<String> styleValueNames = new ArrayList<>();
            for (StyleValue styleValue : productItem.getStyleValues()) {
                styleValueNames.add(styleValue.getName());
            }
            productItemResponse.setStyleValueNames(styleValueNames);
            productItemResponse.setSku(productItem.getSku());
            productItemResponse.setCreatedAt(productItem.getCreatedAt());
            productItemResponse.setUpdatedAt(productItem.getUpdatedAt());
            return ResponseEntity.status(HttpStatus.OK).body(
                    GenericResponse.builder()
                            .success(true)
                            .message("This is information of product item")
                            .result(productItemResponse)
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
