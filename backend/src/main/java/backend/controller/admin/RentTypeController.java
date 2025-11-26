package backend.controller.admin;

import backend.dto.request.AddRentTypeToBuildingRequest;
import backend.dto.request.RentTypeCreationRequest;
import backend.dto.request.RentTypeUpdateRequest;
import backend.dto.response.ApiResponse;
import backend.dto.response.RentTypeResponse;
import backend.service.RentTypeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/renttypes")
@RequiredArgsConstructor
@PreAuthorize("hasRole('Admin')")
public class RentTypeController {
    
    private final RentTypeService rentTypeService;

    @PostMapping
    public ResponseEntity<ApiResponse<RentTypeResponse>> createRentType(
            @Valid @RequestBody RentTypeCreationRequest request) {
        RentTypeResponse response = rentTypeService.createRentType(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.<RentTypeResponse>builder()
                        .result(response)
                        .message("Rent type created successfully")
                        .build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<RentTypeResponse>> updateRentType(
            @PathVariable Long id,
            @Valid @RequestBody RentTypeUpdateRequest request) {
        RentTypeResponse response = rentTypeService.updateRentType(id, request);
        return ResponseEntity.ok(
                ApiResponse.<RentTypeResponse>builder()
                        .result(response)
                        .message("Rent type updated successfully")
                        .build());
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<RentTypeResponse>>> getAllRentTypes() {
        List<RentTypeResponse> rentTypes = rentTypeService.getAllRentTypes();
        return ResponseEntity.ok(
                ApiResponse.<List<RentTypeResponse>>builder()
                        .result(rentTypes)
                        .message("Get all rent types successfully")
                        .build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteRentType(@PathVariable Long id) {
        rentTypeService.deleteRentType(id);
        return ResponseEntity.ok(
                ApiResponse.<Void>builder()
                        .message("Rent type deleted successfully")
                        .build());
    }
    @GetMapping("/{id}/renttypes")
    public ResponseEntity<ApiResponse<List<RentTypeResponse>>> getBuildingRentTypes(
            @PathVariable Long id) {
        List<RentTypeResponse> rentTypes = rentTypeService.getRentTypesByBuildingId(id);
        return ResponseEntity.ok(
                ApiResponse.<List<RentTypeResponse>>builder()
                        .result(rentTypes)
                        .message("Get building rent types successfully")
                        .build());
    }

    @PostMapping("/{id}/renttypes")
    public ResponseEntity<ApiResponse<List<RentTypeResponse>>> addRentTypesToBuilding(
            @PathVariable Long id,
            @Valid @RequestBody AddRentTypeToBuildingRequest request) {
        List<RentTypeResponse> rentTypes = rentTypeService.addRentTypesToBuilding(
                id, 
                request.getRentTypeIds().stream().toList()
        );
        return ResponseEntity.ok(
                ApiResponse.<List<RentTypeResponse>>builder()
                        .result(rentTypes)
                        .message("Rent types added to building successfully")
                        .build());
    }
}

