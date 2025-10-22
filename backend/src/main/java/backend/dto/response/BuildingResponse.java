package backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BuildingResponse {

    private Long id;
    private String name;
    private String street;
    private String ward;
    private String structure;
    private Integer numberOfBasement;
    private Integer floorArea;
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
    private LocalDateTime createdDate;
    private LocalDateTime modifiedDate;
    private String createdBy;
    private String modifiedBy;

    private DistrictInfo district;
    private Set<RentTypeInfo> rentTypes;
    private Set<RentAreaInfo> rentAreas;
    private Set<StaffInfo> assignedStaff;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class DistrictInfo {
        private Long id;
        private String name;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class RentTypeInfo {
        private Long id;
        private String name;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class RentAreaInfo {
        private Long id;
        private Integer value;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class StaffInfo {
        private Long id;
        private String fullname;
        private String username;
    }
}

