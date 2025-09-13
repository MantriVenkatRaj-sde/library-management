package com.MantriVenkatRaj.librarymanagement.user;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final ModelMapper modelMapper;

    public UserService(UserRepository userRepository, ModelMapper modelMapper) {
        this.userRepository = userRepository;
        this.modelMapper = modelMapper;
    }


    public UserDTO convertToDTO(User user) {
        return modelMapper.map(user, UserDTO.class);
    }

    public List<UserDTO> AllUsersToUserDTO() {
        return userRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .toList(); // Java 16+ (or use Collectors.toList() for older Java)
    }

}
