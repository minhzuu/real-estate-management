package backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ConsultRequestDto {

    @NotBlank(message = "CUSTOMER_NAME_REQUIRED")
    private String customerName;

    @NotBlank(message = "CUSTOMER_PHONE_REQUIRED")
    private String customerPhone;

    private String customerEmail;

    private String message;
}

