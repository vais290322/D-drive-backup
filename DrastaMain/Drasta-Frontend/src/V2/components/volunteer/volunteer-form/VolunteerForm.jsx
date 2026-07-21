import { useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import {
  ContactFields,
  DateOfBirthField,
  ImageUploadField,
  NameFields,
  PreferenceFields,
} from ".";
import { useCityData } from "@/V2/hooks/useCityData";
import { useFileUpload } from "@/V2/hooks/useFileUpload";
import { useToast } from "@/context/ToastContext";
import api from "@/V2/service";
import { motion } from "framer-motion";

export function VolunteerForm() {
  const inputRef = useRef(null);
  const dropRef = useRef(null);
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm();

  const selectedState = useWatch({ control, name: "state" });
  const cities = useCityData(selectedState);

  const {
    file,
    setFile,
    imageError,
    setImageError,
    onFileChange,
    handleDrop,
    handleDragOver: handleDragOverFile,
    handleDragLeave: handleDragLeaveFile,
  } = useFileUpload();

  const handleDragOver = (e) => {
    handleDragOverFile(e);
    dropRef.current?.classList.add(
      "ring",
      "ring-[var(--primary-color)]",
      "ring-opacity-50"
    );
  };

  const handleDragLeave = (e) => {
    handleDragLeaveFile(e);
    dropRef.current?.classList.remove(
      "ring",
      "ring-[var(--primary-color)]",
      "ring-opacity-50"
    );
  };

  const onSubmit = async (data) => {
    if (!file) {
      setImageError("Image is required");
      return;
    }

    setImageError("");

    const payload = {
      fullName: [data.namePart0, data.namePart1, data.namePart2]
        .filter(Boolean)
        .join(" "),
      dob: data.dob,
      number: data.mobile,
      email: data.email,
      preferredRole: data.role,
      language: data.language,
      skill: data.skill,
      preferredState: data.state,
      preferredCity: data.city || "",
      bloodGroup: data.blood,
      description: data.why || "",
      profileImage: file,
    };

    try {
      setLoading(true);
      await api.post("/volunteer", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      reset();
      setFile(null);
      showToast(
        "🎉 Thank you! You're now registered as a volunteer.",
        "success"
      );
    } catch {
      showToast("❌ Oops! Something went wrong. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="apply-form" className="w-full py-10 px-4 md:px-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full mx-auto p-6 md:p-8 bg-[#f9f0ee] rounded-2xl border border-red-200 shadow-sm"
      >
        <h2 className="text-center text-2xl font-semibold mb-10">
          Become A Part Of Us
        </h2>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="form-style grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <NameFields register={register} errors={errors} />

          <DateOfBirthField
            register={register}
            errors={errors}
            inputRef={inputRef}
          />

          <ContactFields register={register} errors={errors} />

          <PreferenceFields
            register={register}
            errors={errors}
            cities={cities}
          />

          <div className="sm:col-span-2 lg:col-span-2 flex flex-col h-full">
            <label className="mb-1">Why do you want to volunteer?</label>
            <textarea
              rows={4}
              {...register("why")}
              className="resize-none flex-1"
            />
          </div>

          <ImageUploadField
            file={file}
            setFile={setFile}
            imageError={imageError}
            setImageError={setImageError}
            dropRef={dropRef}
            onFileChange={onFileChange}
            handleDrop={handleDrop}
            handleDragOver={handleDragOver}
            handleDragLeave={handleDragLeave}
          />

          <div className="col-span-1 sm:col-span-2 lg:col-span-3 text-center mt-4">
            <motion.button
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={loading}
              className={`px-8 py-2 rounded-md font-semibold transition transform ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[var(--primary-color)] text-white hover:scale-[1.05] cursor-pointer"
              }`}
            >
              {loading ? "Submitting..." : "Submit"}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </section>
  );
}
