import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface PremiumCardProps {
    title?: string;
    value?: string | number;
    subtitle?: string;
    icon?: LucideIcon;
    gradient?: string;
    iconBg?: string;
    iconColor?: string;
    trend?: string;
    trendUp?: boolean;
    onClick?: () => void;
    className?: string;
    children?: React.ReactNode;
    hideIcon?: boolean;
}

export function PremiumCard({
    title,
    value,
    subtitle,
    icon: Icon,
    gradient = "from-primary to-accent",
    iconBg = "bg-primary/10",
    iconColor = "text-primary",
    trend,
    trendUp,
    onClick,
    className,
    children,
    hideIcon = false,
}: PremiumCardProps) {
    return (
        <Card
            className={cn(
                "group relative overflow-hidden transition-all duration-300 border-0",
                onClick && "cursor-pointer hover:shadow-2xl hover:scale-105",
                !onClick && "hover:shadow-lg",
                `bg-gradient-to-br ${gradient} p-[1px]`,
                className
            )}
            onClick={onClick}
        >
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative bg-background rounded-lg h-full">
                {(title || value !== undefined) && (
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        {title && (
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                {title}
                            </CardTitle>
                        )}
                        {Icon && !hideIcon && (
                            <div
                                className={cn(
                                    "rounded-xl p-2.5 ring-1 ring-white/10 group-hover:scale-110 transition-transform duration-300",
                                    iconBg
                                )}
                            >
                                <Icon className={cn("h-5 w-5", iconColor)} />
                            </div>
                        )}
                    </CardHeader>
                )}
                <CardContent>
                    {value !== undefined && (
                        <div
                            className={cn(
                                "text-3xl font-bold bg-gradient-to-r bg-clip-text text-transparent",
                                gradient
                            )}
                        >
                            {value}
                        </div>
                    )}
                    {subtitle && (
                        <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
                    )}
                    {trend && (
                        <div className="flex items-center gap-1 mt-2">
                            {trendUp ? (
                                <span className="text-xs font-medium text-green-500">↑ {trend}</span>
                            ) : (
                                <span className="text-xs font-medium text-red-500">↓ {trend}</span>
                            )}
                            <span className="text-xs text-muted-foreground">vs last month</span>
                        </div>
                    )}
                    {children}
                </CardContent>
            </div>
        </Card>
    );
}

interface PremiumStatsCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    gradient: string;
    onClick?: () => void;
}

export function PremiumStatsCard({
    title,
    value,
    icon: Icon,
    gradient,
    onClick,
}: PremiumStatsCardProps) {
    const iconBg = gradient.replace("from-", "bg-").split(" ")[0] + "/10";
    const iconColor = gradient.replace("from-", "text-").split(" ")[0];

    return (
        <PremiumCard
            title={title}
            value={value}
            icon={Icon}
            gradient={gradient}
            iconBg={iconBg}
            iconColor={iconColor}
            onClick={onClick}
        />
    );
}

interface PremiumActionCardProps {
    title: string;
    description: string;
    icon: LucideIcon;
    gradient: string;
    onClick?: () => void;
}

export function PremiumActionCard({
    title,
    description,
    icon: Icon,
    gradient,
    onClick,
}: PremiumActionCardProps) {
    const iconColor = gradient.replace("from-", "text-").split(" ")[0];

    return (
        <div
            onClick={onClick}
            className={cn(
                "group block rounded-xl border border-border/50 p-6 transition-all hover:shadow-lg hover:scale-105",
                `bg-gradient-to-br ${gradient}/10`,
                `hover:border-${gradient.split("-")[1]}-500/50`,
                onClick && "cursor-pointer"
            )}
        >
            <Icon
                className={cn(
                    "h-8 w-8 mb-3 group-hover:scale-110 transition-transform",
                    iconColor
                )}
            />
            <h3 className="font-semibold text-lg mb-1">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
        </div>
    );
}

