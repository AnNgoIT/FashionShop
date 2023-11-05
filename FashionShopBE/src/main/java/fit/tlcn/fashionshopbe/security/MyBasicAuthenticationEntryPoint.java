package fit.tlcn.fashionshopbe.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.HashMap;
import java.util.Map;

@Component
public class MyBasicAuthenticationEntryPoint implements AuthenticationEntryPoint {
    @Autowired
    ObjectMapper objectMapper;

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException) throws IOException, ServletException {
        response.setContentType("application/json");

        int statusCode = HttpServletResponse.SC_UNAUTHORIZED; // Default status code is 401 (Unauthorized)
        response.setStatus(statusCode);

        Map<String, Object> errorMap = new HashMap<>();
        errorMap.put("success", false);
        errorMap.put("message", "Unauthenticated!");
        errorMap.put("result", authException.getMessage());
        errorMap.put("statusCode", statusCode); // Add the status code to the error response

        String errorJson = objectMapper.writeValueAsString(errorMap);

        try (PrintWriter writer = response.getWriter()) {
            writer.write(errorJson);
        }
    }
}
