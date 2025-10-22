package backend.service.impl;

import backend.dto.request.AssignBuildingStaffRequest;
import backend.dto.request.BuildingCreationRequest;
import backend.dto.request.BuildingUpdateRequest;
import backend.dto.response.BuildingResponse;
import backend.dto.response.RentAreaResponse;
import backend.entity.Building;
import backend.entity.District;
import backend.entity.RentArea;
import backend.entity.RentType;
import backend.entity.User;
import backend.exception.AppException;
import backend.exception.ErrorCode;
import backend.mapper.BuildingMapper;
import backend.repository.BuildingRepository;
import backend.repository.DistrictRepository;
import backend.repository.RentAreaRepository;
import backend.repository.RentTypeRepository;
import backend.repository.UserRepository;
import backend.service.BuildingService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class BuildingServiceImpl implements BuildingService {

    private final BuildingRepository buildingRepository;
    private final BuildingMapper buildingMapper;
    private final DistrictRepository districtRepository;
    private final RentTypeRepository rentTypeRepository;
    private final RentAreaRepository rentAreaRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public BuildingResponse createBuilding(BuildingCreationRequest request) {
        log.info("Creating building: {}", request.getName());

        // Check if building name already exists
        if (buildingRepository.existsByName(request.getName())) {
            throw new AppException(ErrorCode.BUILDING_NAME_EXISTS);
        }

        // Get district
        District district = districtRepository.findById(request.getDistrictId())
                .orElseThrow(() -> new AppException(ErrorCode.DISTRICT_NOT_EXISTS));

        // Create building
        Building building = buildingMapper.toBuilding(request);
        building.setDistrict(district);
        building.setCreatedBy(getCurrentUsername());

        // Handle rent types if provided
        if (request.getRentTypeIds() != null && !request.getRentTypeIds().isEmpty()) {
            Set<RentType> rentTypes = request.getRentTypeIds().stream()
                    .map(id -> rentTypeRepository.findById(id)
                            .orElseThrow(() -> new AppException(ErrorCode.RENT_TYPE_NOT_EXISTS)))
                    .collect(Collectors.toSet());
            building.setRentTypes(rentTypes);
        }

        // Save building first to get ID
        Building savedBuilding = buildingRepository.save(building);

        // Handle rent areas if provided
        if (request.getRentAreaValues() != null && !request.getRentAreaValues().isEmpty()) {
            Set<RentArea> rentAreas = request.getRentAreaValues().stream()
                    .map(value -> RentArea.builder()
                            .value(value)
                            .building(savedBuilding)
                            .build())
                    .collect(Collectors.toSet());
            rentAreaRepository.saveAll(rentAreas);
            savedBuilding.setRentAreas(new HashSet<>(rentAreas));
        }

        log.info("Building created successfully with ID: {}", savedBuilding.getId());
        return buildingMapper.toBuildingResponse(savedBuilding);
    }

    @Override
    @Transactional
    public BuildingResponse updateBuilding(Long id, BuildingUpdateRequest request) {
        log.info("Updating building with ID: {}", id);

        Building building = buildingRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.BUILDING_NOT_EXISTS));

        // Check if name is being changed and if it already exists
        if (request.getName() != null && !request.getName().equals(building.getName())) {
            if (buildingRepository.existsByName(request.getName())) {
                throw new AppException(ErrorCode.BUILDING_NAME_EXISTS);
            }
        }

        // Update basic fields
        buildingMapper.updateBuilding(building, request);
        building.setModifiedBy(getCurrentUsername());

        // Update district if provided
        if (request.getDistrictId() != null) {
            District district = districtRepository.findById(request.getDistrictId())
                    .orElseThrow(() -> new AppException(ErrorCode.DISTRICT_NOT_EXISTS));
            building.setDistrict(district);
        }

        // Update rent types if provided
        if (request.getRentTypeIds() != null) {
            Set<RentType> rentTypes = request.getRentTypeIds().stream()
                    .map(rentTypeId -> rentTypeRepository.findById(rentTypeId)
                            .orElseThrow(() -> new AppException(ErrorCode.RENT_TYPE_NOT_EXISTS)))
                    .collect(Collectors.toSet());
            building.setRentTypes(rentTypes);
        }

        // Update rent areas if provided
        if (request.getRentAreaValues() != null) {
            // Delete existing rent areas
            rentAreaRepository.deleteAll(building.getRentAreas());
            building.getRentAreas().clear();

            // Create new rent areas
            Set<RentArea> newRentAreas = request.getRentAreaValues().stream()
                    .map(value -> RentArea.builder()
                            .value(value)
                            .building(building)
                            .build())
                    .collect(Collectors.toSet());
            rentAreaRepository.saveAll(newRentAreas);
            building.setRentAreas(new HashSet<>(newRentAreas));
        }

        Building updatedBuilding = buildingRepository.save(building);
        log.info("Building updated successfully with ID: {}", updatedBuilding.getId());
        return buildingMapper.toBuildingResponse(updatedBuilding);
    }

    @Override
    public List<BuildingResponse> getAllBuildings() {
        log.info("Getting all buildings");
        List<Building> buildings = buildingRepository.findAll();
        return buildings.stream()
                .map(buildingMapper::toBuildingResponse)
                .collect(Collectors.toList());
    }

    @Override
    public BuildingResponse getBuildingById(Long id) {
        log.info("Getting building with ID: {}", id);
        Building building = buildingRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.BUILDING_NOT_EXISTS));
        return buildingMapper.toBuildingResponse(building);
    }

    @Override
    @Transactional
    public void deleteBuilding(Long id) {
        log.info("Deleting building with ID: {}", id);

        Building building = buildingRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.BUILDING_NOT_EXISTS));

        // Delete rent areas first
        rentAreaRepository.deleteAll(building.getRentAreas());

        // Clear relationships
        building.getRentTypes().clear();
        building.getAssignedUsers().forEach(user -> user.getAssignedBuildings().remove(building));

        buildingRepository.delete(building);
        log.info("Building deleted successfully with ID: {}", id);
    }

    @Override
    public List<BuildingResponse> searchBuildings(String keyword) {
        log.info("Searching buildings with keyword: {}", keyword);
        List<Building> buildings = buildingRepository.findAllByNameContainingIgnoreCase(keyword);
        return buildings.stream()
                .map(buildingMapper::toBuildingResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<RentAreaResponse> getBuildingRentAreas(Long id) {
        log.info("Getting rent areas for building with ID: {}", id);

        // Verify building exists
        if (!buildingRepository.existsById(id)) {
            throw new AppException(ErrorCode.BUILDING_NOT_EXISTS);
        }

        List<RentArea> rentAreas = rentAreaRepository.findAllByBuilding_Id(id);
        return rentAreas.stream()
                .map(rentArea -> RentAreaResponse.builder()
                        .id(rentArea.getId())
                        .value(rentArea.getValue())
                        .build())
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public BuildingResponse assignStaffToBuilding(AssignBuildingStaffRequest request) {
        log.info("Assigning staff to building with ID: {}", request.getBuildingId());

        Building building = buildingRepository.findById(request.getBuildingId())
                .orElseThrow(() -> new AppException(ErrorCode.BUILDING_NOT_EXISTS));

        // Get all staff users
        Set<User> staffUsers = request.getStaffIds().stream()
                .map(staffId -> userRepository.findById(staffId)
                        .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTS)))
                .collect(Collectors.toSet());

        // Clear existing assignments and set new ones
        building.getAssignedUsers().clear();
        building.getAssignedUsers().addAll(staffUsers);

        // Update the reverse relationship
        staffUsers.forEach(user -> user.getAssignedBuildings().add(building));

        Building updatedBuilding = buildingRepository.save(building);
        log.info("Staff assigned successfully to building with ID: {}", request.getBuildingId());
        return buildingMapper.toBuildingResponse(updatedBuilding);
    }

    private String getCurrentUsername() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()) {
            return authentication.getName();
        }
        return "system";
    }
}

