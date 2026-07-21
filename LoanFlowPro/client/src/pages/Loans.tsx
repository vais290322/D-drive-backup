import { useState } from "react";
import { LoansTable } from "@/components/LoansTable";
import { LoanApplicationForm } from "@/components/LoanApplicationForm";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from "lucide-react";

export default function Loans() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Loan Applications</h1>
          <p className="text-sm text-muted-foreground">
            Manage loan applications and approvals
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-add-loan">
              <Plus className="h-4 w-4 mr-2" />
              New Loan Application
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create Loan Application</DialogTitle>
            </DialogHeader>
            <LoanApplicationForm />
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all" data-testid="tab-all">All Loans</TabsTrigger>
          <TabsTrigger value="pending" data-testid="tab-pending">Pending Approval</TabsTrigger>
          <TabsTrigger value="active" data-testid="tab-active">Active</TabsTrigger>
          <TabsTrigger value="closed" data-testid="tab-closed">Closed</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <LoansTable />
        </TabsContent>
        <TabsContent value="pending">
          <LoansTable />
        </TabsContent>
        <TabsContent value="active">
          <LoansTable />
        </TabsContent>
        <TabsContent value="closed">
          <LoansTable />
        </TabsContent>
      </Tabs>
    </div>
  );
}
