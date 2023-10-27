package fit.tlcn.fashionshopbe.security;

import fit.tlcn.fashionshopbe.entity.User;
import fit.tlcn.fashionshopbe.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class UserDetailService implements UserDetailsService {
    @Autowired
    UserRepository userRepository;
    @Override
    public UserDetails loadUserByUsername(String emailOrPhone) throws UsernameNotFoundException {
        User user = userRepository.findByEmailAndIsActiveIsTrue(emailOrPhone)
                .orElseGet(() -> userRepository.findByPhoneAndIsActiveIsTrue(emailOrPhone)
                        .orElseThrow(() -> new UsernameNotFoundException("User is not found")));
        return new UserDetail(user);
    }

    public UserDetails loadUserByUserId(String userId) {
        User user = userRepository.findByUserIdAndIsActiveIsTrue(userId)
                .orElseThrow(() -> new UsernameNotFoundException("User is not found"));
        return new UserDetail(user);
    }
}
