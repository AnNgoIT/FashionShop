package fit.tlcn.fashionshopbe.controller.AdminController;

import fit.tlcn.fashionshopbe.dto.CreateBrandRequest;
import fit.tlcn.fashionshopbe.dto.GenericResponse;
import fit.tlcn.fashionshopbe.dto.UpdateBrandRequest;
import fit.tlcn.fashionshopbe.service.BrandService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/users/admin/brands")
public class AdBrandController {
    @Autowired
    BrandService brandService;

    @PostMapping("")
    public ResponseEntity<GenericResponse> createBrand(@Valid @RequestBody CreateBrandRequest request, BindingResult bindingResult){
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

        return brandService.createBrand(request);
    }

    @PatchMapping("/{brandId}")
    public ResponseEntity<GenericResponse> updateBrand(@PathVariable Integer brandId,
                                                       @RequestBody UpdateBrandRequest request){
        return brandService.updateBrand(brandId, request);
    }
}
