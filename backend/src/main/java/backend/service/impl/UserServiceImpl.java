package backend.service.impl;

import backend.dto.request.UserCreationRequest;
import backend.dto.request.UserUpdateRequest;
import backend.dto.response.UserResponse;
import backend.entity.Role;
import backend.entity.User;
import backend.exception.AppException;
import backend.exception.ErrorCode;
import backend.mapper.UserMapper;
import backend.repository.RoleRepository;
import backend.repository.UserRepository;
import backend.service.UserService;
import jakarta.transaction.Transactional;

import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public UserResponse createUser(UserCreationRequest request) {
        // Check if username already exists
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new AppException(ErrorCode.USER_EXISTS);
        }

        // Validate role existence
        Role role = roleRepository.findById(request.getRoleId())
                .orElseThrow(() -> new AppException(ErrorCode.ROLE_NOT_EXISTS));

        User user = userMapper.toUser(request);
        // Ensure we use the fully loaded Role
        user.setRole(role);
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        User saved = userRepository.save(user);
        return userMapper.toUserResponse(saved);
    }

    @Override
    @Transactional
    public UserResponse updateUser(Long id, UserUpdateRequest request) {
        // Find existing user
        User user = userRepository.findById(id).orElseThrow(
                () ->  new AppException(ErrorCode.USER_NOT_EXISTS));
        
        // Validate and set role if provided
        if (request.getRoleId() != null) {
            Role role = roleRepository.findById(request.getRoleId())
                    .orElseThrow(() -> new AppException(ErrorCode.ROLE_NOT_EXISTS));
            user.setRole(role);
        }
        
        // Update user fields (except role which we handled above)
        userMapper.updateUser(user, request);
        
        // Only update password if provided (not null and not empty)
        if (request.getPassword() != null && !request.getPassword().trim().isEmpty()) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }
        
        User saved = userRepository.save(user);
        return userMapper.toUserResponse(saved);
    }

    @Override
    public List<UserResponse> getAllUsers() {
        List<User> users = userRepository.findAll();
        return users.stream()
                .map(userMapper::toUserResponse)
                .toList();
    }

    @Override
    public UserResponse getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTS));
        return userMapper.toUserResponse(user);
    }

    @Override
    @Transactional
    public void deleteUser(Long id) {
        // Check if user exists before deleting
        if (!userRepository.existsById(id)) {
            throw new AppException(ErrorCode.USER_NOT_EXISTS);
        }
        userRepository.deleteById(id);
    }

    @Override
    public UserResponse getMyInfo() {
        // TODO: Implement after adding Spring Security authentication
        // Get current authenticated user from SecurityContextHolder
        // var authentication = SecurityContextHolder.getContext().getAuthentication();
        // String username = authentication.getName();
        // User user = userRepository.findByUsername(username)
        //         .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTS));
        // return userMapper.toUserResponse(user);
        throw new UnsupportedOperationException("Not implemented yet. Requires authentication setup.");
    }


}



