package fit.tlcn.fashionshopbe.service;

import fit.tlcn.fashionshopbe.dto.CreateStyleRequest;
import fit.tlcn.fashionshopbe.dto.GenericResponse;
import org.springframework.http.ResponseEntity;

public interface StyleService {
    ResponseEntity<GenericResponse> createStyle(CreateStyleRequest request);
}
