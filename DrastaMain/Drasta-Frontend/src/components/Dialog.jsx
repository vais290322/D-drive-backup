import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

export function CustomDialog({
  trigger,
  title = "Dialog Title",
  description = "",
  children,
  footer,
  contentClass = "",
  open,
  onOpenChange,
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}

      <DialogContent
        className={`sm:max-w-[600px] xl:max-w-[700px] max-h-[80vh] overflow-y-auto rounded-2xl bg-white shadow-xl ${contentClass}`}
      >
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-2xl font-semibold text-zinc-800">
            {title}
          </DialogTitle>
          {description && (
            <DialogDescription className="text-sm text-zinc-500">
              {description}
            </DialogDescription>
          )}
        </DialogHeader>

        <div className=" py-2">{children}</div>

        {footer && (
          <DialogFooter className="mt-4 pt-4 border-t border-zinc-200">
            {footer}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
