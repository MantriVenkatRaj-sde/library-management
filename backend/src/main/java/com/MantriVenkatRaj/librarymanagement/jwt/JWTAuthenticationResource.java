package com.MantriVenkatRaj.librarymanagement.jwt;

import com.MantriVenkatRaj.librarymanagement.signup.SignUpRequest;
import com.MantriVenkatRaj.librarymanagement.signup.SignUpService;
import jakarta.validation.Valid;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.security.provisioning.JdbcUserDetailsManager;
import org.springframework.security.provisioning.UserDetailsManager;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.stream.Collectors;

@RestController
public class JWTAuthenticationResource {
    private final JwtEncoder jwtEncoder;
    //private final UserDetailsManager userDetailsManager;
    private final BCryptPasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final SignUpService signUpService;
    public JWTAuthenticationResource(JwtEncoder jwtEncoder, BCryptPasswordEncoder passwordEncoder, AuthenticationManager authenticationManager, SignUpService signUpService) {
        this.jwtEncoder = jwtEncoder;
        //this.userDetailsManager = userDetailsManager;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.signUpService = signUpService;
    }
    @GetMapping("/")
    public String StatusCheck(){
        return "Status : Up";
    }

    @PostMapping("/authenticate")
    public JwtResponse authenticate(@RequestBody Request request){
        // Authenticate the user
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.username(),
                        request.password()
                )
        );
        return new JwtResponse(createToken(authentication));
    }


    @PostMapping("/signup")   // final URL: /auth/signup
    public String signup(@Valid @RequestBody SignUpRequest request) {
        signUpService.registerUser(request);
        return "User registered successfully!";
    }

    private String createToken(Authentication authentication) {
        var claims=JwtClaimsSet
                .builder()
                .issuer("self")
                .issuedAt(Instant.now())
                .expiresAt(Instant.now().plusSeconds(1800))
                .subject(authentication.getName())
                .claim("scope",createScope(authentication))
                .build();

        JwtEncoderParameters parameters=JwtEncoderParameters.from(claims);
        return jwtEncoder.encode(parameters).getTokenValue();
    }

    private String createScope(Authentication authentication) {
        return authentication
                .getAuthorities()
                .stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.joining(" "));
    }

    record Request(String username, String password) {}
    record JwtResponse(String token){}
}
