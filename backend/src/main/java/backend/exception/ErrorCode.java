package backend.exception;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

@Getter
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public enum ErrorCode {
    UNCATEGORIZED(9999, "Uncategorized error", HttpStatus.INTERNAL_SERVER_ERROR),
    USER_EXISTS(1001, "User already exists",HttpStatus.BAD_REQUEST),
    USERNAME_INVALID(1002, "Username must be between 3 and 50 characters long",HttpStatus.BAD_REQUEST),
    PASSWORD_INVALID(1003, "Password must be at least {min} characters long",HttpStatus.BAD_REQUEST),
    USER_NOT_EXISTS(1004, "User does not exist",HttpStatus.NOT_FOUND),
    UNAUTHENTICATED(1005, "Unauthenticated",HttpStatus.UNAUTHORIZED),
    UNAUTHORIZED(1006, "You do not have permission",HttpStatus.FORBIDDEN),
    ROLE_NOT_EXISTS(1007, "Role does not exist",HttpStatus.NOT_FOUND),
    INVALID_KEY(1008, "Invalid key",HttpStatus.BAD_REQUEST)
    ;
    private final int code;
    private final String message;
    private final HttpStatusCode statusCode;
}
