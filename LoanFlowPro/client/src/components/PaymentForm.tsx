import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

export function PaymentForm() {
  const [formData, setFormData] = useState({
    loanId: "",
    amount: "",
    paymentMethod: "",
    transactionId: "",
  });
  const [paymentDate, setPaymentDate] = useState<Date>(new Date());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Payment recorded:", { ...formData, paymentDate });
  };

  const handleChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Record Payment</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="loanId">Loan ID *</Label>
              <Select
                value={formData.loanId}
                onValueChange={(value) => handleChange("loanId", value)}
              >
                <SelectTrigger data-testid="select-loan">
                  <SelectValue placeholder="Select loan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LN001">LN001 - Rajesh Kumar</SelectItem>
                  <SelectItem value="LN002">LN002 - Priya Sharma</SelectItem>
                  <SelectItem value="LN003">LN003 - Amit Patel</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Payment Amount (₹) *</Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                placeholder="23603"
                value={formData.amount}
                onChange={(e) => handleChange("amount", e.target.value)}
                className="font-mono"
                required
                data-testid="input-amount"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="paymentMethod">Payment Method *</Label>
              <Select
                value={formData.paymentMethod}
                onValueChange={(value) => handleChange("paymentMethod", value)}
              >
                <SelectTrigger data-testid="select-payment-method">
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="upi">UPI</SelectItem>
                  <SelectItem value="card">Card</SelectItem>
                  <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                  <SelectItem value="cheque">Cheque</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Payment Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                    data-testid="button-select-date"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(paymentDate, "PPP")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={paymentDate}
                    onSelect={(date) => date && setPaymentDate(date)}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="transactionId">Transaction ID / Reference</Label>
            <Input
              id="transactionId"
              name="transactionId"
              placeholder="TXN123456789"
              value={formData.transactionId}
              onChange={(e) => handleChange("transactionId", e.target.value)}
              className="font-mono"
              data-testid="input-transaction-id"
            />
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <Button type="button" variant="outline" data-testid="button-cancel">
              Cancel
            </Button>
            <Button type="submit" data-testid="button-submit">
              Record Payment & Generate Receipt
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
