import { signup } from "@/V2/app/features/auth/authAsyncThunk";
import {
  FormButton,
  FormContainer,
  FormFooter,
  InputField,
  PasswordField
} from "@/V2/components/auth";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const colors = {
  primary: "#8B1E3F", // deep red
  accent: "#F3C304", // yellow
  text: "#000000", // black
};

export function Signup() {
  const navigate = useNavigate();
  const [msg, setMsg] = useState("");

  const dispatch = useDispatch();
  const { status } = useSelector((s) => s.auth);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      setMsg("");
      await dispatch(signup(data)).unwrap();
      setMsg("Account created successfully!");
      setTimeout(() => navigate("/login"), 1000);
    } catch (err) {
      setMsg(err || "Signup failed");
    }
  };

  return (
    <FormContainer
      title="Sign Up"
      msg={msg}
      status={status}
      onSubmit={handleSubmit(onSubmit)}
    >
      {/* Full Name */}
      <InputField
        label="Full Name"
        {...register("fullName", { required: "Full name is required" })}
        error={errors.fullName}
        placeholder="John Doe"
      />

      {/* Email */}
      <InputField
        label="Email"
        {...register("email", { required: "Email is required" })}
        error={errors.email}
        placeholder="you@example.com"
      />

      {/* Phone */}
      <InputField
        label="Phone Number"
        {...register("phoneNumber", {
          required: "Phone number is required",
          maxLength: {
            value: 10,
            message: "Phone number must be 10 digits",
          },
          minLength: {
            value: 10,
            message: "Phone number must be 10 digits",
          },
        })}
        error={errors.phoneNumber}
        placeholder="1234567890"
      />

      {/* Password */}
      <PasswordField
        label="Password"
        {...register("password", {
          required: "Password is required",
          minLength: { value: 6, message: "Min 6 chars" },
        })}
        error={errors.password}
      />

      {/* Confirm Password */}
      <PasswordField
        label="Confirm Password"
        {...register("confirmPassword", {
          required: "Confirm password is required",
          validate: (val) =>
            val === watch("password") || "Passwords do not match",
        })}
        error={errors.confirmPassword}
      />
      
      <FormButton status={status} text="Sign Up" />

      <FormFooter isForgotPassword={false} />
    </FormContainer>
  );
}
