import { Badge } from "@/components/ui/badge";

export type LoanStatus = "draft" | "verification" | "approved" | "disbursed" | "closed" | "rejected";
export type PaymentStatus = "pending" | "paid" | "overdue" | "partial";

interface StatusBadgeProps {
  status: LoanStatus | PaymentStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const getVariant = (status: string) => {
    switch (status) {
      case "approved":
      case "disbursed":
      case "paid":
      case "closed":
        return "default" as const;
      case "draft":
      case "pending":
        return "secondary" as const;
      case "verification":
      case "partial":
        return "outline" as const;
      case "overdue":
      case "rejected":
        return "destructive" as const;
      default:
        return "secondary" as const;
    }
  };

  const getLabel = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <Badge variant={getVariant(status)} className={className} data-testid={`badge-status-${status}`}>
      {getLabel(status)}
    </Badge>
  );
}
