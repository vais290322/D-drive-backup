import { SngidhaLedger } from "../SnigdhaModels/snigdhaLadgerAccount.model.js";
import SnigdhaPurchaseAccount from "../SnigdhaModels/snigdhaPurchaseAccount.model.js";
import SnigdhaPurchaseOrderNew from "../SnigdhaModels/SnigdhaPurchaseOrderNew.model.js";
import Invoice from "../invoicemodel/invoice.model.js";

export const getSnigdhaProfitLossDetails = async (req, res) => {
    try {
        // Product Invoice Calculations
        const productInvoices = await Invoice.find();
        const productLedgers = await SngidhaLedger.find();
        
        const productTotalInvoiceValue = productInvoices.reduce((acc, curr) => 
            acc + (curr.grandTotal || 0), 0);
        
        const productTotalPaidValue = productLedgers.reduce((acc, curr) => 
            acc + curr.totalPaidAmount, 0);
        
        // Calculate product dues
        const productDueInvoices = productInvoices.filter(invoice => !invoice.paidOne);
        const productUnpaidDues = productDueInvoices.reduce((acc, curr) => 
            acc + (curr.grandTotal || 0), 0);
        const productLedgerDues = productLedgers.reduce((acc, curr) => 
            acc + (curr.dueAmount || 0), 0);
        const productTotalDueValue = productUnpaidDues + productLedgerDues;

        // Purchase Invoice Calculations
        const purchaseInvoices = await SnigdhaPurchaseOrderNew.find();
        const purchaseAccounts = await SnigdhaPurchaseAccount.find();
        
        const purchaseTotalInvoiceValue = purchaseInvoices.reduce((acc, curr) => 
            acc + (curr.grandTotal || 0), 0);
        
        const purchaseTotalPaidValue = purchaseAccounts.reduce((acc, curr) => 
            acc + curr.totalPaidAmount, 0);
        
        // Calculate purchase dues
        const purchaseDueInvoices = purchaseInvoices.filter(invoice => !invoice.paidOne);
        const purchaseUnpaidDues = purchaseDueInvoices.reduce((acc, curr) => 
            acc + (curr.grandTotal || 0), 0);
        const purchaseAccountDues = purchaseAccounts.reduce((acc, curr) => 
            acc + (curr.dueAmount || 0), 0);
        const purchaseTotalDueValue = purchaseUnpaidDues + purchaseAccountDues;

        // Calculate overall profit/loss
        const totalIncome = productTotalInvoiceValue;
        const totalExpense = purchaseTotalInvoiceValue;
        const netProfitLoss = totalIncome - totalExpense;

        return res.status(200).json({
            success: true,
            data: {
                productInvoice: {
                    totalInvoiceValue: productTotalInvoiceValue,
                    totalPaidInvoiceValue: productTotalPaidValue,
                    totalDueInvoiceValue: productTotalDueValue
                },
                purchaseInvoice: {
                    totalPurchaseInvoiceValue: purchaseTotalInvoiceValue,
                    totalPaidPurchaseInvoiceValue: purchaseTotalPaidValue,
                    totalDuePurchaseInvoiceValue: purchaseTotalDueValue
                },
                profitLossSummary: {
                    totalIncome,
                    totalExpense,
                    netProfitLoss,
                    isProfit: netProfitLoss >= 0
                }
            }
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error calculating Snigdha profit/loss details",
            error: error.message
        });
    }
};

export const getSnigdhaProfitLossByDateRange = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        if (!startDate || !endDate) {
            return res.status(400).json({
                success: false,
                message: "Please provide both start and end dates"
            });
        }

        const dateFilter = {
            date: {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            }
        };

        // Product Invoice Calculations within date range
        const productInvoices = await Invoice.find(dateFilter);
        const productLedgers = await SngidhaLedger.find({
            createdAt: {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            }
        });

        const productTotalInvoiceValue = productInvoices.reduce((acc, curr) => 
            acc + (curr.grandTotal || 0), 0);
        const productTotalPaidValue = productLedgers.reduce((acc, curr) => 
            acc + curr.totalPaidAmount, 0);
        const productDueInvoices = productInvoices.filter(invoice => !invoice.paidOne);
        const productUnpaidDues = productDueInvoices.reduce((acc, curr) => 
            acc + (curr.grandTotal || 0), 0);
        const productLedgerDues = productLedgers.reduce((acc, curr) => 
            acc + (curr.dueAmount || 0), 0);
        const productTotalDueValue = productUnpaidDues + productLedgerDues;

        // Purchase Invoice Calculations within date range
        const purchaseInvoices = await SnigdhaPurchaseOrderNew.find(dateFilter);
        const purchaseAccounts = await SnigdhaPurchaseAccount.find({
            createdAt: {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            }
        });

        const purchaseTotalInvoiceValue = purchaseInvoices.reduce((acc, curr) => 
            acc + (curr.grandTotal || 0), 0);
        const purchaseTotalPaidValue = purchaseAccounts.reduce((acc, curr) => 
            acc + curr.totalPaidAmount, 0);
        const purchaseDueInvoices = purchaseInvoices.filter(invoice => !invoice.paidOne);
        const purchaseUnpaidDues = purchaseDueInvoices.reduce((acc, curr) => 
            acc + (curr.grandTotal || 0), 0);
        const purchaseAccountDues = purchaseAccounts.reduce((acc, curr) => 
            acc + (curr.dueAmount || 0), 0);
        const purchaseTotalDueValue = purchaseUnpaidDues + purchaseAccountDues;

        // Calculate overall profit/loss for date range
        const totalIncome = productTotalInvoiceValue;
        const totalExpense = purchaseTotalInvoiceValue;
        const netProfitLoss = totalIncome - totalExpense;

        return res.status(200).json({
            success: true,
            dateRange: {
                from: startDate,
                to: endDate
            },
            data: {
                productInvoice: {
                    totalInvoiceValue: productTotalInvoiceValue,
                    totalPaidInvoiceValue: productTotalPaidValue,
                    totalDueInvoiceValue: productTotalDueValue
                },
                purchaseInvoice: {
                    totalPurchaseInvoiceValue: purchaseTotalInvoiceValue,
                    totalPaidPurchaseInvoiceValue: purchaseTotalPaidValue,
                    totalDuePurchaseInvoiceValue: purchaseTotalDueValue
                },
                profitLossSummary: {
                    totalIncome,
                    totalExpense,
                    netProfitLoss,
                    isProfit: netProfitLoss >= 0
                }
            }
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error calculating Snigdha profit/loss details for date range",
            error: error.message
        });
    }
};