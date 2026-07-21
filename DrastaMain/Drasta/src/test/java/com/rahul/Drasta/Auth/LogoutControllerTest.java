//package com.rahul.Drasta.Auth;
//
//import com.rahul.Drasta.auth.config.TokenBlacklist;
//import com.rahul.Drasta.auth.controller.LogoutController;
//import jakarta.servlet.http.Cookie;
//import jakarta.servlet.http.HttpServletRequest;
//import jakarta.servlet.http.HttpServletResponse;
//import org.junit.jupiter.api.BeforeEach;
//import org.junit.jupiter.api.Test;
//import org.mockito.*;
//import org.springframework.http.ResponseEntity;
//
//import java.util.Map;
//
//import static org.junit.jupiter.api.Assertions.*;
//import static org.mockito.Mockito.*;
//
//class LogoutControllerTest {
//
//    @Mock
//    private TokenBlacklist tokenBlacklist;
//
//    @Mock
//    private HttpServletRequest request;
//
//    @Mock
//    private HttpServletResponse response;
//
//    @InjectMocks
//    private LogoutController logoutController;
//
//    @Captor
//    ArgumentCaptor<Cookie> cookieCaptor;
//
//    @BeforeEach
//    void setUp() {
//        MockitoAnnotations.openMocks(this);
//    }
//
//    @Test
//    void shouldLogoutAndBlacklistTokenFromHeader() {
//        String token = "Bearer dummy-token";
//
//        when(request.getHeader("Authorization")).thenReturn(token);
//
//        ResponseEntity<?> result = logoutController.logout(request, response);
//
//        verify(tokenBlacklist).blacklistToken("dummy-token");
//
//        // Check response message
//        Map<?, ?> body = (Map<?, ?>) result.getBody();
//        assertEquals("Logged out successfully", body.get("message"));
//    }
//
//    @Test
//    void shouldLogoutAndBlacklistTokenFromCookie() {
//        Cookie cookie = new Cookie("_auth-token", "cookie-token");
//        when(request.getHeader("Authorization")).thenReturn(null);
//        when(request.getCookies()).thenReturn(new Cookie[]{cookie});
//
//        ResponseEntity<?> result = logoutController.logout(request, response);
//
//        verify(tokenBlacklist).blacklistToken("cookie-token");
//
//        Map<?, ?> body = (Map<?, ?>) result.getBody();
//        assertEquals("Logged out successfully", body.get("message"));
//    }
//
//    @Test
//    void shouldLogoutGracefullyWhenNoTokenPresent() {
//        when(request.getHeader("Authorization")).thenReturn(null);
//        when(request.getCookies()).thenReturn(null);
//
//        ResponseEntity<?> result = logoutController.logout(request, response);
//
//        verify(tokenBlacklist, never()).blacklistToken(any());
//
//        Map<?, ?> body = (Map<?, ?>) result.getBody();
//        assertEquals("Logged out successfully", body.get("message"));
//    }
//
//    @Test
//    void shouldClearAuthAndRefreshCookies() {
//        when(request.getHeader("Authorization")).thenReturn("Bearer test-token");
//
//        logoutController.logout(request, response);
//
//        ArgumentCaptor<Cookie> cookieCaptor = ArgumentCaptor.forClass(Cookie.class);
//        verify(response, times(2)).addCookie(cookieCaptor.capture());
//
//        boolean authCookieCleared = false;
//        boolean refreshCookieCleared = false;
//
//        for (Cookie cookie : cookieCaptor.getAllValues()) {
//            if (cookie.getName().equals("_auth-token")) {
//                authCookieCleared = true;
//                assertEquals(0, cookie.getMaxAge());
//                assertEquals("/", cookie.getPath());
//            }
//            if (cookie.getName().equals("refresh_token")) {
//                refreshCookieCleared = true;
//                assertEquals(0, cookie.getMaxAge());
//                assertEquals("/api/v1/auth/refresh", cookie.getPath());
//            }
//        }
//
//        assertTrue(authCookieCleared, "Auth token cookie should be cleared");
//        assertTrue(refreshCookieCleared, "Refresh token cookie should be cleared");
//    }
//}
