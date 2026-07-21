import mongoose from "mongoose";
import InvoiceMns from "../invoicemodel/invoice-mns.model.js";
import { Ledger } from "../Models/ledgerAccount.model.js";
import Service from "../Models/service.model.js";
import { ServiceAccount } from "../Models/serviceAccount.model.js";
import MnsPurchaseOrderNew from "../Models/mnsPurchaseOrderNew.model.js";
import PurchaseAccount from "../Models/purchaseAccount.model.js";
import ExcelJS from 'exceljs';
import fs from 'fs';
import path from 'path';
import PDFDocument from 'pdfkit-table';

// Helper function to generate master ledger report
const generateMasterLedgerReport = async (filters = {}) => {
  try {
    // Extract date range filters
    const { startDate, endDate, reportType } = filters;
    
    // Create date filter object for queries
    const dateFilter = {};
    if (startDate) {
      dateFilter.createdAt = { $gte: new Date(startDate) };
    }
    if (endDate) {
      if (dateFilter.createdAt) {
        dateFilter.createdAt.$lte = new Date(endDate);
      } else {
        dateFilter.createdAt = { $lte: new Date(endDate) };
      }
    }

    // Initialize data containers
    let salesByCustomer = {};
    let servicesByCustomer = {};
    let purchasesByVendor = {};
    
    // Only fetch data for requested report types
    const fetchSales = !reportType || reportType === 'sales' || reportType === 'all';
    const fetchServices = !reportType || reportType === 'services' || reportType === 'all';
    const fetchPurchases = !reportType || reportType === 'purchases' || reportType === 'all';
    
    // 1. Get sales data if needed
    if (fetchSales) {
      // Get all pending sales invoices with date filter
      const pendingSalesInvoices = await InvoiceMns.find({ 
        paidOne: false,
        ...(startDate || endDate ? { date: dateFilter.createdAt } : {})
      });
      
      // Get all ledger accounts with pending payments
      const pendingLedgers = await Ledger.find({ 
        isPaid: false,
        ...dateFilter
      }).populate("invoiceId");
      
      // Process pending sales invoices
      pendingSalesInvoices.forEach(invoice => {
        const customerName = invoice.receiverDetails?.name || "Unknown Customer";
        if (!salesByCustomer[customerName]) {
          salesByCustomer[customerName] = {
            totalPending: 0,
            invoices: []
          };
        }
        
        salesByCustomer[customerName].totalPending += invoice.grandTotal || 0;
        salesByCustomer[customerName].invoices.push({
          invoiceId: invoice._id,
          invoiceNumber: invoice.invoiceNumber,
          date: invoice.date,
          amount: invoice.grandTotal,
          type: "Sales Invoice"
        });
      });
      
      // Process pending ledgers
      pendingLedgers.forEach(ledger => {
        if (ledger.invoiceId) {
          const customerName = ledger.invoiceId.receiverDetails?.name || "Unknown Customer";
          if (!salesByCustomer[customerName]) {
            salesByCustomer[customerName] = {
              totalPending: 0,
              invoices: []
            };
          }
          
          // Only add if not already included from invoices
          const existingInvoice = salesByCustomer[customerName].invoices.find(
            inv => inv.invoiceId.toString() === ledger.invoiceId._id.toString()
          );
          
          if (!existingInvoice) {
            salesByCustomer[customerName].totalPending += ledger.dueAmount || 0;
            salesByCustomer[customerName].invoices.push({
              invoiceId: ledger.invoiceId._id,
              invoiceNumber: ledger.invoiceNumber,
              date: ledger.createdAt,
              amount: ledger.dueAmount,
              type: "Ledger Account"
            });
          }
        }
      });
    }
    
    // 2. Get services data if needed
    if (fetchServices) {
      // Get all pending service invoices
      const pendingServiceInvoices = await Service.find({ 
        paidOne: false,
        ...(startDate || endDate ? { date: dateFilter.createdAt } : {})
      });
      
      // Get all service accounts with pending payments
      const pendingServiceAccounts = await ServiceAccount.find({ 
        isPaid: false,
        ...dateFilter
      }).populate("invoiceId");
      
      // Process pending service invoices
      pendingServiceInvoices.forEach(service => {
        const customerName = service.customerName || service.receiverDetails?.name || "Unknown Customer";
        if (!servicesByCustomer[customerName]) {
          servicesByCustomer[customerName] = {
            totalPending: 0,
            services: []
          };
        }
        
        servicesByCustomer[customerName].totalPending += service.total?.grandTotal || 0;
        servicesByCustomer[customerName].services.push({
          serviceId: service._id,
          invoiceNumber: service.invoiceNumber,
          date: service.date,
          amount: service.total?.grandTotal,
          type: "Service Invoice"
        });
      });
      
      // Process pending service accounts
      pendingServiceAccounts.forEach(account => {
        if (account.invoiceId) {
          const customerName = account.invoiceId.customerName || account.invoiceId.receiverDetails?.name || "Unknown Customer";
          if (!servicesByCustomer[customerName]) {
            servicesByCustomer[customerName] = {
              totalPending: 0,
              services: []
            };
          }
          
          // Only add if not already included from service invoices
          const existingService = servicesByCustomer[customerName].services.find(
            svc => svc.serviceId.toString() === account.invoiceId._id.toString()
          );
          
          if (!existingService) {
            servicesByCustomer[customerName].totalPending += account.dueAmount || 0;
            servicesByCustomer[customerName].services.push({
              serviceId: account.invoiceId._id,
              invoiceNumber: account.invoiceNumber,
              date: account.createdAt,
              amount: account.dueAmount,
              type: "Service Account"
            });
          }
        }
      });
    }
    
    // 3. Get purchases data if needed
    if (fetchPurchases) {
      // Get all pending purchase orders
      const pendingPurchaseOrders = await MnsPurchaseOrderNew.find({ 
        paidOne: false,
        ...(startDate || endDate ? { date: dateFilter.createdAt } : {})
      });
      
      // Get all purchase accounts with pending payments
      const pendingPurchaseAccounts = await PurchaseAccount.find({ 
        isPaid: false,
        ...dateFilter
      }).populate("invoiceId");
      
      // Process pending purchase orders
      pendingPurchaseOrders.forEach(purchase => {
        const vendorName = purchase.vendorName || purchase.receiverDetails?.name || "Unknown Vendor";
        if (!purchasesByVendor[vendorName]) {
          purchasesByVendor[vendorName] = {
            totalPending: 0,
            purchases: []
          };
        }
        
        purchasesByVendor[vendorName].totalPending += purchase.grandTotal || 0;
        purchasesByVendor[vendorName].purchases.push({
          purchaseId: purchase._id,
          invoiceNumber: purchase.invoiceNumber,
          date: purchase.date,
          amount: purchase.grandTotal,
          type: "Purchase Order"
        });
      });
      
      // Process pending purchase accounts
      pendingPurchaseAccounts.forEach(account => {
        // Use vendorName from purchase account
        const vendorName = account.vendorName || "Unknown Vendor";
        if (!purchasesByVendor[vendorName]) {
          purchasesByVendor[vendorName] = {
            totalPending: 0,
            purchases: []
          };
        }
        
        // Only add if not already included from purchase orders
        let existingPurchase = false;
        if (account.invoiceId) {
          existingPurchase = purchasesByVendor[vendorName].purchases.find(
            pur => pur.purchaseId.toString() === account.invoiceId._id.toString()
          );
        }
        
        if (!existingPurchase) {
          purchasesByVendor[vendorName].totalPending += account.dueAmount || 0;
          purchasesByVendor[vendorName].purchases.push({
            purchaseId: account.invoiceId ? account.invoiceId._id : null,
            invoiceNumber: account.invoiceNumber,
            date: account.createdAt,
            amount: account.dueAmount,
            type: "Purchase Account"
          });
        }
      });
    }
    
    // Calculate totals
    const totalSalesPending = Object.values(salesByCustomer).reduce(
      (sum, customer) => sum + customer.totalPending, 0
    );
    
    const totalServicesPending = Object.values(servicesByCustomer).reduce(
      (sum, customer) => sum + customer.totalPending, 0
    );
    
    const totalPurchasesPending = Object.values(purchasesByVendor).reduce(
      (sum, vendor) => sum + vendor.totalPending, 0
    );
    
    // Create the final report based on requested type
    const reportData = {
      generatedAt: new Date(),
      filters: {
        startDate: startDate || null,
        endDate: endDate || null,
        reportType: reportType || 'all'
      }
    };
    
    // Only include requested sections
    if (fetchSales) {
      reportData.salesLedger = {
        customers: salesByCustomer,
        totalPending: totalSalesPending
      };
    }
    
    if (fetchServices) {
      reportData.serviceLedger = {
        customers: servicesByCustomer,
        totalPending: totalServicesPending
      };
    }
    
    if (fetchPurchases) {
      reportData.purchaseLedger = {
        vendors: purchasesByVendor,
        totalPending: totalPurchasesPending
      };
    }
    
    // Add summary if we have multiple sections
    if ((fetchSales && fetchServices) || (fetchSales && fetchPurchases) || (fetchServices && fetchPurchases)) {
      reportData.summary = {
        totalReceivables: totalSalesPending + totalServicesPending,
        totalPayables: totalPurchasesPending,
        netPosition: (totalSalesPending + totalServicesPending) - totalPurchasesPending
      };
    }
    
    return reportData;
  } catch (error) {
    console.error("Error generating master ledger report:", error);
    throw error;
  }
};

