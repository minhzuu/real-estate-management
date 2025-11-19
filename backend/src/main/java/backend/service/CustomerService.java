package backend.service;

import backend.dto.request.AssignCustomerRequest;
import backend.dto.request.CustomerCreationRequest;
import backend.dto.request.CustomerUpdateRequest;
import backend.dto.response.CustomerResponse;
import backend.dto.response.TransactionResponse;
import java.util.List;

public interface CustomerService {
    CustomerResponse createCustomer(CustomerCreationRequest request);
    CustomerResponse updateCustomer(Long id, CustomerUpdateRequest request);
    List<CustomerResponse> getAllCustomers();
    CustomerResponse getCustomerById(Long id);
    void deleteCustomer(Long id);
    
    // Assignment methods
    CustomerResponse assignStaffToCustomer(Long customerId, List<Long> staffIds);
    void unassignStaffFromCustomer(Long customerId, Long staffId);
    List<CustomerResponse> getCustomersByStaffId(Long staffId);
    List<CustomerResponse> searchCustomers(String keyword);
    
    // New methods for authorization
    List<CustomerResponse> getMyCustomers();
    List<CustomerResponse> getUnassignedCustomers();
    List<TransactionResponse> getCustomerTransactions(Long customerId);
    List<CustomerResponse> searchMyCustomers(String keyword);
}

