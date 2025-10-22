package backend.controller;
import backend.dto.request.AuthenticationRequest;
import backend.dto.request.ChangePasswordRequest;
import backend.dto.request.IntrospectRequest;
import backend.dto.request.LogoutRequest;
import backend.dto.request.RefreshToken;
import backend.dto.response.ApiResponse;
import backend.dto.response.AuthenticationResponse;
import backend.dto.response.IntrospectResponse;
import backend.dto.response.UserResponse;
import backend.service.AuthenticationService;
import backend.service.UserService;
import com.nimbusds.jose.JOSEException;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthenticationController {
    AuthenticationService authenticationService;
    UserService userService;
    
    @PostMapping("/login")
    ApiResponse<AuthenticationResponse> login(@RequestBody AuthenticationRequest request){
        var result =  authenticationService.authenticate(request);
        return ApiResponse.<AuthenticationResponse>builder()
                .result(result)
                .build();
    }
    
    @PostMapping("/logout")
    ApiResponse<Void> logout(@RequestBody LogoutRequest request) throws ParseException, JOSEException {
        authenticationService.logout(request);
        return ApiResponse.<Void>builder()
                .build();
    }
    
    @PostMapping("/change-password")
    ApiResponse<Void> changePassword(@RequestBody ChangePasswordRequest request){
        authenticationService.changePassword(request);
        return ApiResponse.<Void>builder()
                .build();
    }
    
    @GetMapping("/me")
    ApiResponse<UserResponse> getMyInfo(){
        var result = userService.getMyInfo();
        return ApiResponse.<UserResponse>builder()
                .result(result)
                .build();
    }
    
    @PostMapping("/refresh-token")
    ApiResponse<AuthenticationResponse> refreshToken(@RequestBody RefreshToken request) throws ParseException, JOSEException {
        var result =  authenticationService.refreshToken(request);
        return ApiResponse.<AuthenticationResponse>builder()
                .result(result)
                .build();
    }
    
    @PostMapping("/introspect")
    ApiResponse<IntrospectResponse> introspect(@RequestBody IntrospectRequest request) throws ParseException, JOSEException {
        var result =  authenticationService.introspect(request);
        return ApiResponse.<IntrospectResponse>builder()
                .result(result)
                .build();
    }
}
