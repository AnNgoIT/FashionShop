package fit.tlcn.fashionshopbe.controller;

import fit.tlcn.fashionshopbe.dto.GenericResponse;
import fit.tlcn.fashionshopbe.service.BannerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/banners")
public class BannerController {
    @Autowired
    BannerService bannerService;

    @GetMapping("")
    public ResponseEntity<GenericResponse> getAllBanners(){
        return bannerService.getAllBanners();
    }

    @GetMapping("/{bannerId}")
    public ResponseEntity<GenericResponse> getOne(@PathVariable Integer bannerId){
        return bannerService.getOne(bannerId);
    }
}