// Helper function to export to Excel
const exportToExcel = async (reportData, filePath) => {
  try {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'MNS Secure Solutions';
    workbook.created = new Date();
    
    // Create a sheet for summary
    const summarySheet = workbook.addWorksheet('Summary');
    
    // Add title and date
    summarySheet.mergeCells('A1:F1');
    const titleCell = summarySheet.getCell('A1');
    titleCell.value = 'Master Ledger Report';
    titleCell.font = { size: 16, bold: true };
    titleCell.alignment = { horizontal: 'center' };
    
    summarySheet.mergeCells('A2:F2');
    const dateCell = summarySheet.getCell('A2');
    dateCell.value = `Generated on: ${new Date(reportData.generatedAt).toLocaleString()}`;
    dateCell.font = { size: 12, italic: true };
    dateCell.alignment = { horizontal: 'center' };
    
    // Add filter information
    if (reportData.filters) {
      let filterText = 'Filters: ';
      if (reportData.filters.startDate) {
        filterText += `From ${new Date(reportData.filters.startDate).toLocaleDateString()} `;
      }
      if (reportData.filters.endDate) {
        filterText += `To ${new Date(reportData.filters.endDate).toLocaleDateString()} `;
      }
      if (reportData.filters.reportType && reportData.filters.reportType !== 'all') {
        filterText += `Type: ${reportData.filters.reportType}`;
      }
      
      summarySheet.mergeCells('A3:F3');
      const filterCell = summarySheet.getCell('A3');
      filterCell.value = filterText;
      filterCell.font = { size: 11 };
      filterCell.alignment = { horizontal: 'center' };
    }
    
    // Add summary data
    summarySheet.addRow([]);
    summarySheet.addRow(['Summary', '', '', '', '', '']);
    const headerRow = summarySheet.addRow(['Category', 'Total Amount', '', '', '', '']);
    headerRow.font = { bold: true };
    
    // Add data rows
    const summaryRows = [];
    
    if (reportData.salesLedger) {
      summaryRows.push(['Total Sales Receivables', reportData.salesLedger.totalPending]);
    }
    
    if (reportData.serviceLedger) {
      summaryRows.push(['Total Services Receivables', reportData.serviceLedger.totalPending]);
    }
    
    if (reportData.purchaseLedger) {
      summaryRows.push(['Total Purchases Payables', reportData.purchaseLedger.totalPending]);
    }
    
    if (reportData.summary) {
      summaryRows.push(['Total Receivables', reportData.summary.totalReceivables]);
      summaryRows.push(['Total Payables', reportData.summary.totalPayables]);
      summaryRows.push(['Net Position', reportData.summary.netPosition]);
    }
    
    summaryRows.forEach(row => {
      summarySheet.addRow(row);
    });
    
    // Format the summary table
    summarySheet.getColumn(1).width = 30;
    summarySheet.getColumn(2).width = 20;
    
    // Add detailed sheets
    if (reportData.salesLedger) {
      addSalesSheet(workbook, reportData.salesLedger);
    }
    
    if (reportData.serviceLedger) {
      addServicesSheet(workbook, reportData.serviceLedger);
    }
    
    if (reportData.purchaseLedger) {
      addPurchasesSheet(workbook, reportData.purchaseLedger);
    }
    
    // Create directory if it doesn't exist
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    // Write to file
    await workbook.xlsx.writeFile(filePath);
    return filePath;
  } catch (error) {
    console.error("Error exporting to Excel:", error);
    throw error;
  }
};

