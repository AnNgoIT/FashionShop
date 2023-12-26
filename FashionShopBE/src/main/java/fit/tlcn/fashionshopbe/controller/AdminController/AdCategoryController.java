package fit.tlcn.fashionshopbe.controller.AdminController;

import fit.tlcn.fashionshopbe.dto.CreateCategoryRequest;
import fit.tlcn.fashionshopbe.dto.GenericResponse;
import fit.tlcn.fashionshopbe.dto.UpdateCategoryRequest;
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

    @PatchMapping("/{categoryId}")
    public ResponseEntity<GenericResponse> updateCategory(@PathVariable Integer categoryId, @ModelAttribute UpdateCategoryRequest updateCategoryRequest, BindingResult bindingResult) {
        return categoryService.updateCategory(categoryId, updateCategoryRequest);
    }

    @GetMapping("")
    public ResponseEntity<GenericResponse> getAllCategories() {
        return categoryService.getAllCategories();
    }

    @GetMapping("/{categoryId}")
    public ResponseEntity<GenericResponse> getCategory(@PathVariable Integer categoryId) {
        return categoryService.getCategory(categoryId);
    }
}
