import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
    Home,
    Users,
    FileText,
    DollarSign,
    Menu
} from "lucide-react";

interface BottomNavProps {
    onMenuClick: () => void;
}

export default function BottomNav({ onMenuClick }: BottomNavProps) {
    const location = useLocation();

    const navItems = [
        {
            name: "Home",
            path: "/",
            icon: Home,
        },
        {
            name: "Customers",
            path: "/customers",
            icon: Users,
        },
        {
            name: "Loans",
            path: "/loans",
            icon: FileText,
        },
        {
            name: "Collect",
            path: "/collections",
            icon: DollarSign,
        },
    ];

    const isActive = (path: string) => {
        if (path === "/" && location.pathname !== "/") return false;
        return location.pathname.startsWith(path);
    };

    return (
        <div className="fixed bottom-0 left-0 right-0 z-[100] bg-background border-t border-border shadow-[0_-5px_15px_rgba(0,0,0,0.05)] lg:hidden pb-safe">
            <div className="flex justify-around items-center p-3">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.path);

                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={cn(
                                "flex flex-col items-center justify-center gap-1.5 rounded-xl transition-all duration-300 min-w-[4rem]",
                                active
                                    ? "text-primary font-bold"
                                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                            )}
                        >
                            <div debug-id="icon-wrapper" className={cn(
                                "p-2 rounded-full transition-all duration-300 relative",
                                active ? "bg-primary text-primary-foreground shadow-md -translate-y-1" : "bg-transparent"
                            )}>
                                <Icon className={cn("h-5 w-5", active && "fill-current")} />
                            </div>
                            <span className={cn(
                                "text-[10px] tracking-wide transition-all duration-300",
                                active ? "opacity-100 translate-y-0" : "opacity-80 translate-y-0"
                            )}>{item.name}</span>
                        </Link>
                    );
                })}

                {/* Menu Button (triggers Sidebar) */}
                <button
                    onClick={onMenuClick}
                    className="flex flex-col items-center justify-center gap-1.5 rounded-xl transition-all duration-300 min-w-[4rem] text-muted-foreground hover:text-foreground hover:bg-muted/50"
                >
                    <div className="p-2 rounded-full bg-transparent">
                        <Menu className="h-5 w-5" />
                    </div>
                    <span className="text-[10px] tracking-wide opacity-80">Menu</span>
                </button>
            </div>
            {/* Safe Area Spacer for iOS Home Indicator is handled by pb-safe padding on container */}
        </div>
    );
}