// Helper function to add sales sheet
const addSalesSheet = (workbook, salesLedger) => {
  const salesSheet = workbook.addWorksheet('Sales Ledger');
  
  // Add title
  salesSheet.mergeCells('A1:F1');
  const titleCell = salesSheet.getCell('A1');
  titleCell.value = 'Sales Ledger - Pending Receivables';
  titleCell.font = { size: 14, bold: true };
  titleCell.alignment = { horizontal: 'center' };
  
  salesSheet.addRow([]);
  
  // Add customer summary
  salesSheet.addRow(['Customer', 'Total Pending', '', '', '', '']);
  
  Object.entries(salesLedger.customers).forEach(([customerName, data]) => {
    salesSheet.addRow([customerName, data.totalPending]);
  });
  
  salesSheet.addRow([]);
  salesSheet.addRow(['Total', salesLedger.totalPending]);
  salesSheet.addRow([]);
  
  // Add detailed invoice list
  salesSheet.addRow(['Detailed Invoice List']);
  const headerRow = salesSheet.addRow(['Customer', 'Invoice Number', 'Date', 'Amount', 'Type']);
  headerRow.font = { bold: true };
  
  Object.entries(salesLedger.customers).forEach(([customerName, data]) => {
    data.invoices.forEach(invoice => {
      salesSheet.addRow([
        customerName,
        invoice.invoiceNumber,
        new Date(invoice.date).toLocaleDateString(),
        invoice.amount,
        invoice.type
      ]);
    });
  });
  
  // Format columns
  salesSheet.getColumn(1).width = 30;
  salesSheet.getColumn(2).width = 20;
  salesSheet.getColumn(3).width = 15;
  salesSheet.getColumn(4).width = 15;
  salesSheet.getColumn(5).width = 20;
};

