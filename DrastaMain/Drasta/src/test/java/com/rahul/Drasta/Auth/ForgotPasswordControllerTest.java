//package com.rahul.Drasta.Auth;
//
//import com.rahul.Drasta.auth.controller.ForgotPasswordController;
//import com.rahul.Drasta.auth.model.User;
//import com.rahul.Drasta.auth.service.EmailService;
//import com.rahul.Drasta.auth.service.UserService;
//import org.junit.jupiter.api.BeforeEach;
//import org.junit.jupiter.api.Test;
//import org.mockito.*;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.http.ResponseEntity;
//
//import java.util.Calendar;
//import java.util.Date;
//import java.util.HashMap;
//import java.util.Map;
//
//import static org.junit.jupiter.api.Assertions.*;
//import static org.mockito.Mockito.*;
//
//class ForgotPasswordControllerTest {
//
//    @InjectMocks
//    private ForgotPasswordController forgotPasswordController;
//
//    @Mock
//    private UserService userService;
//
//    @Mock
//    private EmailService emailService;
//
//    @Captor
//    private ArgumentCaptor<User> userCaptor;
//
//    @BeforeEach
//    void setUp() {
//        MockitoAnnotations.openMocks(this);
//        forgotPasswordController = new ForgotPasswordController(userService, emailService);
//        forgotPasswordController.resetBaseUrl = "http://localhost:3000";  // public or use setter
//    }
//
//
//    @Test
//    void shouldReturnBadRequestWhenEmailIsMissing() {
//        Map<String, String> request = new HashMap<>();
//        ResponseEntity<?> response = forgotPasswordController.forgotPassword(request);
//        assertEquals(400, response.getStatusCodeValue());
//        assertEquals("Email is required", response.getBody());
//    }
//
//    @Test
//    void shouldReturnOkEvenWhenUserNotFound() {
//        String testEmail = "notfound@example.com";
//        Map<String, String> request = Map.of("email", testEmail);
//
//        when(userService.findByEmail(testEmail)).thenReturn(null);
//
//        ResponseEntity<?> response = forgotPasswordController.forgotPassword(request);
//        assertEquals(200, response.getStatusCodeValue());
//        assertEquals("If your email is registered, password reset instructions will be sent.", response.getBody());
//    }
//
//    @Test
//    void shouldSendResetEmailWhenUserFound() {
//        String email = "user@example.com";
//        User user = new User();
//        user.setEmail(email);
//        user.setFullName("John Doe");
//
//        Map<String, String> request = Map.of("email", email);
//        when(userService.findByEmail(email)).thenReturn(user);
//
//        ResponseEntity<?> response = forgotPasswordController.forgotPassword(request);
//
//        assertEquals(200, response.getStatusCodeValue());
//        assertEquals("If your email is registered, password reset instructions will be sent.", response.getBody());
//
//        // Verify userService.save was called and token set
//        verify(userService).save(userCaptor.capture());
//        User savedUser = userCaptor.getValue();
//        assertNotNull(savedUser.getResetToken());
//        assertNotNull(savedUser.getResetTokenExpiry());
//
//        // Token should expire within an hour
//        Calendar oneHourLater = Calendar.getInstance();
//        oneHourLater.add(Calendar.HOUR, 1);
//        Date expectedExpiry = oneHourLater.getTime();
//        assertTrue(savedUser.getResetTokenExpiry().before(expectedExpiry) ||
//                   savedUser.getResetTokenExpiry().equals(expectedExpiry));
//
//        // Verify emailService.sendResetPasswordHtmlEmail was called
//        verify(emailService).sendResetPasswordHtmlEmail(eq(email), eq("John Doe"), anyString());
//    }
//}
