package backend.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
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
public class BuildingCreationRequest {

    @NotBlank(message = "Building name is required")
    private String name;

    private String street;

    private String ward;

    private String structure;

    @Min(value = 0, message = "Number of basement must be greater than or equal to 0")
    private Integer numberOfBasement;

    @Min(value = 0, message = "Floor area must be greater than or equal to 0")
    private Integer floorArea;

    @Min(value = 0, message = "Rent price must be greater than or equal to 0")
    private Double rentPrice;

    private String rentPriceDescription;

    private String serviceFee;

    private String carFee;

    private String motorbikeFee;

    private String overtimeFee;

    private String waterFee;

    private String electricityFee;

    private String deposit;

    private String payment;

    private String rentTime;

    private String decorationTime;

    private String brokerageFee;

    private String type;

    private String note;

    private String linkOfBuilding;

    private String map;

    private String image;

    @NotNull(message = "District ID is required")
    private Long districtId;

    private Set<Long> rentTypeIds;

    private Set<Integer> rentAreaValues;
}

