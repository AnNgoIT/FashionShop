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

    @GetMapping("/statuses")
    public ResponseEntity<GenericResponse> GetOrdersByStatus(@RequestParam(required = false) Status status){
        return orderService.getOrderByStatus(status);
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<GenericResponse> GetOrderByOrderId(@PathVariable Integer orderId){
        return orderService.getOrderByOrderId(orderId);
    }
}
