package backend.service;

import backend.dto.request.ConsultRequestDto;
import backend.dto.response.ConsultRequestResponse;

import java.util.List;

public interface ConsultRequestService {
    ConsultRequestResponse createConsultRequest(Long buildingId, ConsultRequestDto request);
    List<ConsultRequestResponse> getAllConsultRequests();
    List<ConsultRequestResponse> getConsultRequestsByBuilding(Long buildingId);
    ConsultRequestResponse updateStatus(Long id, backend.entity.ConsultRequest.ConsultStatus status);
}

