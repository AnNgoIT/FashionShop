package fit.tlcn.fashionshopbe.service;

import fit.tlcn.fashionshopbe.constant.Status;
import fit.tlcn.fashionshopbe.dto.GenericResponse;
import org.springframework.http.ResponseEntity;

public interface OrderService {
    ResponseEntity<GenericResponse> getOrderByStatus(Status status);

    ResponseEntity<GenericResponse> getOrderByOrderId(Integer orderId);
}
