package backend.controller;

import backend.dto.request.AssignCustomerRequest;
import backend.dto.request.CustomerCreationRequest;
import backend.dto.request.CustomerUpdateRequest;
import backend.dto.response.ApiResponse;
import backend.dto.response.CustomerResponse;
import backend.dto.response.TransactionResponse;
import backend.service.CustomerService;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/customers")
@RequiredArgsConstructor
public class CustomerController {
        
    private final CustomerService customerService;

    // POST /api/customers - Tạo mới (All roles can create)
    @PostMapping
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_MANAGER', 'ROLE_STAFF')")
    public ResponseEntity<ApiResponse<CustomerResponse>> createCustomer(
            @Valid @RequestBody CustomerCreationRequest request) {
        CustomerResponse response = customerService.createCustomer(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.<CustomerResponse>builder()
                        .result(response)
                        .message("Customer created successfully")
                        .build());
    }

    // PUT /api/customers/{id} - Cập nhật (Admin: all, Manager/Staff: own customers)
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_MANAGER', 'ROLE_STAFF')")
    public ResponseEntity<ApiResponse<CustomerResponse>> updateCustomer(
            @PathVariable Long id,
            @Valid @RequestBody CustomerUpdateRequest request) {
        CustomerResponse response = customerService.updateCustomer(id, request);
        return ResponseEntity.ok(
                ApiResponse.<CustomerResponse>builder()
                        .result(response)
                        .message("Customer updated successfully")
                        .build());
    }

    // GET /api/customers - Danh sách (Admin only)
    @GetMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<List<CustomerResponse>>> getAllCustomers() {
        List<CustomerResponse> customers = customerService.getAllCustomers();
        return ResponseEntity.ok(
                ApiResponse.<List<CustomerResponse>>builder()
                        .result(customers)
                        .message("Get all customers successfully")
                        .build());
    }

    // GET /api/customers/{id} - Chi tiết (Admin: all, Manager/Staff: own customers)
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_MANAGER', 'ROLE_STAFF')")
    public ResponseEntity<ApiResponse<CustomerResponse>> getCustomerById(@PathVariable Long id) {
        CustomerResponse response = customerService.getCustomerById(id);
        return ResponseEntity.ok(
                ApiResponse.<CustomerResponse>builder()
                        .result(response)
                        .message("Get customer successfully")
                        .build());
    }

    // DELETE /api/customers/{id} - Xóa (Admin only)
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteCustomer(@PathVariable Long id) {
        customerService.deleteCustomer(id);
        return ResponseEntity.ok(
                ApiResponse.<Void>builder()
                        .message("Customer deleted successfully")
                        .build());
    }

    // GET /api/customers/search?keyword= - Tìm kiếm
    @GetMapping("/search")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_MANAGER', 'ROLE_STAFF')")
    public ResponseEntity<ApiResponse<List<CustomerResponse>>> searchCustomers(
            @RequestParam String keyword) {
        List<CustomerResponse> customers = customerService.searchCustomers(keyword);
        return ResponseEntity.ok(
                ApiResponse.<List<CustomerResponse>>builder()
                        .result(customers)
                        .message("Search customers successfully")
                        .build());
    }

    // GET /api/customers/my-customers - Khách của tôi
    @GetMapping("/my-customers")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_MANAGER', 'ROLE_STAFF')")
    public ResponseEntity<ApiResponse<List<CustomerResponse>>> getMyCustomers() {
        List<CustomerResponse> customers = customerService.getMyCustomers();
        return ResponseEntity.ok(
                ApiResponse.<List<CustomerResponse>>builder()
                        .result(customers)
                        .message("Get my customers successfully")
                        .build());
    }

    // GET /api/customers/unassigned - Khách chưa gán (Admin and Manager only)
    @GetMapping("/unassigned")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_MANAGER')")
    public ResponseEntity<ApiResponse<List<CustomerResponse>>> getUnassignedCustomers() {
        List<CustomerResponse> customers = customerService.getUnassignedCustomers();
        return ResponseEntity.ok(
                ApiResponse.<List<CustomerResponse>>builder()
                        .result(customers)
                        .message("Get unassigned customers successfully")
                        .build());
    }

    // POST /api/customers/{id}/assign - Gán khách cho NV (Admin and Manager only)
    @PostMapping("/{id}/assign")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_MANAGER')")
    public ResponseEntity<ApiResponse<CustomerResponse>> assignStaffToCustomer(
            @PathVariable Long id,
            @RequestBody List<Long> staffIds) {
        CustomerResponse response = customerService.assignStaffToCustomer(id, staffIds);
        return ResponseEntity.ok(
                ApiResponse.<CustomerResponse>builder()
                        .result(response)
                        .message("Staff assigned to customer successfully")
                        .build());
    }

    // DELETE /api/customers/{id}/assign/{uid} - Xóa gán khách (Admin and Manager only)
    @DeleteMapping("/{id}/assign/{uid}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_MANAGER')")
    public ResponseEntity<ApiResponse<Void>> unassignStaffFromCustomer(
            @PathVariable Long id,
            @PathVariable Long uid) {
        customerService.unassignStaffFromCustomer(id, uid);
        return ResponseEntity.ok(
                ApiResponse.<Void>builder()
                        .message("Staff unassigned from customer successfully")
                        .build());
    }

    // GET /api/customers/{id}/transactions - Lịch tương tác
    @GetMapping("/{id}/transactions")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_MANAGER', 'ROLE_STAFF')")
    public ResponseEntity<ApiResponse<List<TransactionResponse>>> getCustomerTransactions(
            @PathVariable Long id) {
        List<TransactionResponse> transactions = customerService.getCustomerTransactions(id);
        return ResponseEntity.ok(
                ApiResponse.<List<TransactionResponse>>builder()
                        .result(transactions)
                        .message("Get customer transactions successfully")
                        .build());
    }
}

