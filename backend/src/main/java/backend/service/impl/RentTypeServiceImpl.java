package backend.service.impl;

import backend.dto.request.RentTypeCreationRequest;
import backend.dto.request.RentTypeUpdateRequest;
import backend.dto.response.RentTypeResponse;
import backend.entity.Building;
import backend.entity.RentType;
import backend.exception.AppException;
import backend.exception.ErrorCode;
import backend.mapper.RentTypeMapper;
import backend.repository.BuildingRepository;
import backend.repository.RentTypeRepository;
import backend.service.RentTypeService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class RentTypeServiceImpl implements RentTypeService {

    private final RentTypeRepository rentTypeRepository;
    private final RentTypeMapper rentTypeMapper;
    private final BuildingRepository buildingRepository;

    @Override
    @Transactional
    public RentTypeResponse createRentType(RentTypeCreationRequest request) {
        log.info("Creating rent type: {}", request.getName());

        // Check if rent type name already exists
        if (rentTypeRepository.existsByName(request.getName())) {
            throw new AppException(ErrorCode.RENT_TYPE_NAME_EXISTS);
        }

        RentType rentType = rentTypeMapper.toRentType(request);
        RentType savedRentType = rentTypeRepository.save(rentType);

        log.info("Rent type created successfully with ID: {}", savedRentType.getId());
        return rentTypeMapper.toRentTypeResponse(savedRentType);
    }

    @Override
    @Transactional
    public RentTypeResponse updateRentType(Long id, RentTypeUpdateRequest request) {
        log.info("Updating rent type with ID: {}", id);

        RentType rentType = rentTypeRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.RENT_TYPE_NOT_EXISTS));

        // Check if name is being changed and if it already exists
        if (!request.getName().equals(rentType.getName())) {
            if (rentTypeRepository.existsByName(request.getName())) {
                throw new AppException(ErrorCode.RENT_TYPE_NAME_EXISTS);
            }
        }

        rentTypeMapper.updateRentType(rentType, request);
        RentType updatedRentType = rentTypeRepository.save(rentType);

        log.info("Rent type updated successfully with ID: {}", updatedRentType.getId());
        return rentTypeMapper.toRentTypeResponse(updatedRentType);
    }

    @Override
    public List<RentTypeResponse> getAllRentTypes() {
        log.info("Getting all rent types");
        List<RentType> rentTypes = rentTypeRepository.findAll();
        return rentTypes.stream()
                .map(rentTypeMapper::toRentTypeResponse)
                .collect(Collectors.toList());
    }

    @Override
    public RentTypeResponse getRentTypeById(Long id) {
        log.info("Getting rent type with ID: {}", id);
        RentType rentType = rentTypeRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.RENT_TYPE_NOT_EXISTS));
        return rentTypeMapper.toRentTypeResponse(rentType);
    }

    @Override
    @Transactional
    public void deleteRentType(Long id) {
        log.info("Deleting rent type with ID: {}", id);

        RentType rentType = rentTypeRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.RENT_TYPE_NOT_EXISTS));

        // Clear relationships with buildings
        rentType.getBuildings().forEach(building -> building.getRentTypes().remove(rentType));

        rentTypeRepository.delete(rentType);
        log.info("Rent type deleted successfully with ID: {}", id);
    }

    @Override
    public List<RentTypeResponse> getRentTypesByBuildingId(Long buildingId) {
        log.info("Getting rent types for building with ID: {}", buildingId);

        // Verify building exists
        if (!buildingRepository.existsById(buildingId)) {
            throw new AppException(ErrorCode.BUILDING_NOT_EXISTS);
        }

        List<RentType> rentTypes = rentTypeRepository.findAllByBuildings_Id(buildingId);
        return rentTypes.stream()
                .map(rentTypeMapper::toRentTypeResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public List<RentTypeResponse> addRentTypesToBuilding(Long buildingId, List<Long> rentTypeIds) {
        log.info("Adding rent types to building with ID: {}", buildingId);

        Building building = buildingRepository.findById(buildingId)
                .orElseThrow(() -> new AppException(ErrorCode.BUILDING_NOT_EXISTS));

        // Get all rent types
        List<RentType> rentTypes = rentTypeIds.stream()
                .map(id -> rentTypeRepository.findById(id)
                        .orElseThrow(() -> new AppException(ErrorCode.RENT_TYPE_NOT_EXISTS)))
                .collect(Collectors.toList());

        // Add rent types to building (only new ones)
        rentTypes.forEach(rentType -> {
            if (!building.getRentTypes().contains(rentType)) {
                building.getRentTypes().add(rentType);
                rentType.getBuildings().add(building);
            }
        });

        buildingRepository.save(building);

        log.info("Rent types added successfully to building with ID: {}", buildingId);
        return getRentTypesByBuildingId(buildingId);
    }
}

