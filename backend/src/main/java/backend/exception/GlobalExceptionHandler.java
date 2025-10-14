package backend.exception;


import backend.dto.response.ApiResponse;
import jakarta.validation.ConstraintViolation;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;


import java.nio.file.AccessDeniedException;
import java.util.Map;
import java.util.Objects;

@ControllerAdvice
public class GlobalExceptionHandler {
    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);
    private static final String MIN_ATTRIBUTE = "min";
    
    @ExceptionHandler(value = AppException.class)
    ResponseEntity<ApiResponse<?>> handlingAppException(AppException e) {
        ErrorCode errorCode = e.getErrorCode();
        ApiResponse<?> response = new ApiResponse<>();
        response.setCode(errorCode.getCode());
        response.setMessage(errorCode.getMessage());
        return ResponseEntity
                .status(errorCode.getStatusCode())
                .body(response);
    }
    
    @ExceptionHandler(value = MethodArgumentNotValidException.class)
    ResponseEntity<ApiResponse<?>> handlingMethodArgumentNotValidException(MethodArgumentNotValidException e) {
        String enumKey =  e.getFieldError().getDefaultMessage();
        ErrorCode errorCode = ErrorCode.INVALID_KEY;
        Map<String, Object> attribute = null;
        
        log.info("Validation error - enumKey: {}", enumKey);
        
        try {
             errorCode = ErrorCode.valueOf(enumKey);
            var contraintViolation = e.getBindingResult().getAllErrors().get(0).unwrap(ConstraintViolation.class);
             attribute = contraintViolation.getConstraintDescriptor().getAttributes();
            log.info("Constraint attributes: {}", attribute);
        }catch (IllegalArgumentException ex){
            log.warn("Cannot parse error code from enumKey: {}", enumKey);
        }catch (Exception ex){
            log.error("Error while processing validation exception", ex);
        }

        ApiResponse<?> response = new ApiResponse<>();
        response.setCode(errorCode.getCode());
        response.setMessage(Objects.nonNull(attribute) ?
                mapAttribute(errorCode.getMessage(), attribute) : errorCode.getMessage()
                );
        return ResponseEntity.badRequest().body(response);
    }

    @ExceptionHandler(value = AccessDeniedException.class)
    ResponseEntity<ApiResponse<?>> handlingAccessDeniedException(AccessDeniedException e) {
       ErrorCode errorCode = ErrorCode.UNAUTHORIZED;
        return ResponseEntity
                .status(errorCode.getStatusCode())
                .body(ApiResponse.builder()
                        .code(errorCode.getCode())
                        .message(errorCode.getMessage())
                        .build());
    }
    
    // This should be the last handler - catches all unhandled exceptions
    @ExceptionHandler(value = Exception.class)
    ResponseEntity<ApiResponse<?>> handlingRuntimeException(Exception e) {
        log.error("Uncategorized Exception: ", e);
        ApiResponse<?> response = new ApiResponse<>();
        response.setCode(ErrorCode.UNCATEGORIZED.getCode());
        response.setMessage(ErrorCode.UNCATEGORIZED.getMessage());
        return ResponseEntity
                .status(ErrorCode.UNCATEGORIZED.getStatusCode())
                .body(response);
    }
    
    private String mapAttribute(String message, Map<String, Object> attribute){
        String minValue = String.valueOf(attribute.get(MIN_ATTRIBUTE)) ;
        return message.replace("{" + MIN_ATTRIBUTE + "}", minValue);
    }

}
