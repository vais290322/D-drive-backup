import { useEffect, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useDropzone } from "react-dropzone";
import {
  ContactFields,
  DateOfBirthField,
  NameFields,
  PreferenceFields,
} from ".";
import { useCityData } from "@/V2/hooks/useCityData";
import { useToast } from "@/context/ToastContext";
import api from "@/V2/service";
import { motion } from "framer-motion";

export function ReusableVolunteerForm({ mode = "create", defaultValues = {}, onSuccess }) {
  const inputRef = useRef(null);
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [imageError, setImageError] = useState("");

  const fullNameMap = defaultValues?.fullName?.split(" ") || [];

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      namePart0: fullNameMap[0] || "",
      namePart1: fullNameMap.length === 3 ? fullNameMap[1] : "",
      namePart2: fullNameMap.length === 3 ? fullNameMap[2] : fullNameMap[1] || "",
      ...defaultValues,
    },
  });

  const selectedState = useWatch({ control, name: "state" });
  const cities = useCityData(selectedState);
  const isActive = watch("active");

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "image/*": [] },
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setFile(acceptedFiles[0]);
        setImageError("");
      }
    },
  });

  useEffect(() => {
    if (mode === "edit" && defaultValues?.profileImage) {
      setFile(defaultValues.profileImage);
    }
  }, [defaultValues, mode]);

  const onSubmit = async (data) => {
    if (!file) {
      setImageError("Image is required");
      return;
    }

    const payload = {
      fullName: [data.namePart0, data.namePart1, data.namePart2].filter(Boolean).join(" "),
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

    if (mode === "edit") {
      payload.active = data.active;
      payload.rejectionReason = data.rejectionReason || "";
      payload.status = data.active ? "APPROVED" : "REJECTED";
    }

    try {
      setLoading(true);
      if (mode === "create") {
        await api.post("/volunteer", payload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        showToast("🎉 Volunteer registered successfully!", "success");
        reset();
        setFile(null);
      } else {
        await api.put(`/volunteer/${defaultValues.id}`, payload);
        showToast("✅ Volunteer updated successfully!", "success");
      }
      onSuccess?.();
    } catch {
      showToast("❌ Something went wrong. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full py-10 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full mx-auto p-6 md:p-8 bg-[#f9f0ee] rounded-2xl border border-red-200 shadow-sm"
      >
        {mode === "create" && (
          <h1 className="mb-6 text-2xl font-semibold text-[var(--primary-color)]">Volunteer Registration</h1>
        )}

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="form-style grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <NameFields register={register} errors={errors} />
          <DateOfBirthField register={register} errors={errors} inputRef={inputRef} />
          <ContactFields register={register} errors={errors} />
          <PreferenceFields register={register} errors={errors} cities={cities} />

          <div className="sm:col-span-2 lg:col-span-2 flex flex-col h-full">
            <label className="mb-1">Why do you want to volunteer?</label>
            <textarea rows={4} {...register("why")} className="resize-none flex-1" />
          </div>

          {/* Image Upload */}
          <div
            {...getRootProps()}
            className={`sm:col-span-2 lg:col-span-1 border-2 border-dashed rounded-lg p-4 text-center cursor-pointer ${
              isDragActive ? "bg-purple-100 border-purple-400" : "border-gray-300"
            }`}
          >
            <input {...getInputProps()} />
            {file ? (
              <img
                src={typeof file === "string" ? file : URL.createObjectURL(file)}
                alt="Preview"
                className="mx-auto w-32 h-32 object-cover rounded-full"
              />
            ) : (
              <p className="text-sm text-gray-500">Drag and drop an image here, or click to select</p>
            )}
            {imageError && <p className="text-red-500 text-sm mt-2">{imageError}</p>}
          </div>

          {/* Admin-only fields */}
          {mode === "edit" && (
            <>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  {...register("active")}
                  id="active-checkbox"
                  className="w-4 h-4"
                />
                <label htmlFor="active-checkbox" className="text-sm font-medium">Active</label>
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-medium">Status</label>
                <input
                  type="text"
                  value={defaultValues?.status ? defaultValues.status : isActive ? "APPROVED" : "REJECTED"}
                  disabled
                  className="border rounded px-3 py-2 bg-gray-100 text-gray-700"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-sm font-medium">Rejection Reason</label>
                <input
                  {...register("rejectionReason")}
                  className="w-full px-3 py-2 border rounded"
                  placeholder="Optional reason if rejected"
                />
              </div>
            </>
          )}

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
              {loading
                ? mode === "edit"
                  ? "Saving..."
                  : "Submitting..."
                : mode === "edit"
                ? "Save Changes"
                : "Submit"}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </section>
  );
}
