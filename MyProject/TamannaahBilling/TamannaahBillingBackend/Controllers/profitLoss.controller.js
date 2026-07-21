import { Ledger } from "../Models/ledgerAccount.model.js";
import { ServiceAccount } from "../Models/serviceAccount.model.js";
import PurchaseAccount from "../Models/purchaseAccount.model.js";
import InvoiceMns from "../invoicemodel/invoice-mns.model.js";
import Service from "../Models/service.model.js";
import MnsPurchaseOrderNew from "../Models/mnsPurchaseOrderNew.model.js";

export const getProfitLossDetails = async (req, res) => {
    try {
        // Product Invoice Calculations
        const productInvoices = await InvoiceMns.find();
        const productLedgers = await Ledger.find();
        
        const productTotalInvoiceValue = productInvoices.reduce((acc, curr) => 
            acc + (curr.grandTotal || 0), 0);
        
        const productTotalPaidValue = productLedgers.reduce((acc, curr) => 
            acc + curr.totalPaidAmount, 0);
        
        // Calculate dues from unpaid invoices and ledger dueAmounts
        const productDueInvoices = productInvoices.filter(invoice => !invoice.paidOne);
        const productUnpaidDues = productDueInvoices.reduce((acc, curr) => 
            acc + (curr.grandTotal || 0), 0);
        const productLedgerDues = productLedgers.reduce((acc, curr) => 
            acc + (curr.dueAmount || 0), 0);
        const productTotalDueValue = productUnpaidDues + productLedgerDues;

        // Service Invoice Calculations
        const serviceInvoices = await Service.find();
        const serviceAccounts = await ServiceAccount.find();
        
        const serviceTotalInvoiceValue = serviceInvoices.reduce((acc, curr) => 
            acc + (curr.total.grandTotal || 0), 0);
        
        const serviceTotalPaidValue = serviceAccounts.reduce((acc, curr) => 
            acc + curr.totalPaidAmount, 0);
        
        // Calculate dues from unpaid services and account dueAmounts
        const serviceDueInvoices = serviceInvoices.filter(invoice => !invoice.paidOne);
        const serviceUnpaidDues = serviceDueInvoices.reduce((acc, curr) => 
            acc + (curr.total.grandTotal || 0), 0);
        const serviceAccountDues = serviceAccounts.reduce((acc, curr) => 
            acc + (curr.dueAmount || 0), 0);
        const serviceTotalDueValue = serviceUnpaidDues + serviceAccountDues;

        // Purchase Invoice Calculations
        const purchaseInvoices = await MnsPurchaseOrderNew.find();
        const purchaseAccounts = await PurchaseAccount.find();
        
        const purchaseTotalInvoiceValue = purchaseInvoices.reduce((acc, curr) => 
            acc + (curr.grandTotal || 0), 0);
        
        const purchaseTotalPaidValue = purchaseAccounts.reduce((acc, curr) => 
            acc + curr.totalPaidAmount, 0);
        
        // Calculate dues from unpaid purchases and account dueAmounts
        const purchaseDueInvoices = purchaseInvoices.filter(invoice => !invoice.paidOne);
        const purchaseUnpaidDues = purchaseDueInvoices.reduce((acc, curr) => 
            acc + (curr.grandTotal || 0), 0);
        const purchaseAccountDues = purchaseAccounts.reduce((acc, curr) => 
            acc + (curr.dueAmount || 0), 0);
        const purchaseTotalDueValue = purchaseUnpaidDues + purchaseAccountDues;

        return res.status(200).json({
            success: true,
            data: {
                productInvoice: {
                    totalInvoiceValue: productTotalInvoiceValue,
                    totalPaidInvoiceValue: productTotalPaidValue,
                    totalDueInvoiceValue: productTotalDueValue
                },
                serviceInvoice: {
                    totalServiceInvoiceValue: serviceTotalInvoiceValue,
                    totalPaidServiceInvoiceValue: serviceTotalPaidValue,
                    totalDueServiceInvoiceValue: serviceTotalDueValue
                },
                purchaseInvoice: {
                    totalPurchaseInvoiceValue: purchaseTotalInvoiceValue,
                    totalPaidPurchaseInvoiceValue: purchaseTotalPaidValue,
                    totalDuePurchaseInvoiceValue: purchaseTotalDueValue
                }
            }
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error calculating profit/loss details",
            error: error.message
        });
    }
};

export const getProfitLossByDateRange = async (req, res) => {
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
        const productInvoices = await InvoiceMns.find(dateFilter);
        const productLedgers = await Ledger.find({
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

        // Service Invoice Calculations within date range
        const serviceInvoices = await Service.find(dateFilter);
        const serviceAccounts = await ServiceAccount.find({
            createdAt: {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            }
        });

        const serviceTotalInvoiceValue = serviceInvoices.reduce((acc, curr) => 
            acc + (curr.total.grandTotal || 0), 0);
        const serviceTotalPaidValue = serviceAccounts.reduce((acc, curr) => 
            acc + curr.totalPaidAmount, 0);
        const serviceDueInvoices = serviceInvoices.filter(invoice => !invoice.paidOne);
        const serviceUnpaidDues = serviceDueInvoices.reduce((acc, curr) => 
            acc + (curr.total.grandTotal || 0), 0);
        const serviceAccountDues = serviceAccounts.reduce((acc, curr) => 
            acc + (curr.dueAmount || 0), 0);
        const serviceTotalDueValue = serviceUnpaidDues + serviceAccountDues;

        // Purchase Invoice Calculations within date range
        const purchaseInvoices = await MnsPurchaseOrderNew.find(dateFilter);
        const purchaseAccounts = await PurchaseAccount.find({
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

        // Calculate overall profit/loss
        const totalIncome = productTotalInvoiceValue + serviceTotalInvoiceValue;
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
                serviceInvoice: {
                    totalServiceInvoiceValue: serviceTotalInvoiceValue,
                    totalPaidServiceInvoiceValue: serviceTotalPaidValue,
                    totalDueServiceInvoiceValue: serviceTotalDueValue
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
            message: "Error calculating profit/loss details for date range",
            error: error.message
        });
    }
};