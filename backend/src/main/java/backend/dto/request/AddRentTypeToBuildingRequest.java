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
public class AddRentTypeToBuildingRequest {

    @NotEmpty(message = "Rent type IDs are required")
    private Set<Long> rentTypeIds;
}

