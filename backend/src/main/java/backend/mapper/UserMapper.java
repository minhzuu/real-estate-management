package backend.mapper;

import backend.dto.request.UserCreationRequest;
import backend.dto.request.UserUpdateRequest;
import backend.dto.response.UserResponse;
import backend.entity.Role;
import backend.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface UserMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "role", expression = "java(mapRoleIdToRole(request.getRoleId()))")
    @Mapping(target = "assignedBuildings", ignore = true)
    @Mapping(target = "transactions", ignore = true)
    User toUser(UserCreationRequest request);

    @Mapping(target = "roleId", source = "role.id")
    @Mapping(target = "roleName", source = "role.name")
    UserResponse toUserResponse(User user);

    @Mapping(target = "role", ignore = true)  // Handle role separately in service
    @Mapping(target = "password", ignore = true)  // Handle password separately in service
    @Mapping(target = "username", ignore = true)  // Username cannot be changed
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "assignedBuildings", ignore = true)
    @Mapping(target = "transactions", ignore = true)
    void updateUser(@MappingTarget User user, UserUpdateRequest request);

    // Helper for mapping roleId -> Role entity reference with only id set
    default Role mapRoleIdToRole(Long roleId) {
        if (roleId == null) {
            return null;
        }
        Role role = new Role();
        role.setId(roleId);
        return role;
    }
}
