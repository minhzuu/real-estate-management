package backend.repository;

import backend.entity.ConsultRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ConsultRequestRepository extends JpaRepository<ConsultRequest, Long> {
    List<ConsultRequest> findAllByBuildingId(Long buildingId);
    List<ConsultRequest> findAllByOrderByCreatedDateDesc();
}

