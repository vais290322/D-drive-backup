import { login } from "@/V2/app/features/auth/authAsyncThunk";
import {
  FormButton,
  FormContainer,
  FormFooter,
  PasswordField,
  InputField
} from "@/V2/components/auth";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export function Login() {
  const navigate = useNavigate();
  const [msg, setMsg] = useState("");
  const dispatch = useDispatch();
  const { status } = useSelector((s) => s.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      setMsg("");
      await dispatch(login(data)).unwrap();
      setMsg("Login successful!");
      setTimeout(() => navigate("/home"), 1000);
    } catch (err) {
      setMsg(err || "Login failed");
    }
  };

  return (
    <FormContainer
      title="Login"
      msg={msg}
      status={status}
      onSubmit={handleSubmit(onSubmit)}
    >
      {/* Email */}
      <InputField
        label="Email"
        {...register("email", { required: "Email is required" })}
        error={errors.email}
        placeholder="you@example.com"
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

      <FormButton status={status} text="Login" />
      <FormFooter to="sign-up" />
    </FormContainer>
  );
}
