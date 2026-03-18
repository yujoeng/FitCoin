package org.a504.fitCoin.domain.auth.util;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

public class ResponseUtil {

    public static void setResponse(HttpServletResponse response, HttpStatus status, boolean isSuccess, String code, String message) throws IOException {

        response.setStatus(status.value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding("UTF-8");

        Map<String, Object> body = new HashMap<>();
        body.put("isSuccess", isSuccess);
        body.put("code", code);
        body.put("message", message);

        new ObjectMapper().writeValue(response.getWriter(), body);
    }
}
