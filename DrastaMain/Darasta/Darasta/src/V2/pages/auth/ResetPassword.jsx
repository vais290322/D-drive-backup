import { resetPassword } from "@/V2/app/features/auth/authAsyncThunk";
import {
  FormButton,
  FormContainer,
  PasswordField
} from "@/V2/components/auth";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

export function ResetPassword() {
  const { token } = useParams();
  const [msg, setMsg] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status } = useSelector((s) => s.auth);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setMsg("");
    try {
      await dispatch(resetPassword({ data, token })).unwrap();
      setMsg("Password reset successful!");
      setTimeout(() => navigate("/login"), 1000);
    } catch (err) {
      setMsg(err || "Password reset failed");
    }
  };

  return (
    <FormContainer
      title="Reset Password"
      msg={msg}
      status={status}
      onSubmit={handleSubmit(onSubmit)}
    >
      {/* New Password */}
      <PasswordField
        label="New Password"
        {...register("newPassword", {
          required: "New password is required",
          minLength: { value: 6, message: "Min 6 chars" },
        })}
        error={errors.newPassword}
      />

      {/* Confirm Password */}
      <PasswordField
        label="Confirm Password"
        {...register("confirmPassword", {
          required: "Confirm password is required",
          validate: (val) =>
            val === watch("newPassword") || "Passwords do not match",
        })}
        error={errors.confirmPassword}
      />

      <FormButton status={status} text="Reset Password" />
    </FormContainer>
  );
}
