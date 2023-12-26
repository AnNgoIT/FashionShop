package fit.tlcn.fashionshopbe.service;

import fit.tlcn.fashionshopbe.dto.CreateStyleRequest;
import fit.tlcn.fashionshopbe.dto.GenericResponse;
import fit.tlcn.fashionshopbe.dto.UpdateStyleRequest;
import org.springframework.http.ResponseEntity;

public interface StyleService {
    ResponseEntity<GenericResponse> createStyle(CreateStyleRequest request);

    ResponseEntity<GenericResponse> getAllStyles();

    ResponseEntity<GenericResponse> getStyle(Integer styleId);

    ResponseEntity<GenericResponse> updateStyle(Integer styleId, UpdateStyleRequest request);
}
