package backend.dto.request;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AssignBuildingStaffRequest {

    @NotNull(message = "Building ID is required")
    private Long buildingId;

    @NotEmpty(message = "Staff IDs are required")
    private Set<Long> staffIds;
}

