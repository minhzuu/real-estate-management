package backend.service;

import backend.dto.request.AssignBuildingStaffRequest;
import backend.dto.request.BuildingCreationRequest;
import backend.dto.request.BuildingUpdateRequest;
import backend.dto.response.BuildingResponse;
import backend.dto.response.RentAreaResponse;

import java.util.List;

public interface BuildingService {
    BuildingResponse createBuilding(BuildingCreationRequest request);
    BuildingResponse updateBuilding(Long id, BuildingUpdateRequest request);
    List<BuildingResponse> getAllBuildings();
    BuildingResponse getBuildingById(Long id);
    void deleteBuilding(Long id);
    List<BuildingResponse> searchBuildings(String keyword);
    List<RentAreaResponse> getBuildingRentAreas(Long id);
    BuildingResponse assignStaffToBuilding(AssignBuildingStaffRequest request);
}

