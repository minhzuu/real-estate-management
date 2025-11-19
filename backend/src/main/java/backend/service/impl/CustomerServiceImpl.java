package backend.service.impl;

import backend.dto.request.AssignCustomerRequest;
import backend.dto.request.CustomerCreationRequest;
import backend.dto.request.CustomerUpdateRequest;
import backend.dto.response.CustomerResponse;
import backend.dto.response.TransactionResponse;
import backend.entity.Customer;
import backend.entity.Transaction;
import backend.entity.User;
import backend.exception.AppException;
import backend.exception.ErrorCode;
import backend.mapper.CustomerMapper;
import backend.mapper.TransactionMapper;
import backend.repository.CustomerRepository;
import backend.repository.TransactionRepository;
import backend.repository.UserRepository;
import backend.service.CustomerService;
import jakarta.transaction.Transactional;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomerServiceImpl implements CustomerService {

    private final CustomerRepository customerRepository;
    private final UserRepository userRepository;
    private final TransactionRepository transactionRepository;
    private final CustomerMapper customerMapper;
    private final TransactionMapper transactionMapper;

    @Override
    @Transactional
    public CustomerResponse createCustomer(CustomerCreationRequest request) {
        // Check if email already exists
        if (request.getEmail() != null && !request.getEmail().trim().isEmpty()) {
            if (customerRepository.existsByEmail(request.getEmail())) {
                throw new AppException(ErrorCode.CUSTOMER_EMAIL_EXISTS);
            }
        }

        // Check if phone already exists
        if (customerRepository.existsByPhone(request.getPhone())) {
            throw new AppException(ErrorCode.CUSTOMER_PHONE_EXISTS);
        }

        // Get current user and set as creator
        User currentUser = getCurrentUser();
        Customer customer = customerMapper.toCustomer(request);
        customer.setCreatedBy(currentUser);
        
        Customer saved = customerRepository.save(customer);
        return customerMapper.toCustomerResponse(saved);
    }

    @Override
    @Transactional
    public CustomerResponse updateCustomer(Long id, CustomerUpdateRequest request) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.CUSTOMER_NOT_EXISTS));

        // Check access permission
        User currentUser = getCurrentUser();
        checkCustomerAccess(customer, currentUser);

        // Check if email is being changed and if it already exists
        if (request.getEmail() != null && !request.getEmail().trim().isEmpty()) {
            if (!request.getEmail().equals(customer.getEmail()) 
                    && customerRepository.existsByEmail(request.getEmail())) {
                throw new AppException(ErrorCode.CUSTOMER_EMAIL_EXISTS);
            }
        }

        // Check if phone is being changed and if it already exists
        if (request.getPhone() != null && !request.getPhone().trim().isEmpty()) {
            if (!request.getPhone().equals(customer.getPhone()) 
                    && customerRepository.existsByPhone(request.getPhone())) {
                throw new AppException(ErrorCode.CUSTOMER_PHONE_EXISTS);
            }
        }

        customerMapper.updateCustomer(customer, request);
        Customer saved = customerRepository.save(customer);
        return customerMapper.toCustomerResponse(saved);
    }

    @Override
    public List<CustomerResponse> getAllCustomers() {
        // This method should only be called by ADMIN (enforced by security config)
        List<Customer> customers = customerRepository.findAll();
        return customers.stream()
                .map(customerMapper::toCustomerResponse)
                .toList();
    }

    @Override
    public CustomerResponse getCustomerById(Long id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.CUSTOMER_NOT_EXISTS));
        
        // Check access permission (Admin can access all, others only their customers)
        User currentUser = getCurrentUser();
        checkCustomerAccess(customer, currentUser);
        
        return customerMapper.toCustomerResponse(customer);
    }

    @Override
    @Transactional
    public void deleteCustomer(Long id) {
        // This method should only be called by ADMIN (enforced by security config)
        if (!customerRepository.existsById(id)) {
            throw new AppException(ErrorCode.CUSTOMER_NOT_EXISTS);
        }
        customerRepository.deleteById(id);
    }

    @Override
    @Transactional
    public CustomerResponse assignStaffToCustomer(Long customerId, List<Long> staffIds) {
        // Find customer
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new AppException(ErrorCode.CUSTOMER_NOT_EXISTS));

        // Find all staff users
        Set<User> staffUsers = staffIds.stream()
                .map(staffId -> userRepository.findById(staffId)
                        .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTS)))
                .collect(Collectors.toSet());

        // Assign staff to customer (replace existing assignments)
        customer.getAssignedStaff().clear();
        customer.getAssignedStaff().addAll(staffUsers);

        Customer saved = customerRepository.save(customer);
        return customerMapper.toCustomerResponse(saved);
    }

    @Override
    @Transactional
    public void unassignStaffFromCustomer(Long customerId, Long staffId) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new AppException(ErrorCode.CUSTOMER_NOT_EXISTS));

        User staff = userRepository.findById(staffId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTS));

        customer.getAssignedStaff().remove(staff);
        customerRepository.save(customer);
    }

    @Override
    public List<CustomerResponse> getCustomersByStaffId(Long staffId) {
        // Verify staff exists
        User staff = userRepository.findById(staffId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTS));

        // Get all customers assigned to this staff
        List<Customer> customers = customerRepository.findAll().stream()
                .filter(customer -> customer.getAssignedStaff().contains(staff))
                .toList();

        return customers.stream()
                .map(customerMapper::toCustomerResponse)
                .toList();
    }

    @Override
    public List<CustomerResponse> searchCustomers(String keyword) {
        // Search based on user role
        User currentUser = getCurrentUser();
        String roleName = currentUser.getRole().getName();
        
        List<Customer> customers;
        if ("ADMIN".equals(roleName)) {
            // Admin can search all customers
            customers = customerRepository.findAllByFullnameContainingIgnoreCase(keyword);
        } else {
            // Manager and Staff can only search their own customers
            customers = customerRepository.searchMyCustomers(currentUser.getId(), keyword);
        }
        
        return customers.stream()
                .map(customerMapper::toCustomerResponse)
                .toList();
    }

    @Override
    public List<CustomerResponse> getMyCustomers() {
        User currentUser = getCurrentUser();
        List<Customer> customers = customerRepository.findMyCustomers(currentUser.getId());
        return customers.stream()
                .map(customerMapper::toCustomerResponse)
                .toList();
    }

    @Override
    public List<CustomerResponse> getUnassignedCustomers() {
        // This method should only be called by ADMIN or MANAGER (enforced by security config)
        List<Customer> customers = customerRepository.findUnassignedCustomers();
        return customers.stream()
                .map(customerMapper::toCustomerResponse)
                .toList();
    }

    @Override
    public List<TransactionResponse> getCustomerTransactions(Long customerId) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new AppException(ErrorCode.CUSTOMER_NOT_EXISTS));
        
        // Check access permission
        User currentUser = getCurrentUser();
        checkCustomerAccess(customer, currentUser);
        
        List<Transaction> transactions = transactionRepository.findAllByCustomer_Id(customerId);
        return transactions.stream()
                .map(transactionMapper::toTransactionResponse)
                .toList();
    }

    @Override
    public List<CustomerResponse> searchMyCustomers(String keyword) {
        User currentUser = getCurrentUser();
        List<Customer> customers = customerRepository.searchMyCustomers(currentUser.getId(), keyword);
        return customers.stream()
                .map(customerMapper::toCustomerResponse)
                .toList();
    }

    // Helper methods
    private User getCurrentUser() {
        var context = SecurityContextHolder.getContext();
        String username = context.getAuthentication().getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTS));
    }

    private void checkCustomerAccess(Customer customer, User currentUser) {
        String roleName = currentUser.getRole().getName();
        
        // Admin has access to all customers
        if ("ADMIN".equals(roleName)) {
            return;
        }
        
        // Check if user is the creator or assigned to this customer
        boolean isCreator = customer.getCreatedBy() != null && 
                           customer.getCreatedBy().getId().equals(currentUser.getId());
        boolean isAssigned = customer.getAssignedStaff().stream()
                .anyMatch(staff -> staff.getId().equals(currentUser.getId()));
        
        if (!isCreator && !isAssigned) {
            throw new AppException(ErrorCode.CUSTOMER_ACCESS_DENIED);
        }
    }
}

