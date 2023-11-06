package fit.tlcn.fashionshopbe.controller.AdminController;

import fit.tlcn.fashionshopbe.dto.CreateStyleValueRequest;
import fit.tlcn.fashionshopbe.dto.GenericResponse;
import fit.tlcn.fashionshopbe.service.StyleValueService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/users/admin/styleValues")
public class AdStyleValueController {
    @Autowired
    StyleValueService styleValueService;

    @PostMapping("")
    public ResponseEntity<GenericResponse> createStyleValue(@Valid @RequestBody CreateStyleValueRequest request, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
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
        }

        return styleValueService.createStyleValue(request);
    }
}
