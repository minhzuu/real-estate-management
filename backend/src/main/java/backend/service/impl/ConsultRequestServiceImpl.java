package backend.service.impl;

import backend.dto.request.ConsultRequestDto;
import backend.dto.response.ConsultRequestResponse;
import backend.entity.Building;
import backend.entity.ConsultRequest;
import backend.exception.AppException;
import backend.exception.ErrorCode;
import backend.repository.BuildingRepository;
import backend.repository.ConsultRequestRepository;
import backend.service.ConsultRequestService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ConsultRequestServiceImpl implements ConsultRequestService {

    private final ConsultRequestRepository consultRequestRepository;
    private final BuildingRepository buildingRepository;

    @Override
    public ConsultRequestResponse createConsultRequest(Long buildingId, ConsultRequestDto request) {
        log.info("Creating consult request for building ID: {}", buildingId);

        Building building = buildingRepository.findById(buildingId)
                .orElseThrow(() -> new AppException(ErrorCode.BUILDING_NOT_EXISTS));

        ConsultRequest consultRequest = ConsultRequest.builder()
                .customerName(request.getCustomerName())
                .customerPhone(request.getCustomerPhone())
                .customerEmail(request.getCustomerEmail())
                .message(request.getMessage())
                .status(ConsultRequest.ConsultStatus.PENDING)
                .building(building)
                .build();

        ConsultRequest saved = consultRequestRepository.save(consultRequest);
        log.info("Consult request created with ID: {}", saved.getId());

        return toResponse(saved);
    }

    @Override
    public List<ConsultRequestResponse> getAllConsultRequests() {
        return consultRequestRepository.findAllByOrderByCreatedDateDesc()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<ConsultRequestResponse> getConsultRequestsByBuilding(Long buildingId) {
        return consultRequestRepository.findAllByBuildingId(buildingId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public ConsultRequestResponse updateStatus(Long id, ConsultRequest.ConsultStatus status) {
        log.info("Updating consult request ID: {} to status: {}", id, status);
        ConsultRequest request = consultRequestRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.CONSULT_REQUEST_NOT_EXISTS));
        request.setStatus(status);
        return toResponse(consultRequestRepository.save(request));
    }

    private ConsultRequestResponse toResponse(ConsultRequest entity) {
        return ConsultRequestResponse.builder()
                .id(entity.getId())
                .customerName(entity.getCustomerName())
                .customerPhone(entity.getCustomerPhone())
                .customerEmail(entity.getCustomerEmail())
                .message(entity.getMessage())
                .status(entity.getStatus().name())
                .buildingId(entity.getBuilding().getId())
                .buildingName(entity.getBuilding().getName())
                .createdDate(entity.getCreatedDate())
                .build();
    }
}

