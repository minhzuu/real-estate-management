package backend.controller;

import backend.dto.request.AssignCustomerRequest;
import backend.dto.request.CustomerCreationRequest;
import backend.dto.request.CustomerUpdateRequest;
import backend.dto.response.ApiResponse;
import backend.dto.response.CustomerResponse;
import backend.service.CustomerService;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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

    @PostMapping
    public ResponseEntity<ApiResponse<CustomerResponse>> createCustomer(
            @Valid @RequestBody CustomerCreationRequest request) {
        CustomerResponse response = customerService.createCustomer(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.<CustomerResponse>builder()
                        .result(response)
                        .message("Customer created successfully")
                        .build());
    }

    @PutMapping("/{id}")
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

    @GetMapping
    public ResponseEntity<ApiResponse<List<CustomerResponse>>> getAllCustomers() {
        List<CustomerResponse> customers = customerService.getAllCustomers();
        return ResponseEntity.ok(
                ApiResponse.<List<CustomerResponse>>builder()
                        .result(customers)
                        .message("Get all customers successfully")
                        .build());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CustomerResponse>> getCustomerById(@PathVariable Long id) {
        CustomerResponse response = customerService.getCustomerById(id);
        return ResponseEntity.ok(
                ApiResponse.<CustomerResponse>builder()
                        .result(response)
                        .message("Get customer successfully")
                        .build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCustomer(@PathVariable Long id) {
        customerService.deleteCustomer(id);
        return ResponseEntity.ok(
                ApiResponse.<Void>builder()
                        .message("Customer deleted successfully")
                        .build());
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<CustomerResponse>>> searchCustomers(
            @RequestParam String keyword) {
        List<CustomerResponse> customers = customerService.searchCustomers(keyword);
        return ResponseEntity.ok(
                ApiResponse.<List<CustomerResponse>>builder()
                        .result(customers)
                        .message("Search customers successfully")
                        .build());
    }

    @PostMapping("/assign")
    public ResponseEntity<ApiResponse<CustomerResponse>> assignStaffToCustomer(
            @Valid @RequestBody AssignCustomerRequest request) {
        CustomerResponse response = customerService.assignStaffToCustomer(request);
        return ResponseEntity.ok(
                ApiResponse.<CustomerResponse>builder()
                        .result(response)
                        .message("Staff assigned to customer successfully")
                        .build());
    }

    @DeleteMapping("/{customerId}/staff/{staffId}")
    public ResponseEntity<ApiResponse<Void>> unassignStaffFromCustomer(
            @PathVariable Long customerId,
            @PathVariable Long staffId) {
        customerService.unassignStaffFromCustomer(customerId, staffId);
        return ResponseEntity.ok(
                ApiResponse.<Void>builder()
                        .message("Staff unassigned from customer successfully")
                        .build());
    }

    @GetMapping("/staff/{staffId}")
    public ResponseEntity<ApiResponse<List<CustomerResponse>>> getCustomersByStaffId(
            @PathVariable Long staffId) {
        List<CustomerResponse> customers = customerService.getCustomersByStaffId(staffId);
        return ResponseEntity.ok(
                ApiResponse.<List<CustomerResponse>>builder()
                        .result(customers)
                        .message("Get customers by staff successfully")
                        .build());
    }
}

