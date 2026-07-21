export function SelectField({ label, register, name, options = [], error }) {
  return (
    <div className="flex flex-col">
      <label className="mb-1">{label}</label>
      <select {...register(name, { required: "This field is required" })}>
        <option value="">Select…</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      {error && <span className="text-sm text-red-600 mt-1">{error.message}</span>}
    </div>
  );
}