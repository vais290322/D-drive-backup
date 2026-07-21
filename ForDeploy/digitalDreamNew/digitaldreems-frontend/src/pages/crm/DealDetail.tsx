import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
    ArrowLeft,
    Building2,
    Calendar,
    CheckCircle,
    DollarSign,
    Edit,
    Mail,
    Phone,
    Tag,
    Trash2,
    User,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { getDealById, deleteDeal } from "@/db/crmApi";
import type { DealWithRelations } from "@/types/types";
import { formatCurrency } from "@/lib/currency";

export default function DealDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [deal, setDeal] = useState<DealWithRelations | null>(null);
    const [loading, setLoading] = useState(true);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        if (id) {
            loadDeal();
        }
    }, [id]);

    const loadDeal = async () => {
        if (!id) return;
        try {
            setLoading(true);
            const data = await getDealById(id);
            setDeal(data);
        } catch (error) {
            console.error("Error loading deal:", error);
            toast({
                title: "Error",
                description: "Failed to load deal details",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!id) return;
        try {
            setDeleting(true);
            await deleteDeal(id);
            toast({
                title: "Success",
                description: "Deal deleted successfully",
            });
            navigate("/crm/deals");
        } catch (error) {
            console.error("Error deleting deal:", error);
            toast({
                title: "Error",
                description: "Failed to delete deal",
                variant: "destructive",
            });
        } finally {
            setDeleting(false);
            setDeleteDialogOpen(false);
        }
    };

    const getStageColor = (stage: string) => {
        const colors: Record<string, string> = {
            lead: "bg-muted",
            qualified: "bg-blue-500",
            proposal: "bg-purple-500",
            negotiation: "bg-orange-500",
            won: "bg-green-500",
            lost: "bg-red-500",
        };
        return colors[stage] || "bg-muted";
    };

    const getPriorityColor = (priority: string) => {
        const colors: Record<string, string> = {
            high: "bg-red-500",
            medium: "bg-orange-500",
            low: "bg-blue-500",
        };
        return colors[priority] || "bg-muted";
    };

    if (loading) {
        return (
            <div className="p-6 xl:p-8 space-y-6">
                <Skeleton className="h-10 w-48" />
                <div className="grid gap-6 md:grid-cols-3">
                    <Skeleton className="h-48 md:col-span-2" />
                    <Skeleton className="h-48" />
                </div>
            </div>
        );
    }

    if (!deal) {
        return (
            <div className="p-6 xl:p-8 flex flex-col items-center justify-center h-96 text-center">
                <h2 className="text-2xl font-bold mb-2">Deal Not Found</h2>
                <p className="text-muted-foreground mb-4">The deal you are looking for does not exist.</p>
                <Button onClick={() => navigate("/crm/deals")}>Back to Deals</Button>
            </div>
        );
    }

    return (
        <div className="p-6 xl:p-8 space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" onClick={() => navigate("/crm/deals")}>
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <h1 className="text-3xl font-bold">{deal.title}</h1>
                    </div>
                    <div className="flex items-center gap-2 ml-10">
                        <Badge className={getStageColor(deal.stage)}>
                            {deal.stage.toUpperCase()}
                        </Badge>
                        <Badge variant="outline" className="capitalize">
                            {deal.priority} Priority
                        </Badge>
                    </div>
                </div>
                <div className="flex gap-2 ml-10 md:ml-0">
                    <Button variant="outline" onClick={() => navigate(`/crm/deals/${id}/edit`)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Deal
                    </Button>
                    <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                        <DialogTrigger asChild>
                            <Button variant="destructive">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Delete Deal</DialogTitle>
                                <DialogDescription>
                                    Are you sure you want to delete this deal? This action cannot be undone.
                                </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
                                    {deleting ? "Deleting..." : "Delete Deal"}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {/* Main Info */}
                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Tag className="h-5 w-5 text-primary" />
                                Deal Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Value</p>
                                <p className="text-xl font-bold text-success">
                                    {formatCurrency(Number(deal.value))}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Probability</p>
                                <p className="text-base">{deal.probability}%</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Expected Close</p>
                                <p className="text-base">
                                    {deal.expected_close_date
                                        ? new Date(deal.expected_close_date).toLocaleDateString()
                                        : "-"}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Actual Close</p>
                                <p className="text-base">
                                    {deal.actual_close_date
                                        ? new Date(deal.actual_close_date).toLocaleDateString()
                                        : "-"}
                                </p>
                            </div>
                            <div className="sm:col-span-2">
                                <p className="text-sm font-medium text-muted-foreground mb-1">Description</p>
                                <p className="text-base whitespace-pre-wrap">
                                    {deal.description || "No description provided."}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="h-5 w-5 text-primary" />
                                Notes
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-base whitespace-pre-wrap">
                                {deal.notes || "No notes added."}
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    {deal.company && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Building2 className="h-5 w-5 text-primary" />
                                    Company
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div>
                                    <Link
                                        to={`/crm/companies/${deal.company.id}/edit`}
                                        className="text-lg font-semibold hover:text-primary hover:underline"
                                    >
                                        {deal.company.name}
                                    </Link>
                                    <p className="text-sm text-muted-foreground">{deal.company.industry || "Industry not specified"}</p>
                                </div>
                                {deal.company.phone && (
                                    <div className="flex items-center gap-2 text-sm">
                                        <Phone className="h-4 w-4 text-muted-foreground" />
                                        <span>{deal.company.phone}</span>
                                    </div>
                                )}
                                {deal.company.email && (
                                    <div className="flex items-center gap-2 text-sm">
                                        <Mail className="h-4 w-4 text-muted-foreground" />
                                        <a href={`mailto:${deal.company.email}`} className="hover:underline">
                                            {deal.company.email}
                                        </a>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}

                    {deal.contact && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <User className="h-5 w-5 text-primary" />
                                    Primary Contact
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div>
                                    <Link
                                        to={`/crm/contacts/${deal.contact.id}/edit`}
                                        className="text-lg font-semibold hover:text-primary hover:underline"
                                    >
                                        {deal.contact.first_name} {deal.contact.last_name}
                                    </Link>
                                    <p className="text-sm text-muted-foreground">{deal.contact.title || "No title"}</p>
                                </div>
                                {(deal.contact.mobile || deal.contact.phone) && (
                                    <div className="flex items-center gap-2 text-sm">
                                        <Phone className="h-4 w-4 text-muted-foreground" />
                                        <span>{deal.contact.mobile || deal.contact.phone}</span>
                                    </div>
                                )}
                                {deal.contact.email && (
                                    <div className="flex items-center gap-2 text-sm">
                                        <Mail className="h-4 w-4 text-muted-foreground" />
                                        <a href={`mailto:${deal.contact.email}`} className="hover:underline">
                                            {deal.contact.email}
                                        </a>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
