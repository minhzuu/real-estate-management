package backend.service;

import backend.dto.request.RentTypeCreationRequest;
import backend.dto.request.RentTypeUpdateRequest;
import backend.dto.response.RentTypeResponse;

import java.util.List;

public interface RentTypeService {
    RentTypeResponse createRentType(RentTypeCreationRequest request);
    RentTypeResponse updateRentType(Long id, RentTypeUpdateRequest request);
    List<RentTypeResponse> getAllRentTypes();
    RentTypeResponse getRentTypeById(Long id);
    void deleteRentType(Long id);
    List<RentTypeResponse> getRentTypesByBuildingId(Long buildingId);
    List<RentTypeResponse> addRentTypesToBuilding(Long buildingId, List<Long> rentTypeIds);
}

