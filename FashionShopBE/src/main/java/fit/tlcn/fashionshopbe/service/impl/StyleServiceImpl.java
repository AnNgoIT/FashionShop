package fit.tlcn.fashionshopbe.service.impl;

import fit.tlcn.fashionshopbe.dto.CreateStyleRequest;
import fit.tlcn.fashionshopbe.dto.GenericResponse;
import fit.tlcn.fashionshopbe.entity.Category;
import fit.tlcn.fashionshopbe.entity.Style;
import fit.tlcn.fashionshopbe.repository.StyleRepository;
import fit.tlcn.fashionshopbe.service.StyleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class StyleServiceImpl implements StyleService {
    @Autowired
    StyleRepository styleRepository;

    @Override
    public ResponseEntity<GenericResponse> createStyle(CreateStyleRequest request) {
        try {
            Optional<Style> styleOptional = styleRepository.findByName(request.getName());
            if (styleOptional.isPresent()) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body(
                        GenericResponse.builder()
                                .success(false)
                                .message("Style already exists")
                                .result("Conflict")
                                .statusCode(HttpStatus.CONFLICT.value())
                                .build()
                );
            }

            Style style = new Style();
            style.setName(request.getName());
            styleRepository.save(style);

            return ResponseEntity.status(HttpStatus.OK).body(
                    GenericResponse.builder()
                            .success(true)
                            .message("Style is created successfully")
                            .result(style)
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
