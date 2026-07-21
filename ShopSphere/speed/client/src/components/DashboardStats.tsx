import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface DashboardStatsProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export function DashboardStats({
  title,
  value,
  icon: Icon,
  description,
  trend,
}: DashboardStatsProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold font-heading" data-testid="text-stat-value">
          {value}
        </div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
        {trend && (
          <p
            className={`text-xs mt-2 font-medium ${
              trend.isPositive ? "text-green-600" : "text-red-600"
            }`}
            data-testid="text-trend"
          >
            {trend.isPositive ? "+" : ""}
            {trend.value}% from last month
          </p>
        )}
      </CardContent>
    </Card>
  );
}
