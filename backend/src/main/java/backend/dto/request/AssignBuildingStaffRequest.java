package backend.dto.request;

import jakarta.validation.constraints.NotEmpty;
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

    private Long buildingId; // Set from path variable in controller

    @NotEmpty(message = "STAFF_IDS_REQUIRED")
    private Set<Long> staffIds;
}

