package fit.tlcn.fashionshopbe.controller.AdminController;

import fit.tlcn.fashionshopbe.dto.CreateShipperAccountRequest;
import fit.tlcn.fashionshopbe.dto.GenericResponse;
import fit.tlcn.fashionshopbe.dto.RegisterRequest;
import fit.tlcn.fashionshopbe.entity.User;
import fit.tlcn.fashionshopbe.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/users/admin/user-management")
public class AdUserController {
    @Autowired
    UserService userService;

    @PostMapping("/shippers")
    public ResponseEntity<GenericResponse> createShipperAccount(@Valid @RequestBody CreateShipperAccountRequest request,
                                                                BindingResult bindingResult){
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
        return userService.createShipperAccount(request);
    }

    @GetMapping("/users")
    public  ResponseEntity<GenericResponse> getAllUsersByRoleName(@RequestParam String roleName){
        return userService.getAllUsersByRoleName(roleName);
    }

    @GetMapping("/users/{userId}")
    public  ResponseEntity<GenericResponse> getUserByUserId(@PathVariable String userId){
        return userService.getUserByUserId(userId);
    }

    @GetMapping("/users/address")
    public  ResponseEntity<GenericResponse> getAllShippersByAddress(@RequestParam String address){
        return userService.getAllShippersByAddress(address);
    }
}
