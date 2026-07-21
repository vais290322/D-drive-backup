import { useToast } from "@/context/ToastContext";
import api from "@/V2/service";
import { useState, useEffect } from "react";

export function AddCategoryForm({ onCategoryAdded }) {
  const [newCategory, setNewCategory] = useState({
    title: "",
    description: "",
  });
  const [descError, setDescError] = useState("");
  const [titleError, setTitleError] = useState("");
  const [charCount, setCharCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    const descLength = newCategory.description?.trim().length || 0;
    setCharCount(descLength);

    if (!descLength) {
      setDescError("Description is required.");
    } else if (descLength < 300) {
      setDescError("Description must be at least 300 characters.");
    } else if (descLength > 400) {
      setDescError("Description must not exceed 400 characters.");
    } else {
      setDescError("");
    }

    if (!newCategory.title.trim()) {
      setTitleError("Title is required.");
    } else {
      setTitleError("");
    }
  }, [newCategory.description, newCategory.title]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (titleError || descError) return;

    try {
      setLoading(true);
      const {data: {data}} = await api.post("/initiatives/category", {
        title: newCategory.title.trim(),
        description: newCategory.description.trim(),
      });
      onCategoryAdded(data);
      setNewCategory({ title: "", description: "" });
      showToast("Category added successfully", "success");
    } catch (err) {
      console.error(err);
      showToast("Failed to add category", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="category-title"
          className="block text-sm font-medium mb-1"
        >
          Title *
        </label>
        <input
          id="category-title"
          value={newCategory.title}
          onChange={(e) =>
            setNewCategory((prev) => ({ ...prev, title: e.target.value }))
          }
          className="w-full border border-gray-300 rounded-md px-3 py-2"
          placeholder="Enter category title"
        />
        {titleError && (
          <div className="text-sm text-red-600 mt-1">{titleError}</div>
        )}
      </div>

      <div>
        <label
          htmlFor="category-description"
          className="block text-sm font-medium mb-1"
        >
          Description *
        </label>
        <textarea
          id="category-description"
          value={newCategory.description}
          onChange={(e) =>
            setNewCategory((prev) => ({ ...prev, description: e.target.value }))
          }
          rows={5}
          className="w-full border border-gray-300 rounded-md px-3 py-2"
          placeholder="Enter a detailed description (300-400 characters)"
        />
        <div className="text-sm mt-1 text-gray-500">
          Characters: {charCount} / 400
        </div>
        {descError && (
          <div className="text-sm text-red-600 mt-1">{descError}</div>
        )}
      </div>

      <button
        type="submit"
        disabled={loading || Boolean(descError || titleError)}
        className="w-full bg-[var(--primary-color)] text-white py-2 rounded-md hover:opacity-90 transition disabled:opacity-50 cursor-pointer"
      >
        {loading ? "Adding..." : "Add Category"}
      </button>
    </form>
  );
}
