package fit.tlcn.fashionshopbe.controller.ShipperController;

import fit.tlcn.fashionshopbe.dto.GenericResponse;
import fit.tlcn.fashionshopbe.security.JwtTokenProvider;
import fit.tlcn.fashionshopbe.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/users/shippers")
public class ShipperController {
    @Autowired
    UserService userService;

    @Autowired
    JwtTokenProvider jwtTokenProvider;

    @GetMapping("/deliveries")
    public ResponseEntity<GenericResponse> getAllDeliveriesOfShipper(@RequestHeader("Authorization") String authorizationHeader) {
        String token = authorizationHeader.substring(7);
        String emailFromToken = jwtTokenProvider.getEmailFromJwt(token);

        return userService.getAllDeliveriesOfShipper(emailFromToken);
    }

    @GetMapping("/deliveries/{deliveryId}")
    public ResponseEntity<GenericResponse> getOneDeliveryOfShipper(@PathVariable Integer deliveryId,
                                                                   @RequestHeader("Authorization") String authorizationHeader) {
        String token = authorizationHeader.substring(7);
        String emailFromToken = jwtTokenProvider.getEmailFromJwt(token);

        return userService.getOneDeliveryOfShipper(emailFromToken, deliveryId);
    }

    @GetMapping("/deliveries/not-received")
    public ResponseEntity<GenericResponse> getAllNotReceivedDeliveriesOfShipper(@RequestHeader("Authorization") String authorizationHeader) {
        String token = authorizationHeader.substring(7);
        String emailFromToken = jwtTokenProvider.getEmailFromJwt(token);

        return userService.getAllNotReceivedDeliveriesOfShipper(emailFromToken);
    }

    @PatchMapping("/deliveries/{deliveryId}/receive")
    public ResponseEntity<GenericResponse> receive(@PathVariable Integer deliveryId,
                                                   @RequestHeader("Authorization") String authorizationHeader) {
        String token = authorizationHeader.substring(7);
        String emailFromToken = jwtTokenProvider.getEmailFromJwt(token);

        return userService.receive(emailFromToken, deliveryId);
    }

    @GetMapping("/deliveries/received-notDelivered")
    public ResponseEntity<GenericResponse> getAllReceivedAndNotDeliveredDeliveriesOfShipper(@RequestHeader("Authorization") String authorizationHeader) {
        String token = authorizationHeader.substring(7);
        String emailFromToken = jwtTokenProvider.getEmailFromJwt(token);

        return userService.getAllReceivedAndNotDeliveredDeliveriesOfShipper(emailFromToken);
    }

    @PatchMapping("/deliveries/{deliveryId}/deliver")
    public ResponseEntity<GenericResponse> deliver(@PathVariable Integer deliveryId,
                                                   @RequestHeader("Authorization") String authorizationHeader) {
        String token = authorizationHeader.substring(7);
        String emailFromToken = jwtTokenProvider.getEmailFromJwt(token);

        return userService.deliver(emailFromToken, deliveryId);
    }

    @GetMapping("/deliveries/delivered")
    public ResponseEntity<GenericResponse> getAllDeliveredDeliveriesOfShipper(@RequestHeader("Authorization") String authorizationHeader) {
        String token = authorizationHeader.substring(7);
        String emailFromToken = jwtTokenProvider.getEmailFromJwt(token);

        return userService.getAllDeliveredDeliveriesOfShipper(emailFromToken);
    }
}
