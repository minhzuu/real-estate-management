package backend.repository;

import backend.entity.User;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);

    List<User> findAllByFullnameContainingIgnoreCase(String keyword);

    List<User> findAllByRole_Name(String roleName);

    boolean existsByUsername(String username);
}


