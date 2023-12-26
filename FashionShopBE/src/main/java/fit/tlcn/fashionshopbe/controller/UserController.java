package fit.tlcn.fashionshopbe.controller;

import fit.tlcn.fashionshopbe.config.VNPayConfig;
import fit.tlcn.fashionshopbe.dto.ChangePasswordRequest;
import fit.tlcn.fashionshopbe.dto.GenericResponse;
import fit.tlcn.fashionshopbe.dto.UserProfileUpdateRequest;
import fit.tlcn.fashionshopbe.security.JwtTokenProvider;
import fit.tlcn.fashionshopbe.service.UserService;
import fit.tlcn.fashionshopbe.service.VNPayService;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {
    @Autowired
    JwtTokenProvider jwtTokenProvider;

    @Autowired
    UserService userService;

    @Autowired
    VNPayService vnPayService;

    @GetMapping("/role")
    public ResponseEntity<GenericResponse> checkUserRole(@RequestHeader("Authorization") String authorizationHeader){
        String token = authorizationHeader.substring(7);
        String emailFromToken = jwtTokenProvider.getEmailFromJwt(token);

        return userService.getUserRole(emailFromToken);
    }

    @GetMapping("/profile")
    public ResponseEntity<GenericResponse> getUserProfile(@RequestHeader("Authorization") String authorizationHeader) {
        String token = authorizationHeader.substring(7);
        String emailFromToken = jwtTokenProvider.getEmailFromJwt(token);

        return userService.getUserProfile(emailFromToken);
    }

    @PutMapping("/profile")
    public ResponseEntity<GenericResponse> updateUserProfile(@ModelAttribute UserProfileUpdateRequest request,
                                                             @RequestHeader("Authorization") String authorizationHeader) {
        String token = authorizationHeader.substring(7);
        String emailFromToken = jwtTokenProvider.getEmailFromJwt(token);

        return userService.updateUserProfile(request, emailFromToken);
    }

    @PatchMapping("/change-password")
    public ResponseEntity<GenericResponse> changePassword(@Valid @RequestBody ChangePasswordRequest request,
                                                          @RequestHeader("Authorization") String authorizationHeader,
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
        return userService.changePassword(request, emailFromToken);
    }

    @GetMapping("/paymentPay-callback")
    public void paymentPayCallback(@RequestParam Map<String, String> queryParams, HttpServletResponse response) throws IOException {
        vnPayService.PaymentPayCallBack(queryParams,response);
    }
}
