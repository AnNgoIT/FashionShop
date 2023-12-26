package fit.tlcn.fashionshopbe.service;

import fit.tlcn.fashionshopbe.constant.Status;
import fit.tlcn.fashionshopbe.dto.GenericResponse;
import org.springframework.http.ResponseEntity;

public interface OrderService {
    ResponseEntity<GenericResponse> getOrdersByStatus(Status status);

    ResponseEntity<GenericResponse> getOrderByOrderId(Integer orderId);

    ResponseEntity<GenericResponse> updateOrderStatusToProcessing(Integer orderId);

    ResponseEntity<GenericResponse> updateOrderStatusToShipping(Integer orderId, String shipperEmail);

    ResponseEntity<GenericResponse> getAllOrders();

    ResponseEntity<GenericResponse> getDeliveryByOrder(Integer orderId);
}
