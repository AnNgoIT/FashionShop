package fit.tlcn.fashionshopbe.service;

import fit.tlcn.fashionshopbe.dto.CreateProductRequest;
import fit.tlcn.fashionshopbe.dto.GenericResponse;
import org.springframework.http.ResponseEntity;

public interface ProductService {
    ResponseEntity<GenericResponse> createProduct(CreateProductRequest request);
}
