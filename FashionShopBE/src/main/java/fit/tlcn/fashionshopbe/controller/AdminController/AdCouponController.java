package fit.tlcn.fashionshopbe.controller.AdminController;

import fit.tlcn.fashionshopbe.dto.CreateCouponRequest;
import fit.tlcn.fashionshopbe.dto.GenericResponse;
import fit.tlcn.fashionshopbe.service.CouponService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/users/admin/coupons")
public class AdCouponController {
    @Autowired
    CouponService couponService;

    @PostMapping("")
    public ResponseEntity<GenericResponse> createCoupon(@Valid @RequestBody CreateCouponRequest request,
                                                          BindingResult bindingResult) {
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

        return couponService.createCoupon(request);
    }

    @GetMapping("")
    public ResponseEntity<GenericResponse> getAllCoupons(){
        return couponService.getAllCoupons();
    }

    @GetMapping("/{couponId}")
    public ResponseEntity<GenericResponse> getOne(@PathVariable String couponId){
        return couponService.getOne(couponId);
    }

    @PatchMapping("/{couponId}/grant")
    public ResponseEntity<GenericResponse> grantCoupon(@PathVariable String couponId){
        return couponService.grantCoupon(couponId);
    }

    @PatchMapping("/{couponId}/revoke")
    public ResponseEntity<GenericResponse> revokeCoupon(@PathVariable String couponId){
        return couponService.revokeCoupon(couponId);
    }
}
