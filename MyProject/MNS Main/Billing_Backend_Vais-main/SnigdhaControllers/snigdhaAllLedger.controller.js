import mongoose from "mongoose";
import {SngidhaLedger} from "../SnigdhaModels/snigdhaLadgerAccount.model.js";
import Invoice from "../invoicemodel/invoice.model.js";
import SnigdhaPurchaseAccount from "../SnigdhaModels/snigdhaPurchaseAccount.model.js";
import SnigdhaPurchaseOrderNew from "../SnigdhaModels/SnigdhaPurchaseOrderNew.model.js";
import {SngidhaServiceLedger} from "../SnigdhaModels/snigdhaServiceLedgerAccount.model.js";
import SnigdhaServiceInvoice from "../SnigdhaModels/snigdhaServiceInvoice.model.js";

// Helper for case-insensitive partial match
const buildNameRegex = (name) => ({
  $regex: name,
  $options: "i",
}); 

// export const getAllLedgerDetails = async (req, res) => {
//     try {
//         const { customerName } = req.query;
//         if (!customerName) {
//             return res.status(400).json({ message: "customerName query param is required" });
//         }

//         // INCOME: Find ledgers and invoices matching customer name
//         const incomeLedgers = await SngidhaLedger.find().populate({
//             path: "invoiceId",
//             model: Invoice,
//             match: { "receiverDetails.name": buildNameRegex(customerName) }
//         });

//         // Filter out ledgers where invoiceId is null (no match)
//         const filteredIncomeLedgers = incomeLedgers.filter(l => l.invoiceId);

//         // EXPENSE: Find purchase accounts and orders matching vendor name
//         const expenseAccounts = await SnigdhaPurchaseAccount.find({ vendorName: buildNameRegex(customerName) }).populate({
//             path: "invoiceId",
//             model: SnigdhaPurchaseOrderNew
//         });

//         // Prepare response
//         let allTransactions = [];
//         let totalPaidAmount = 0;
//         let totalDueAmount = 0;
//         let totalInvoices = 0;
//         let pendingAmount = 0;

//         // Income aggregation
//         filteredIncomeLedgers.forEach(ledger => {
//             totalPaidAmount += ledger.totalPaidAmount || 0;
//             totalDueAmount += ledger.dueAmount || 0;
//             totalInvoices += 1;
//             pendingAmount += (ledger.dueAmount || 0);

//             allTransactions.push({
//                 type: "income",
//                 invoiceNumber: ledger.invoiceNumber,
//                 totalAmount: ledger.totalAmount,
//                 dueAmount: ledger.dueAmount,
//                 totalPaidAmount: ledger.totalPaidAmount,
//                 isPaid: ledger.isPaid,
//                 paymentDetails: ledger.paymentDetails,
//                 invoice: ledger.invoiceId
//             });
//         });

//         // Expense aggregation
//         expenseAccounts.forEach(account => {
//             totalPaidAmount += account.totalPaidAmount || 0;
//             totalDueAmount += account.dueAmount || 0;
//             totalInvoices += 1;
//             pendingAmount += (account.dueAmount || 0);

//             allTransactions.push({
//                 type: "expense",
//                 invoiceNumber: account.invoiceNumber,
//                 totalAmount: account.totalAmount,
//                 dueAmount: account.dueAmount,
//                 totalPaidAmount: account.totalPaidAmount,
//                 isPaid: account.isPaid,
//                 paymentDetails: account.paymentDetails,
//                 invoice: account.invoiceId
//             });
//         });

//         res.json({
//             customerName,
//             totalPaidAmount,
//             totalDueAmount,
//             totalInvoices,
//             pendingAmount,
//             allTransactions
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: "Server error", error: error.message });
//     }
// };

//  // New function to get all unique customer/vendor names and their ledger/payment details
// export const getAllCustomersAndVendorsLedger = async (req, res) => {
//     try {
//         // Get all unique customer names from invoices
//         const invoiceCustomers = await Invoice.distinct('receiverDetails.name');
//         // Get all unique vendor names from purchase accounts
//         const purchaseVendors = await SnigdhaPurchaseAccount.distinct('vendorName');
//         // Merge and deduplicate
//         const allNames = Array.from(new Set([...invoiceCustomers, ...purchaseVendors]));

//         // For each name, get their ledger/payment details
//         const results = await Promise.all(allNames.map(async (name) => {
//             // INCOME: Ledgers for this customer
//             const incomeLedgers = await SngidhaLedger.find().populate({
//                 path: 'invoiceId',
//                 model: Invoice,
//                 match: { 'receiverDetails.name': name }
//             });
//             const filteredIncomeLedgers = incomeLedgers.filter(l => l.invoiceId);

//             // EXPENSE: Purchase accounts for this vendor
//             const expenseAccounts = await SnigdhaPurchaseAccount.find({ vendorName: name }).populate({
//                 path: 'invoiceId',
//                 model: SnigdhaPurchaseOrderNew
//             });

