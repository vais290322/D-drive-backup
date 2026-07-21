import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { api } from "@/db/api";
import type { Customer } from "@/types/types";
import { toast } from "sonner";
import { Phone, Calendar } from "lucide-react";

interface CallTrackingDialogProps {
    customer: Customer;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
}

export default function CallTrackingDialog({
    customer,
    open,
    onOpenChange,
    onSuccess,
}: CallTrackingDialogProps) {
    const [lastCallDate, setLastCallDate] = useState<string>(
        customer.last_call_date
            ? new Date(customer.last_call_date).toISOString().split("T")[0]
            : new Date().toISOString().split("T")[0]
    );
    const [nextFollowupDate, setNextFollowupDate] = useState<string>(
        customer.next_followup_date
            ? new Date(customer.next_followup_date).toISOString().split("T")[0]
            : ""
    );
    const [feedback, setFeedback] = useState<string>(customer.feedback || "");
    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
        try {
            setSaving(true);
            await api.customers.update(customer.id, {
                last_call_date: lastCallDate,
                next_followup_date: nextFollowupDate || null,
                feedback: feedback || null,
            });
            toast.success("Call tracking updated successfully");
            onSuccess();
            onOpenChange(false);
        } catch (error) {
            console.error("Error updating call tracking:", error);
            toast.error("Failed to update call tracking");
        } finally {
            setSaving(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Phone className="h-5 w-5 text-primary" />
                        Call Tracking - {customer.full_name}
                    </DialogTitle>
                    <DialogDescription>
                        Record your call details and schedule the next follow-up
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="lastCallDate" className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            Last Call Date
                        </Label>
                        <Input
                            id="lastCallDate"
                            type="date"
                            value={lastCallDate}
                            onChange={(e) => setLastCallDate(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="nextFollowupDate" className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-orange-500" />
                            Next Follow-up Date
                        </Label>
                        <Input
                            id="nextFollowupDate"
                            type="date"
                            value={nextFollowupDate}
                            onChange={(e) => setNextFollowupDate(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="feedback">Feedback / Notes</Label>
                        <Textarea
                            id="feedback"
                            placeholder="Enter call feedback, customer response, or any important notes..."
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            rows={5}
                            className="resize-none"
                        />
                    </div>

                    {customer.last_call_date && (
                        <div className="rounded-lg bg-muted p-3 text-sm">
                            <p className="font-medium">Previous Call Information:</p>
                            <p className="text-muted-foreground mt-1">
                                Last Called: {new Date(customer.last_call_date).toLocaleDateString()}
                            </p>
                            {customer.next_followup_date && (
                                <p className="text-muted-foreground">
                                    Previous Follow-up Date:{" "}
                                    {new Date(customer.next_followup_date).toLocaleDateString()}
                                </p>
                            )}
                            {customer.feedback && (
                                <p className="text-muted-foreground mt-2">
                                    Previous Feedback: {customer.feedback}
                                </p>
                            )}
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={saving}>
                        {saving ? "Saving..." : "Save Call Details"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
