package backend.repository;

import backend.entity.RentType;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RentTypeRepository extends JpaRepository<RentType, Long> {
    Optional<RentType> findByName(String name);

    boolean existsByName(String name);

    List<RentType> findAllByBuildings_Id(Long buildingId);
}


