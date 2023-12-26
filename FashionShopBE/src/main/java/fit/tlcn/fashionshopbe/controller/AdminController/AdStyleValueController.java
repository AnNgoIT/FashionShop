package fit.tlcn.fashionshopbe.controller.AdminController;

import fit.tlcn.fashionshopbe.dto.CreateStyleValueRequest;
import fit.tlcn.fashionshopbe.dto.GenericResponse;
import fit.tlcn.fashionshopbe.dto.UpdateStyleValueRequest;
import fit.tlcn.fashionshopbe.service.StyleValueService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

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

    @GetMapping("")
    public ResponseEntity<GenericResponse> getAllStyleValuesByStyleName(@RequestParam String styleName){
        return styleValueService.getAllStyleValuesByStyleName(styleName);
    }

    @GetMapping("/{styleValueId}")
    public ResponseEntity<GenericResponse> getStyleValue(@PathVariable Integer styleValueId){
        return  styleValueService.getStyleValue(styleValueId);
    }

    @PatchMapping("/{styleValueId}")
    public ResponseEntity<GenericResponse> updateStyleValue(@PathVariable Integer styleValueId,
                                                            @Valid @RequestBody UpdateStyleValueRequest request,
                                                            BindingResult bindingResult){
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

        return styleValueService.updateStyleValue(styleValueId, request);
    }
}
