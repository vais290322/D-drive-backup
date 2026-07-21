export function NameFields({ register, errors }) {
  return (
    <>
      {["First Name", "Middle Name", "Last Name"].map((label, i) => (
        <div key={i} className="flex flex-col">
          <label className="mb-1">{label}</label>
          <input type="text" {...register(`namePart${i}`, { required: i === 0 })} />
          {errors[`namePart${i}`] && i === 0 && (
            <span className="text-sm text-red-600 mt-1">Required</span>
          )}
        </div>
      ))}
    </>
  );
}