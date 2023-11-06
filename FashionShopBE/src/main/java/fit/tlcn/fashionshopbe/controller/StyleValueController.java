package fit.tlcn.fashionshopbe.controller;

import fit.tlcn.fashionshopbe.dto.GenericResponse;
import fit.tlcn.fashionshopbe.entity.StyleValue;
import fit.tlcn.fashionshopbe.repository.StyleValueRepository;
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
@RequestMapping("/api/v1/styleValues")
public class StyleValueController {
    @Autowired
    StyleValueRepository styleValueRepository;

    @GetMapping("")
    public ResponseEntity<GenericResponse> getAll() {
        List<StyleValue> styleValueList = styleValueRepository.findAllByIsActiveIsTrue();
        Map<String, Object> map = new HashMap<String, Object>();
        map.put("content", styleValueList);
        map.put("totalElements", styleValueList.size());
        return ResponseEntity.status(HttpStatus.OK).body(
                GenericResponse.builder()
                        .success(true)
                        .message("All Style Values")
                        .result(map)
                        .statusCode(HttpStatus.OK.value())
                        .build()
        );
    }

    @GetMapping("/{styleValueId}")
    public ResponseEntity<GenericResponse> getOne(@PathVariable Integer styleValueId) {
        try {
            Optional<StyleValue> styleValueOptional = styleValueRepository.findByStyleValueIdAndIsActiveIsTrue(styleValueId);
            if (styleValueOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                        GenericResponse.builder()
                                .success(false)
                                .message("Not found style value")
                                .result("Not found")
                                .statusCode(HttpStatus.NOT_FOUND.value())
                                .build());
            }

            return ResponseEntity.status(HttpStatus.OK).body(
                    GenericResponse.builder()
                            .success(true)
                            .message("This is information of style value")
                            .result(styleValueOptional.get())
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
