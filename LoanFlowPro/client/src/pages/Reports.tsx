import { CollectionChart } from "@/components/CollectionChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText, TrendingUp, TrendingDown } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Reports() {
  // TODO: remove mock data - replace with real data from API
  const summaryStats = [
    {
      label: "Total Disbursed (This Month)",
      value: "₹5.2M",
      trend: "+12%",
      positive: true,
    },
    {
      label: "Collections (This Month)",
      value: "₹2.8M",
      trend: "+8%",
      positive: true,
    },
    {
      label: "Overdue Amount",
      value: "₹450K",
      trend: "-5%",
      positive: true,
    },
    {
      label: "Default Rate",
      value: "2.1%",
      trend: "+0.3%",
      positive: false,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Reports & Analytics</h1>
          <p className="text-sm text-muted-foreground">
            Generate reports and analyze loan portfolio performance
          </p>
        </div>
        <Button data-testid="button-export-report">
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {summaryStats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <div className="flex items-end justify-between">
                  <p className="text-2xl font-bold font-mono">{stat.value}</p>
                  <div
                    className={`flex items-center gap-1 text-sm font-medium ${
                      stat.positive ? "text-chart-2" : "text-destructive"
                    }`}
                  >
                    {stat.positive ? (
                      <TrendingUp className="h-4 w-4" />
                    ) : (
                      <TrendingDown className="h-4 w-4" />
                    )}
                    {stat.trend}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="collections" className="space-y-4">
        <TabsList>
          <TabsTrigger value="collections" data-testid="tab-collections">
            Collections
          </TabsTrigger>
          <TabsTrigger value="disbursements" data-testid="tab-disbursements">
            Disbursements
          </TabsTrigger>
          <TabsTrigger value="overdue" data-testid="tab-overdue">
            Overdue Analysis
          </TabsTrigger>
        </TabsList>
        <TabsContent value="collections">
          <CollectionChart />
        </TabsContent>
        <TabsContent value="disbursements">
          <CollectionChart />
        </TabsContent>
        <TabsContent value="overdue">
          <CollectionChart />
        </TabsContent>
      </Tabs>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Reports</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => console.log("Generate monthly collection report")}
              data-testid="button-monthly-collection"
            >
              <FileText className="h-4 w-4 mr-2" />
              Monthly Collection Report
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => console.log("Generate overdue accounts")}
              data-testid="button-overdue-accounts"
            >
              <FileText className="h-4 w-4 mr-2" />
              Overdue Accounts List
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => console.log("Generate loan portfolio")}
              data-testid="button-loan-portfolio"
            >
              <FileText className="h-4 w-4 mr-2" />
              Loan Portfolio Summary
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => console.log("Generate customer report")}
              data-testid="button-customer-report"
            >
              <FileText className="h-4 w-4 mr-2" />
              Customer Analysis Report
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Export Options</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => console.log("Export to PDF")}
              data-testid="button-export-pdf"
            >
              <Download className="h-4 w-4 mr-2" />
              Export as PDF
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => console.log("Export to Excel")}
              data-testid="button-export-excel"
            >
              <Download className="h-4 w-4 mr-2" />
              Export as Excel
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => console.log("Export to CSV")}
              data-testid="button-export-csv"
            >
              <Download className="h-4 w-4 mr-2" />
              Export as CSV
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
