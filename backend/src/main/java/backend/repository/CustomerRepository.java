package backend.repository;

import backend.entity.Customer;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {
    Optional<Customer> findByEmail(String email);

    Optional<Customer> findByPhone(String phone);

    List<Customer> findAllByFullnameContainingIgnoreCase(String keyword);

    boolean existsByEmail(String email);

    boolean existsByPhone(String phone);
    
    // Tìm khách hàng được gán cho user
    @Query("SELECT c FROM Customer c JOIN c.assignedStaff s WHERE s.id = :userId")
    List<Customer> findCustomersByAssignedStaffId(@Param("userId") Long userId);
    
    // Tìm khách hàng do user tạo
    List<Customer> findAllByCreatedBy_Id(Long createdById);
    
    // Tìm khách hàng chưa được gán cho ai
    @Query("SELECT c FROM Customer c WHERE c.assignedStaff IS EMPTY")
    List<Customer> findUnassignedCustomers();
    
    // Tìm khách hàng của user (gồm cả do user tạo và được gán cho user)
    @Query("SELECT DISTINCT c FROM Customer c LEFT JOIN c.assignedStaff s WHERE c.createdBy.id = :userId OR s.id = :userId")
    List<Customer> findMyCustomers(@Param("userId") Long userId);
    
    // Tìm kiếm khách hàng của user
    @Query("SELECT DISTINCT c FROM Customer c LEFT JOIN c.assignedStaff s WHERE (c.createdBy.id = :userId OR s.id = :userId) AND LOWER(c.fullname) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Customer> searchMyCustomers(@Param("userId") Long userId, @Param("keyword") String keyword);
}


