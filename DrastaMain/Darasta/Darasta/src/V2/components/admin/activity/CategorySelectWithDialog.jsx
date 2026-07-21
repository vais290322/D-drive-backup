import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { useToast } from "@/context/ToastContext";
import api from "@/V2/service";
import {CustomDialog} from "@/components";

export function CategorySelectWithDialog({ value, onChange, categories }) {
  const [local, setLocal] = useState(categories);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const { showToast } = useToast();
  
  useEffect(() => setLocal(categories), [categories]);

  const addCategory = async () => {
    if (!newTitle.trim()) return;
    try {
      const { data } = await api.post("/initiatives/categories", { title: newTitle });
      showToast("Category added", "success");
      setLocal(prev => [...prev, data.data]);
      onChange(data.data.id);
      setDialogOpen(false);
      setNewTitle("");
    } catch {
      showToast("Add failed", "error");
    }
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <select
          value={value}
          onChange={e => onChange(e.target.value)}
          className="border rounded px-3 py-2 flex-1"
        >
          <option value="">Select category</option>
          {local.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
        </select>
        <button
          type="button"
          onClick={() => setDialogOpen(true)}
          className="p-2 bg-gray-100 border rounded hover:bg-gray-200"
        >
          <Plus size={16} />
        </button>
      </div>
      <CustomDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title="Add Category"
      >
        <div className="space-y-4">
          <input
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            className="w-full border rounded px-3 py-2"
            placeholder="New category title"
          />
          <button onClick={addCategory} className="btn-primary w-full">
            Add Category
          </button>
        </div>
      </CustomDialog>
    </>
  );
}