// Helper function to add services sheet
const addServicesSheet = (workbook, serviceLedger) => {
  const servicesSheet = workbook.addWorksheet('Services Ledger');
  
  // Add title
  servicesSheet.mergeCells('A1:F1');
  const titleCell = servicesSheet.getCell('A1');
  titleCell.value = 'Services Ledger - Pending Receivables';
  titleCell.font = { size: 14, bold: true };
  titleCell.alignment = { horizontal: 'center' };
  
  servicesSheet.addRow([]);
  
  // Add customer summary
  servicesSheet.addRow(['Customer', 'Total Pending', '', '', '', '']);
  
  Object.entries(serviceLedger.customers).forEach(([customerName, data]) => {
    servicesSheet.addRow([customerName, data.totalPending]);
  });
  
  servicesSheet.addRow([]);
  servicesSheet.addRow(['Total', serviceLedger.totalPending]);
  servicesSheet.addRow([]);
  
  // Add detailed service list
  servicesSheet.addRow(['Detailed Service List']);
  const headerRow = servicesSheet.addRow(['Customer', 'Invoice Number', 'Date', 'Amount', 'Type']);
  headerRow.font = { bold: true };
  
  Object.entries(serviceLedger.customers).forEach(([customerName, data]) => {
    data.services.forEach(service => {
      servicesSheet.addRow([
        customerName,
        service.invoiceNumber,
        new Date(service.date).toLocaleDateString(),
        service.amount,
        service.type
      ]);
    });
  });
  
  // Format columns
  servicesSheet.getColumn(1).width = 30;
  servicesSheet.getColumn(2).width = 20;
  servicesSheet.getColumn(3).width = 15;
  servicesSheet.getColumn(4).width = 15;
  servicesSheet.getColumn(5).width = 20;
};

