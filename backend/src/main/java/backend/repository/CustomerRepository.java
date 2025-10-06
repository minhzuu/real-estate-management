package backend.repository;

import backend.entity.Customer;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {
    Optional<Customer> findByEmail(String email);

    Optional<Customer> findByPhone(String phone);

    List<Customer> findAllByFullnameContainingIgnoreCase(String keyword);

    boolean existsByEmail(String email);

    boolean existsByPhone(String phone);
}


