//package com.rahul.Drasta;
//
//import com.fasterxml.jackson.databind.ObjectMapper;
//import com.rahul.Drasta.auth.config.TokenBlacklist;
//import com.rahul.Drasta.auth.dto.UserRegistrationDto;
//import com.rahul.Drasta.auth.model.User;
//import com.rahul.Drasta.auth.repository.UserRepository;
//import com.rahul.Drasta.auth.service.EmailService;
//import com.rahul.Drasta.auth.service.UserService;
//import com.rahul.Drasta.auth.util.JwtUtil;
//import jakarta.servlet.http.Cookie;
//import org.junit.jupiter.api.BeforeEach;
//import org.junit.jupiter.api.Test;
//import org.mockito.Mock;
//import org.mockito.Mockito;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
//import org.springframework.boot.test.context.SpringBootTest;
//
//import org.springframework.http.MediaType;
//import org.springframework.security.crypto.password.PasswordEncoder;
//import org.springframework.test.web.servlet.MockMvc;
//
//import java.util.Map;
//
//import static org.assertj.core.api.Assertions.assertThat;
//import static org.mockito.Mockito.verify;
//import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
//import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
//
//@SpringBootTest
//@AutoConfigureMockMvc
//class AuthIntegrationTest {
//
//    @Autowired private MockMvc mockMvc;
//    @Autowired private UserRepository userRepository;
//    @Autowired private PasswordEncoder passwordEncoder;
//    @Autowired private JwtUtil jwtUtil;
//
//    @Mock
//    private TokenBlacklist tokenBlacklist;
//   @Autowired
//    private UserService userService;
//
//
//    @Autowired
//    private ObjectMapper objectMapper;
//
//    private final String email = "securetest@example.com";
//    private final String password = "Secure@123";
//
//    @BeforeEach
//    void setup() {
//        userRepository.deleteAll();
//        User user = new User();
//        user.setEmail(email);
//        user.setPassword(passwordEncoder.encode(password));
//        user.setRole("ROLE_ADMIN");
//        user.setBlocked(false);
//        userRepository.save(user);
//    }
//
//    @Test
//    void shouldLoginAndReturnAccessAndRefreshTokens() throws Exception {
//        String json = String.format("""
//            {
//              "email": "%s",
//              "password": "%s"
//            }
//            """, email, password);
//
//        String response = mockMvc.perform(post("/api/v1/login")
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(json))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.accessToken").exists())
//                .andExpect(jsonPath("$.refreshToken").exists())
//                .andExpect(jsonPath("$.message").value("Login successful!")) // <-- updated here
//                .andReturn().getResponse().getContentAsString();
//
//        // Extract token strings
//        String accessToken = response.replaceAll(".*\"accessToken\":\"([^\"]+)\".*", "$1");
//        String refreshToken = response.replaceAll(".*\"refreshToken\":\"([^\"]+)\".*", "$1");
//
//        // Decode access token and verify claims
//        Map<String, Object> claims = jwtUtil.extractAllClaims(accessToken);
//        assertThat(claims.get("sub")).isEqualTo(email);
//        assertThat(claims.get("role")).isEqualTo("ROLE_ADMIN");
//    }
//
//
//    @Test
//    void shouldRefreshAccessTokenUsingRefreshToken() throws Exception {
//        // Login
//        String json = String.format("""
//        {
//          "email": "%s",
//          "password": "%s"
//        }
//        """, email, password);
//
//        String response = mockMvc.perform(post("/api/v1/login")
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(json))
//                .andExpect(status().isOk())
//                .andReturn().getResponse().getContentAsString();
//
//        String refreshToken = response.replaceAll(".*\"refreshToken\":\"([^\"]+)\".*", "$1");
//
//        // Send refresh token request
//        mockMvc.perform(post("/api/v1/auth/refresh")
//                        .cookie(new Cookie("refresh_token", refreshToken)))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.accessToken").exists())
//                .andExpect(jsonPath("$.refreshToken").exists());
//
//    }
//
//
//    @Test
//    public void testLogoutWithoutToken() throws Exception {
//        mockMvc.perform(post("/api/v1/logout"))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.message").value("You have been signed out"))
//                .andExpect(jsonPath("$.status").value("success"))
//                .andExpect(cookie().maxAge("_auth-token", 0))
//                .andExpect(cookie().maxAge("refresh_token", 0));
//
//        verify(tokenBlacklist, Mockito.never()).blacklistToken(Mockito.anyString());
//    }
//
//    @Test
//    void registerUser_ShouldFail_WhenEmailMissing() throws Exception {
//        UserRegistrationDto dto = new UserRegistrationDto();
//        dto.setFullName("No Email");
//        dto.setPhoneNumber("8888888888");
//        dto.setPassword("Test@123");
//        dto.setRole("ROLE_USER");
//        // email is missing here
//
//        mockMvc.perform(post("/api/v1/register")
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(objectMapper.writeValueAsString(dto)))
//                .andExpect(status().isBadRequest())
//                .andExpect(jsonPath("$.success").value(false))
//                .andExpect(jsonPath("$.message").exists());
//    }
//
//
//
//
//
//
//
//
//
//}
