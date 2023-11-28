package fit.tlcn.fashionshopbe.service;

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
}
