package fit.tlcn.fashionshopbe.controller;

import fit.tlcn.fashionshopbe.dto.GenericResponse;
import fit.tlcn.fashionshopbe.entity.Category;
import fit.tlcn.fashionshopbe.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/categories")
public class CategoryController {
    @Autowired
    CategoryRepository categoryRepository;

    @GetMapping("")
    public ResponseEntity<GenericResponse> getAll() {
        List<Category> categoryList = categoryRepository.findAllByIsActiveIsTrue();
        Map<String, Object> map = new HashMap<String, Object>();
        map.put("content", categoryList);
        map.put("totalElements", categoryList.size());
        return ResponseEntity.status(HttpStatus.OK).body(
                GenericResponse.builder()
                        .success(true)
                        .message("This is categories of shop")
                        .result(map)
                        .statusCode(HttpStatus.OK.value())
                        .build()
        );
    }

    @GetMapping("/{categoryId}")
    public ResponseEntity<GenericResponse> getOne(@PathVariable Integer categoryId) {
        try {
            Optional<Category> categoryOptional = categoryRepository.findByCategoryIdAndIsActiveIsTrue(categoryId);
            if (categoryOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                        GenericResponse.builder()
                                .success(false)
                                .message("Not found category")
                                .result("Not found")
                                .statusCode(HttpStatus.NOT_FOUND.value())
                                .build());
            }

            return ResponseEntity.status(HttpStatus.OK).body(
                    GenericResponse.builder()
                            .success(true)
                            .message("This is category's information")
                            .result(categoryOptional.get())
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
