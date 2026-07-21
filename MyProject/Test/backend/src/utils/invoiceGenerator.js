import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

/**
 * Generate PDF Invoice
 * @param {Object} transaction - Transaction object from DB
 * @param {Object} user - User object
 */
export const generateInvoicePDF = (transaction, user) => {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({ margin: 50 });
            const buffers = [];

            doc.on("data", buffers.push.bind(buffers));
            doc.on("end", () => {
                const pdfData = Buffer.concat(buffers);
                resolve(pdfData);
            });

            // Header
            doc
                .fillColor("#444444")
                .fontSize(20)
                .text("VAISBUCKET", 50, 57)
                .fontSize(10)
                .text("Premium Cloud Storage", 200, 65, { align: "right" })
                .text("India", 200, 80, { align: "right" })
                .moveDown();

            // Invoice Info
            doc
                .fillColor("#444444")
                .fontSize(20)
                .text("Invoice", 50, 160);

            generateHr(doc, 185);

            const customerInformationTop = 200;

            doc
                .fontSize(10)
                .text("Invoice Number:", 50, customerInformationTop)
                .font("Helvetica-Bold")
                .text(transaction._id.toString().slice(-8).toUpperCase(), 150, customerInformationTop)
                .font("Helvetica")
                .text("Invoice Date:", 50, customerInformationTop + 15)
                .text(new Date(transaction.createdAt).toLocaleDateString(), 150, customerInformationTop + 15)
                .text("Balance Due:", 50, customerInformationTop + 30)
                .text(`₹0.00`, 150, customerInformationTop + 30)

                .font("Helvetica-Bold")
                .text(transaction.billingName || user.name, 300, customerInformationTop)
                .font("Helvetica")
                .text(transaction.billingAddress || "N/A", 300, customerInformationTop + 15)
                .text(transaction.email || user.email, 300, customerInformationTop + 30)
                .moveDown();

            if (transaction.gstNumber) {
                doc.text(`GST: ${transaction.gstNumber}`, 300, customerInformationTop + 45);
            }

            generateHr(doc, 256);

            // Table Header
            const invoiceTableTop = 330;
            doc.font("Helvetica-Bold");
            generateTableRow(
                doc,
                invoiceTableTop,
                "Description",
                "Cycle",
                "Unit Cost",
                "Amount"
            );
            generateHr(doc, invoiceTableTop + 20);
            doc.font("Helvetica");

            // Table Content
            const description = `${transaction.plan} Plan Subscription`;
            generateTableRow(
                doc,
                invoiceTableTop + 30,
                description,
                transaction.billingCycle,
                `₹${transaction.amount}`,
                `₹${transaction.amount}`
            );

            generateHr(doc, invoiceTableTop + 56);

            // Totals
            const subtotalPosition = invoiceTableTop + 70;
            generateTableRow(
                doc,
                subtotalPosition,
                "",
                "",
                "Subtotal",
                `₹${transaction.amount}`
            );

            const totalPosition = subtotalPosition + 25;
            doc.font("Helvetica-Bold");
            generateTableRow(
                doc,
                totalPosition,
                "",
                "",
                "Total",
                `₹${transaction.amount}`
            );
            doc.font("Helvetica");

            // Footer
            doc
                .fontSize(10)
                .text(
                    "Thank you for choosing VaisBucket!",
                    50,
                    700,
                    { align: "center", width: 500 }
                );

            doc.end();
        } catch (error) {
            reject(error);
        }
    });
};

function generateHr(doc, y) {
    doc
        .strokeColor("#aaaaaa")
        .lineWidth(1)
        .moveTo(50, y)
        .lineTo(550, y)
        .stroke();
}

function generateTableRow(doc, y, description, cycle, unitPrice, total) {
    doc
        .fontSize(10)
        .text(description, 50, y)
        .text(cycle, 200, y)
        .text(unitPrice, 350, y, { width: 90, align: "right" })
        .text(total, 450, y, { width: 90, align: "right" });
}

