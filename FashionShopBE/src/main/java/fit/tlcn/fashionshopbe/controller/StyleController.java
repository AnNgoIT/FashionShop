package fit.tlcn.fashionshopbe.controller;

import fit.tlcn.fashionshopbe.dto.GenericResponse;
import fit.tlcn.fashionshopbe.entity.Category;
import fit.tlcn.fashionshopbe.entity.Style;
import fit.tlcn.fashionshopbe.repository.StyleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/styles")
public class StyleController {
    @Autowired
    StyleRepository styleRepository;

    @GetMapping("")
    public ResponseEntity<GenericResponse> getAll() {
        List<Style> styleList = styleRepository.findAllByIsActiveIsTrue();
        Map<String, Object> map = new HashMap<String, Object>();
        map.put("content", styleList);
        map.put("totalElements", styleList.size());
        return ResponseEntity.status(HttpStatus.OK).body(
                GenericResponse.builder()
                        .success(true)
                        .message("All Styles")
                        .result(map)
                        .statusCode(HttpStatus.OK.value())
                        .build()
        );
    }

    @GetMapping("/{styleId}")
    public ResponseEntity<GenericResponse> getOne(@PathVariable Integer styleId) {
        try {
            Optional<Style> styleOptional = styleRepository.findByStyleIdAndIsActiveIsTrue(styleId);
            if (styleOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                        GenericResponse.builder()
                                .success(false)
                                .message("Not found style")
                                .result("Not found")
                                .statusCode(HttpStatus.NOT_FOUND.value())
                                .build());
            }

            return ResponseEntity.status(HttpStatus.OK).body(
                    GenericResponse.builder()
                            .success(true)
                            .message("This is style's information")
                            .result(styleOptional.get())
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
