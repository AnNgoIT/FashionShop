package fit.tlcn.fashionshopbe.controller.CustomerController;

import fit.tlcn.fashionshopbe.constant.Status;
import fit.tlcn.fashionshopbe.dto.*;
import fit.tlcn.fashionshopbe.security.JwtTokenProvider;
import fit.tlcn.fashionshopbe.service.UserService;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/users/customers")
public class CustomerController {
    @Autowired
    UserService userService;

    @Autowired
    JwtTokenProvider jwtTokenProvider;

    @PostMapping("/carts/cartItems")
    public ResponseEntity<GenericResponse> addToCart(@Valid @RequestBody AddToCartRequest request,
                                                     @RequestHeader("Authorization") String authorizationHeader,
                                                     BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                    GenericResponse.builder()
                            .success(false)
                            .message("Invalid input data")
                            .result(bindingResult.getFieldError())
                            .statusCode(HttpStatus.BAD_REQUEST.value())
                            .build()
            );
        }

        String token = authorizationHeader.substring(7);
        String emailFromToken = jwtTokenProvider.getEmailFromJwt(token);
        return userService.addToCart(request, emailFromToken);
    }

    @GetMapping("/carts")
    public ResponseEntity<GenericResponse> getCart(@RequestHeader("Authorization") String authorizationHeader) {
        String token = authorizationHeader.substring(7);
        String emailFromToken = jwtTokenProvider.getEmailFromJwt(token);

        return userService.getCart(emailFromToken);
    }

    @GetMapping("/carts/cartItems/{cartItemId}")
    public ResponseEntity<GenericResponse> getCartItem(@PathVariable Integer cartItemId,
                                                       @RequestHeader("Authorization") String authorizationHeader) {
        String token = authorizationHeader.substring(7);
        String emailFromToken = jwtTokenProvider.getEmailFromJwt(token);
        return userService.getCartItem(cartItemId, emailFromToken);
    }

    @PatchMapping("/carts/cartItems/{cartItemId}")
    public ResponseEntity<GenericResponse> updateCartItem(@PathVariable Integer cartItemId,
                                                          @Valid @RequestBody UpdateCartItemRequest request,
                                                          @RequestHeader("Authorization") String authorizationHeader) {
        String token = authorizationHeader.substring(7);
        String emailFromToken = jwtTokenProvider.getEmailFromJwt(token);

        return userService.updateCartItem(cartItemId, request, emailFromToken);
    }

    @DeleteMapping("/carts/cartItems/{cartItemId}")
    public ResponseEntity<GenericResponse> deleteCartItem(@PathVariable Integer cartItemId,
                                                          @RequestHeader("Authorization") String authorizationHeader) {
        String token = authorizationHeader.substring(7);
        String emailFromToken = jwtTokenProvider.getEmailFromJwt(token);

        return userService.deleteCartItem(cartItemId, emailFromToken);
    }

    @Transactional
    @DeleteMapping("/carts/cartItems")
    public ResponseEntity<GenericResponse> deleteAllCartItemsInCart(@RequestHeader("Authorization") String authorizationHeader) {
        String token = authorizationHeader.substring(7);
        String emailFromToken = jwtTokenProvider.getEmailFromJwt(token);

        return userService.deleteAllCartItemsInCart(emailFromToken);
    }

    @PostMapping("/orders")
    public ResponseEntity<GenericResponse> order(@RequestHeader("Authorization") String authorizationHeader,
                                                 @Valid @RequestBody OrderRequest request,
                                                 BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                    GenericResponse.builder()
                            .success(false)
                            .message("Invalid input data")
                            .result(bindingResult.getFieldError().getDefaultMessage())
                            .statusCode(HttpStatus.BAD_REQUEST.value())
                            .build()
            );
        }

        String token = authorizationHeader.substring(7);
        String emailFromToken = jwtTokenProvider.getEmailFromJwt(token);

        return userService.order(emailFromToken, request);
    }

    @GetMapping("/orders")
    public ResponseEntity<GenericResponse> getAllOrdersOfCustomer(@RequestHeader("Authorization") String authorizationHeader) {
        String token = authorizationHeader.substring(7);
        String emailFromToken = jwtTokenProvider.getEmailFromJwt(token);

        return userService.getAllOrdersOfCustomer(emailFromToken);
    }

    @GetMapping("orders/statuses")
    public ResponseEntity<GenericResponse> GetOrdersByStatusOfCustomer(@RequestParam Status status,
                                                                       @RequestHeader("Authorization") String authorizationHeader) {
        String token = authorizationHeader.substring(7);
        String emailFromToken = jwtTokenProvider.getEmailFromJwt(token);

        return userService.getOrdersByStatusOfCustomer(status, emailFromToken);
    }

    @GetMapping("/orders/{orderId}")
    public ResponseEntity<GenericResponse> getOneOrderOfCustomer(@PathVariable Integer orderId,
                                                                 @RequestHeader("Authorization") String authorizationHeader) {
        String token = authorizationHeader.substring(7);
        String emailFromToken = jwtTokenProvider.getEmailFromJwt(token);

        return userService.getOneOrderOfCustomer(orderId, emailFromToken);
    }

    @PatchMapping("/orders/cancel/{orderId}")
    public ResponseEntity<GenericResponse> cancelOrderWithStatusNOT_PROCESSED(@PathVariable Integer orderId,
                                                                              @RequestHeader("Authorization") String authorizationHeader) {
        String token = authorizationHeader.substring(7);
        String emailFromToken = jwtTokenProvider.getEmailFromJwt(token);

        return userService.cancelOrderWithStatusNOT_PROCESSED(orderId, emailFromToken);
    }

    @GetMapping("/orders/{orderId}/checkout-eWallet")
    public ResponseEntity<GenericResponse> checkoutEWallet(@PathVariable Integer orderId,
                                                           @RequestHeader("Authorization") String authorizationHeader) {
        String token = authorizationHeader.substring(7);
        String emailFromToken = jwtTokenProvider.getEmailFromJwt(token);

        return userService.checkoutEWallet(emailFromToken, orderId);
    }

    @PatchMapping("/products/follow-product/{productId}")
    public ResponseEntity<GenericResponse> FollowProduct(@PathVariable Integer productId,
                                                         @RequestHeader("Authorization") String authorizationHeader) {
        String token = authorizationHeader.substring(7);
        String emailFromToken = jwtTokenProvider.getEmailFromJwt(token);

        return userService.followProduct(emailFromToken, productId);
    }

    @PatchMapping("/products/unfollow-product/{productId}")
    public ResponseEntity<GenericResponse> UnfollowProduct(@PathVariable Integer productId,
                                                         @RequestHeader("Authorization") String authorizationHeader) {
        String token = authorizationHeader.substring(7);
        String emailFromToken = jwtTokenProvider.getEmailFromJwt(token);

        return userService.unfollowProduct(emailFromToken, productId);
    }

    @GetMapping("/products/check-follow/{productId}")
    public ResponseEntity<GenericResponse> checkFollow(@PathVariable Integer productId,
                                                           @RequestHeader("Authorization") String authorizationHeader) {
        String token = authorizationHeader.substring(7);
        String emailFromToken = jwtTokenProvider.getEmailFromJwt(token);

        return userService.checkFollow(emailFromToken, productId);
    }

    @PostMapping("/ratings/{orderItemId}")
    public ResponseEntity<GenericResponse> RatingOrderItem(@PathVariable Integer orderItemId,
                                                           @RequestBody CreateRatingRequest request,
                                                           @RequestHeader("Authorization") String authorizationHeader){
        String token = authorizationHeader.substring(7);
        String emailFromToken = jwtTokenProvider.getEmailFromJwt(token);

        return userService.ratingOrderItem(emailFromToken, orderItemId, request);
    }
}
