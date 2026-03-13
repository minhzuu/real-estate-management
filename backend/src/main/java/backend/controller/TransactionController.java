package backend.controller;

import backend.dto.response.ApiResponse;
import backend.dto.response.TransactionResponse;
import backend.entity.Customer;
import backend.entity.Transaction;
import backend.entity.TransactionType;
import backend.entity.User;
import backend.mapper.TransactionMapper;
import backend.repository.CustomerRepository;
import backend.repository.TransactionRepository;
import backend.repository.TransactionTypeRepository;
import backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionRepository transactionRepository;
    private final TransactionTypeRepository transactionTypeRepository;
    private final CustomerRepository customerRepository;
    private final UserRepository userRepository;
    private final TransactionMapper transactionMapper;

    // POST /transactions — Tạo giao dịch mới
    // Body: { "customerId": 1, "transactionTypeId": 2, "note": "..." }
    @PostMapping
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_MANAGER', 'ROLE_STAFF')")
    public ResponseEntity<ApiResponse<TransactionResponse>> createTransaction(
            @RequestBody Map<String, Object> body) {

        Long customerId = Long.valueOf(body.get("customerId").toString());
        Long transactionTypeId = Long.valueOf(body.get("transactionTypeId").toString());
        String note = body.getOrDefault("note", "").toString();

        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found"));
        TransactionType txType = transactionTypeRepository.findById(transactionTypeId)
                .orElseThrow(() -> new RuntimeException("TransactionType not found"));

        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User staff = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Transaction transaction = Transaction.builder()
                .customer(customer)
                .transactionType(txType)
                .staff(staff)
                .note(note)
                .build();

        Transaction saved = transactionRepository.save(transaction);
        TransactionResponse response = transactionMapper.toTransactionResponse(saved);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.<TransactionResponse>builder()
                        .result(response)
                        .message("Transaction created successfully")
                        .build());
    }

    // GET /transactions/types — Danh sách loại giao dịch (for dropdown)
    @GetMapping("/types")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_MANAGER', 'ROLE_STAFF')")
    public ApiResponse<List<TransactionType>> getTransactionTypes() {
        return ApiResponse.<List<TransactionType>>builder()
                .result(transactionTypeRepository.findAll())
                .message("Get transaction types successfully")
                .build();
    }
}
