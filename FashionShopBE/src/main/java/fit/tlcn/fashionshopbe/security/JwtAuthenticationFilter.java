package fit.tlcn.fashionshopbe.security;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.security.SignatureException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.Optional;

@Log4j2
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private UserDetailService userDetailService;

    private Optional<String> getJwtFromRequest(HttpServletRequest request){
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return Optional.of(bearerToken.substring(7));
        }
        return Optional.empty();
    }
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        try {
            CustomHttpServletRequestWrapper requestWrapper = new CustomHttpServletRequestWrapper(request);
            try {
                Optional<String> jwt = getJwtFromRequest(requestWrapper);

                if (jwt.isPresent() && jwtTokenProvider.validateToken(jwt.get())) {
                    String id = jwtTokenProvider.getUserIdFromJwt(jwt.get());

                    UserDetails userDetails = userDetailService.loadUserByUserId(id);
                    if (userDetails != null) {
                        UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                        authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(requestWrapper));

                        SecurityContextHolder.getContext().setAuthentication(authentication);
                        response.addHeader("Authorization", "Bearer " + jwt);
                    }
                }
            } catch (MalformedJwtException e) {
                response.setStatus(401);
                response.setContentType("application/json");
                response.setCharacterEncoding("UTF-8");
                PrintWriter out = response.getWriter();
                out.print("{\"success\": false, \"message\": \"Access Denied\", \"result\": \"Invalid JWT token. Please login again!\", \"statusCode\": \"401\"}");
                out.flush();
                return;
            } catch (ExpiredJwtException e) {
                response.setStatus(401);
                response.setContentType("application/json");
                response.setCharacterEncoding("UTF-8");
                PrintWriter out = response.getWriter();
                out.print("{\"success\": false, \"message\": \"Access Denied\", \"result\": \"Token is expired. Please login again!\", \"statusCode\": \"401\"}");
                out.flush();
                return;
            } catch (SignatureException ex) {
                response.setStatus(401);
                response.setContentType("application/json");
                response.setCharacterEncoding("UTF-8");
                PrintWriter out = response.getWriter();
                out.print("{\"success\": false, \"message\": \"Access Denied\", \"result\": \"In valid JWT signature. Please login again!\", \"statusCode\": \"401\"}");
                out.flush();
                return;
            } catch (Exception ex) {
                ex.printStackTrace();
                response.setStatus(401);
                response.setContentType("application/json");
                response.setCharacterEncoding("UTF-8");
                PrintWriter out = response.getWriter();
                out.print("{\"success\": false, \"message\": \"Access Denied\", \"result\": \"Please login again!\", \"statusCode\": \"401\"}");
                out.flush();
                return;
            }

            filterChain.doFilter(requestWrapper, response);
        } catch (Exception e) {

        }
    }
}
