package backend.repository;

import backend.entity.RentArea;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RentAreaRepository extends JpaRepository<RentArea, Long> {
    List<RentArea> findAllByBuilding_Id(Long buildingId);
}


