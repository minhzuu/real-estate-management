package backend.controller.admin;

import backend.dto.response.ApiResponse;
import backend.dto.response.ConsultRequestResponse;
import backend.entity.ConsultRequest;
import backend.service.ConsultRequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/consult-requests")
@RequiredArgsConstructor
@PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_MANAGER')")
public class ConsultRequestController {

    private final ConsultRequestService consultRequestService;

    // GET /api/admin/consult-requests — Xem tất cả yêu cầu tư vấn
    @GetMapping
    public ApiResponse<List<ConsultRequestResponse>> getAllConsultRequests() {
        return ApiResponse.<List<ConsultRequestResponse>>builder()
                .result(consultRequestService.getAllConsultRequests())
                .message("Get all consult requests successfully")
                .build();
    }

    // GET /api/admin/consult-requests/building/:id — Theo tòa nhà
    @GetMapping("/building/{buildingId}")
    public ApiResponse<List<ConsultRequestResponse>> getByBuilding(@PathVariable Long buildingId) {
        return ApiResponse.<List<ConsultRequestResponse>>builder()
                .result(consultRequestService.getConsultRequestsByBuilding(buildingId))
                .message("Get consult requests by building successfully")
                .build();
    }

    // PATCH /api/admin/consult-requests/:id/status — Cập nhật trạng thái
    @PatchMapping("/{id}/status")
    public ApiResponse<ConsultRequestResponse> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        ConsultRequest.ConsultStatus status = ConsultRequest.ConsultStatus.valueOf(body.get("status"));
        return ApiResponse.<ConsultRequestResponse>builder()
                .result(consultRequestService.updateStatus(id, status))
                .message("Status updated successfully")
                .build();
    }
}
