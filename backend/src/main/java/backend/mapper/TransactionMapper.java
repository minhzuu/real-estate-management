package backend.mapper;

import backend.dto.response.TransactionResponse;
import backend.entity.Transaction;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface TransactionMapper {

    @Mapping(target = "customer", expression = "java(mapCustomerToCustomerInfo(transaction))")
    @Mapping(target = "staff", expression = "java(mapStaffToStaffInfo(transaction))")
    @Mapping(target = "transactionType", expression = "java(mapTransactionTypeToInfo(transaction))")
    TransactionResponse toTransactionResponse(Transaction transaction);

    default TransactionResponse.CustomerInfo mapCustomerToCustomerInfo(Transaction transaction) {
        if (transaction.getCustomer() == null) {
            return null;
        }
        return TransactionResponse.CustomerInfo.builder()
                .id(transaction.getCustomer().getId())
                .fullname(transaction.getCustomer().getFullname())
                .phone(transaction.getCustomer().getPhone())
                .build();
    }

    default TransactionResponse.StaffInfo mapStaffToStaffInfo(Transaction transaction) {
        if (transaction.getStaff() == null) {
            return null;
        }
        return TransactionResponse.StaffInfo.builder()
                .id(transaction.getStaff().getId())
                .fullname(transaction.getStaff().getFullname())
                .username(transaction.getStaff().getUsername())
                .build();
    }

    default TransactionResponse.TransactionTypeInfo mapTransactionTypeToInfo(Transaction transaction) {
        if (transaction.getTransactionType() == null) {
            return null;
        }
        return TransactionResponse.TransactionTypeInfo.builder()
                .id(transaction.getTransactionType().getId())
                .name(transaction.getTransactionType().getName())
                .build();
    }
}

