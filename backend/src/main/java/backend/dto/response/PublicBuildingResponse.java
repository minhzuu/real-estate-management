package backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PublicBuildingResponse {

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
    private List<String> images;

    private DistrictInfo district;
    private Set<RentTypeInfo> rentTypes;
    private Set<RentAreaInfo> rentAreas;

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
}

