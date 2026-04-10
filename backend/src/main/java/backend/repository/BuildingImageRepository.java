package backend.repository;

import backend.entity.BuildingImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BuildingImageRepository extends JpaRepository<BuildingImage, Long> {
    List<BuildingImage> findAllByBuildingIdOrderBySortOrderAsc(Long buildingId);
    void deleteAllByBuildingId(Long buildingId);
}
