package backend.mapper;

import backend.dto.request.RentTypeCreationRequest;
import backend.dto.request.RentTypeUpdateRequest;
import backend.dto.response.RentTypeResponse;
import backend.entity.RentType;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface RentTypeMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "buildings", ignore = true)
    RentType toRentType(RentTypeCreationRequest request);

    RentTypeResponse toRentTypeResponse(RentType rentType);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "buildings", ignore = true)
    void updateRentType(@MappingTarget RentType rentType, RentTypeUpdateRequest request);
}

