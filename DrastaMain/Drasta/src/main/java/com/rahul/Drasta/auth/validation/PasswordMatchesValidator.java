package com.rahul.Drasta.auth.validation;


import com.rahul.Drasta.auth.dto.UserRegistrationDto;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;


public class PasswordMatchesValidator implements ConstraintValidator<PasswordMatches, UserRegistrationDto> {

    @Override
    public void initialize(PasswordMatches passwordMatches) {
    }

    @Override
    public boolean isValid(UserRegistrationDto dto, ConstraintValidatorContext context) {
        return dto.getPassword().equals(dto.getConfirmPassword());
    }
}

