import {Ledger} from "../Models/ledgerAccount.model.js";
import {ServiceAccount} from "../Models/serviceAccount.model.js";
import PurchaseAccount from "../Models/purchaseAccount.model.js";
import InvoiceMns from "../invoicemodel/invoice-mns.model.js";
import Service from "../Models/service.model.js";
import MnsPurchaseOrderNew from "../Models/mnsPurchaseOrderNew.model.js";

export const getAllMnsLedgerDetails = async (req, res) => {
  try {
    // INCOME: Ledger (InvoiceMns) + ServiceAccount (Service)
    const ledgerAccounts = await Ledger.find().lean();
    const serviceAccounts = await ServiceAccount.find().lean();

    // EXPENSE: PurchaseAccount (MnsPurchaseOrderNew)
    const purchaseAccounts = await PurchaseAccount.find().lean();

    // Group by customerName (income) and vendorName (expense)
    const incomeMap = {};
    for (const entry of ledgerAccounts) {
      // Find invoice for customer name
      const invoice = await InvoiceMns.findOne({ invoiceNumber: entry.invoiceNumber }).lean();
      const customerName = invoice?.receiverDetails?.name || "Unknown";
      if (!incomeMap[customerName]) {
        incomeMap[customerName] = {
          name: customerName,
          type: "income",
          invoices: [],
          totalPaidAmount: 0,
          totalDueAmount: 0,
          totalPendingAmount: 0,
          totalInvoices: 0
        };
      }
      incomeMap[customerName].invoices.push({
        invoiceNumber: entry.invoiceNumber,
        totalAmount: entry.totalAmount,
        dueAmount: entry.dueAmount,
        totalPaidAmount: entry.totalPaidAmount,
        isPaid: entry.isPaid,
        paymentDetails: entry.paymentDetails || []
      });
      incomeMap[customerName].totalPaidAmount += entry.totalPaidAmount || 0;
      incomeMap[customerName].totalDueAmount += entry.dueAmount || 0;
      incomeMap[customerName].totalPendingAmount += (entry.totalAmount || 0) - (entry.totalPaidAmount || 0);
      incomeMap[customerName].totalInvoices++;
    }
    for (const entry of serviceAccounts) {
      // Find service for customer name
      const service = await Service.findOne({ invoiceNumber: entry.invoiceNumber }).lean();
      const customerName = service?.receiverDetails?.name || service?.customerName || "Unknown";
      if (!incomeMap[customerName]) {
        incomeMap[customerName] = {
          name: customerName,
          type: "income",
          invoices: [],
          totalPaidAmount: 0,
          totalDueAmount: 0,
          totalPendingAmount: 0,
          totalInvoices: 0
        };
      }
      incomeMap[customerName].invoices.push({
        invoiceNumber: entry.invoiceNumber,
        totalAmount: entry.totalAmount,
        dueAmount: entry.dueAmount,
        totalPaidAmount: entry.totalPaidAmount,
        isPaid: entry.isPaid,
        paymentDetails: entry.paymentDetails || []
      });
      incomeMap[customerName].totalPaidAmount += entry.totalPaidAmount || 0;
      incomeMap[customerName].totalDueAmount += entry.dueAmount || 0;
      incomeMap[customerName].totalPendingAmount += (entry.totalAmount || 0) - (entry.totalPaidAmount || 0);
      incomeMap[customerName].totalInvoices++;
    }

    // EXPENSE
    const expenseMap = {};
    for (const entry of purchaseAccounts) {
      // Find purchase order for vendor name
      const po = await MnsPurchaseOrderNew.findOne({ invoiceNumber: entry.invoiceNumber }).lean();
      const vendorName = entry.vendorName || po?.receiverDetails?.name || "Unknown";
      if (!expenseMap[vendorName]) {
        expenseMap[vendorName] = {
          name: vendorName,
          type: "expense",
          invoices: [],
          totalPaidAmount: 0,
          totalDueAmount: 0,
          totalPendingAmount: 0,
          totalInvoices: 0
        };
      }
      expenseMap[vendorName].invoices.push({
        invoiceNumber: entry.invoiceNumber,
        totalAmount: entry.totalAmount,
        dueAmount: entry.dueAmount,
        totalPaidAmount: entry.totalPaidAmount,
        isPaid: entry.isPaid,
        paymentDetails: entry.paymentDetails || []
      });
      expenseMap[vendorName].totalPaidAmount += entry.totalPaidAmount || 0;
      expenseMap[vendorName].totalDueAmount += entry.dueAmount || 0;
      expenseMap[vendorName].totalPendingAmount += (entry.totalAmount || 0) - (entry.totalPaidAmount || 0);
      expenseMap[vendorName].totalInvoices++;
    }

    // Combine and return
    const result = [
      ...Object.values(incomeMap),
      ...Object.values(expenseMap)
    ];
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

