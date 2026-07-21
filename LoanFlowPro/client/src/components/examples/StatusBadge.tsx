import { StatusBadge } from "../StatusBadge";

export default function StatusBadgeExample() {
  return (
    <div className="p-8 space-y-4">
      <div>
        <h3 className="text-sm font-medium mb-2">Loan Statuses</h3>
        <div className="flex flex-wrap gap-2">
          <StatusBadge status="draft" />
          <StatusBadge status="verification" />
          <StatusBadge status="approved" />
          <StatusBadge status="disbursed" />
          <StatusBadge status="closed" />
          <StatusBadge status="rejected" />
        </div>
      </div>
      <div>
        <h3 className="text-sm font-medium mb-2">Payment Statuses</h3>
        <div className="flex flex-wrap gap-2">
          <StatusBadge status="pending" />
          <StatusBadge status="paid" />
          <StatusBadge status="overdue" />
          <StatusBadge status="partial" />
        </div>
      </div>
    </div>
  );
}
