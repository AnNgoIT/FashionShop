package fit.tlcn.fashionshopbe.service;

import fit.tlcn.fashionshopbe.dto.CreateStyleValueRequest;
import fit.tlcn.fashionshopbe.dto.GenericResponse;
import org.springframework.http.ResponseEntity;

public interface StyleValueService {
    ResponseEntity<GenericResponse> createStyleValue(CreateStyleValueRequest request);
}
