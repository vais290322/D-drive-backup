//package com.rahul.Drasta.Auth;
//
//import com.rahul.Drasta.Dto.ResponseDto;
//import com.rahul.Drasta.auth.controller.RegistrationController;
//import com.rahul.Drasta.auth.dto.UserRegistrationDto;
//import com.rahul.Drasta.auth.model.User;
//import com.rahul.Drasta.auth.service.UserService;
//import org.junit.jupiter.api.BeforeEach;
//import org.junit.jupiter.api.Test;
//import org.mockito.InjectMocks;
//import org.mockito.Mock;
//import org.mockito.MockitoAnnotations;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.security.crypto.password.PasswordEncoder;
//import org.springframework.validation.BeanPropertyBindingResult;
//import org.springframework.validation.BindingResult;
//
//import static org.junit.jupiter.api.Assertions.*;
//import static org.mockito.Mockito.*;
//
//class RegistrationControllerTest {
//
//    @Mock
//    private UserService userService;
//
//    @Mock
//    private PasswordEncoder passwordEncoder;
//
//    @InjectMocks
//    private RegistrationController registrationController;
//
//    @BeforeEach
//    void setUp() {
//        MockitoAnnotations.openMocks(this);
//    }
//
//    @Test
//    void testRegisterUser_Success() {
//        UserRegistrationDto dto = new UserRegistrationDto();
//        dto.setFullName("John Doe");
//        dto.setEmail("john@example.com");
//        dto.setPhoneNumber("9999999999");
//        dto.setPassword("password123");
//
//        BindingResult bindingResult = new BeanPropertyBindingResult(dto, "registrationDto");
//
//        when(userService.findByEmail(dto.getEmail())).thenReturn(null);
//        when(passwordEncoder.encode(dto.getPassword())).thenReturn("encodedPassword");
//
//        ResponseEntity<ResponseDto> response = registrationController.registerUser(dto, bindingResult);
//
//        assertEquals(HttpStatus.CREATED, response.getStatusCode());
//        assertTrue(response.getBody().isSuccess());
//        assertTrue(((User) response.getBody().getData()).getPassword() == null);
//
//        verify(userService).save(any(User.class));
//    }
//
//    @Test
//    void testRegisterUser_EmailAlreadyExists() {
//        UserRegistrationDto dto = new UserRegistrationDto();
//        dto.setEmail("existing@example.com");
//
//        BindingResult bindingResult = new BeanPropertyBindingResult(dto, "registrationDto");
//
//        when(userService.findByEmail(dto.getEmail())).thenReturn(new User());
//
//        ResponseEntity<ResponseDto> response = registrationController.registerUser(dto, bindingResult);
//
//        assertEquals(HttpStatus.CONFLICT, response.getStatusCode());
//        assertFalse(response.getBody().isSuccess());
//    }
//
//    @Test
//    void testRegisterUser_ValidationErrors() {
//        UserRegistrationDto dto = new UserRegistrationDto();
//
//        BindingResult bindingResult = new BeanPropertyBindingResult(dto, "registrationDto");
//        bindingResult.rejectValue("email", "error.email", "Email is invalid");
//
//        ResponseEntity<ResponseDto> response = registrationController.registerUser(dto, bindingResult);
//
//        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
//        assertFalse(response.getBody().isSuccess());
//        assertTrue(response.getBody().getMessage().contains("Email is invalid"));
//    }
//}
