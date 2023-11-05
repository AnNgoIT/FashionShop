package fit.tlcn.fashionshopbe.service;

import fit.tlcn.fashionshopbe.dto.GenericResponse;
import fit.tlcn.fashionshopbe.dto.LoginRequest;
import fit.tlcn.fashionshopbe.dto.RegisterRequest;
import fit.tlcn.fashionshopbe.entity.User;
import org.springframework.http.ResponseEntity;

import java.util.Optional;

public interface UserService {
    ResponseEntity<GenericResponse> registerUser(RegisterRequest registerRequest);

    ResponseEntity<GenericResponse> login(LoginRequest loginRequest);
}
