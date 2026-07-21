import { DashboardStats } from "@/components/DashboardStats";
import { CollectionChart } from "@/components/CollectionChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoansTable } from "@/components/LoansTable";
import { Plus } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Welcome back! Here's your loan portfolio overview.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => console.log("Add new customer")}
            data-testid="button-add-customer"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Customer
          </Button>
          <Button
            onClick={() => console.log("Add new loan")}
            data-testid="button-add-loan"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Loan
          </Button>
        </div>
      </div>

      <DashboardStats />

      <div className="grid gap-6 md:grid-cols-2">
        <CollectionChart />
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* TODO: remove mock data - replace with real data from API */}
            <div className="flex items-start gap-3 pb-3 border-b">
              <div className="h-2 w-2 mt-2 rounded-full bg-chart-2" />
              <div className="flex-1">
                <p className="text-sm font-medium">Payment Received</p>
                <p className="text-xs text-muted-foreground">
                  Rajesh Kumar paid ₹23,603 for LN001
                </p>
                <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-start gap-3 pb-3 border-b">
              <div className="h-2 w-2 mt-2 rounded-full bg-chart-1" />
              <div className="flex-1">
                <p className="text-sm font-medium">Loan Approved</p>
                <p className="text-xs text-muted-foreground">
                  Business loan for Priya Sharma (LN002)
                </p>
                <p className="text-xs text-muted-foreground mt-1">5 hours ago</p>
              </div>
            </div>
            <div className="flex items-start gap-3 pb-3 border-b">
              <div className="h-2 w-2 mt-2 rounded-full bg-chart-3" />
              <div className="flex-1">
                <p className="text-sm font-medium">New Application</p>
                <p className="text-xs text-muted-foreground">
                  Gold loan application submitted by Amit Patel
                </p>
                <p className="text-xs text-muted-foreground mt-1">1 day ago</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Loans</CardTitle>
        </CardHeader>
        <CardContent>
          <LoansTable />
        </CardContent>
      </Card>
    </div>
  );
}
