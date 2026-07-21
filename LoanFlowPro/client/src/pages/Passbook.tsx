import { useState } from "react";
import { PassbookView } from "@/components/PassbookView";
import { LoanDetailsCard } from "@/components/LoanDetailsCard";
import { EMISchedule } from "@/components/EMISchedule";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export default function Passbook() {
  const [selectedLoan, setSelectedLoan] = useState("LN001");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Loan Passbook</h1>
          <p className="text-sm text-muted-foreground">
            View complete transaction history and EMI schedule
          </p>
        </div>
        <div className="w-[280px]">
          <Label htmlFor="loan-select" className="text-sm mb-2 block">
            Select Loan Account
          </Label>
          <Select value={selectedLoan} onValueChange={setSelectedLoan}>
            <SelectTrigger id="loan-select" data-testid="select-loan">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="LN001">LN001 - Rajesh Kumar</SelectItem>
              <SelectItem value="LN002">LN002 - Priya Sharma</SelectItem>
              <SelectItem value="LN003">LN003 - Amit Patel</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <LoanDetailsCard />
      <PassbookView />
      <EMISchedule />
    </div>
  );
}
