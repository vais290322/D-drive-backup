import { BsCalendarDateFill } from "react-icons/bs";

export function DateOfBirthField({ register, errors, inputRef, label="Date Of Birth" }) {
  const handleIconClick = () => {
    inputRef.current?.showPicker?.();
  };

  return (
    <div className="flex flex-col">
      <label className="mb-1">{label}</label>
      <div className="volunteer flex items-center gap-3">
        <input
          type="date"
          {...register("dob", { required: true })}
          ref={(e) => {
            register("dob").ref(e);
            inputRef.current = e;
          }}
          className=" w-full"
        />
        <button type="button" onClick={handleIconClick} className="text-[var(--primary-color)] hover:opacity-80">
          <BsCalendarDateFill className="w-5 h-5" />
        </button>
      </div>
      {errors.dob && <span className="text-sm text-red-600 mt-1">Required</span>}
    </div>
  );
}