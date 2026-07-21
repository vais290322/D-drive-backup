import { CustomDialog } from "@/components";
import { useToast } from "@/context/ToastContext";
import api from "@/V2/service";
import { Trash2 } from "lucide-react";
import { DeleteConfirmDialog } from "../../DeleteConfirmDialog";

export function CategoryManagerModal({ open, onClose, categories, refresh, onAddCategoryClick }) {
  const { showToast } = useToast();


  const handleDelete = async id => {
    try {
      await api.delete(`/initiatives/categories/${id}`);
      showToast("Category deleted", "success");
      refresh();
    } catch {
      showToast("Delete failed", "error");
    }
  };

  return (
    <CustomDialog open={open} onOpenChange={open => open ? null : onClose()} title="Manage Categories">
        <div className="w-full flex justify-end mb-4">
            <button onClick={onAddCategoryClick} className="bg-[var(--primary-color)] text-white px-4 py-2 rounded cursor-pointer">Add Category</button>
        </div>
      <div className="overflow-auto max-h-64">
        <table className="w-full bg-white rounded-lg shadow">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="px-4 py-2">Title</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.length > 0 ? categories.map(cat => (
              <tr key={cat.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">{cat.title}</td>
                <td className="px-4 py-2">
                  <DeleteConfirmDialog
                    onConfirm={() => handleDelete(cat.id)}
                    renderTrigger={props => (
                      <button {...props} className="p-1 hover:bg-gray-200 rounded">
                        <Trash2 size={18} />
                      </button>
                    )}
                  />
                </td>
              </tr>
            )) : (
                <tr>
                    <td colSpan="2" className="px-4 py-2 text-center text-gray-500">
                    No categories found
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </CustomDialog>
  );
}
