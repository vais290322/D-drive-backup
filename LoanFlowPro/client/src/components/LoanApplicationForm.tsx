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

export function LoanApplicationForm() {
  const [formData, setFormData] = useState({
    customerId: "",
    loanType: "",
    amount: "",
    interestRate: "",
    duration: "",
  });

  const [emiAmount, setEmiAmount] = useState<number | null>(null);

  const calculateEMI = () => {
    const principal = parseFloat(formData.amount);
    const rate = parseFloat(formData.interestRate) / 12 / 100;
    const tenure = parseInt(formData.duration);

    if (principal && rate && tenure) {
      const emi =
        (principal * rate * Math.pow(1 + rate, tenure)) /
        (Math.pow(1 + rate, tenure) - 1);
      setEmiAmount(Math.round(emi));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Loan application submitted:", formData, "EMI:", emiAmount);
  };

  const handleChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
    setEmiAmount(null);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>New Loan Application</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="customerId">Customer *</Label>
              <Select
                value={formData.customerId}
                onValueChange={(value) => handleChange("customerId", value)}
              >
                <SelectTrigger data-testid="select-customer">
                  <SelectValue placeholder="Select customer" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Rajesh Kumar</SelectItem>
                  <SelectItem value="2">Priya Sharma</SelectItem>
                  <SelectItem value="3">Amit Patel</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="loanType">Loan Type *</Label>
              <Select
                value={formData.loanType}
                onValueChange={(value) => handleChange("loanType", value)}
              >
                <SelectTrigger data-testid="select-loan-type">
                  <SelectValue placeholder="Select loan type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="personal">Personal Loan</SelectItem>
                  <SelectItem value="business">Business Loan</SelectItem>
                  <SelectItem value="gold">Gold Loan</SelectItem>
                  <SelectItem value="home">Home Loan</SelectItem>
                  <SelectItem value="vehicle">Vehicle Loan</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="amount">Loan Amount (₹) *</Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                placeholder="500000"
                value={formData.amount}
                onChange={(e) => handleChange("amount", e.target.value)}
                className="font-mono"
                required
                data-testid="input-amount"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="interestRate">Interest Rate (%) *</Label>
              <Input
                id="interestRate"
                name="interestRate"
                type="number"
                step="0.1"
                placeholder="12.5"
                value={formData.interestRate}
                onChange={(e) => handleChange("interestRate", e.target.value)}
                className="font-mono"
                required
                data-testid="input-interest-rate"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (Months) *</Label>
              <Input
                id="duration"
                name="duration"
                type="number"
                placeholder="24"
                value={formData.duration}
                onChange={(e) => handleChange("duration", e.target.value)}
                className="font-mono"
                required
                data-testid="input-duration"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={calculateEMI}
              data-testid="button-calculate-emi"
            >
              Calculate EMI
            </Button>
            {emiAmount && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">EMI Amount:</span>
                <span className="text-lg font-bold font-mono" data-testid="text-emi-amount">
                  {formatCurrency(emiAmount)}
                </span>
              </div>
            )}
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <Button type="button" variant="outline" data-testid="button-cancel">
              Cancel
            </Button>
            <Button type="submit" data-testid="button-submit">
              Submit Application
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
