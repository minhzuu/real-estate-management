package backend.controller;

import backend.dto.response.ApiResponse;
import backend.entity.District;
import backend.repository.DistrictRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/public/districts")
@RequiredArgsConstructor
public class DistrictController {

    private final DistrictRepository districtRepository;

    // Public endpoint — used in building creation forms (frontend dropdown)
    @GetMapping
    public ApiResponse<List<District>> getAllDistricts() {
        List<District> districts = districtRepository.findAll();
        return ApiResponse.<List<District>>builder()
                .result(districts)
                .message("Get all districts successfully")
                .build();
    }
}
