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
    INVALID_KEY(1008, "Invalid key",HttpStatus.BAD_REQUEST),
    CUSTOMER_NOT_EXISTS(2001, "Customer does not exist",HttpStatus.NOT_FOUND),
    CUSTOMER_EMAIL_EXISTS(2002, "Customer email already exists",HttpStatus.BAD_REQUEST),
    CUSTOMER_PHONE_EXISTS(2003, "Customer phone already exists",HttpStatus.BAD_REQUEST),
    CUSTOMER_ACCESS_DENIED(2004, "You do not have permission to access this customer",HttpStatus.FORBIDDEN),
    BUILDING_NOT_EXISTS(3001, "Building does not exist",HttpStatus.NOT_FOUND),
    BUILDING_NAME_EXISTS(3002, "Building name already exists",HttpStatus.BAD_REQUEST),
    DISTRICT_NOT_EXISTS(3003, "District does not exist",HttpStatus.NOT_FOUND),
    RENT_TYPE_NOT_EXISTS(3004, "Rent type does not exist",HttpStatus.NOT_FOUND),
    RENT_TYPE_NAME_EXISTS(3005, "Rent type name already exists",HttpStatus.BAD_REQUEST)
    ;
    private final int code;
    private final String message;
    private final HttpStatusCode statusCode;
}
