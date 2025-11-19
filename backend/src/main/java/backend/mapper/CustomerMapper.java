package backend.mapper;

import backend.dto.request.CustomerCreationRequest;
import backend.dto.request.CustomerUpdateRequest;
import backend.dto.response.CustomerResponse;
import backend.entity.Customer;
import backend.entity.User;
import java.util.Set;
import java.util.stream.Collectors;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface CustomerMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdDate", ignore = true)
    @Mapping(target = "modifiedDate", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "assignedStaff", ignore = true)
    @Mapping(target = "transactions", ignore = true)
    Customer toCustomer(CustomerCreationRequest request);

    @Mapping(target = "assignedStaff", expression = "java(mapStaffToStaffInfo(customer.getAssignedStaff()))")
    CustomerResponse toCustomerResponse(Customer customer);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdDate", ignore = true)
    @Mapping(target = "modifiedDate", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "assignedStaff", ignore = true)
    @Mapping(target = "transactions", ignore = true)
    void updateCustomer(@MappingTarget Customer customer, CustomerUpdateRequest request);

    // Helper method to map User entities to StaffInfo DTOs
    default Set<CustomerResponse.StaffInfo> mapStaffToStaffInfo(Set<User> staff) {
        if (staff == null) {
            return Set.of();
        }
        return staff.stream()
                .map(user -> CustomerResponse.StaffInfo.builder()
                        .id(user.getId())
                        .fullname(user.getFullname())
                        .username(user.getUsername())
                        .build())
                .collect(Collectors.toSet());
    }
}

