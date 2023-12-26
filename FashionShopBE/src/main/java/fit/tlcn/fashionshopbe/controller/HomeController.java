package fit.tlcn.fashionshopbe.controller;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.client.annotation.RegisteredOAuth2AuthorizedClient;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthorizationCodeAuthenticationToken;
import org.springframework.security.oauth2.core.endpoint.OAuth2AccessTokenResponse;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;

@RestController
public class HomeController {
    @GetMapping("/")
    public String helloEveryone() {
        return "Hello everyone, Welcome to AT Shop";
    }

    @GetMapping("/api/v1/oauth2/callback/google")
    public String handleGoogleCallback(Principal principal) {
        // Sử dụng accessToken cho các yêu cầu API tiếp theo tới Google
        //...

        return "Hello: " + principal;
    }

    @GetMapping("/api/v1/oauth2/callback/facebook")
    public String handleFacebookCallback(Principal principal) {
        // Sử dụng accessToken cho các yêu cầu API tiếp theo tới Google
        //...

        return "Hello: " + principal;
    }
}

