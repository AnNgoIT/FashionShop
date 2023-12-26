package fit.tlcn.fashionshopbe.controller.AdminController;

import fit.tlcn.fashionshopbe.dto.CreateBannerRequest;
import fit.tlcn.fashionshopbe.dto.GenericResponse;
import fit.tlcn.fashionshopbe.service.BannerService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/users/admin/banners")
public class AdBannerController {
    @Autowired
    BannerService bannerService;

    @PostMapping("")
    public ResponseEntity<GenericResponse> createBrand(@Valid @ModelAttribute CreateBannerRequest request, BindingResult bindingResult){
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

        return bannerService.createBanner(request);
    }

    @GetMapping("")
    public ResponseEntity<GenericResponse> getAllBanners(){
        return bannerService.getAllBanners();
    }

    @GetMapping("/{bannerId}")
    public ResponseEntity<GenericResponse> getOne(@PathVariable Integer bannerId){
        return bannerService.getOne(bannerId);
    }
}
