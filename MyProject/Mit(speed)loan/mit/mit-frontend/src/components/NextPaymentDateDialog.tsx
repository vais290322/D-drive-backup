
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Calendar } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface NextPaymentDateDialogProps {
    title?: string;
    initialDate?: string | null;
    entityName: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSave: (date: string) => Promise<void>;
}

export default function NextPaymentDateDialog({
    title = "Set Next Payment Date",
    initialDate,
    entityName,
    open,
    onOpenChange,
    onSave
}: NextPaymentDateDialogProps) {
    const [loading, setLoading] = useState(false);
    const [date, setDate] = useState(
        initialDate ? new Date(initialDate).toISOString().split('T')[0] : ""
    );

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
            await onSave(new Date(date).toISOString());
            toast({
                title: "Success",
                description: "Date updated successfully",
            });
            onOpenChange(false);
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

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-primary" />
                        {title}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 py-4">
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
                            {loading ? "Saving..." : "Save Date"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
