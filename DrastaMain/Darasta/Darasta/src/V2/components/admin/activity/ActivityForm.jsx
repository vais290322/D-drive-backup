import { useToast } from "@/context/ToastContext";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const defaultValues = {
  categoryId: "",
  eventTitle: "",
  eventDate: "",
  eventEndDate: "",
  description: "",
  location: "",
  totalHours: "",
  eventBannerUrl: null,
};

const getTomorrowDate = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split("T")[0];
};

export function ActivityForm({
  initialData = {},
  categories = [],
  onSubmit,
  loading = false,
  onAddCategoryClick,
}) {
  const isEditMode = Boolean(Object.keys(initialData).length);
  const { showToast } = useToast();

  const [preview, setPreview] = useState(
    typeof initialData?.eventBannerUrl === "string"
      ? initialData.eventBannerUrl
      : null
  );
  const [fileKey, setFileKey] = useState(Date.now());
  const [localCategories, setLocalCategories] = useState(categories);

  const tomorrow = getTomorrowDate();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: { ...defaultValues, ...initialData },
  });

  const startDate = watch("eventDate");

  useEffect(() => {
    if (isEditMode) {
      reset({ ...defaultValues, ...initialData });
      setPreview(
        typeof initialData?.eventBannerUrl === "string"
          ? initialData.eventBannerUrl
          : null
      );
      setFileKey(Date.now());
    }
  }, [initialData, isEditMode, reset]);

  useEffect(() => {
    setLocalCategories(categories);
  }, [categories]);

  useEffect(() => {
    if (initialData?.categoryId) {
      setValue("categoryId", initialData.categoryId);
    }
  }, [initialData?.categoryId, setValue]);

  const fileList = watch("eventBannerUrl");
  useEffect(() => {
    if (fileList && fileList.length > 0 && fileList[0] instanceof File) {
      const url = URL.createObjectURL(fileList[0]);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [fileList]);

  const submitHandler = async (values) => {
    try {
      const body = new FormData();
      [
        "categoryId",
        "eventTitle",
        "eventDate",
        "eventEndDate",
        "description",
        "location",
        "totalHours",
      ].forEach((key) => {
        if (values[key]) body.append(key, values[key]);
      });
      if (values.eventBannerUrl?.[0] instanceof File) {
        body.append("eventBannerUrl", values.eventBannerUrl[0]);
      }

      await onSubmit(body);
      setFileKey(Date.now());
      setPreview(null);
      reset(defaultValues);
    } catch (err) {
      console.error(err);
      showToast("Submit failed.", "error");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(submitHandler)}
      className="space-y-6 bg-white p-6 rounded-md"
    >
      <div>
        <label className="block text-sm font-medium mb-1">Title *</label>
        <input
          {...register("eventTitle", { required: "Title is required" })}
          className="w-full border border-gray-300 rounded-md px-3 py-2"
        />
        {errors.eventTitle && (
          <p className="text-red-500 text-sm mt-1">{errors.eventTitle.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          {...register("description")}
          rows={4}
          className="w-full border border-gray-300 rounded-md px-3 py-2"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="relative">
          <label className="block text-sm font-medium mb-1">Total Hours *</label>
          <div className="relative">
            <input
              type="number"
              min="0"
              {...register("totalHours", {
                required: "Total hours is required",
                min: { value: 0, message: "Can't be negative" },
              })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 pr-10"
              placeholder="Enter total hours"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm pointer-events-none">
              hr
            </span>
          </div>
          {errors.totalHours && (
            <p className="text-red-500 text-sm mt-1">
              {errors.totalHours.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Starts from *</label>
          <input
            type="date"
            min={tomorrow}
            {...register("eventDate", {
              required: "Start date is required",
              validate: (value) =>
                value >= tomorrow || "Start date must be from tomorrow",
            })}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          />
          {errors.eventDate && (
            <p className="text-red-500 text-sm mt-1">{errors.eventDate.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">End Date *</label>
          <input
            type="date"
            min={startDate || tomorrow}
            {...register("eventEndDate", {
              required: "End date is required",
              validate: (value) =>
                value >= (startDate || tomorrow) ||
                "End date must be after or equal to start date",
            })}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          />
          {errors.eventEndDate && (
            <p className="text-red-500 text-sm mt-1">
              {errors.eventEndDate.message}
            </p>
          )}
        </div>

        <div className="md:col-span-2 lg:col-span-1">
          <label className="block text-sm font-medium mb-1">Location *</label>
          <input
            {...register("location", {
              required: "Location is required",
            })}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
            placeholder="Enter location"
          />
          {errors.location && (
            <p className="text-red-500 text-sm mt-1">{errors.location.message}</p>
          )}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Category *</label>
          <div className="flex items-center gap-2">
            <select
              {...register("categoryId", {
                required: "Category is required",
              })}
              className="flex-1 border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="">Select category</option>
              {localCategories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={onAddCategoryClick}
              className="p-2 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200"
              title="Add Category"
            >
              <Plus size={16} />
            </button>
          </div>
          {errors.categoryId && (
            <p className="text-red-500 text-sm mt-1">{errors.categoryId.message}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Banner Image {isEditMode ? "(optional)" : "*"}
        </label>
        <input
          key={fileKey}
          type="file"
          accept="image/*"
          {...register("eventBannerUrl", {
            required: !isEditMode && "Image is required",
          })}
          className="w-full border border-gray-300 rounded-md px-3 py-2 cursor-pointer"
        />
        {errors.eventBannerUrl && (
          <p className="text-red-500 text-sm mt-1">
            {errors.eventBannerUrl.message}
          </p>
        )}
      </div>

      {preview && (
        <div className="mt-4">
          <label className="block text-sm font-medium mb-2">Image Preview</label>
          <div className="border rounded-lg overflow-hidden shadow-sm w-full max-w-xs">
            <img
              src={preview}
              alt="Preview"
              className="w-full object-cover h-48"
            />
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="cursor-pointer w-full bg-[var(--primary-color)] text-white py-2 rounded-md hover:opacity-90 transition"
      >
        {loading ? "Submitting…" : "Submit Request"}
      </button>
    </form>
  );
}
