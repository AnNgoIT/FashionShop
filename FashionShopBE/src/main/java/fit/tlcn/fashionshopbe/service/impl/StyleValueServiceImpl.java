package fit.tlcn.fashionshopbe.service.impl;

import fit.tlcn.fashionshopbe.dto.CreateStyleValueRequest;
import fit.tlcn.fashionshopbe.dto.GenericResponse;
import fit.tlcn.fashionshopbe.dto.StyleValueResponse;
import fit.tlcn.fashionshopbe.dto.UpdateStyleValueRequest;
import fit.tlcn.fashionshopbe.entity.Style;
import fit.tlcn.fashionshopbe.entity.StyleValue;
import fit.tlcn.fashionshopbe.repository.StyleRepository;
import fit.tlcn.fashionshopbe.repository.StyleValueRepository;
import fit.tlcn.fashionshopbe.service.StyleValueService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class StyleValueServiceImpl implements StyleValueService {
    @Autowired
    StyleValueRepository styleValueRepository;

    @Autowired
    StyleRepository styleRepository;

    @Override
    public ResponseEntity<GenericResponse> createStyleValue(CreateStyleValueRequest request) {
        try {
            Optional<StyleValue> styleValueOptional = styleValueRepository.findByName(request.getName());
            if (styleValueOptional.isPresent()) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body(
                        GenericResponse.builder()
                                .success(false)
                                .message("Style Value already exists")
                                .result("Conflict")
                                .statusCode(HttpStatus.CONFLICT.value())
                                .build()
                );
            }

            StyleValue styleValue = new StyleValue();
            styleValue.setName(request.getName());
            Optional<Style> styleOptional = styleRepository.findByStyleIdAndIsActiveIsTrue(request.getStyleId());
            if (styleOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                        GenericResponse.builder()
                                .success(false)
                                .message("This StyleId does not exist")
                                .result("Not found")
                                .statusCode(HttpStatus.NOT_FOUND.value())
                                .build());
            }
            styleValue.setStyle(styleOptional.get());

            styleValueRepository.save(styleValue);

            StyleValueResponse styleValueResponse = new StyleValueResponse();
            styleValueResponse.setStyleValueId(styleValue.getStyleValueId());
            styleValueResponse.setName(styleValue.getName());
            styleValueResponse.setStyleName(styleValue.getStyle().getName());
            styleValueResponse.setCreatedAt(styleValue.getCreatedAt());
            styleValueResponse.setUpdatedAt(styleValue.getUpdatedAt());
            styleValueResponse.setIsActive(styleValue.getIsActive());
            return ResponseEntity.status(HttpStatus.OK).body(
                    GenericResponse.builder()
                            .success(true)
                            .message("Style Value is created successfully")
                            .result(styleValueResponse)
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

    @Override
    public ResponseEntity<GenericResponse> getAllStyleValuesByStyleName(String styleName) {
        try {
            Optional<Style> styleOptional = styleRepository.findByName(styleName);
            if(styleOptional.isEmpty()){
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                        GenericResponse.builder()
                                .success(false)
                                .message("Style isn't exist")
                                .result("Bad request")
                                .statusCode(HttpStatus.BAD_REQUEST.value())
                                .build()
                );
            }

            Style style = styleOptional.get();
            List<StyleValue> styleValueList = styleValueRepository.findByStyle(style);
            List<StyleValueResponse> styleValueResponseList = new ArrayList<>();
            for (StyleValue styleValue : styleValueList) {
                StyleValueResponse styleValueResponse = new StyleValueResponse();
                styleValueResponse.setStyleValueId(styleValue.getStyleValueId());
                styleValueResponse.setName(styleValue.getName());
                styleValueResponse.setStyleName(styleValue.getStyle().getName());
                styleValueResponse.setCreatedAt(styleValue.getCreatedAt());
                styleValueResponse.setUpdatedAt(styleValue.getUpdatedAt());
                styleValueResponse.setIsActive(styleValue.getIsActive());

                styleValueResponseList.add(styleValueResponse);
            }

            Map<String, Object> map = new HashMap<String, Object>();
            map.put("content", styleValueResponseList);
            map.put("totalElements", styleValueList.size());
            return ResponseEntity.status(HttpStatus.OK).body(
                    GenericResponse.builder()
                            .success(true)
                            .message("All Style Values of " + styleName)
                            .result(map)
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

    @Override
    public ResponseEntity<GenericResponse> getStyleValue(Integer styleValueId) {
        try {
            Optional<StyleValue> styleValueOptional = styleValueRepository.findById(styleValueId);
            if (styleValueOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                        GenericResponse.builder()
                                .success(false)
                                .message("Not found style value")
                                .result("Not found")
                                .statusCode(HttpStatus.NOT_FOUND.value())
                                .build());
            }
            StyleValue styleValue = styleValueOptional.get();

            StyleValueResponse styleValueResponse = new StyleValueResponse();
            styleValueResponse.setStyleValueId(styleValue.getStyleValueId());
            styleValueResponse.setName(styleValue.getName());
            styleValueResponse.setStyleName(styleValue.getStyle().getName());
            styleValueResponse.setCreatedAt(styleValue.getCreatedAt());
            styleValueResponse.setUpdatedAt(styleValue.getUpdatedAt());
            styleValueResponse.setIsActive(styleValue.getIsActive());

            return ResponseEntity.status(HttpStatus.OK).body(
                    GenericResponse.builder()
                            .success(true)
                            .message("This is information of style value")
                            .result(styleValueResponse)
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

    @Override
    public ResponseEntity<GenericResponse> updateStyleValue(Integer styleValueId, UpdateStyleValueRequest request) {
        try {
            Optional<StyleValue> styleValueOptional = styleValueRepository.findById(styleValueId);
            if (styleValueOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                        GenericResponse.builder()
                                .success(false)
                                .message("Not found style value")
                                .result("Not found")
                                .statusCode(HttpStatus.NOT_FOUND.value())
                                .build());
            }

            StyleValue styleValue = styleValueOptional.get();
            if (request.getName().equals(styleValue.getName())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                        GenericResponse.builder()
                                .success(false)
                                .message("New style value's name must difference from style value's name in the present")
                                .result("Bad request")
                                .statusCode(HttpStatus.BAD_REQUEST.value())
                                .build());
            }

            Optional<StyleValue> styleValueNameOptional = styleValueRepository.findByName(request.getName());
            if (styleValueNameOptional.isPresent()) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body(
                        GenericResponse.builder()
                                .success(false)
                                .message("Style Value already exists")
                                .result("Conflict")
                                .statusCode(HttpStatus.CONFLICT.value())
                                .build()
                );
            }

            styleValue.setName(request.getName());
            styleValueRepository.save(styleValue);

            StyleValueResponse styleValueResponse = new StyleValueResponse();
            styleValueResponse.setStyleValueId(styleValue.getStyleValueId());
            styleValueResponse.setName(styleValue.getName());
            styleValueResponse.setStyleName(styleValue.getStyle().getName());
            styleValueResponse.setCreatedAt(styleValue.getCreatedAt());
            styleValueResponse.setUpdatedAt(styleValue.getUpdatedAt());
            styleValueResponse.setIsActive(styleValue.getIsActive());

            return ResponseEntity.status(HttpStatus.OK).body(
                    GenericResponse.builder()
                            .success(true)
                            .message("Updated style value successfully")
                            .result(styleValueResponse)
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
