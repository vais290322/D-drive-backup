import type { BusinessSettings } from "@/types/types";

interface DocumentFooterProps {
  settings: BusinessSettings | null;
  showTerms?: boolean;
  showBankDetails?: boolean;
}

export default function DocumentFooter({ 
  settings, 
  showTerms = true,
  showBankDetails = false 
}: DocumentFooterProps) {
  return (
    <div className="mt-8 border-t pt-6 space-y-4">
      {/* Bank Details */}
      {showBankDetails && (settings?.bank_name || settings?.bank_account) && (
        <div className="bg-muted/50 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Bank Details for Payment</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {settings.bank_name && (
              <div>
                <span className="font-medium">Bank Name:</span> {settings.bank_name}
              </div>
            )}
            {settings.bank_account && (
              <div>
                <span className="font-medium">Account Number:</span> {settings.bank_account}
              </div>
            )}
            {settings.bank_ifsc && (
              <div>
                <span className="font-medium">IFSC Code:</span> {settings.bank_ifsc}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Terms and Conditions */}
      {showTerms && settings?.terms_conditions && (
        <div className="text-sm">
          <h3 className="font-semibold mb-2">Terms & Conditions</h3>
          <p className="text-muted-foreground whitespace-pre-wrap">
            {settings.terms_conditions}
          </p>
        </div>
      )}

      {/* Footer Note */}
      <div className="text-center text-sm text-muted-foreground pt-4 border-t">
        <p>
          This is a computer-generated document from{" "}
          <span className="font-semibold">{settings?.company_name || "Digital Dreams"}</span>
        </p>
        {settings?.email && (
          <p className="mt-1">
            For queries, contact: {settings.email}
            {settings.phone && ` | ${settings.phone}`}
          </p>
        )}
      </div>
    </div>
  );
}

