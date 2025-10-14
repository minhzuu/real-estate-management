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
public class UserCreationRequest {

    @NotBlank
    @Size(min = 3, max = 50, message = "USERNAME_INVALID")
    private String username;

    @NotBlank
    @Size(min = 6, message = "PASSWORD_INVALID")
    private String password;

    @NotBlank
    @Size(max = 100)
    private String fullname;

    // 0/1 status expected by DB (TinyInt)
    @NotNull
    @Min(0)
    private Integer status;

    @Size(max = 255)
    private String avatar;

    @NotNull
    private Long roleId;
}


