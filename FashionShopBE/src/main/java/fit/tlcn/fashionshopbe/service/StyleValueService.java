package fit.tlcn.fashionshopbe.service;

import fit.tlcn.fashionshopbe.dto.CreateStyleValueRequest;
import fit.tlcn.fashionshopbe.dto.GenericResponse;
import fit.tlcn.fashionshopbe.dto.UpdateStyleValueRequest;
import org.springframework.http.ResponseEntity;

public interface StyleValueService {
    ResponseEntity<GenericResponse> createStyleValue(CreateStyleValueRequest request);

    ResponseEntity<GenericResponse> getAllStyleValuesByStyleName(String styleName);

    ResponseEntity<GenericResponse> getStyleValue(Integer styleValueId);

    ResponseEntity<GenericResponse> updateStyleValue(Integer styleValueId, UpdateStyleValueRequest request);
}
