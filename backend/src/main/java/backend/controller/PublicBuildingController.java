package backend.controller;

import backend.dto.request.ConsultRequestDto;
import backend.dto.response.ApiResponse;
import backend.dto.response.ConsultRequestResponse;
import backend.dto.response.PublicBuildingResponse;
import backend.service.BuildingService;
import backend.service.ConsultRequestService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/public/buildings")
@RequiredArgsConstructor
public class PublicBuildingController {

    private final BuildingService buildingService;
    private final ConsultRequestService consultRequestService;

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

    @PostMapping("/{id}/request-consult")
    public ResponseEntity<ApiResponse<ConsultRequestResponse>> requestConsult(
            @PathVariable Long id,
            @Valid @RequestBody ConsultRequestDto request) {
        ConsultRequestResponse response = consultRequestService.createConsultRequest(id, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.<ConsultRequestResponse>builder()
                        .result(response)
                        .message("Consult request submitted successfully")
                        .build());
    }
}