// Helper function to add purchases sheet
const addPurchasesSheet = (workbook, purchaseLedger) => {
  const purchasesSheet = workbook.addWorksheet('Purchases Ledger');
  
  // Add title
  purchasesSheet.mergeCells('A1:F1');
  const titleCell = purchasesSheet.getCell('A1');
  titleCell.value = 'Purchases Ledger - Pending Payables';
  titleCell.font = { size: 14, bold: true };
  titleCell.alignment = { horizontal: 'center' };
  
  purchasesSheet.addRow([]);
  
  // Add vendor summary
  purchasesSheet.addRow(['Vendor', 'Total Pending', '', '', '', '']);
  
  Object.entries(purchaseLedger.vendors).forEach(([vendorName, data]) => {
    purchasesSheet.addRow([vendorName, data.totalPending]);
  });
  
  purchasesSheet.addRow([]);
  purchasesSheet.addRow(['Total', purchaseLedger.totalPending]);
  purchasesSheet.addRow([]);
  
  // Add detailed purchase list
  purchasesSheet.addRow(['Detailed Purchase List']);
  const headerRow = purchasesSheet.addRow(['Vendor', 'Invoice Number', 'Date', 'Amount', 'Type']);
  headerRow.font = { bold: true };
  
  Object.entries(purchaseLedger.vendors).forEach(([vendorName, data]) => {
    data.purchases.forEach(purchase => {
      purchasesSheet.addRow([
        vendorName,
        purchase.invoiceNumber,
        new Date(purchase.date).toLocaleDateString(),
        purchase.amount,
        purchase.type
      ]);
    });
  });
  
  // Format columns
  purchasesSheet.getColumn(1).width = 30;
  purchasesSheet.getColumn(2).width = 20;
  purchasesSheet.getColumn(3).width = 15;
  purchasesSheet.getColumn(4).width = 15;
  purchasesSheet.getColumn(5).width = 20;
};

