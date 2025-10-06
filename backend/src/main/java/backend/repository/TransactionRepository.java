package backend.repository;

import backend.entity.Transaction;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findAllByCustomer_Id(Long customerId);

    List<Transaction> findAllByStaff_Id(Long staffId);

    List<Transaction> findAllByTransactionType_Name(String transactionTypeName);

    List<Transaction> findAllByCreatedDateBetween(LocalDateTime start, LocalDateTime end);
}


