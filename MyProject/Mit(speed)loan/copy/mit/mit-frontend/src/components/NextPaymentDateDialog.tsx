
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, MessageSquare } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface NextPaymentDateDialogProps {
    title?: string;
    initialDate?: string | null;
    entityName: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSave: (date: string, feedback: string) => Promise<void>;
    feedbackHistory?: {
        date: string;
        feedback: string;
        created_by?: string;
        payment_date?: string;
    }[];
}

export default function NextPaymentDateDialog({
    title = "Set Next Payment Date",
    initialDate,
    entityName,
    open,
    onOpenChange,
    onSave,
    feedbackHistory = []
}: NextPaymentDateDialogProps) {
    const [loading, setLoading] = useState(false);
    const [date, setDate] = useState(
        initialDate ? new Date(initialDate).toISOString().split('T')[0] : ""
    );
    const [feedback, setFeedback] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!date) {
            toast({
                title: "Error",
                description: "Please select a date",
                variant: "destructive",
            });
            return;
        }

        try {
            setLoading(true);
            await onSave(new Date(date).toISOString(), feedback);
            toast({
                title: "Success",
                description: "Date and feedback updated successfully",
            });
            onOpenChange(false);
            setFeedback(""); // Reset feedback
        } catch (error) {
            console.error("Error updating date:", error);
            toast({
                title: "Error",
                description: "Failed to update date",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    // Sort feedback history by date descending (newest first)
    const sortedHistory = [...feedbackHistory].sort((a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-[95vw] sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-primary" />
                        {title}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="payment-date">Select Date</Label>
                            <Input
                                id="payment-date"
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                min={new Date().toISOString().split('T')[0]}
                                required
                            />
                            <p className="text-sm text-muted-foreground">
                                For: <span className="font-medium text-foreground">{entityName}</span>
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="feedback">Feedback / Remarks</Label>
                            <Textarea
                                id="feedback"
                                value={feedback}
                                onChange={(e) => setFeedback(e.target.value)}
                                placeholder="Enter feedback or remarks here..."
                                rows={3}
                                className="resize-none"
                            />
                        </div>
                    </div>

                    {sortedHistory.length > 0 && (
                        <div className="border rounded-lg p-4 bg-muted/20 space-y-3">
                            <div className="flex items-center gap-2 pb-2 border-b">
                                <MessageSquare className="h-4 w-4 text-primary" />
                                <h4 className="text-sm font-semibold">Previous Feedback</h4>
                                <span className="text-xs text-muted-foreground ml-auto">
                                    ({sortedHistory.length} {sortedHistory.length === 1 ? 'entry' : 'entries'})
                                </span>
                            </div>
                            <div className="space-y-3 max-h-[200px] overflow-y-auto pr-2">
                                {sortedHistory.map((item, index) => (
                                    <div key={index} className="bg-background rounded-md p-3 space-y-1.5 border">
                                        <div className="flex justify-between items-center">
                                            <p className="text-xs font-medium text-muted-foreground">
                                                {new Date(item.date).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </p>
                                            {item.created_by && (
                                                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                                                    {item.created_by}
                                                </span>
                                            )}
                                        </div>
                                        {item.payment_date && (
                                            <p className="text-xs font-medium text-blue-600">
                                                Payment Date: {new Date(item.payment_date).toLocaleDateString()}
                                            </p>
                                        )}
                                        <p className="text-sm text-foreground whitespace-pre-wrap">
                                            {item.feedback}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Saving..." : "Save"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

