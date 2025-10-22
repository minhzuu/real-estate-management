package backend.service.impl;

import backend.dto.request.AssignCustomerRequest;
import backend.dto.request.CustomerCreationRequest;
import backend.dto.request.CustomerUpdateRequest;
import backend.dto.response.CustomerResponse;
import backend.entity.Customer;
import backend.entity.User;
import backend.exception.AppException;
import backend.exception.ErrorCode;
import backend.mapper.CustomerMapper;
import backend.repository.CustomerRepository;
import backend.repository.UserRepository;
import backend.service.CustomerService;
import jakarta.transaction.Transactional;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomerServiceImpl implements CustomerService {

    private final CustomerRepository customerRepository;
    private final UserRepository userRepository;
    private final CustomerMapper customerMapper;

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

        Customer customer = customerMapper.toCustomer(request);
        Customer saved = customerRepository.save(customer);
        return customerMapper.toCustomerResponse(saved);
    }

    @Override
    @Transactional
    public CustomerResponse updateCustomer(Long id, CustomerUpdateRequest request) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.CUSTOMER_NOT_EXISTS));

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
        List<Customer> customers = customerRepository.findAll();
        return customers.stream()
                .map(customerMapper::toCustomerResponse)
                .toList();
    }

    @Override
    public CustomerResponse getCustomerById(Long id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.CUSTOMER_NOT_EXISTS));
        return customerMapper.toCustomerResponse(customer);
    }

    @Override
    @Transactional
    public void deleteCustomer(Long id) {
        if (!customerRepository.existsById(id)) {
            throw new AppException(ErrorCode.CUSTOMER_NOT_EXISTS);
        }
        customerRepository.deleteById(id);
    }

    @Override
    @Transactional
    public CustomerResponse assignStaffToCustomer(AssignCustomerRequest request) {
        // Find customer
        Customer customer = customerRepository.findById(request.getCustomerId())
                .orElseThrow(() -> new AppException(ErrorCode.CUSTOMER_NOT_EXISTS));

        // Find all staff users
        Set<User> staffUsers = request.getStaffIds().stream()
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
        List<Customer> customers = customerRepository.findAllByFullnameContainingIgnoreCase(keyword);
        return customers.stream()
                .map(customerMapper::toCustomerResponse)
                .toList();
    }
}

