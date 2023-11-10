package fit.tlcn.fashionshopbe.controller.AdminController;

import fit.tlcn.fashionshopbe.dto.CreateCategoryRequest;
import fit.tlcn.fashionshopbe.dto.GenericResponse;
import fit.tlcn.fashionshopbe.dto.UpdateCategoryRequest;
import fit.tlcn.fashionshopbe.dto.UpdateCategoryStatusRequest;
import fit.tlcn.fashionshopbe.service.CategoryService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/v1/users/admin/categories")
public class AdCategoryController {
    @Autowired
    CategoryService categoryService;

    @PostMapping("")
    public ResponseEntity<GenericResponse> createCategory(@Valid @ModelAttribute CreateCategoryRequest request,
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

        return categoryService.createCategory(request);
    }

    @PutMapping("/{categoryId}")
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

    @PatchMapping("/{categoryId}")
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
