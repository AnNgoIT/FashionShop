package fit.tlcn.fashionshopbe.service.impl;

import fit.tlcn.fashionshopbe.dto.CreateCouponRequest;
import fit.tlcn.fashionshopbe.dto.GenericResponse;
import fit.tlcn.fashionshopbe.entity.*;
import fit.tlcn.fashionshopbe.repository.*;
import fit.tlcn.fashionshopbe.service.CouponService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class CouponServiceImpl implements CouponService {
    @Autowired
    CouponRepository couponRepository;

    @Autowired
    BannerRepository bannerRepository;

    @Autowired
    CategoryRepository categoryRepository;

    @Autowired
    ProductRepository productRepository;

    @Autowired
    ProductItemRepository productItemRepository;

    @Override
    public ResponseEntity<GenericResponse> createCoupon(CreateCouponRequest request) {
        try {
            Optional<Coupon> couponOptional = couponRepository.findById(request.getCouponId());
            if (couponOptional.isPresent()) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body(
                        GenericResponse.builder()
                                .success(false)
                                .message("Coupon already exists")
                                .result("Conflict")
                                .statusCode(HttpStatus.CONFLICT.value())
                                .build()
                );
            }

            Coupon coupon = new Coupon();
            coupon.setCouponId(request.getCouponId());

            if (request.getBannerId() != null) {
                Optional<Banner> bannerOptional = bannerRepository.findById(request.getBannerId());
                if (bannerOptional.isEmpty()) {
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                            GenericResponse.builder()
                                    .success(false)
                                    .message("This BannerId does not exist")
                                    .result("Not found")
                                    .statusCode(HttpStatus.NOT_FOUND.value())
                                    .build());
                }
                coupon.setBanner(bannerOptional.get());
            }

            coupon.setStartAt(request.getStartAt());
            coupon.setExpireAt(request.getExpireAt());
            coupon.setDiscount(request.getDiscount());

            Set<Category> categorySet = new HashSet<>();
            for (Integer categoryId : request.getCategoryIds()) {
                Optional<Category> categoryOptional = categoryRepository.findById(categoryId);
                if (categoryOptional.isEmpty()) {
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                            GenericResponse.builder()
                                    .success(false)
                                    .message("CategoryId: " + categoryId + " does not exist")
                                    .result("Not found")
                                    .statusCode(HttpStatus.NOT_FOUND.value())
                                    .build());
                }

                Category category = categoryOptional.get();
                Float cateDiscounts = coupon.getDiscount();
                List<Coupon> couponList = couponRepository.findAllByCategoriesContainingAndCheckCouponIsTrue(category);
                if (!couponList.isEmpty()) {
                    for (Coupon cateCoupon : couponList) {
                        cateDiscounts += cateCoupon.getDiscount();
                    }
                }

                if (cateDiscounts >= Float.valueOf(1)) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                            GenericResponse.builder()
                                    .success(false)
                                    .message("Discount of " + category.getName() + "must be < 100%")
                                    .result("Not found")
                                    .statusCode(HttpStatus.BAD_REQUEST.value())
                                    .build());
                }

                categorySet.add(category);
            }
            coupon.setCategories(categorySet);

            couponRepository.save(coupon);

            Map<String, Object> map = new HashMap<>();
            map.put("couponId", coupon.getCouponId());
            if (coupon.getBanner() != null) {
                map.put("bannerId", coupon.getBanner().getBannerId());
            } else {
                map.put("bannerId", null);
            }

            map.put("startAt", coupon.getStartAt());
            map.put("expireAt", coupon.getExpireAt());
            map.put("discount", coupon.getDiscount());
            Set<String> categoryNames = new HashSet<>();
            for (Category category : coupon.getCategories()) {
                categoryNames.add(category.getName());
            }
            map.put("categoryNames", categoryNames);
            map.put("checkCoupon", coupon.getCheckCoupon());
            map.put("createdAt", coupon.getCreatedAt());
            map.put("updateAt", coupon.getUpdatedAt());
            map.put("isActive", coupon.getIsActive());

            return ResponseEntity.status(HttpStatus.OK).body(
                    GenericResponse.builder()
                            .success(true)
                            .message("Coupon is created successfully")
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

    @Override
    public ResponseEntity<GenericResponse> getAllCoupons() {
        try {
            List<Coupon> couponList = couponRepository.findAll();

            Map<String, Object> map = new HashMap<>();
            map.put("couponList", couponList);
            map.put("totalElements", couponList.size());
            return ResponseEntity.status(HttpStatus.OK).body(
                    GenericResponse.builder()
                            .success(true)
                            .message("Get all coupons successfully")
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

    @Override
    public ResponseEntity<GenericResponse> getOne(String couponId) {
        try {
            Optional<Coupon> couponOptional = couponRepository.findById(couponId);
            if (couponOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                        GenericResponse.builder()
                                .success(false)
                                .message("Coupon doesn't exist")
                                .result("Not found")
                                .statusCode(HttpStatus.NOT_FOUND.value())
                                .build()
                );
            }

            Coupon coupon = couponOptional.get();

            Map<String, Object> map = new HashMap<>();
            map.put("couponId", coupon.getCouponId());
            if (coupon.getBanner() != null) {
                map.put("bannerId", coupon.getBanner().getBannerId());
            } else {
                map.put("bannerId", null);
            }

            map.put("startAt", coupon.getStartAt());
            map.put("expireAt", coupon.getExpireAt());
            map.put("discount", coupon.getDiscount());
            Set<String> categoryNames = new HashSet<>();
            for (Category category : coupon.getCategories()) {
                categoryNames.add(category.getName());
            }
            map.put("categoryNames", categoryNames);
            map.put("checkCoupon", coupon.getCheckCoupon());
            map.put("createdAt", coupon.getCreatedAt());
            map.put("updateAt", coupon.getUpdatedAt());
            map.put("isActive", coupon.getIsActive());

            return ResponseEntity.status(HttpStatus.OK).body(
                    GenericResponse.builder()
                            .success(true)
                            .message("Get coupon successfully")
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

    @Override
    public ResponseEntity<GenericResponse> grantCoupon(String couponId) {
        try {
            Optional<Coupon> couponOptional = couponRepository.findById(couponId);
            if (couponOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                        GenericResponse.builder()
                                .success(false)
                                .message("Coupon doesn't exist")
                                .result("Not found")
                                .statusCode(HttpStatus.NOT_FOUND.value())
                                .build()
                );
            }

            Coupon coupon = couponOptional.get();
            if(coupon.getCheckCoupon().equals(true)){
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                        GenericResponse.builder()
                                .success(false)
                                .message("Coupon has been granted")
                                .result("Bad request")
                                .statusCode(HttpStatus.BAD_REQUEST.value())
                                .build()
                );
            }

            Set<Category> categoryList = coupon.getCategories();
            for (Category category : categoryList) {
                List<ProductItem> productItemList = productItemRepository.findAllByParent_Category(category);
                for (ProductItem productItem : productItemList) {
                    Float price = productItem.getPrice();
                    Float promote = price * coupon.getDiscount();
                    productItem.setPromotionalPrice(productItem.getPromotionalPrice() - promote);
                    productItemRepository.save(productItem);

                    Product product = productItem.getParent();
                    if (productItem.getPromotionalPrice() < product.getPromotionalPriceMin()) {
                        product.setPromotionalPriceMin(productItem.getPromotionalPrice());
                        product.setPriceMin(productItem.getPrice());
                        productRepository.save(product);
                    }
                }
            }

            coupon.setCheckCoupon(true);
            couponRepository.save(coupon);

            Map<String, Object> map = new HashMap<>();
            map.put("couponId", coupon.getCouponId());
            if (coupon.getBanner() != null) {
                map.put("bannerId", coupon.getBanner().getBannerId());
            } else {
                map.put("bannerId", null);
            }

            map.put("startAt", coupon.getStartAt());
            map.put("expireAt", coupon.getExpireAt());
            map.put("discount", coupon.getDiscount());
            Set<String> categoryNames = new HashSet<>();
            for (Category category : coupon.getCategories()) {
                categoryNames.add(category.getName());
            }
            map.put("categoryNames", categoryNames);
            map.put("checkCoupon", coupon.getCheckCoupon());
            map.put("createdAt", coupon.getCreatedAt());
            map.put("updateAt", coupon.getUpdatedAt());
            map.put("isActive", coupon.getIsActive());

            return ResponseEntity.status(HttpStatus.OK).body(
                    GenericResponse.builder()
                            .success(true)
                            .message("Grant coupon successfully")
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

    @Override
    public ResponseEntity<GenericResponse> revokeCoupon(String couponId) {
        try {
            Optional<Coupon> couponOptional = couponRepository.findById(couponId);
            if (couponOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                        GenericResponse.builder()
                                .success(false)
                                .message("Coupon doesn't exist")
                                .result("Not found")
                                .statusCode(HttpStatus.NOT_FOUND.value())
                                .build()
                );
            }

            Coupon coupon = couponOptional.get();
            if(coupon.getCheckCoupon().equals(false)){
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                        GenericResponse.builder()
                                .success(false)
                                .message("Coupon has been revoked")
                                .result("Bad request")
                                .statusCode(HttpStatus.BAD_REQUEST.value())
                                .build()
                );
            }

            Set<Category> categoryList = coupon.getCategories();
            for (Category category : categoryList) {
                List<ProductItem> productItemList = productItemRepository.findAllByParent_Category(category);
                for (ProductItem productItem : productItemList) {
                    Float price = productItem.getPrice();
                    Float promote = price * coupon.getDiscount();
                    Float oldPromotionalPrice = productItem.getPromotionalPrice();
                    productItem.setPromotionalPrice(productItem.getPromotionalPrice() + promote);
                    productItemRepository.save(productItem);

                    Product product = productItem.getParent();
                    if (product.getPromotionalPriceMin().equals(oldPromotionalPrice)) {
                        product.setPromotionalPriceMin(productItem.getPromotionalPrice());
                        product.setPriceMin(productItem.getPrice());
                        productRepository.save(product);
                    }
                }
            }

            coupon.setCheckCoupon(false);
            couponRepository.save(coupon);

            Map<String, Object> map = new HashMap<>();
            map.put("couponId", coupon.getCouponId());
            if (coupon.getBanner() != null) {
                map.put("bannerId", coupon.getBanner().getBannerId());
            } else {
                map.put("bannerId", null);
            }

            map.put("startAt", coupon.getStartAt());
            map.put("expireAt", coupon.getExpireAt());
            map.put("discount", coupon.getDiscount());
            Set<String> categoryNames = new HashSet<>();
            for (Category category : coupon.getCategories()) {
                categoryNames.add(category.getName());
            }
            map.put("categoryNames", categoryNames);
            map.put("checkCoupon", coupon.getCheckCoupon());
            map.put("createdAt", coupon.getCreatedAt());
            map.put("updateAt", coupon.getUpdatedAt());
            map.put("isActive", coupon.getIsActive());

            return ResponseEntity.status(HttpStatus.OK).body(
                    GenericResponse.builder()
                            .success(true)
                            .message("Revoke coupon successfully")
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
