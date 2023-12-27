package fit.tlcn.fashionshopbe.service;

import fit.tlcn.fashionshopbe.dto.CreateCouponRequest;
import fit.tlcn.fashionshopbe.dto.GenericResponse;
import org.springframework.http.ResponseEntity;

public interface CouponService {
    ResponseEntity<GenericResponse> createCoupon(CreateCouponRequest request);

    ResponseEntity<GenericResponse> getAllCoupons();

    ResponseEntity<GenericResponse> getOne(String couponId);

    ResponseEntity<GenericResponse> grantCoupon(String couponId);

    ResponseEntity<GenericResponse> revokeCoupon(String couponId);
}
