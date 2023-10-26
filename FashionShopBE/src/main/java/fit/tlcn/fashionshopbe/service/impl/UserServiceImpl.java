package fit.tlcn.fashionshopbe.service.impl;

import fit.tlcn.fashionshopbe.constant.Role;
import fit.tlcn.fashionshopbe.dto.GenericResponse;
import fit.tlcn.fashionshopbe.dto.RegisterRequest;
import fit.tlcn.fashionshopbe.entity.User;
import fit.tlcn.fashionshopbe.repository.UserRepository;
import fit.tlcn.fashionshopbe.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
//import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class UserServiceImpl implements UserService {
    @Autowired
    UserRepository userRepository;

    @Autowired
    BCryptPasswordEncoder passwordEncoder;

    private static final String PHONE_NUMBER_REGEX = "^(\\+\\d{1,3}[- ]?)?\\d{10}$";

    @Override
    public ResponseEntity<GenericResponse> registerUser(RegisterRequest registerRequest) {
        try{
            Optional<User> userOptionalEmail = userRepository.findByEmail(registerRequest.getEmail());
            if(userOptionalEmail.isPresent()){
                return ResponseEntity.status(HttpStatus.CONFLICT).body(
                        GenericResponse.builder()
                                .success(false)
                                .message("Email already in use")
                                .result("Conflict")
                                .statusCode(HttpStatus.CONFLICT.value())
                                .build()
                );
            }

            if(!isValidPhoneNumber(registerRequest.getPhone())){
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                        GenericResponse.builder()
                                .success(false)
                                .message("Invalid phone number format")
                                .result("Bad request")
                                .statusCode(HttpStatus.BAD_REQUEST.value())
                                .build()
                );
            }

            Optional<User> userOptionalPhone = userRepository.findByPhone(registerRequest.getPhone());
            if(userOptionalPhone.isPresent()){
                return ResponseEntity.status(HttpStatus.CONFLICT).body(
                        GenericResponse.builder()
                                .success(false)
                                .message("Phone number already in use")
                                .result("Conflict")
                                .statusCode(HttpStatus.CONFLICT.value())
                                .build()
                );
            }

            if(!registerRequest.getConfirmPassword().equals(registerRequest.getPassword())){
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                        GenericResponse.builder()
                                .success(false)
                                .message("Password and Confirm Password don't match")
                                .result("Bad request")
                                .statusCode(HttpStatus.BAD_REQUEST.value())
                                .build()
                );
            }

            User user = new User();
            user.setFullname(registerRequest.getFullname());
            user.setEmail(registerRequest.getEmail());
            user.setPhone(registerRequest.getPhone());
            user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
            user.setRole(Role.CUSTOMER);

            userRepository.save(user);
            return ResponseEntity.status(HttpStatus.OK).body(
                    GenericResponse.builder()
                            .success(true)
                            .message("You've successfully registered")
                            .result(user)
                            .statusCode(HttpStatus.OK.value())
                            .build()
            );

        }catch(Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    GenericResponse.builder()
                            .success(false)
                            .message(e.getMessage())
                            .result("Internal server error")
                            .statusCode(HttpStatus.INTERNAL_SERVER_ERROR.value())
                            .build()
            );
        }
    }

    private boolean isValidPhoneNumber(String phoneNumber) {
        Pattern pattern = Pattern.compile(PHONE_NUMBER_REGEX);
        Matcher matcher = pattern.matcher(phoneNumber);
        return matcher.matches();
    }
}
