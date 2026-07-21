export function ContactFields({ register, errors }) {
  return (
    <>
      <div className="flex flex-col">
        <label className="mb-1">Mobile Number</label>
        <input
          type="number"
          {...register("mobile", {
            required: "Mobile number is required",
            pattern: {
              value: /^\d{10}$/,
              message: "Mobile number must be exactly 10 digits",
            },
          })}
          placeholder="+91-"
        />
        {errors.mobile && <span className="text-sm text-red-600 mt-1">{errors.mobile.message}</span>}
      </div>

      <div className="flex flex-col">
        <label className="mb-1">E-Mail</label>
        <input
          type="email"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Enter a valid email address",
            },
          })}
        />
        {errors.email && <span className="text-sm text-red-600 mt-1">{errors.email.message}</span>}
      </div>
    </>
  );
}