package fit.tlcn.fashionshopbe.service.impl;

import fit.tlcn.fashionshopbe.dto.LoginRequest;
import fit.tlcn.fashionshopbe.entity.RefreshToken;
import fit.tlcn.fashionshopbe.entity.Role;
import fit.tlcn.fashionshopbe.dto.GenericResponse;
import fit.tlcn.fashionshopbe.dto.RegisterRequest;
import fit.tlcn.fashionshopbe.entity.User;
import fit.tlcn.fashionshopbe.repository.RoleRepository;
import fit.tlcn.fashionshopbe.repository.UserRepository;
import fit.tlcn.fashionshopbe.security.JwtTokenProvider;
import fit.tlcn.fashionshopbe.security.UserDetail;
import fit.tlcn.fashionshopbe.service.RefreshTokenService;
import fit.tlcn.fashionshopbe.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
//import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class UserServiceImpl implements UserService {
    @Autowired
    UserRepository userRepository;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    BCryptPasswordEncoder passwordEncoder;

    @Autowired
    JwtTokenProvider jwtTokenProvider;

    @Autowired
    RefreshTokenService refreshTokenService;

    private static final String PHONE_NUMBER_REGEX = "^(\\+\\d{1,3}[- ]?)?\\d{10}$";

    @Override
    public ResponseEntity<GenericResponse> registerUser(RegisterRequest registerRequest) {
        try {
            Optional<User> userOptionalEmail = userRepository.findByEmail(registerRequest.getEmail());
            if (userOptionalEmail.isPresent()) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body(
                        GenericResponse.builder()
                                .success(false)
                                .message("Email already in use")
                                .result("Conflict")
                                .statusCode(HttpStatus.CONFLICT.value())
                                .build()
                );
            }

            if (!isValidPhoneNumber(registerRequest.getPhone())) {
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
            if (userOptionalPhone.isPresent()) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body(
                        GenericResponse.builder()
                                .success(false)
                                .message("Phone number already in use")
                                .result("Conflict")
                                .statusCode(HttpStatus.CONFLICT.value())
                                .build()
                );
            }

            if (!registerRequest.getConfirmPassword().equals(registerRequest.getPassword())) {
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
            user.setRole(roleRepository.findByName("CUSTOMER"));

            userRepository.save(user);
            return ResponseEntity.status(HttpStatus.OK).body(
                    GenericResponse.builder()
                            .success(true)
                            .message("You've successfully registered")
                            .result(user)
                            .statusCode(HttpStatus.OK.value())
                            .build()
            );

        } catch (Exception e) {
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

    @Override
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    @Override
    public void save(User user) {
        userRepository.save(user);
    }

    @Override
    public ResponseEntity<GenericResponse> login(LoginRequest loginRequest) {
        try {
            Optional<User> userOptional = userRepository.findByEmail(loginRequest.getEmail());
            if (userOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                        GenericResponse.builder()
                                .success(false)
                                .message("Account does not exist")
                                .result("Not found")
                                .statusCode(HttpStatus.NOT_FOUND.value())
                                .build());
            }

            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));
            SecurityContextHolder.getContext().setAuthentication(authentication);

            System.out.println(SecurityContextHolder.getContext());


//            UserDetail userDetail = (UserDetail) authentication.getPrincipal();
//
//            String accessToken = jwtTokenProvider.generateAccessToken(userDetail);
//            RefreshToken refreshToken = new RefreshToken();
//            String token = jwtTokenProvider.generateRefreshToken(userDetail);
//            refreshToken.setToken(token);
//            refreshToken.setUser(userDetail.getUser());
//            //invalid all refreshToken before
//            refreshTokenService.revokeRefreshToken(userDetail.getUserId());
//            refreshTokenService.save(refreshToken);
//            Map<String, String> tokenMap = new HashMap<>();
//            tokenMap.put("accessToken", accessToken);
//            tokenMap.put("refreshToken", token);

            User user = userOptional.get();

            user.setLastLoginAt(new Date());
            userRepository.save(user);


            return ResponseEntity.ok().body(GenericResponse.builder()
                    .success(true)
                    .message("Login successfully")
//                    .result(tokenMap)
                    .statusCode(HttpStatus.OK.value())
                    .build());

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    GenericResponse.builder()
                            .success(false)
                            .message(e.getMessage())
                            .result("Email or Password is incorrect. Please type again!")
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
