package fit.tlcn.fashionshopbe.service;

import fit.tlcn.fashionshopbe.dto.GenericResponse;
import fit.tlcn.fashionshopbe.dto.RegisterRequest;
import org.springframework.http.ResponseEntity;

public interface UserService {
    ResponseEntity<GenericResponse> registerUser(RegisterRequest registerRequest);
}
