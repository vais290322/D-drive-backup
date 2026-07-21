import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CheckCircle, XCircle, FileText, Image as ImageIcon, AlertCircle, Camera } from "lucide-react";
import { api } from "@/db/api";
import { useToast } from "@/hooks/use-toast";
import type { Customer } from "@/types/types";
import CameraCapture from "@/components/CameraCapture";

interface KYCVerificationDialogProps {
  customer: Customer;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onVerified: () => void;
}

export default function KYCVerificationDialog({
  customer,
  open,
  onOpenChange,
  onVerified,
}: KYCVerificationDialogProps) {
  const [remarks, setRemarks] = useState(customer.kyc_remarks || "");
  const [loading, setLoading] = useState(false);
  const [kycPhoto, setKycPhoto] = useState<string | null>(customer.kyc_photo_url || null);
  const [showCamera, setShowCamera] = useState(false);
  const { toast } = useToast();

  const handleCameraCapture = (imageDataUrl: string) => {
    setKycPhoto(imageDataUrl);
    toast({
      title: "Photo Captured",
      description: "Live verification photo captured successfully",
    });
  };

  const handleVerify = async (status: 'verified' | 'rejected') => {
    // if (!remarks.trim()) {
    //   toast({
    //     title: "Remarks Required",
    //     description: "Please provide remarks for KYC verification",
    //     variant: "destructive",
    //   });
    //   return;
    // }

    // if (status === 'verified' && !kycPhoto) {
    //   toast({
    //     title: "Live Photo Required",
    //     description: "Please capture a live photo for KYC verification",
    //     variant: "destructive",
    //   });
    //   return;
    // }

    try {
      setLoading(true);
      const currentUser = await api?.auth?.getCurrentUser();
      console.log("Current User:", currentUser)
      await api.customers.updateKYC(
        customer.id,
        status,
        remarks,
        currentUser?.full_name || currentUser?.email || 'System',
        kycPhoto
      );

      toast({
        title: "KYC Updated",
        description: `KYC status updated to ${status}`,
      });

      onVerified();
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating KYC:", error);
      toast({
        title: "Error",
        description: "Failed to update KYC status",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      verified: "default",
      pending: "secondary",
      rejected: "destructive",
    };
    return (
      <Badge variant={variants[status] || "secondary"}>
        {status.toUpperCase()}
      </Badge>
    );
  };

  const DocumentPreview = ({ label, url }: { label: string; url: string | null }) => {
    if (!url) {
      return (
        <div className="border rounded-lg p-4 text-center text-muted-foreground">
          <AlertCircle className="h-8 w-8 mx-auto mb-2" />
          <p className="text-sm">No {label} uploaded</p>
        </div>
      );
    }

    const isImage = url.startsWith('data:image/') || url.match(/\.(jpg|jpeg|png|gif|webp)$/i);

    return (
      <div className="border rounded-lg p-2 bg-green-600">
        <p className="text-sm font-medium mb-2">{label}</p>
        {isImage ? (
          <img
            src={url}
            alt={label}
            className="w-full h-48 object-contain rounded"
          />
        ) : (
          <div className="flex items-center justify-center h-48 bg-muted rounded">
            <FileText className="h-12 w-12 text-muted-foreground" />
          </div>
        )}
        <Button
          variant="outline"
          size="sm"
          className="w-full mt-2"
          onClick={() => window.open(url, '_blank')}
        >
          View Full Size
        </Button>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>KYC Verification - {customer.full_name}</span>
            {getStatusBadge(customer.kyc_status)}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Customer Basic Info */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
            <div>
              <p className="text-sm text-muted-foreground">Customer Code</p>
              <p className="font-medium">{customer.customer_code}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Mobile</p>
              <p className="font-medium">{customer.mobile_primary}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{customer.email || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Date of Birth</p>
              <p className="font-medium">{customer.date_of_birth || '-'}</p>
            </div>
          </div>

          {/* KYC Details */}
          <div className="grid grid-cols-2 gap-4 p-4 border rounded-lg">
            <div>
              <p className="text-sm text-muted-foreground">Aadhaar Number</p>
              <p className="font-medium">{customer.aadhaar_number || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">PAN Number</p>
              <p className="font-medium">{customer.pan_number || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Voter ID</p>
              <p className="font-medium">{customer.voter_id || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Driving License</p>
              <p className="font-medium">{customer.driving_license || '-'}</p>
            </div>
          </div>

          {/* KYC Documents */}
          <div>
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              KYC Documents
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <DocumentPreview label="Aadhaar Front" url={customer.aadhaar_front_url} />
              <DocumentPreview label="Aadhaar Back" url={customer.aadhaar_back_url} />
              <DocumentPreview label="PAN Card" url={customer.pan_card_url} />
              <DocumentPreview label="Photo" url={customer.photo_url} />
              <DocumentPreview label="Signature" url={customer.signature_url} />
              <DocumentPreview label="Address Proof" url={customer.address_proof_url} />
            </div>
          </div>

          {/* Bank Details */}
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold mb-3">Bank Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Bank Name</p>
                <p className="font-medium">{customer.bank_name || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Account Number</p>
                <p className="font-medium">{customer.account_number || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">IFSC Code</p>
                <p className="font-medium">{customer.ifsc_code || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Branch</p>
                <p className="font-medium">{customer.branch_name || '-'}</p>
              </div>
            </div>
            {customer.cancelled_cheque_url && (
              <div className="mt-4">
                <DocumentPreview label="Cancelled Cheque" url={customer.cancelled_cheque_url} />
              </div>
            )}
          </div>

          {/* Previous Verification Info */}
          {customer.kyc_verified_by && (
            <div className="p-4 bg-muted rounded-lg">
              <h3 className="font-semibold mb-2">Previous Verification</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Verified By</p>
                  <p className="font-medium">{customer.kyc_verified_by}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Verified At</p>
                  <p className="font-medium">
                    {customer.kyc_verified_at
                      ? new Date(customer.kyc_verified_at).toLocaleString()
                      : '-'}
                  </p>
                </div>
              </div>
              {customer.kyc_remarks && (
                <div className="mt-2">
                  <p className="text-muted-foreground">Previous Remarks</p>
                  <p className="font-medium">{customer.kyc_remarks}</p>
                </div>
              )}
            </div>
          )}

          {/* Remarks Input */}
          <div className="space-y-2">
            <Label htmlFor="remarks">Verification Remarks </Label>
            <Textarea
              id="remarks"
              placeholder="Enter verification remarks (required)..."
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>

          {/* Live Photo Capture for KYC */}
          <div className="space-y-2 p-4 border rounded-lg bg-muted/50">
            <Label className="flex items-center gap-2">
              <Camera className="h-4 w-4" />
              Live Verification Photo  (Required for approval)
            </Label>
            <p className="text-sm text-muted-foreground">
              Capture a live photo of the customer for identity verification
            </p>
            
            <div className="flex items-center gap-4 mt-3">
              <Avatar className="h-20 w-20">
                <AvatarImage src={kycPhoto || undefined} alt="KYC Photo" />
                <AvatarFallback className="text-xl">
                  {customer.full_name?.charAt(0)?.toUpperCase() || "?"}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <Button
                  type="button"
                  variant={kycPhoto ? "outline" : "default"}
                  size="sm"
                  onClick={() => setShowCamera(true)}
                  className="gap-2"
                >
                  <Camera className="h-4 w-4" />
                  {kycPhoto ? "Retake Photo" : "Capture Live Photo"}
                </Button>
                {kycPhoto && (
                  <p className="text-xs text-green-600 mt-1">✓ Live photo captured</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => handleVerify('rejected')}
            disabled={loading}
          >
            <XCircle className="mr-2 h-4 w-4" />
            Reject KYC
          </Button>
          <Button
            onClick={() => handleVerify('verified')}
            disabled={loading}
          >
            <CheckCircle className="mr-2 h-4 w-4" />
            Verify KYC
          </Button>
        </DialogFooter>
      </DialogContent>

      <CameraCapture
        open={showCamera}
        onClose={() => setShowCamera(false)}
        onCapture={handleCameraCapture}
        title="Capture Live KYC Verification Photo"
      />
    </Dialog>
  );
}

