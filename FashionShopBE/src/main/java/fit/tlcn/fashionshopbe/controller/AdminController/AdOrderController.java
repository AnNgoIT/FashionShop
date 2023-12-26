package fit.tlcn.fashionshopbe.controller.AdminController;

import fit.tlcn.fashionshopbe.constant.Status;
import fit.tlcn.fashionshopbe.dto.GenericResponse;
import fit.tlcn.fashionshopbe.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/users/admin/orders")
public class AdOrderController {
    @Autowired
    OrderService orderService;

    @GetMapping("")
    public ResponseEntity<GenericResponse> GetAllOrders(){
        return orderService.getAllOrders();
    }

    @GetMapping("/statuses")
    public ResponseEntity<GenericResponse> GetOrdersByStatus(@RequestParam Status status){
        return orderService.getOrdersByStatus(status);
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<GenericResponse> GetOrderByOrderId(@PathVariable Integer orderId){
        return orderService.getOrderByOrderId(orderId);
    }

    @PatchMapping("/toProcessing/{orderId}")
    public ResponseEntity<GenericResponse> UpdateOrderStatusToProcessing(@PathVariable Integer orderId){
        return orderService.updateOrderStatusToProcessing(orderId);
    }

    @PatchMapping("/toShipping/{orderId}")
    public ResponseEntity<GenericResponse> UpdateOrderStatusToShipping(@PathVariable Integer orderId,
                                                                       @RequestParam String shipperEmail){
        return  orderService.updateOrderStatusToShipping(orderId, shipperEmail);
    }

    @GetMapping("/{orderId}/delivery")
    public ResponseEntity<GenericResponse> GetDeliveryByOrder(@PathVariable Integer orderId){
        return  orderService.getDeliveryByOrder(orderId);
    }
}
