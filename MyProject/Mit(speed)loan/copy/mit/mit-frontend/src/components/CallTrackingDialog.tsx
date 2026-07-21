import { useState, useEffect } from "react";
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
import { Phone, Calendar, Clock, User } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CallTrackingDialogProps {
    customer: Customer;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
}

interface CallLog {
    _id: string;
    date: string;
    next_followup_date?: string;
    feedback?: string;
    created_at: string;
    created_by?: string;
}

export default function CallTrackingDialog({
    customer,
    open,
    onOpenChange,
    onSuccess,
}: CallTrackingDialogProps) {
    const [lastCallDate, setLastCallDate] = useState<string>(
        new Date().toISOString().split("T")[0]
    );
    const [nextFollowupDate, setNextFollowupDate] = useState<string>("");
    const [feedback, setFeedback] = useState<string>("");
    const [saving, setSaving] = useState(false);
    const [history, setHistory] = useState<CallLog[]>([]);
    const [loadingHistory, setLoadingHistory] = useState(false);

    useEffect(() => {
        if (open && customer.id) {
            loadCallHistory();
            // Reset form
            setLastCallDate(new Date().toISOString().split("T")[0]);
            setNextFollowupDate("");
            setFeedback("");
        }
    }, [open, customer.id]);

    const loadCallHistory = async () => {
        try {
            setLoadingHistory(true);
            const logs = await api.customers.getCallLogs(customer.id);
            setHistory(logs);
        } catch (error) {
            console.error("Error loading call history:", error);
        } finally {
            setLoadingHistory(false);
        }
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            await api.customers.addCallLog(customer.id, {
                date: lastCallDate,
                next_followup_date: nextFollowupDate || null,
                feedback: feedback || null,
            });
            toast.success("Call logged successfully");
            onSuccess();
            // Reload history to show the new log
            await loadCallHistory();
            // Reset form
            setFeedback("");
            setNextFollowupDate("");
        } catch (error) {
            console.error("Error saving call log:", error);
            toast.error("Failed to log call");
        } finally {
            setSaving(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Phone className="h-5 w-5 text-primary" />
                        Call Tracking - {customer.full_name}
                    </DialogTitle>
                    <DialogDescription>
                        Record new call details and view history
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-6 py-4 flex-1 overflow-hidden">
                    {/* New Call Form */}
                    <div className="space-y-4 border rounded-lg p-4 bg-muted/20 shrink-0">
                        <h3 className="font-semibold text-sm flex items-center gap-2">
                            <Clock className="h-4 w-4" /> Log New Call
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="lastCallDate">Call Date</Label>
                                <Input
                                    id="lastCallDate"
                                    type="date"
                                    value={lastCallDate}
                                    onChange={(e) => setLastCallDate(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="nextFollowupDate">Next Follow-up</Label>
                                <Input
                                    id="nextFollowupDate"
                                    type="date"
                                    value={nextFollowupDate}
                                    onChange={(e) => setNextFollowupDate(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="feedback">Feedback / Notes</Label>
                            <Textarea
                                id="feedback"
                                placeholder="Enter call notes..."
                                value={feedback}
                                onChange={(e) => setFeedback(e.target.value)}
                                rows={2}
                                className="resize-none"
                            />
                        </div>
                        <div className="flex justify-end">
                            <Button onClick={handleSave} disabled={saving} size="sm">
                                {saving ? "Saving..." : "Save Log"}
                            </Button>
                        </div>
                    </div>

                    {/* History */}
                    <div className="flex-1 flex flex-col overflow-hidden">
                        <h3 className="font-semibold text-sm mb-2 flex items-center gap-2">
                            <User className="h-4 w-4" /> Call History
                        </h3>
                        <ScrollArea className="flex-1 border rounded-md p-2 bg-background">
                            {loadingHistory ? (
                                <p className="text-center text-muted-foreground p-4">Loading history...</p>
                            ) : history.length === 0 ? (
                                <p className="text-center text-muted-foreground p-4">No call history found.</p>
                            ) : (
                                <div className="space-y-4">
                                    {history.map((log) => (
                                        <div key={log._id} className="border-b pb-3 last:border-0 last:pb-0">
                                            <div className="flex justify-between items-start mb-1">
                                                <span className="font-medium text-sm">
                                                    {new Date(log.date).toLocaleDateString()}
                                                </span>
                                                {log.next_followup_date && (
                                                    <span className="text-xs px-2 py-0.5 rounded-full bg-orange-100 text-orange-800">
                                                        Next: {new Date(log.next_followup_date).toLocaleDateString()}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                                                {log.feedback || "No notes"}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </ScrollArea>
                    </div>
                </div>

                <DialogFooter className="shrink-0">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
