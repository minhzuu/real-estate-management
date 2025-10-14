package backend.service;

import backend.dto.request.AuthenticationRequest;
import backend.dto.request.IntrospectRequest;
import backend.dto.request.LogoutRequest;
import backend.dto.request.RefreshToken;
import backend.dto.response.AuthenticationResponse;
import backend.dto.response.IntrospectResponse;
import com.nimbusds.jose.JOSEException;

import java.text.ParseException;

public interface AuthenticationService {
    AuthenticationResponse authenticate(AuthenticationRequest request);
    IntrospectResponse introspect (IntrospectRequest request);
    void logout(LogoutRequest request) throws ParseException, JOSEException;
    AuthenticationResponse refreshToken(RefreshToken request) throws ParseException, JOSEException;
}