//             // Aggregate
//             let totalPaidAmount = 0;
//             let totalDueAmount = 0;
//             let totalInvoices = 0;
//             let pendingAmount = 0;
//             let allTransactions = [];

//             filteredIncomeLedgers.forEach(ledger => {
//                 totalPaidAmount += ledger.totalPaidAmount || 0;
//                 totalDueAmount += ledger.dueAmount || 0;
//                 totalInvoices += 1;
//                 pendingAmount += (ledger.dueAmount || 0);
//                 allTransactions.push({
//                     type: 'income',
//                     invoiceNumber: ledger.invoiceNumber,
//                     totalAmount: ledger.totalAmount,
//                     dueAmount: ledger.dueAmount,
//                     totalPaidAmount: ledger.totalPaidAmount,
//                     isPaid: ledger.isPaid,
//                     paymentDetails: ledger.paymentDetails,
//                     invoice: ledger.invoiceId
//                 });
//             });
//             expenseAccounts.forEach(account => {
//                 totalPaidAmount += account.totalPaidAmount || 0;
//                 totalDueAmount += account.dueAmount || 0;
//                 totalInvoices += 1;
//                 pendingAmount += (account.dueAmount || 0);
//                 allTransactions.push({
//                     type: 'expense',
//                     invoiceNumber: account.invoiceNumber,
//                     totalAmount: account.totalAmount,
//                     dueAmount: account.dueAmount,
//                     totalPaidAmount: account.totalPaidAmount,
//                     isPaid: account.isPaid,
//                     paymentDetails: account.paymentDetails,
//                     invoice: account.invoiceId
//                 });
//             });
//             return {
//                 name,
//                 totalPaidAmount,
//                 totalDueAmount,
//                 totalInvoices,
//                 pendingAmount,
//                 allTransactions
//             };
//         }));
//         res.json({ customersAndVendors: results });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Server error', error: error.message });
//     }
// };


