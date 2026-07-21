import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface GradientBadgeProps {
    children: React.ReactNode;
    variant?: "default" | "success" | "warning" | "error" | "info";
    className?: string;
}

const variantStyles = {
    default: "bg-gradient-to-r from-primary to-accent text-white",
    success: "bg-gradient-to-r from-green-500 to-emerald-500 text-white",
    warning: "bg-gradient-to-r from-amber-500 to-orange-500 text-white",
    error: "bg-gradient-to-r from-red-500 to-rose-500 text-white",
    info: "bg-gradient-to-r from-blue-500 to-indigo-500 text-white",
};

export function GradientBadge({
    children,
    variant = "default",
    className,
}: GradientBadgeProps) {
    return (
        <Badge
            className={cn(
                "border-0 shadow-sm hover:shadow-md transition-shadow",
                variantStyles[variant],
                className
            )}
        >
            {children}
        </Badge>
    );
}

