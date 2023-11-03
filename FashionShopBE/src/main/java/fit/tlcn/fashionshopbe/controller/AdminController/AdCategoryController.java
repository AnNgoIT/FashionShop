package fit.tlcn.fashionshopbe.controller.AdminController;

import fit.tlcn.fashionshopbe.dto.CreateCategoryRequest;
import fit.tlcn.fashionshopbe.dto.GenericResponse;
import fit.tlcn.fashionshopbe.dto.UpdateCategoryRequest;
import fit.tlcn.fashionshopbe.dto.UpdateCategoryStatusRequest;
//import fit.tlcn.fashionshopbe.security.UserDetail;
import fit.tlcn.fashionshopbe.service.CategoryService;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/users/admin")
public class AdCategoryController {
    @Autowired
    CategoryService categoryService;

    @PostMapping("/categories")
    public ResponseEntity<GenericResponse> createCategory(@Valid @RequestBody CreateCategoryRequest request, BindingResult bindingResult) {
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

        return categoryService.createCategory(request);
    }

    @PutMapping("/categories/{categoryId}")
    public ResponseEntity<GenericResponse> updateCategory(@PathVariable Integer categoryId, @Valid @RequestBody UpdateCategoryRequest updateCategoryRequest, BindingResult bindingResult) {
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
        return categoryService.updateCategory(categoryId, updateCategoryRequest);
    }

    @PatchMapping("/categories/{categoryId}")
    public ResponseEntity<GenericResponse> updateCategoryStatus(@PathVariable Integer categoryId, @Valid @RequestBody UpdateCategoryStatusRequest updateCategoryStatusRequest, BindingResult bindingResult) {
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
        return categoryService.updateCategoryStatus(categoryId, updateCategoryStatusRequest);
    }
}
