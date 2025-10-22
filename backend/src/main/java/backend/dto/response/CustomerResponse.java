package backend.dto.response;

import java.time.LocalDateTime;
import java.util.Set;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CustomerResponse {

    private Long id;
    private String fullname;
    private String phone;
    private String email;
    private String companyName;
    private String demand;
    private LocalDateTime createdDate;
    private LocalDateTime modifiedDate;
    private Set<StaffInfo> assignedStaff;

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