export const getAllLedgerDetails = async (req, res) => {
    try {
        const { customerName } = req.query;
        if (!customerName) {
            return res.status(400).json({ message: "customerName query param is required" });
        }

        // INCOME: Find ledgers and invoices matching customer name
        const incomeLedgers = await SngidhaLedger.find().populate({
            path: "invoiceId",
            model: Invoice,
            match: { "receiverDetails.name": buildNameRegex(customerName) }
        });

        // SERVICE: Find service ledgers and invoices matching customer name
        const serviceLedgers = await SngidhaServiceLedger.find().populate({
            path: "invoiceId",
            model: SnigdhaServiceInvoice,
            match: { "receiverDetails.name": buildNameRegex(customerName) }
        });

        // Filter out ledgers where invoiceId is null (no match)
        const filteredIncomeLedgers = incomeLedgers.filter(l => l.invoiceId);
        const filteredServiceLedgers = serviceLedgers.filter(l => l.invoiceId);

        // EXPENSE: Find purchase accounts and orders matching vendor name
        const expenseAccounts = await SnigdhaPurchaseAccount.find({ vendorName: buildNameRegex(customerName) }).populate({
            path: "invoiceId",
            model: SnigdhaPurchaseOrderNew
        });

        // Prepare response
        let allTransactions = [];
        let totalPaidAmount = 0;
        let totalDueAmount = 0;
        let totalInvoices = 0;
        let pendingAmount = 0;
        let totalInvoicesValue = 0;

        // Regular Income aggregation
        filteredIncomeLedgers.forEach(ledger => {
            totalPaidAmount += ledger.totalPaidAmount || 0;
            totalDueAmount += ledger.dueAmount || 0;
            totalInvoices += 1;
            pendingAmount += (ledger.dueAmount || 0);
            totalInvoicesValue += ledger.invoiceId.grandTotal || 0;

            allTransactions.push({
                type: "income",
                invoiceNumber: ledger.invoiceNumber,
                totalAmount: ledger.totalAmount,
                dueAmount: ledger.dueAmount,
                totalPaidAmount: ledger.totalPaidAmount,
                isPaid: ledger.isPaid,
                paymentDetails: ledger.paymentDetails,
                invoice: ledger.invoiceId
            });
        });

        // Service Income aggregation
        filteredServiceLedgers.forEach(ledger => {
            totalPaidAmount += ledger.totalPaidAmount || 0;
            totalDueAmount += ledger.dueAmount || 0;
            totalInvoices += 1;
            pendingAmount += (ledger.dueAmount || 0);
            totalInvoicesValue += ledger.invoiceId.grandTotal || 0;

            allTransactions.push({
                type: "service",
                invoiceNumber: ledger.invoiceNumber,
                totalAmount: ledger.totalAmount,
                dueAmount: ledger.dueAmount,
                totalPaidAmount: ledger.totalPaidAmount,
                isPaid: ledger.isPaid,
                paymentDetails: ledger.paymentDetails,
                invoice: ledger.invoiceId
            });
        });

        // Expense aggregation
        expenseAccounts.forEach(account => {
            totalPaidAmount += account.totalPaidAmount || 0;
            totalDueAmount += account.dueAmount || 0;
            totalInvoices += 1;
            pendingAmount += (account.dueAmount || 0);
            totalInvoicesValue += account.invoiceId?.grandTotal || 0;

            allTransactions.push({
                type: "expense",
                invoiceNumber: account.invoiceNumber,
                totalAmount: account.totalAmount,
                dueAmount: account.dueAmount,
                totalPaidAmount: account.totalPaidAmount,
                isPaid: account.isPaid,
                paymentDetails: account.paymentDetails,
                invoice: account.invoiceId
            });
        });

        res.json({
            customerName,
            totalPaidAmount,
            totalDueAmount,
            totalInvoices,
            pendingAmount,
            totalInvoicesValue,
            allTransactions
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const getAllCustomersAndVendorsLedger = async (req, res) => {
    try {
        // Get all unique customer names from all invoice types
        const invoiceCustomers = await Invoice.distinct('receiverDetails.name');
        const serviceCustomers = await SnigdhaServiceInvoice.distinct('receiverDetails.name');
        const purchaseVendors = await SnigdhaPurchaseAccount.distinct('vendorName');
        // console.log("all venders name : ", purchaseVendors);
        // Merge and deduplicate all names
        const allNames = Array.from(new Set([...invoiceCustomers, ...serviceCustomers, ...purchaseVendors]));

        const results = await Promise.all(allNames.map(async (name) => {
            // Regular Income Ledgers
            const incomeLedgers = await SngidhaLedger.find().populate({
                path: 'invoiceId',
                model: Invoice,
                match: { 'receiverDetails.name': name }
            });

            // Service Ledgers
            const serviceLedgers = await SngidhaServiceLedger.find().populate({
                path: 'invoiceId',
                model: SnigdhaServiceInvoice,
                match: { 'receiverDetails.name': name }
            });

            // Expense accounts
            const expenseAccounts = await SnigdhaPurchaseAccount.find({ vendorName: name }).populate({
                path: 'invoiceId',
                model: SnigdhaPurchaseOrderNew
            });

            const filteredIncomeLedgers = incomeLedgers.filter(l => l.invoiceId);
            const filteredServiceLedgers = serviceLedgers.filter(l => l.invoiceId);

            let totalPaidAmount = 0;
            let totalDueAmount = 0;
            let totalInvoices = 0;
            let pendingAmount = 0;
            let totalInvoicesValue = 0;
            let allTransactions = [];

            // Regular Income
            filteredIncomeLedgers.forEach(ledger => {
                totalPaidAmount += ledger.totalPaidAmount || 0;
                totalDueAmount += ledger.dueAmount || 0;
                totalInvoices += 1;
                pendingAmount += (ledger.dueAmount || 0);
                totalInvoicesValue += ledger.invoiceId.grandTotal || 0;
                
                allTransactions.push({
                    type: 'income',
                    invoiceNumber: ledger.invoiceNumber,
                    totalAmount: ledger.totalAmount,
                    dueAmount: ledger.dueAmount,
                    totalPaidAmount: ledger.totalPaidAmount,
                    isPaid: ledger.isPaid,
                    paymentDetails: ledger.paymentDetails,
                    invoice: ledger.invoiceId
                });
            });

            // Service Income
            filteredServiceLedgers.forEach(ledger => {
                totalPaidAmount += ledger.totalPaidAmount || 0;
                totalDueAmount += ledger.dueAmount || 0;
                totalInvoices += 1;
                pendingAmount += (ledger.dueAmount || 0);
                totalInvoicesValue += ledger.invoiceId.grandTotal || 0;

                allTransactions.push({
                    type: 'service',
                    invoiceNumber: ledger.invoiceNumber,
                    totalAmount: ledger.totalAmount,
                    dueAmount: ledger.dueAmount,
                    totalPaidAmount: ledger.totalPaidAmount,
                    isPaid: ledger.isPaid,
                    paymentDetails: ledger.paymentDetails,
                    invoice: ledger.invoiceId
                });
            });

            // Expenses
            expenseAccounts.forEach(account => {
                totalPaidAmount += account.totalPaidAmount || 0;
                totalDueAmount += account.dueAmount || 0;
                totalInvoices += 1;
                pendingAmount += (account.dueAmount || 0);
                totalInvoicesValue += account.invoiceId?.grandTotal || 0;

                allTransactions.push({
                    type: 'expense',
                    invoiceNumber: account.invoiceNumber,
                    totalAmount: account.totalAmount,
                    dueAmount: account.dueAmount,
                    totalPaidAmount: account.totalPaidAmount,
                    isPaid: account.isPaid,
                    paymentDetails: account.paymentDetails,
                    invoice: account.invoiceId
                });
            });

            return {
                name,
                totalPaidAmount,
                totalDueAmount,
                totalInvoices,
                pendingAmount,
                totalInvoicesValue,
                allTransactions
            };
        }));
        res.json({ customersAndVendors: results });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};