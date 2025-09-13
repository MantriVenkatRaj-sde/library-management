package com.MantriVenkatRaj.librarymanagement.signup;

import com.MantriVenkatRaj.librarymanagement.user.User;
import com.MantriVenkatRaj.librarymanagement.user.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.UserDetailsManager;
import org.springframework.stereotype.Service;

@Service
public class SignUpService {

    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;

    public SignUpService(PasswordEncoder passwordEncoder, UserRepository userRepository) {
        this.passwordEncoder = passwordEncoder;
        this.userRepository = userRepository;
    }

    public void registerUser(SignUpRequest request) {
        if (userRepository.findByUsername(request.username()).isPresent()) {
            throw new UsernameNotFoundException("User already exists!");
        }

        User newUser = User.builder()
                .username(request.username())
                .password(passwordEncoder.encode(request.password()))
                .email(request.email())
                .phone(request.phone())
                .age(request.age())
                .address(request.address())
                .enabled(true)
                .role(User.Role.USER)
                .build();

        userRepository.save(newUser);
    }
}
