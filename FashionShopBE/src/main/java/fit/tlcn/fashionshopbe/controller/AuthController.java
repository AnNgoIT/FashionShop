package fit.tlcn.fashionshopbe.controller;

import fit.tlcn.fashionshopbe.dto.GenericResponse;
import fit.tlcn.fashionshopbe.dto.LoginRequest;
import fit.tlcn.fashionshopbe.dto.RegisterRequest;
import fit.tlcn.fashionshopbe.entity.RefreshToken;
import fit.tlcn.fashionshopbe.entity.User;
//import fit.tlcn.fashionshopbe.security.JwtTokenProvider;
//import fit.tlcn.fashionshopbe.security.UserDetail;
import fit.tlcn.fashionshopbe.security.JwtTokenProvider;
import fit.tlcn.fashionshopbe.service.RefreshTokenService;
import fit.tlcn.fashionshopbe.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
//@PreAuthorize("hasAuthority('ADMIN')")
@RequestMapping("/api/v1/auth")
public class AuthController {
    @Autowired
    UserService userService;

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    JwtTokenProvider jwtTokenProvider;

    @Autowired
    RefreshTokenService refreshTokenService;

    @PostMapping("/register")
    public ResponseEntity<GenericResponse> register(@Valid @RequestBody RegisterRequest registerRequest, BindingResult bindingResult) {
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
        return userService.registerUser(registerRequest);
    }

    @PostMapping("/login")
    @Transactional
    public ResponseEntity<GenericResponse> login(@Valid @RequestBody LoginRequest loginRequest, BindingResult bindingResult)
    {
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
        return userService.login(loginRequest);
    }

//    @PostMapping("/login")
//    @Transactional
//    public ResponseEntity<GenericResponse> login(@Valid @RequestBody LoginRequest loginRequest) {
//
//        if (userService.findByEmail(loginRequest.getEmail()).isEmpty()) {
//            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
//                    GenericResponse.builder()
//                            .success(false)
//                            .message("Account does not exist")
//                            .result("Not found")
//                            .statusCode(HttpStatus.NOT_FOUND.value())
//                            .build());
//        }
//
//        Authentication authentication = authenticationManager.authenticate(
//                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(),
//                        loginRequest.getPassword()));
//        SecurityContextHolder.getContext().setAuthentication(authentication);
//        UserDetail userDetail = (UserDetail) authentication.getPrincipal();
//        String accessToken = jwtTokenProvider.generateAccessToken(userDetail);
//        RefreshToken refreshToken = new RefreshToken();
//        String token = jwtTokenProvider.generateRefreshToken(userDetail);
//        refreshToken.setToken(token);
//        refreshToken.setUser(userDetail.getUser());
//        //invalid all refreshToken before
//        refreshTokenService.revokeRefreshToken(userDetail.getUserId());
//        refreshTokenService.save(refreshToken);
//        Map<String, String> tokenMap = new HashMap<>();
//        tokenMap.put("accessToken", accessToken);
//        tokenMap.put("refreshToken", token);
//
//        Optional<User> optionalUser = userService.findByEmail(loginRequest.getEmail());
//        if (optionalUser.isPresent()) {
//            optionalUser.get().setLastLoginAt(new Date());
//            userService.save(optionalUser.get());
//        }
//
//        System.out.println(userDetail.getAuthorities());
//
//        return ResponseEntity.ok().body(GenericResponse.builder()
//                .success(true)
//                .message("Login successfully")
//                .result(tokenMap)
//                .statusCode(HttpStatus.OK.value())
//                .build());
//    }

//    @PostMapping("/logout")
//    public ResponseEntity<GenericResponse> logout(@RequestHeader("Authorization") String authorizationHeader,
//                                    @RequestParam("refreshToken") String refreshToken) {
//        String accessToken = authorizationHeader.substring(7);
//        if (jwtTokenProvider.getUserIdFromJwt(accessToken).equals(jwtTokenProvider.getUserIdFromRefreshToken(refreshToken))) {
////            System.out.println(jwtTokenProvider.getUserIdFromJwt(accessToken));
////            System.out.println(jwtTokenProvider.getUserIdFromRefreshToken(refreshToken));
//            return refreshTokenService.logout(refreshToken);
//
//        }
//        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
//                .body(GenericResponse.builder()
//                        .success(false)
//                        .message("Please login before logout!")
//                        .result("Unauthorized")
//                        .statusCode(HttpStatus.UNAUTHORIZED.value())
//                        .build());
//    }
}
