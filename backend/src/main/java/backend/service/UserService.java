package backend.service;

import backend.dto.request.UserCreationRequest;
import backend.dto.request.UserUpdateRequest;
import backend.dto.response.UserResponse;

import java.util.List;

public interface UserService {
    UserResponse createUser(UserCreationRequest request);
    UserResponse updateUser(Long id, UserUpdateRequest request);
    List<UserResponse> getAllUsers();
    UserResponse getUserById(Long id);
    void deleteUser(Long id);
    UserResponse getMyInfo();
}



