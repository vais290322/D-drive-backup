import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, DollarSign, AlertCircle } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  trend?: {
    value: string;
    positive: boolean;
  };
}

function StatCard({ title, value, subtitle, icon, trend }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold font-mono" data-testid={`stat-${title.toLowerCase().replace(/\s+/g, '-')}`}>{value}</div>
        <div className="flex items-center gap-2 mt-1">
          <p className="text-xs text-muted-foreground">{subtitle}</p>
          {trend && (
            <span
              className={`text-xs font-medium ${
                trend.positive ? "text-chart-2" : "text-destructive"
              }`}
            >
              {trend.positive ? "+" : ""}{trend.value}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function DashboardStats() {
  // TODO: remove mock data - replace with real data from API
  const stats = [
    {
      title: "Total Customers",
      value: "1,234",
      subtitle: "Active customers",
      icon: <Users className="h-4 w-4" />,
      trend: { value: "12%", positive: true },
    },
    {
      title: "Active Loans",
      value: "567",
      subtitle: "Loans disbursed",
      icon: <FileText className="h-4 w-4" />,
      trend: { value: "8%", positive: true },
    },
    {
      title: "Total Outstanding",
      value: "₹45.2M",
      subtitle: "Pending amount",
      icon: <DollarSign className="h-4 w-4" />,
      trend: { value: "5%", positive: false },
    },
    {
      title: "Overdue Accounts",
      value: "23",
      subtitle: "Needs attention",
      icon: <AlertCircle className="h-4 w-4" />,
      trend: { value: "3%", positive: false },
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <StatCard key={stat.title} {...stat} />
      ))}
    </div>
  );
}
