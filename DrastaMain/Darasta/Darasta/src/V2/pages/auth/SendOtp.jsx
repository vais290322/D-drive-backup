import { forgetPassword } from "@/V2/app/features/auth/authAsyncThunk";
import { FormButton, FormContainer, FormFooter, InputField } from "@/V2/components/auth";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

export function SendOtp() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [msg, setMsg] = useState("");
  const dispatch = useDispatch();
  const { status } = useSelector((s) => s.auth);

  const onSubmit = async (data) => {
    try {
        setMsg("");
        await dispatch(forgetPassword(data)).unwrap();
        setMsg("Check you email to reset password!");
    } catch (err) {
        setMsg(err || 'Send email failed');
    }
};

  return (
    <FormContainer
      title="Reset Password"
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
      <FormButton status={status} text="Submit" />

      <FormFooter to="login" isForgotPassword={false} />
    </FormContainer>
  );
}
