package backend.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserUpdateRequest {

    @Size(max = 100)
    private String fullname;

    @Min(0)
    private Integer status;

    @Size(max = 255)
    private String avatar;

    private Long roleId;

    @Size(min = 6, message = "PASSWORD_INVALID")
    private String password;
}


