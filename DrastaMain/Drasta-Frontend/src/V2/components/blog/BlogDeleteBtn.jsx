import { Trash2 } from "lucide-react";

export function BlogDeleteBtn({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="text-[var(--primary-color)] p-1 rounded-full transition cursor-pointer hover:scale-[1.1]"
      aria-label="Delete"
    >
      <Trash2 size={20} />
    </button>
  );
}
