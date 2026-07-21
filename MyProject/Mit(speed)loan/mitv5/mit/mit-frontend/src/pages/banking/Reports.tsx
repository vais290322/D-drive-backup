import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, TrendingUp, TrendingDown, Users, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import {
  getDailyTransactionSummary,
  getCustomerBalanceSummary,
  getBankingDashboardStats,
} from '@/db/bankingApi';
import { formatCurrency } from '@/lib/currency';
import type {
  DailyTransactionSummary,
  CustomerBalanceSummary,
  BankingDashboardStats,
} from '@/types/types';

export default function Reports() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<BankingDashboardStats | null>(null);
  const [dailySummary, setDailySummary] = useState<DailyTransactionSummary[]>([]);
  const [customerBalances, setCustomerBalances] = useState<CustomerBalanceSummary[]>([]);
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    loadAllReports();
  }, []);

  const loadAllReports = async () => {
    try {
      setLoading(true);
      const [statsData, summaryData, balancesData] = await Promise.all([
        getBankingDashboardStats(),
        getDailyTransactionSummary(dateRange.start, dateRange.end),
        getCustomerBalanceSummary(),
      ]);
      setStats(statsData);
      setDailySummary(summaryData);
      setCustomerBalances(balancesData);
    } catch (error) {
      console.error('Error loading reports:', error);
      toast({
        title: 'Error',
        description: 'Failed to load reports',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDateRangeChange = async () => {
    try {
      setLoading(true);
      const summaryData = await getDailyTransactionSummary(dateRange.start, dateRange.end);
      setDailySummary(summaryData);
      toast({
        title: 'Report Updated',
        description: `Showing data from ${dateRange.start} to ${dateRange.end}`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update report',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading && !stats) {
    return (
      <div className="p-6 xl:p-8">
        <div className="mb-6">
          <h1 className="text-2xl xl:text-3xl font-bold">Banking Reports</h1>
          <p className="text-muted-foreground mt-1">Loading reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 xl:p-8">
      <div className="mb-6 print:hidden">
        <Button variant="ghost" onClick={() => navigate('/banking')} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
          <div>
            <h1 className="text-2xl xl:text-3xl font-bold">Banking Reports</h1>
            <p className="text-muted-foreground mt-1">Analytical insights and summaries</p>
          </div>
          <Button onClick={handlePrint} variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Print Reports
          </Button>
        </div>
      </div>

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Customers
              </CardTitle>
              <Users className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total_customers}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Balance
              </CardTitle>
              <DollarSign className="h-5 w-5 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(stats.total_balance)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Deposits Today
              </CardTitle>
              <TrendingUp className="h-5 w-5 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">
                {formatCurrency(stats.total_deposits_today)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Withdrawals Today
              </CardTitle>
              <TrendingDown className="h-5 w-5 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">
                {formatCurrency(stats.total_withdrawals_today)}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="daily" className="space-y-6">
        <TabsList className="print:hidden">
          <TabsTrigger value="daily">Daily Summary</TabsTrigger>
          <TabsTrigger value="customers">Customer Balances</TabsTrigger>
          <TabsTrigger value="cashflow">Cash Flow</TabsTrigger>
        </TabsList>

        <TabsContent value="daily" className="space-y-4">
          <Card className="print:hidden">
            <CardHeader>
              <CardTitle>Date Range</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 items-end">
                <div className="flex-1">
                  <Label htmlFor="start_date">Start Date</Label>
                  <Input
                    id="start_date"
                    type="date"
                    value={dateRange.start}
                    onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                  />
                </div>
                <div className="flex-1">
                  <Label htmlFor="end_date">End Date</Label>
                  <Input
                    id="end_date"
                    type="date"
                    value={dateRange.end}
                    onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                  />
                </div>
                <Button onClick={handleDateRangeChange} disabled={loading}>
                  Update
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Daily Transaction Summary</CardTitle>
            </CardHeader>
            <CardContent>
              {dailySummary.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No transactions in selected date range
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Deposits</TableHead>
                        <TableHead className="text-right">Withdrawals</TableHead>
                        <TableHead className="text-right">Transactions</TableHead>
                        <TableHead className="text-right">Net Change</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {dailySummary.map((summary) => (
                        <TableRow key={summary.date}>
                          <TableCell>{formatDate(summary.date)}</TableCell>
                          <TableCell className="text-right text-success font-medium">
                            {formatCurrency(summary.total_deposits)}
                          </TableCell>
                          <TableCell className="text-right text-destructive font-medium">
                            {formatCurrency(summary.total_withdrawals)}
                          </TableCell>
                          <TableCell className="text-right">{summary.transaction_count}</TableCell>
                          <TableCell
                            className={`text-right font-semibold ${
                              summary.net_change >= 0 ? 'text-success' : 'text-destructive'
                            }`}
                          >
                            {summary.net_change >= 0 ? '+' : ''}{formatCurrency(summary.net_change)}
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow className="font-bold bg-muted">
                        <TableCell>Total</TableCell>
                        <TableCell className="text-right text-success">
                          {formatCurrency(dailySummary.reduce((sum, s) => sum + s.total_deposits, 0))}
                        </TableCell>
                        <TableCell className="text-right text-destructive">
                          {formatCurrency(dailySummary.reduce((sum, s) => sum + s.total_withdrawals, 0))}
                        </TableCell>
                        <TableCell className="text-right">
                          {dailySummary.reduce((sum, s) => sum + s.transaction_count, 0)}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(dailySummary.reduce((sum, s) => sum + s.net_change, 0))}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customers">
          <Card>
            <CardHeader>
              <CardTitle>Customer Account Balances</CardTitle>
            </CardHeader>
            <CardContent>
              {customerBalances.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No customer accounts found</p>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Customer Name</TableHead>
                        <TableHead>Account Number</TableHead>
                        <TableHead className="text-right">Balance</TableHead>
                        <TableHead>Last Transaction</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {customerBalances.map((customer) => (
                        <TableRow key={customer.customer_id}>
                          <TableCell className="font-medium">{customer.customer_name}</TableCell>
                          <TableCell>{customer.account_number}</TableCell>
                          <TableCell className="text-right font-semibold text-success">
                            {formatCurrency(customer.balance)}
                          </TableCell>
                          <TableCell>
                            {customer.last_transaction_date
                              ? formatDate(customer.last_transaction_date)
                              : 'No transactions'}
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow className="font-bold bg-muted">
                        <TableCell colSpan={2}>Total</TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(customerBalances.reduce((sum, c) => sum + c.balance, 0))}
                        </TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cashflow">
          <Card>
            <CardHeader>
              <CardTitle>Cash Flow Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              {stats && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="pt-6">
                        <p className="text-sm text-muted-foreground mb-2">Total Inflow (Today)</p>
                        <p className="text-2xl font-bold text-success">
                          {formatCurrency(stats.total_deposits_today)}
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <p className="text-sm text-muted-foreground mb-2">Total Outflow (Today)</p>
                        <p className="text-2xl font-bold text-destructive">
                          {formatCurrency(stats.total_withdrawals_today)}
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <p className="text-sm text-muted-foreground mb-2">Net Cash Flow (Today)</p>
                        <p
                          className={`text-2xl font-bold ${
                            stats.total_deposits_today - stats.total_withdrawals_today >= 0
                              ? 'text-success'
                              : 'text-destructive'
                          }`}
                        >
                          {formatCurrency(stats.total_deposits_today - stats.total_withdrawals_today)}
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardContent className="pt-6">
                        <p className="text-sm text-muted-foreground mb-2">Total Accounts</p>
                        <p className="text-xl font-semibold">{stats.total_accounts}</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <p className="text-sm text-muted-foreground mb-2">Active Accounts</p>
                        <p className="text-xl font-semibold">{stats.active_accounts}</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

