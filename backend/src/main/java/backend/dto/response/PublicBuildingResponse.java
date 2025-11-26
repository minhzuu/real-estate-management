package backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

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
    private String type;
    private String linkOfBuilding;
    private String map;
    private String image;

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

