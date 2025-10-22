package backend.mapper;

import backend.dto.request.BuildingCreationRequest;
import backend.dto.request.BuildingUpdateRequest;
import backend.dto.response.BuildingResponse;
import backend.entity.Building;
import backend.entity.District;
import backend.entity.RentArea;
import backend.entity.RentType;
import backend.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.util.Set;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface BuildingMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdDate", ignore = true)
    @Mapping(target = "modifiedDate", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "modifiedBy", ignore = true)
    @Mapping(target = "district", ignore = true)
    @Mapping(target = "rentAreas", ignore = true)
    @Mapping(target = "rentTypes", ignore = true)
    @Mapping(target = "assignedUsers", ignore = true)
    Building toBuilding(BuildingCreationRequest request);

    @Mapping(target = "district", expression = "java(mapDistrictToInfo(building.getDistrict()))")
    @Mapping(target = "rentTypes", expression = "java(mapRentTypesToInfo(building.getRentTypes()))")
    @Mapping(target = "rentAreas", expression = "java(mapRentAreasToInfo(building.getRentAreas()))")
    @Mapping(target = "assignedStaff", expression = "java(mapUsersToStaffInfo(building.getAssignedUsers()))")
    BuildingResponse toBuildingResponse(Building building);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdDate", ignore = true)
    @Mapping(target = "modifiedDate", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "modifiedBy", ignore = true)
    @Mapping(target = "district", ignore = true)
    @Mapping(target = "rentAreas", ignore = true)
    @Mapping(target = "rentTypes", ignore = true)
    @Mapping(target = "assignedUsers", ignore = true)
    void updateBuilding(@MappingTarget Building building, BuildingUpdateRequest request);

    // Helper methods
    default BuildingResponse.DistrictInfo mapDistrictToInfo(District district) {
        if (district == null) {
            return null;
        }
        return BuildingResponse.DistrictInfo.builder()
                .id(district.getId())
                .name(district.getName())
                .build();
    }

    default Set<BuildingResponse.RentTypeInfo> mapRentTypesToInfo(Set<RentType> rentTypes) {
        if (rentTypes == null) {
            return Set.of();
        }
        return rentTypes.stream()
                .map(rentType -> BuildingResponse.RentTypeInfo.builder()
                        .id(rentType.getId())
                        .name(rentType.getName())
                        .build())
                .collect(Collectors.toSet());
    }

    default Set<BuildingResponse.RentAreaInfo> mapRentAreasToInfo(Set<RentArea> rentAreas) {
        if (rentAreas == null) {
            return Set.of();
        }
        return rentAreas.stream()
                .map(rentArea -> BuildingResponse.RentAreaInfo.builder()
                        .id(rentArea.getId())
                        .value(rentArea.getValue())
                        .build())
                .collect(Collectors.toSet());
    }

    default Set<BuildingResponse.StaffInfo> mapUsersToStaffInfo(Set<User> users) {
        if (users == null) {
            return Set.of();
        }
        return users.stream()
                .map(user -> BuildingResponse.StaffInfo.builder()
                        .id(user.getId())
                        .fullname(user.getFullname())
                        .username(user.getUsername())
                        .build())
                .collect(Collectors.toSet());
    }
}

