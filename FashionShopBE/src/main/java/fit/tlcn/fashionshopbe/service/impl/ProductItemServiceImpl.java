package fit.tlcn.fashionshopbe.service.impl;

import fit.tlcn.fashionshopbe.dto.CreateProductItemRequest;
import fit.tlcn.fashionshopbe.dto.GenericResponse;
import fit.tlcn.fashionshopbe.dto.ProductItemResponse;
import fit.tlcn.fashionshopbe.entity.*;
import fit.tlcn.fashionshopbe.repository.ProductItemRepository;
import fit.tlcn.fashionshopbe.repository.ProductRepository;
import fit.tlcn.fashionshopbe.repository.StyleValueRepository;
import fit.tlcn.fashionshopbe.service.CloudinaryService;
import fit.tlcn.fashionshopbe.service.ProductItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class ProductItemServiceImpl implements ProductItemService {
    @Autowired
    ProductItemRepository productItemRepository;

    @Autowired
    ProductRepository productRepository;

    @Autowired
    CloudinaryService cloudinaryService;

    @Autowired
    StyleValueRepository styleValueRepository;

    @Override
    public ResponseEntity<GenericResponse> createProductItem(CreateProductItemRequest request) {
        try {
            ProductItem productItem = new ProductItem();
            Optional<Product> productOptional = productRepository.findByProductIdAndIsActiveIsTrueAndIsSellingIsTrue(request.getProductId());
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
            productItem.setParent(product);

            productItem.setQuantity(request.getQuantity());
            product.setTotalQuantity(product.getTotalQuantity() + request.getQuantity());

            productItem.setPrice(request.getPrice());
            //Khi nào làm phần Coupon thì quay lại tính toán promotionalPrice
            productItem.setPromotionalPrice(request.getPrice());

            List<ProductItem> productItemList = productItemRepository.findAllByParent_ProductId(product.getProductId());
            if (!productItemList.isEmpty()) {
                Float priceMin = productItemList.get(0).getPrice();
                Float promotionalPriceMin = productItemList.get(0).getPromotionalPrice();
                for (ProductItem i : productItemList) {
                    if (i.getPrice() < priceMin && i.getPromotionalPrice() < promotionalPriceMin) {
                        priceMin = i.getPrice();
                        promotionalPriceMin = i.getPromotionalPrice();
                    }
                }

                product.setPriceMin(priceMin);
                //Khi nào làm phần Coupon thì quay lại tính toán promotionalPriceMin
                product.setPromotionalPriceMin(promotionalPriceMin);
            } else {
                product.setPriceMin(request.getPrice());
                product.setPromotionalPriceMin(request.getPrice());
            }

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

            productItem.setStyleValues(styleValueSet);

            //Generate ProductItem SKU
            String sku = product.getProductId().toString();
            List<StyleValue> sortedStyleValues = new ArrayList<>(styleValueSet);
            Collections.sort(sortedStyleValues, Comparator.comparingLong(StyleValue::getStyleValueId));
            for (StyleValue styleValue : sortedStyleValues) {
                sku = sku.concat("00" + styleValue.getStyleValueId().toString());
            }
            productItem.setSku(sku);

            Optional<ProductItem> productItemOptional = productItemRepository.findBySku(sku);
            if (productItemOptional.isPresent()) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body(
                        GenericResponse.builder()
                                .success(false)
                                .message("Product Item already exists")
                                .result("Conflict")
                                .statusCode(HttpStatus.CONFLICT.value())
                                .build());
            }

            String image = cloudinaryService.uploadProductImage(request.getImage());
            productItem.setImage(image);

            productItemRepository.save(productItem);
            productRepository.save(product);

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
                            .message("Product Item is created successfully")
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
