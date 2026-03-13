package backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ConsultRequestResponse {

    private Long id;
    private String customerName;
    private String customerPhone;
    private String customerEmail;
    private String message;
    private String status;
    private Long buildingId;
    private String buildingName;
    private LocalDateTime createdDate;
}

