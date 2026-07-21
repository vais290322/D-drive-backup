import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";

// Reusable confirmation dialog for delete actions
export function DeleteConfirmDialog({
  triggerElement,
  title = "Are you sure?",
  description = "This action cannot be undone.",
  confirmLabel = "Delete",
  onConfirm,
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {triggerElement || (
          <button className="p-1 hover:bg-gray-200 rounded cursor-pointer">
            <Trash2 size={18} className="text-[var(--primary-color)]" />
          </button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-red-600 text-white hover:bg-red-700"
          >
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
