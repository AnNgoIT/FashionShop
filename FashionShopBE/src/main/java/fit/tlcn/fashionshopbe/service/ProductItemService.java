package fit.tlcn.fashionshopbe.service;

import fit.tlcn.fashionshopbe.dto.CreateProductItemRequest;
import fit.tlcn.fashionshopbe.dto.GenericResponse;
import fit.tlcn.fashionshopbe.dto.UpdateProductItemRequest;
import org.springframework.http.ResponseEntity;

public interface ProductItemService {
    ResponseEntity<GenericResponse> createProductItem(CreateProductItemRequest request);

    ResponseEntity<GenericResponse> updateProductItem(Integer productItemId, UpdateProductItemRequest request);
}
