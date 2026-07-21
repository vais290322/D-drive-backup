import { Loader2 } from "lucide-react";

export const Loader = ({ className, size = 30 }) => {
    return (
      <div
        className={`
          "w-full h-full flex items-center justify-center p-4",
          ${className}`
        }
      >
        <Loader2
          className="animate-spin text-muted-foreground"
          size={size}
          strokeWidth={2.5}
        />
      </div>
    );
  };