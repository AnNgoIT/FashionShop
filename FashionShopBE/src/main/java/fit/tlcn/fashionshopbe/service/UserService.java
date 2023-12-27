package fit.tlcn.fashionshopbe.service;

import fit.tlcn.fashionshopbe.constant.Status;
import fit.tlcn.fashionshopbe.dto.*;
import fit.tlcn.fashionshopbe.entity.User;
import org.springframework.http.ResponseEntity;

import java.util.Optional;

public interface UserService {
    ResponseEntity<GenericResponse> registerUser(RegisterRequest registerRequest);

    ResponseEntity<GenericResponse> login(LoginRequest loginRequest);

    ResponseEntity<GenericResponse> updateUserProfile(UserProfileUpdateRequest request, String emailFromToken);

    ResponseEntity<GenericResponse> changePassword(ChangePasswordRequest request, String emailFromToken);

    ResponseEntity<GenericResponse> getUserProfile(String emailFromToken);

    ResponseEntity<GenericResponse> addToCart(AddToCartRequest request, String emailFromToken);

    ResponseEntity<GenericResponse> getCart(String emailFromToken);

    ResponseEntity<GenericResponse> getCartItem(Integer cartItemId, String emailFromToken);

    ResponseEntity<GenericResponse> updateCartItem(Integer cartItemId, UpdateCartItemRequest request, String emailFromToken);

    ResponseEntity<GenericResponse> deleteCartItem(Integer cartItemId, String emailFromToken);

    ResponseEntity<GenericResponse> deleteAllCartItemsInCart(String emailFromToken);

    ResponseEntity<GenericResponse> order(String emailFromToken, OrderRequest request);

    ResponseEntity<GenericResponse> getUserRole(String emailFromToken);

    ResponseEntity<GenericResponse> getAllOrdersOfCustomer(String emailFromToken);

    ResponseEntity<GenericResponse> getOneOrderOfCustomer(Integer orderId, String emailFromToken);

    ResponseEntity<GenericResponse> createShipperAccount(CreateShipperAccountRequest request);

    ResponseEntity<GenericResponse> cancelOrderWithStatusNOT_PROCESSED(Integer orderId, String emailFromToken);

    ResponseEntity<GenericResponse> getOrdersByStatusOfCustomer(Status status, String emailFromToken);

    ResponseEntity<GenericResponse> checkoutEWallet(String emailFromToken, Integer orderId);

    ResponseEntity<GenericResponse> getAllDeliveriesOfShipper(String emailFromToken);

    ResponseEntity<GenericResponse> getAllNotReceivedDeliveriesOfShipper(String emailFromToken);

    ResponseEntity<GenericResponse> receive(String emailFromToken, Integer deliveryId);

    ResponseEntity<GenericResponse> getAllReceivedAndNotDeliveredDeliveriesOfShipper(String emailFromToken);

    ResponseEntity<GenericResponse> deliver(String emailFromToken, Integer deliveryId);

    ResponseEntity<GenericResponse> getOneDeliveryOfShipper(String emailFromToken, Integer deliveryId);

    ResponseEntity<GenericResponse> getAllDeliveredDeliveriesOfShipper(String emailFromToken);

    ResponseEntity<GenericResponse> getAllUsersByRoleName(String roleName);

    ResponseEntity<GenericResponse> getUserByUserId(String userId);

    ResponseEntity<GenericResponse> followProduct(String emailFromToken, Integer productId);

    ResponseEntity<GenericResponse> unfollowProduct(String emailFromToken, Integer productId);

    ResponseEntity<GenericResponse> ratingOrderItem(String emailFromToken, Integer orderItemId, CreateRatingRequest request);

    ResponseEntity<GenericResponse> checkFollow(String emailFromToken, Integer productId);

    ResponseEntity<GenericResponse> getAllShippersByAddress(String address);

    ResponseEntity<GenericResponse> updateOrderToRated(String emailFromToken, Integer orderId);

    ResponseEntity<GenericResponse> getRatingOfOrder(String emailFromToken, Integer orderId);
}
