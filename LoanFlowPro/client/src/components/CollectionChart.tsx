import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export function CollectionChart() {
  // TODO: remove mock data - replace with real data from API
  const data = [
    { month: "Jan", collected: 2400000, target: 2800000 },
    { month: "Feb", collected: 2600000, target: 2800000 },
    { month: "Mar", collected: 2900000, target: 2800000 },
    { month: "Apr", collected: 2700000, target: 2800000 },
    { month: "May", collected: 3100000, target: 3000000 },
    { month: "Jun", collected: 2800000, target: 3000000 },
  ];

  const formatCurrency = (value: number) => {
    return `₹${(value / 100000).toFixed(1)}L`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Collections</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis
              dataKey="month"
              className="text-xs"
              tick={{ fill: "hsl(var(--muted-foreground))" }}
            />
            <YAxis
              className="text-xs"
              tick={{ fill: "hsl(var(--muted-foreground))" }}
              tickFormatter={formatCurrency}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--popover))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "6px",
              }}
              formatter={(value: number) => [
                new Intl.NumberFormat("en-IN", {
                  style: "currency",
                  currency: "INR",
                  maximumFractionDigits: 0,
                }).format(value),
              ]}
            />
            <Bar dataKey="collected" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
            <Bar dataKey="target" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
