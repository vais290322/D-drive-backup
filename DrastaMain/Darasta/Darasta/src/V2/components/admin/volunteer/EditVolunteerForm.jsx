import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useCityData } from "@/V2/hooks/useCityData";
import api from "@/V2/service";
import { useToast } from "@/context/ToastContext";

export function EditVolunteerForm({ data, onClose, onSuccess }) {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(data.profileImage || null);
  const [imageError, setImageError] = useState("");

  const fullNameParts = (data.fullName || "").split(" ");
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstName: fullNameParts[0] || "",
      middleName: fullNameParts.length === 3 ? fullNameParts[1] : "",
      lastName:
        fullNameParts.length === 3 ? fullNameParts[2] : fullNameParts[1] || "",
      ...data,
    },
  });

  const active = watch("active");
  const selectedState = watch("preferredState");
  const cities = useCityData(selectedState);

  const onSubmit = async (form) => {
    if (!file) {
      setImageError("Image is required");
      return;
    }

    const newFullName = [form.firstName, form.middleName, form.lastName]
      .filter(Boolean)
      .join(" ");

    const current = {
      fullName: newFullName,
      dob: form.dob,
      number: form.number,
      email: form.email,
      preferredRole: form.preferredRole,
      language: form.language,
      skill: form.skill,
      preferredState: form.preferredState,
      preferredCity: form.preferredCity || "",
      bloodGroup: form.bloodGroup,
      description: form.description || "",
      profileImage: file,
      active: form.active,
      rejectionReason: form.rejectionReason || "",
      status:
        data.status === "PENDING"
          ? "PENDING"
          : form.active
          ? "APPROVED"
          : "REJECTED",
    };

    const formData = new FormData();
    let hasChanges = false;

    for (const key in current) {
      const currentValue = current[key];
      const originalValue = data[key];

      if (key === "profileImage") {
        if (typeof currentValue !== "string") {
          formData.append("profileImage", currentValue);
          hasChanges = true;
        }
        continue;
      }

      if (currentValue !== originalValue) {
        formData.append(key, currentValue);
        hasChanges = true;
      }
    }

    if (!hasChanges) {
      showToast("⚠️ No changes to save", "info");
      return;
    }

    try {
      setLoading(true);
      await api.put(`/volunteer/${data.id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      showToast("✅ Volunteer updated successfully", "success");
      onSuccess?.();
      onClose();
    } catch {
      showToast("❌ Failed to update volunteer", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const fileObj = e.target.files[0];
    if (fileObj) {
      setFile(fileObj);
      setImageError("");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-2"
    >
      {/* Name fields */}
      <div>
        <label className="text-sm text-gray-700">First Name</label>
        <input
          {...register("firstName")}
          className="w-full border rounded px-3 py-2"
          placeholder="First Name"
        />
      </div>
      <div>
        <label className="text-sm text-gray-700">Middle Name</label>
        <input
          {...register("middleName")}
          className="w-full border rounded px-3 py-2"
          placeholder="Middle Name"
        />
      </div>
      <div>
        <label className="text-sm text-gray-700">Last Name</label>
        <input
          {...register("lastName")}
          className="w-full border rounded px-3 py-2"
          placeholder="Last Name"
        />
      </div>

      {/* Basic fields */}
      <div>
        <label className="text-sm text-gray-700">DOB</label>
        <input
          type="date"
          {...register("dob")}
          className="w-full border rounded px-3 py-2"
        />
      </div>
      <div>
        <label className="text-sm text-gray-700">Mobile</label>
        <input
          {...register("number")}
          className="w-full border rounded px-3 py-2"
        />
      </div>
      <div>
        <label className="text-sm text-gray-700">Email</label>
        <input
          type="email"
          {...register("email")}
          className="w-full border rounded px-3 py-2"
        />
      </div>
      <div>
        <label className="text-sm text-gray-700">Role</label>
        <input
          {...register("preferredRole")}
          className="w-full border rounded px-3 py-2"
        />
      </div>
      <div>
        <label className="text-sm text-gray-700">Language</label>
        <input
          {...register("language")}
          className="w-full border rounded px-3 py-2"
        />
      </div>
      <div>
        <label className="text-sm text-gray-700">Skill</label>
        <input
          {...register("skill")}
          className="w-full border rounded px-3 py-2"
        />
      </div>
      <div>
        <label className="text-sm text-gray-700">Blood Group</label>
        <input
          {...register("bloodGroup")}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      {/* Location */}
      <div>
        <label className="text-sm text-gray-700">State</label>
        <input
          {...register("preferredState")}
          className="w-full border rounded px-3 py-2"
        />
      </div>
      <div>
        <label className="text-sm text-gray-700">City</label>
        <select
          {...register("preferredCity")}
          className="w-full border rounded px-3 py-2"
        >
          <option value="">Select city</option>
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>

      {/* Description */}
      <div className="sm:col-span-2">
        <label className="text-sm text-gray-700">Why Volunteer</label>
        <textarea
          {...register("description")}
          rows={3}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      {/* Image Upload */}
      <div className="sm:col-span-2">
        <label className="text-sm text-gray-700">Profile Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full"
        />
        {file && (
          <img
            src={typeof file === "string" ? file : URL.createObjectURL(file)}
            alt="preview"
            className="w-24 h-24 mt-2 object-cover rounded-full"
          />
        )}
        {imageError && <p className="text-red-500 text-sm">{imageError}</p>}
      </div>

      {/* Active & Status */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          {...register("active")}
          id="active"
          disabled={data?.status === "PENDING"}
        />
        <label htmlFor="active">Active</label>
      </div>
      <div>
        <label className="text-sm text-gray-700">Status</label>
        <input
          readOnly
          value={
            data?.status === "PENDING"
              ? "PENDING"
              : active
              ? "APPROVED"
              : "REJECTED"
          }
          className="w-full border rounded px-3 py-2 bg-gray-100 cursor-not-allowed"
        />
      </div>

      {/* Rejection Reason */}
      {(!data?.active || !active) && (
        <div className="sm:col-span-2">
          <label className="text-sm">Rejection Reason (if rejected)</label>
          <input
            {...register("rejectionReason")}
            disabled={data?.status === "PENDING"}
            className="w-full border rounded px-3 py-2"
            placeholder="Why rejected?"
          />
        </div>
      )}

      {/* Buttons */}
      <div className="col-span-full flex justify-end mt-2 gap-2">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 bg-gray-200 rounded text-sm cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-[var(--primary-color)] text-white rounded text-sm cursor-pointer"
        >
          {loading ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
}
