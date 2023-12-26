package fit.tlcn.fashionshopbe.controller.AdminController;

import fit.tlcn.fashionshopbe.dto.CreateStyleRequest;
import fit.tlcn.fashionshopbe.dto.GenericResponse;
import fit.tlcn.fashionshopbe.dto.UpdateStyleRequest;
import fit.tlcn.fashionshopbe.service.StyleService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/users/admin/styles")
public class AdStyleController {
    @Autowired
    StyleService styleService;

    @PostMapping("")
    public ResponseEntity<GenericResponse> createStyle(@Valid @RequestBody CreateStyleRequest request, BindingResult bindingResult) {
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

        return styleService.createStyle(request);
    }

    @GetMapping("")
    public ResponseEntity<GenericResponse> getAllStyles(){
        return styleService.getAllStyles();
    }

    @GetMapping("/{styleId}")
    public ResponseEntity<GenericResponse> getStyle(@PathVariable Integer styleId){
        return styleService.getStyle(styleId);
    }

    @PatchMapping("/{styleId}")
    public ResponseEntity<GenericResponse> updateStyle(@PathVariable Integer styleId,
                                                       @Valid @RequestBody UpdateStyleRequest request,
                                                       BindingResult bindingResult){
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
        return styleService.updateStyle(styleId, request);
    }
}
