package backend.controller;

import backend.dto.response.ApiResponse;
import backend.dto.response.PublicBuildingResponse;
import backend.service.BuildingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/public/buildings")
@RequiredArgsConstructor
public class PublicBuildingController {

    private final BuildingService buildingService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<PublicBuildingResponse>>> getAllBuildings() {
        List<PublicBuildingResponse> buildings = buildingService.getAllPublicBuildings();
        return ResponseEntity.ok(
                ApiResponse.<List<PublicBuildingResponse>>builder()
                        .result(buildings)
                        .message("Get all buildings successfully")
                        .build());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PublicBuildingResponse>> getBuildingById(@PathVariable Long id) {
        PublicBuildingResponse response = buildingService.getPublicBuildingById(id);
        return ResponseEntity.ok(
                ApiResponse.<PublicBuildingResponse>builder()
                        .result(response)
                        .message("Get building details successfully")
                        .build());
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<PublicBuildingResponse>>> searchBuildings(
            @RequestParam String keyword) {
        List<PublicBuildingResponse> buildings = buildingService.searchPublicBuildings(keyword);
        return ResponseEntity.ok(
                ApiResponse.<List<PublicBuildingResponse>>builder()
                        .result(buildings)
                        .message("Search buildings successfully")
                        .build());
    }
}

