import React, { useEffect, useState } from "react";
import { CustomDialog } from "@/components";
import api from "@/V2/service";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { BlogCard, BlogView, BlogEditForm } from "@/V2/components/admin/blog";
import { useToast } from "@/context/ToastContext";
import { DeleteConfirmDialog } from "@/V2/components";

export function CurrentBlog({ blogs, loading, error, setError, fetchPublished }) {
  const { showToast } = useToast();
  const [dialogMode, setDialogMode] = useState(null); // "view" | "edit"
  const [selected, setSelected] = useState(null);

  // clear error after 3s
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [error, setError]);

  // Delete handler
  const handleDelete = async (id) => {
    try {
      await api.delete(`/blogs/${id}`);
      showToast("Blog deleted successfully.", "success");
      fetchPublished();
    } catch {
      showToast("Failed to delete blog.", "error");
    }
  };

  // Update handler
  const handleUpdate = async (id, formData) => {
    if (!selected) return;
    try {
      await api.put(`/blogs/${id}`, formData);
      showToast("Blog updated successfully.", "success");
      setDialogMode(null);
      setSelected(null);
      fetchPublished();
    } catch {
      showToast("Failed to update blog.", "error");
    }
  };

  return (
    <>
      <div className="h-[1px] w-[98%] bg-[#9225211a] my-4" />
      {error && <p className="text-center py-4 text-red-600">{error}</p>}
      {loading ? (
        <p className="text-center py-4">Loading...</p>
      ) : blogs.length === 0 ? (
        <p className="text-center text-gray-600 py-6">No blogs found.</p>
      ) : (
        <div className="w-full flex-1 overflow-y-auto space-y-3 pr-2 max-h-[400px]">
          {blogs.map((blog) => (
            <BlogCard
              key={blog.id}
              data={blog}
              actions={[
                {
                  label: "View",
                  icon: Eye,
                  onClick: () => {
                    setSelected(blog);
                    setDialogMode("view");
                  },
                },
                {
                  label: "Edit",
                  icon: Pencil,
                  onClick: () => {
                    setSelected(blog);
                    setDialogMode("edit");
                  },
                },
                {
                  label: "Delete",
                  icon: Trash2,
                  // use DeleteConfirmDialog for confirmation
                  triggerElement: (props) => (
                    <DeleteConfirmDialog
                      {...props}
                      title="Delete Blog?"
                      description={`Delete \"${blog.title}\"?`}
                      onConfirm={() => handleDelete(blog.id)}
                    />
                  ),
                },
              ]}
            />
          ))}
        </div>
      )}

      {/* View Dialog */}
      <CustomDialog
        open={dialogMode === "view"}
        onOpenChange={(o) => {
          setDialogMode(o ? "view" : null);
          if (!o) setSelected(null);
        }}
        title="Published Blog"
      >
        <BlogView data={selected} />
      </CustomDialog>

      {/* Edit Dialog */}
      <CustomDialog
        open={dialogMode === "edit"}
        onOpenChange={(o) => {
          setDialogMode(o ? "edit" : null);
          if (!o) setSelected(null);
        }}
        title={`Edit: ${selected?.title || ""}`}
      >
        <BlogEditForm initialData={selected || {}} onSubmit={handleUpdate} />
      </CustomDialog>
    </>
  );
}
