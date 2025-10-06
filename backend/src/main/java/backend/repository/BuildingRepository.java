package backend.repository;

import backend.entity.Building;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BuildingRepository extends JpaRepository<Building, Long> {
    Optional<Building> findByName(String name);

    boolean existsByName(String name);

    List<Building> findAllByNameContainingIgnoreCase(String keyword);

    List<Building> findAllByDistrict_Id(Long districtId);

    List<Building> findAllByRentTypes_Name(String rentTypeName);

    List<Building> findAllByAssignedUsers_Id(Long userId);
}


