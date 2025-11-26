package backend.controller.admin;

import backend.dto.request.AssignBuildingStaffRequest;
import backend.dto.request.BuildingCreationRequest;
import backend.dto.request.BuildingUpdateRequest;
import backend.dto.response.ApiResponse;
import backend.dto.response.BuildingResponse;
import backend.dto.response.RentAreaResponse;
import backend.service.BuildingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/buildings")
@RequiredArgsConstructor
@PreAuthorize("hasRole('Admin')")
public class BuildingController {

    private final BuildingService buildingService;

    @PostMapping
    public ResponseEntity<ApiResponse<BuildingResponse>> createBuilding(
            @Valid @RequestBody BuildingCreationRequest request) {
        BuildingResponse response = buildingService.createBuilding(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.<BuildingResponse>builder()
                        .result(response)
                        .message("Building created successfully")
                        .build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<BuildingResponse>> updateBuilding(
            @PathVariable Long id,
            @Valid @RequestBody BuildingUpdateRequest request) {
        BuildingResponse response = buildingService.updateBuilding(id, request);
        return ResponseEntity.ok(
                ApiResponse.<BuildingResponse>builder()
                        .result(response)
                        .message("Building updated successfully")
                        .build());
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<BuildingResponse>>> getAllBuildings() {
        List<BuildingResponse> buildings = buildingService.getAllBuildings();
        return ResponseEntity.ok(
                ApiResponse.<List<BuildingResponse>>builder()
                        .result(buildings)
                        .message("Get all buildings successfully")
                        .build());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<BuildingResponse>> getBuildingById(@PathVariable Long id) {
        BuildingResponse response = buildingService.getBuildingById(id);
        return ResponseEntity.ok(
                ApiResponse.<BuildingResponse>builder()
                        .result(response)
                        .message("Get building successfully")
                        .build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteBuilding(@PathVariable Long id) {
        buildingService.deleteBuilding(id);
        return ResponseEntity.ok(
                ApiResponse.<Void>builder()
                        .message("Building deleted successfully")
                        .build());
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<BuildingResponse>>> searchBuildings(
            @RequestParam String keyword) {
        List<BuildingResponse> buildings = buildingService.searchBuildings(keyword);
        return ResponseEntity.ok(
                ApiResponse.<List<BuildingResponse>>builder()
                        .result(buildings)
                        .message("Search buildings successfully")
                        .build());
    }

    @GetMapping("/{id}/rentareas")
    public ResponseEntity<ApiResponse<List<RentAreaResponse>>> getBuildingRentAreas(
            @PathVariable Long id) {
        List<RentAreaResponse> rentAreas = buildingService.getBuildingRentAreas(id);
        return ResponseEntity.ok(
                ApiResponse.<List<RentAreaResponse>>builder()
                        .result(rentAreas)
                        .message("Get building rent areas successfully")
                        .build());
    }

    @PostMapping("/{id}/staff")
    public ResponseEntity<ApiResponse<BuildingResponse>> assignStaffToBuilding(
            @PathVariable Long id,
            @Valid @RequestBody AssignBuildingStaffRequest request) {
        // Set the building ID from path variable
        request.setBuildingId(id);
        BuildingResponse response = buildingService.assignStaffToBuilding(request);
        return ResponseEntity.ok(
                ApiResponse.<BuildingResponse>builder()
                        .result(response)
                        .message("Staff assigned to building successfully")
                        .build());
    }
}

