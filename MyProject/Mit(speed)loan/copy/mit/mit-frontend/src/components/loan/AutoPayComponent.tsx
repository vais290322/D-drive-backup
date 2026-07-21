import React, { useState } from 'react';
import { Card, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { api } from "@/db/api";
import {
    CreditCard,
    RefreshCcw,
    Send,
    Activity,
    CheckCircle,
    XOctagon,
    PlayCircle,
    Loader2,
    AlertTriangle,
    Info,
    Copy
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface AutoPayProps {
    loanId: string;
}

const AutoPayComponent: React.FC<AutoPayProps> = ({ loanId }) => {
    const [loadingAction, setLoadingAction] = useState<string | null>(null);
    const [actionResult, setActionResult] = useState<any>(null);

    const performAction = async (actionName: string, actionFn: () => Promise<any>) => {
        setLoadingAction(actionName);
        setActionResult(null);
        try {
            const result = await actionFn();
            setActionResult({ action: actionName, result, type: result?.success === false ? 'error' : 'success' });

            if (result && result.redirectUrl) {
                window.open(result.redirectUrl, '_blank');
                toast.success("Redirecting to AutoPay Setup...");
            } else if (result && result.data && result.data.redirectUrl) {
                window.open(result.data.redirectUrl, '_blank');
                toast.success("Redirecting to AutoPay Setup...");
            } else {
                toast[result?.success === false ? 'error' : 'success'](result?.message || `${actionName} executed successfully`);
            }
        } catch (error: any) {
            console.error(`${actionName} Error:`, error);
            toast.error(error.message || `Failed to execute ${actionName}`);
            setActionResult({ action: actionName, error: error.message, type: 'error' });
        } finally {
            setLoadingAction(null);
        }
    };

    const actions = [
        {
            title: "Setup AutoPay",
            description: "Initiate PhonePe AutoPay mandate setup for this loan.",
            icon: <CreditCard className="w-5 h-5 text-blue-500" />,
            actionId: "setup",
            btnText: "Setup Mandate",
            btnVariant: "default" as const,
            handler: () => api.autopay.setup(loanId)
        },
        {
            title: "Check Setup Status",
            description: "Verify the current status of the mandate setup order.",
            icon: <RefreshCcw className="w-5 h-5 text-purple-500" />,
            actionId: "checkSetup",
            btnText: "Check Status",
            btnVariant: "outline" as const,
            handler: () => api.autopay.checkSetupStatus(loanId)
        },
        {
            title: "Subscription Status",
            description: "Get detailed status of the active AutoPay subscription.",
            icon: <Activity className="w-5 h-5 text-green-500" />,
            actionId: "subStatus",
            btnText: "View Status",
            btnVariant: "outline" as const,
            handler: () => api.autopay.checkSubscriptionStatus(loanId)
        },
        {
            title: "Notify Redemption",
            description: "Send a pre-debit notification to the customer as per guidelines.",
            icon: <Send className="w-5 h-5 text-amber-500" />,
            actionId: "notifyRedemption",
            btnText: "Notify Customer",
            btnVariant: "secondary" as const,
            handler: () => api.autopay.notifyRedemption(loanId)
        },
        {
            title: "Execute Redemption",
            description: "Trigger the actual EMI debit transaction from the bank account.",
            icon: <PlayCircle className="w-5 h-5 text-emerald-500" />,
            actionId: "executeRedemption",
            btnText: "Execute Debit",
            btnVariant: "default" as const,
            handler: () => api.autopay.executeRedemption(loanId)
        },
        {
            title: "Redemption Status",
            description: "Check the status of the previously executed debit transaction.",
            icon: <CheckCircle className="w-5 h-5 text-indigo-500" />,
            actionId: "checkRedemption",
            btnText: "Check Status",
            btnVariant: "outline" as const,
            handler: () => api.autopay.checkRedemptionStatus(loanId)
        },
        {
            title: "Cancel Subscription",
            description: "Revoke the AutoPay mandate. This action is irreversible.",
            icon: <XOctagon className="w-5 h-5 text-red-500" />,
            actionId: "cancel",
            btnText: "Cancel Mandate",
            btnVariant: "destructive" as const,
            handler: () => {
                if (window.confirm("Are you sure you want to cancel the AutoPay mandate? This action is irreversible.")) {
                    return api.autopay.cancelSubscription(loanId);
                }
                return Promise.reject(new Error("Cancelled by user"));
            }
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-medium">AutoPay Management</h3>
                    <p className="text-sm text-muted-foreground">Manage PhonePe UPI mandate and automatic collections.</p>
                </div>
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 uppercase px-3 py-1">
                    PhonePe Integration
                </Badge>
            </div>

            {actionResult && (
                <Alert variant={actionResult.type === 'error' ? "destructive" : "default"} className={actionResult.type === 'success' ? "border-green-200 bg-green-50" : ""}>
                    {actionResult.type === 'error' ? <AlertTriangle className="h-4 w-4" /> : <Info className="h-4 w-4 text-green-600" />}
                    <AlertTitle>
                        <div className="flex justify-between items-center w-full">
                            <span className={actionResult.type === 'success' ? "text-green-800" : ""}>
                                {actionResult.type === 'success' ? "Operation Successful" : "Operation Failed"}
                            </span>
                            {(actionResult?.result?.redirectUrl || actionResult?.result?.data?.redirectUrl) && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-7 text-xs bg-white text-black hover:bg-slate-100"
                                    onClick={() => {
                                        const url = actionResult.result.redirectUrl || actionResult.result.data.redirectUrl;
                                        navigator.clipboard.writeText(url);
                                        toast.success("URL copied to clipboard!");
                                    }}
                                >
                                    <Copy className="w-3 h-3 mr-1" />
                                    Copy URL
                                </Button>
                            )}
                        </div>
                    </AlertTitle>
                    <AlertDescription className="mt-2 text-xs overflow-auto max-h-[200px] break-all">
                        <pre className="font-mono bg-black/5 p-2 rounded-md">
                            {JSON.stringify(actionResult.result || actionResult.error, null, 2)}
                        </pre>
                    </AlertDescription>
                </Alert>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {actions.map((action, index) => (
                    <Card key={index} className="flex flex-col hover:shadow-md transition-shadow">
                        <CardHeader className="pb-2 flex-grow">
                            <div className="flex items-center space-x-2 mb-2">
                                <div className="p-2 bg-slate-100 rounded-md">
                                    {action.icon}
                                </div>
                                <CardTitle className="text-md font-semibold">{action.title}</CardTitle>
                            </div>
                            <CardDescription className="text-xs">{action.description}</CardDescription>
                        </CardHeader>
                        <CardFooter className="pt-2">
                            <Button
                                variant={action.btnVariant}
                                className="w-full text-sm h-9"
                                onClick={() => performAction(action.actionId, action.handler)}
                                disabled={loadingAction !== null}
                            >
                                {loadingAction === action.actionId ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    action.btnText
                                )}
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default AutoPayComponent;