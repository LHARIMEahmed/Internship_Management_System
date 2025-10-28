package com.example.security;

import com.example.models.Utilisateur;
import com.example.repositories.UtilisateurRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UtilisateurRepository utilisateurRepository;

    @Autowired
    public CustomUserDetailsService(UtilisateurRepository utilisateurRepository) {
        this.utilisateurRepository = utilisateurRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Utilisateur utilisateur = utilisateurRepository.findByUsername(username);
        
        if (utilisateur == null) {
            throw new UsernameNotFoundException("Utilisateur non trouvé avec le username: " + username);
        }
        
        return new User(
            utilisateur.getUsername(),
            utilisateur.getPassword(),
            List.of(new SimpleGrantedAuthority(utilisateur.getRole()))
        );
    }
}