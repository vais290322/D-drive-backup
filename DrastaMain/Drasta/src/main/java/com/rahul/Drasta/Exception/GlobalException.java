package com.rahul.Drasta.Exception;

import com.mongodb.DuplicateKeyException;
import com.rahul.Drasta.Dto.ResponseDto;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalException {

    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<ResponseDto> notFoundException(NotFoundException ex){
        return new ResponseEntity<>(new ResponseDto(false, ex.getMessage(), null), HttpStatus.NOT_FOUND);
    }
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String,String>> HandleValidationError(MethodArgumentNotValidException ex){
        Map<String,String> errors = new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(fieldError ->
                errors.put(fieldError.getField(), fieldError.getDefaultMessage()));
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errors);
    }

    @ExceptionHandler(AlreadyExist.class)
    public ResponseEntity<ResponseDto> handleDuplicateKey(AlreadyExist ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(new ResponseDto(false, ex.getMessage(), null));
    }

}
