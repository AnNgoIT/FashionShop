package fit.tlcn.fashionshopbe.controller.AdminController;

import fit.tlcn.fashionshopbe.dto.CreateProductRequest;
import fit.tlcn.fashionshopbe.dto.GenericResponse;
import fit.tlcn.fashionshopbe.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/v1/users/admin/products")
public class AdProductController {
    @Autowired
    ProductService productService;

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
}