// Helper function to export to PDF
const exportToPDF = async (reportData, filePath) => {
  try {
    // Create a document
    const doc = new PDFDocument({ margin: 50 });
    
    // Create directory if it doesn't exist
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    // Pipe its output to the file
    doc.pipe(fs.createWriteStream(filePath));
    
    // Add title
    doc.fontSize(20).text('Master Ledger Report', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Generated on: ${new Date(reportData.generatedAt).toLocaleString()}`, { align: 'center' });
    doc.moveDown();
    
    // Add filter information
    if (reportData.filters) {
      let filterText = 'Filters: ';
      if (reportData.filters.startDate) {
        filterText += `From ${new Date(reportData.filters.startDate).toLocaleDateString()} `;
      }
      if (reportData.filters.endDate) {
        filterText += `To ${new Date(reportData.filters.endDate).toLocaleDateString()} `;
      }
      if (reportData.filters.reportType && reportData.filters.reportType !== 'all') {
        filterText += `Type: ${reportData.filters.reportType}`;
      }
      
      doc.fontSize(10).text(filterText, { align: 'center' });
      doc.moveDown();
    }
    
    // Add summary table
    doc.fontSize(16).text('Summary', { align: 'left' });
    doc.moveDown();
    
    const summaryTable = {
      title: "Summary",
      headers: ["Category", "Amount"],
      rows: []
    };
    
    if (reportData.salesLedger) {
      summaryTable.rows.push(["Total Sales Receivables", reportData.salesLedger.totalPending.toFixed(2)]);
    }
    
    if (reportData.serviceLedger) {
      summaryTable.rows.push(["Total Services Receivables", reportData.serviceLedger.totalPending.toFixed(2)]);
    }
    
    if (reportData.purchaseLedger) {
      summaryTable.rows.push(["Total Purchases Payables", reportData.purchaseLedger.totalPending.toFixed(2)]);
    }
    
    if (reportData.summary) {
      summaryTable.rows.push(["Total Receivables", reportData.summary.totalReceivables.toFixed(2)]);
      summaryTable.rows.push(["Total Payables", reportData.summary.totalPayables.toFixed(2)]);
      summaryTable.rows.push(["Net Position", reportData.summary.netPosition.toFixed(2)]);
    }
    
    // Draw the summary table
    await doc.table(summaryTable, {
      prepareHeader: () => doc.font('Helvetica-Bold').fontSize(10),
      prepareRow: () => doc.font('Helvetica').fontSize(10)
    });
    
    doc.moveDown();
    
    // Add detailed sections based on report type
    if (reportData.salesLedger && Object.keys(reportData.salesLedger.customers).length > 0) {
      doc.addPage();
      doc.fontSize(16).text('Sales Ledger - Pending Receivables', { align: 'center' });
      doc.moveDown();
      
      // Customer summary
      doc.fontSize(14).text('Customer Summary', { align: 'left' });
      doc.moveDown();
      
      const customerSummaryTable = {
        headers: ["Customer", "Total Pending"],
        rows: []
      };
      
      Object.entries(reportData.salesLedger.customers).forEach(([customerName, data]) => {
        customerSummaryTable.rows.push([customerName, data.totalPending.toFixed(2)]);
      });
      
      customerSummaryTable.rows.push(["Total", reportData.salesLedger.totalPending.toFixed(2)]);
      
      await doc.table(customerSummaryTable, {
        prepareHeader: () => doc.font('Helvetica-Bold').fontSize(10),
        prepareRow: (row, i) => {
          doc.font(i === customerSummaryTable.rows.length - 1 ? 'Helvetica-Bold' : 'Helvetica').fontSize(10);
        }
      });
      
      doc.moveDown();
      
      // Detailed invoice list
      doc.fontSize(14).text('Detailed Invoice List', { align: 'left' });
      doc.moveDown();
      
      const invoiceTable = {
        headers: ["Customer", "Invoice Number", "Date", "Amount", "Type"],
        rows: []
      };
      
      Object.entries(reportData.salesLedger.customers).forEach(([customerName, data]) => {
        data.invoices.forEach(invoice => {
          invoiceTable.rows.push([
            customerName,
            invoice.invoiceNumber,
            new Date(invoice.date).toLocaleDateString(),
            invoice.amount.toFixed(2),
            invoice.type
          ]);
        });
      });
      
      await doc.table(invoiceTable, {
        prepareHeader: () => doc.font('Helvetica-Bold').fontSize(10),
        prepareRow: () => doc.font('Helvetica').fontSize(10)
      });
    }
    
    if (reportData.serviceLedger && Object.keys(reportData.serviceLedger.customers).length > 0) {
      doc.addPage();
      doc.fontSize(16).text('Services Ledger - Pending Receivables', { align: 'center' });
      doc.moveDown();
      
      // Customer summary
      doc.fontSize(14).text('Customer Summary', { align: 'left' });
      doc.moveDown();
      
      const customerSummaryTable = {
        headers: ["Customer", "Total Pending"],
        rows: []
      };
      
      Object.entries(reportData.serviceLedger.customers).forEach(([customerName, data]) => {
        customerSummaryTable.rows.push([customerName, data.totalPending.toFixed(2)]);
      });
      
      customerSummaryTable.rows.push(["Total", reportData.serviceLedger.totalPending.toFixed(2)]);
      
      await doc.table(customerSummaryTable, {
        prepareHeader: () => doc.font('Helvetica-Bold').fontSize(10),
        prepareRow: (row, i) => {
          doc.font(i === customerSummaryTable.rows.length - 1 ? 'Helvetica-Bold' : 'Helvetica').fontSize(10);
        }
      });
      
      doc.moveDown();
      
      // Detailed service list
      doc.fontSize(14).text('Detailed Service List', { align: 'left' });
      doc.moveDown();
      
      const serviceTable = {
        headers: ["Customer", "Invoice Number", "Date", "Amount", "Type"],
        rows: []
      };
      
      Object.entries(reportData.serviceLedger.customers).forEach(([customerName, data]) => {
        data.services.forEach(service => {
          serviceTable.rows.push([
            customerName,
            service.invoiceNumber,
            new Date(service.date).toLocaleDateString(),
            service.amount.toFixed(2),
            service.type
          ]);
        });
      });
      
      await doc.table(serviceTable, {
        prepareHeader: () => doc.font('Helvetica-Bold').fontSize(10),
        prepareRow: () => doc.font('Helvetica').fontSize(10)
      });
    }
    
    if (reportData.purchaseLedger && Object.keys(reportData.purchaseLedger.vendors).length > 0) {
      doc.addPage();
      doc.fontSize(16).text('Purchases Ledger - Pending Payables', { align: 'center' });
      doc.moveDown();
      
      // Vendor summary
      doc.fontSize(14).text('Vendor Summary', { align: 'left' });
      doc.moveDown();
      
      const vendorSummaryTable = {
        headers: ["Vendor", "Total Pending"],
        rows: []
      };
      
      Object.entries(reportData.purchaseLedger.vendors).forEach(([vendorName, data]) => {
        vendorSummaryTable.rows.push([vendorName, data.totalPending.toFixed(2)]);
      });
      
      vendorSummaryTable.rows.push(["Total", reportData.purchaseLedger.totalPending.toFixed(2)]);
      
      await doc.table(vendorSummaryTable, {
        prepareHeader: () => doc.font('Helvetica-Bold').fontSize(10),
        prepareRow: (row, i) => {
          doc.font(i === vendorSummaryTable.rows.length - 1 ? 'Helvetica-Bold' : 'Helvetica').fontSize(10);
        }
      });
      
      doc.moveDown();
      
      // Detailed purchase list
      doc.fontSize(14).text('Detailed Purchase List', { align: 'left' });
      doc.moveDown();
      
      const purchaseTable = {
        headers: ["Vendor", "Invoice Number", "Date", "Amount", "Type"],
        rows: []
      };
      
      Object.entries(reportData.purchaseLedger.vendors).forEach(([vendorName, data]) => {
        data.purchases.forEach(purchase => {
          purchaseTable.rows.push([
            vendorName,
            purchase.invoiceNumber,
            new Date(purchase.date).toLocaleDateString(),
            purchase.amount.toFixed(2),
            purchase.type
          ]);
        });
      });
      
      await doc.table(purchaseTable, {
        prepareHeader: () => doc.font('Helvetica-Bold').fontSize(10),
        prepareRow: () => doc.font('Helvetica').fontSize(10)
      });
    }
    
    // Finalize the PDF
    doc.end();
    return filePath;
  } catch (error) {
    console.error("Error exporting to PDF:", error);
    throw error;
  }
};

// Main endpoint to get master ledger report with all data
const getMasterLedgerReport = async (req, res) => {
  try {
    const { startDate, endDate, format } = req.query;
    
    // Generate the report data
    const reportData = await generateMasterLedgerReport({
      startDate,
      endDate,
      reportType: 'all'
    });
    
    // If export format is specified, generate the file
    if (format) {
      const timestamp = new Date().getTime();
      const exportDir = path.join('d:', 'mns', 'backend', 'exports');
      
      if (format === 'excel') {
        const filePath = path.join(exportDir, `master_ledger_${timestamp}.xlsx`);
        await exportToExcel(reportData, filePath);
        
        return res.status(200).json({
          success: true,
          message: "Master ledger report exported to Excel successfully",
          filePath: filePath
        });
      } else if (format === 'pdf') {
        const filePath = path.join(exportDir, `master_ledger_${timestamp}.pdf`);
        await exportToPDF(reportData, filePath);
        
        return res.status(200).json({
          success: true,
          message: "Master ledger report exported to PDF successfully",
          filePath: filePath
        });
      }
    }
    
    // Return the report data as JSON
    return res.status(200).json({
      success: true,
      message: "Master ledger report generated successfully",
      data: reportData
    });
  } catch (error) {
    console.error("Error in getMasterLedgerReport:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to generate master ledger report",
      error: error.message
    });
  }
};

// Get only sales ledger data
const getSalesLedgerReport = async (req, res) => {
  try {
    const { startDate, endDate, format } = req.query;
    
    // Generate the report with only sales data
    const reportData = await generateMasterLedgerReport({
      startDate,
      endDate,
      reportType: 'sales'
    });
    
    // Handle export if requested
    if (format) {
      const timestamp = new Date().getTime();
      const exportDir = path.join('d:', 'mns', 'backend', 'exports');
      
      if (format === 'excel') {
        const filePath = path.join(exportDir, `sales_ledger_${timestamp}.xlsx`);
        await exportToExcel(reportData, filePath);
        
        return res.status(200).json({
          success: true,
          message: "Sales ledger report exported to Excel successfully",
          filePath: filePath
        });
      } else if (format === 'pdf') {
        const filePath = path.join(exportDir, `sales_ledger_${timestamp}.pdf`);
        await exportToPDF(reportData, filePath);
        
        return res.status(200).json({
          success: true,
          message: "Sales ledger report exported to PDF successfully",
          filePath: filePath
        });
      }
    }
    
    return res.status(200).json({
      success: true,
      message: "Sales ledger report generated successfully",
      data: reportData
    });
  } catch (error) {
    console.error("Error in getSalesLedgerReport:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to generate sales ledger report",
      error: error.message
    });
  }
};

// Get only services ledger data
const getServicesLedgerReport = async (req, res) => {
  try {
    const { startDate, endDate, format } = req.query;
    
    // Generate the report with only services data
    const reportData = await generateMasterLedgerReport({
      startDate,
      endDate,
      reportType: 'services'
    });
    
    // Handle export if requested
    if (format) {
      const timestamp = new Date().getTime();
      const exportDir = path.join('d:', 'mns', 'backend', 'exports');
      
      if (format === 'excel') {
        const filePath = path.join(exportDir, `services_ledger_${timestamp}.xlsx`);
        await exportToExcel(reportData, filePath);
        
        return res.status(200).json({
          success: true,
          message: "Services ledger report exported to Excel successfully",
          filePath: filePath
        });
      } else if (format === 'pdf') {
        const filePath = path.join(exportDir, `services_ledger_${timestamp}.pdf`);
        await exportToPDF(reportData, filePath);
        
        return res.status(200).json({
          success: true,
          message: "Services ledger report exported to PDF successfully",
          filePath: filePath
        });
      }
    }
    
    return res.status(200).json({
      success: true,
      message: "Services ledger report generated successfully",
      data: reportData
    });
  } catch (error) {
    console.error("Error in getServicesLedgerReport:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to generate services ledger report",
      error: error.message
    });
  }
};

// Get only purchases ledger data
const getPurchasesLedgerReport = async (req, res) => {
  try {
    const { startDate, endDate, format } = req.query;
    
    // Generate the report with only purchases data
    const reportData = await generateMasterLedgerReport({
      startDate,
      endDate,
      reportType: 'purchases'
    });
    
    // Handle export if requested
    if (format) {
      const timestamp = new Date().getTime();
      const exportDir = path.join('d:', 'mns', 'backend', 'exports');
      
      if (format === 'excel') {
        const filePath = path.join(exportDir, `purchases_ledger_${timestamp}.xlsx`);
        await exportToExcel(reportData, filePath);
        
        return res.status(200).json({
          success: true,
          message: "Purchases ledger report exported to Excel successfully",
          filePath: filePath
        });
      } else if (format === 'pdf') {
        const filePath = path.join(exportDir, `purchases_ledger_${timestamp}.pdf`);
        await exportToPDF(reportData, filePath);
        
        return res.status(200).json({
          success: true,
          message: "Purchases ledger report exported to PDF successfully",
          filePath: filePath
        });
      }
    }
    
    return res.status(200).json({
      success: true,
      message: "Purchases ledger report generated successfully",
      data: reportData
    });
  } catch (error) {
    console.error("Error in getPurchasesLedgerReport:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to generate purchases ledger report",
      error: error.message
    });
  }
};

export {
  getMasterLedgerReport,
  getSalesLedgerReport,
  getServicesLedgerReport,
  getPurchasesLedgerReport
};