import React, { useState, useEffect } from "react";
import { backendDomainA, backendDomainS } from "../../../Common/index";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { ToWords } from 'to-words';

const companyName= import.meta.env.VITE_REACT_COMPANY_NAME;
const companyAddress= import.meta.env.VITE_REACT_COMPANY_ADDRESS;
const companyGST= import.meta.env.VITE_REACT_COMPANY_GSTIN;
const companyPhone= import.meta.env.VITE_REACT_COMPANY_PHONE;
const companyEmail= import.meta.env.VITE_REACT_COMPANY_EMAIL;
const companyState= import.meta.env.VITE_REACT_COMPANY_STATE;



const ServicePdfPage = ({ serviceinvoiceData }) => {
  const [bankDtails, setBankDtails] = useState([]);
  // console.log("shfsgsgj", serviceinvoiceData);

  const toWords = new ToWords();

  const fetchBanks = async () => {
    try {
      const response = await fetch(`${backendDomainS}/api/v1/bank/all`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const jsonData = await response.json();
      setBankDtails(jsonData.data || []);
    } catch (error) {
      console.error("Fetch Error:", error);
    }
  };

  useEffect(() => {
    fetchBanks();
  }, []);

  const downloadPDF = () => {
    const doc = new jsPDF("p", "mm", "a4");
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;

    // Helper function to draw bordered box
    const drawBox = (x, y, width, height, fillColor = null) => {
      doc.setDrawColor(0, 0, 0); // Ensure black border
      doc.setLineWidth(0.2); // Set line width for consistency with table
      if (fillColor) {
        doc.setFillColor(fillColor);
        doc.rect(x, y, width, height, "FD");
      } else {
        doc.rect(x, y, width, height);
      }
    };

    // Company Header with border
    drawBox(10, 10, pageWidth - 20, 35, 240); // Light gray background

    // Company name
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text(`${companyName}`, pageWidth / 2, 20, { align: "center" });

    // Certification
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text("An ISO 9001- 2015 Certified company", pageWidth / 2, 26, {
      align: "center",
    });

    // Address
    doc.text(`${companyAddress}`, pageWidth / 2, 32, { align: "center" });
    // doc.text("KOLKATA- 700 064", pageWidth / 2, 38, { align: "center" });

    // GSTIN and Phone in footer of header box
    doc.setFontSize(8);
    doc.text(`GSTIN: ${companyGST}`, 12, 50);
    doc.text(`STATE: ${companyState}`, 12, 54);
    doc.text(`Phone no: ${companyPhone}`, pageWidth - 60, 50);
    doc.text(`e-mail ID : ${companyEmail}`, pageWidth - 60, 54);

    // Tax Invoice Title
    drawBox(10, 60, pageWidth - 20, 8, 220);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("Tax Invoice", pageWidth / 2, 66, { align: "center" });

    // Invoice Details Section - Left Side
    const leftBoxX = 10;
    const rightBoxX = pageWidth / 2;
    const boxY = 72;
    const boxHeight = 60;
    drawBox(leftBoxX, boxY, pageWidth / 2 - 10, boxHeight);
    drawBox(rightBoxX, boxY, pageWidth / 2 - 10, boxHeight);

    // Left side content
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    let yPos = 78;

    doc.text(
      `Invoice No: ${serviceinvoiceData.invoiceNumber}`,
      leftBoxX + 6,
      yPos
    );
    yPos += 5;
    doc.text(`Invoice Date: ${serviceinvoiceData.date}`, leftBoxX + 6, yPos);
    yPos += 5;
    doc.text(
      `Billing Month: ${new Date(serviceinvoiceData.date).toLocaleString(
        "en-US",
        {
          month: "long",
          year: "numeric",
        }
      )}`,
      leftBoxX + 6,
      yPos
    );

    yPos += 10;
    doc.setFont("helvetica", "bold");
    doc.text("Details of Receiver Billed To:", leftBoxX + 6, yPos);
    yPos += 5;
    doc.text(serviceinvoiceData.receiverDetails.name, leftBoxX + 6, yPos);
    yPos += 4;

    doc.setFont("helvetica", "normal");
    const addressLines = doc.splitTextToSize(
      serviceinvoiceData.receiverDetails.address,
      80
    );
    addressLines.forEach((line) => {
      doc.text(line, leftBoxX + 6, yPos);
      yPos += 4;
    });

    yPos += 2;
    doc.text(
      `GSTIN: ${serviceinvoiceData.receiverDetails.gstin}`,
      leftBoxX + 6,
      yPos
    );
    yPos += 4;
    doc.text(`PO NO: ${serviceinvoiceData.poNumber}`, leftBoxX + 6, yPos);
    yPos += 4;
    doc.text(`DATE: ${serviceinvoiceData.poDate}`, leftBoxX + 6, yPos);

    // Right side content
    yPos = 78;
    doc.text("Transportation mode:", rightBoxX + 2, yPos);
    yPos += 5;
    doc.text("E-way no:", rightBoxX + 2, yPos);
    yPos += 5;
    doc.text("Date of Supply:", rightBoxX + 2, yPos);
    yPos += 5;
    doc.text("Place of Supply:", rightBoxX + 2, yPos);

    yPos += 10;
    doc.setFont("helvetica", "bold");
    doc.text("Details of Consignee Shipped To:", rightBoxX + 2, yPos);
    yPos += 5;

    doc.setFont("helvetica", "normal");
    doc.text(
      `Address: ${serviceinvoiceData.receiverDetails.deliveryAddress}`,
      rightBoxX + 2,
      yPos
    );
    yPos += 4;
    doc.text(
      `Phone No: ${serviceinvoiceData.receiverDetails.phoneNumber}`,
      rightBoxX + 2,
      yPos
    );
    yPos += 4;
    doc.text(
      `GSTIN: ${serviceinvoiceData.receiverDetails.gstin}`,
      rightBoxX + 2,
      yPos
    );
    yPos += 4;
    doc.text(
      `State: ${serviceinvoiceData.receiverDetails.state}`,
      rightBoxX + 2,
      yPos
    );

    // Declaration
    const declarationY = 135;
    drawBox(10, declarationY, pageWidth - 20, 8);
    doc.setFontSize(8);
    doc.text(
      "Declaration: We declare that this invoice show the actual price of goods described and that all particular are true and correct.",
      12,
      declarationY + 5
    );

    // Items Table
    const tableStartY = 148;

    // Calculate totals
    const cgstTotal = serviceinvoiceData.items.reduce(
      (acc, curr) =>
        acc + (parseFloat((curr.grossAmount * curr.cgst) / 100) || 0),
      0
    );
    const sgstTotal = serviceinvoiceData.items.reduce(
      (acc, curr) => acc + ((curr.grossAmount * curr.sgst) / 100 || 0),
      0
    );
    const igstTotal = serviceinvoiceData.items.reduce(
      (acc, curr) =>
        acc + (parseFloat((curr.grossAmount * curr.igst) / 100) || 0),
      0
    );
    const totalTaxAmount = cgstTotal + sgstTotal + igstTotal;

    // Prepare table data
    const tableData = serviceinvoiceData.items.map((item, i) => [
      (i + 1).toString(),
      item.description,
      item.hsnCode,
      item.quantity.toString(),
      item.uom,
      item.sellingPrice.toString(),
      item.grossAmount.toString(),
      `${item.cgst || 0}%`,
      (item.grossAmount * (item.cgst / 100) || 0).toFixed(2),
      `${item.sgst || 0}%`,
      (item.grossAmount * (item.sgst / 100) || 0).toFixed(2),
      `${item.igst || 0}%`,
      (item.grossAmount * (item.igst / 100) || 0).toFixed(2),
      item.amount.toFixed(2),
    ]);

    // Add totals row
    tableData.push([
      "",
      "",
      "",
      "",
      "",
      "",
      "Total",
      "",
      cgstTotal.toFixed(2),
      "",
      sgstTotal.toFixed(2),
      "",
      igstTotal.toFixed(2),
      serviceinvoiceData.grandTotal.toFixed(2),
    ]);

    // Create table using autoTable
    doc.autoTable({
      startY: tableStartY,
      head: [
        [
          "Sl no",
          "Item Description",
          "HSN code",
          "Qty.",
          "Unit",
          "Rate",
          "Amount",
          "CGST",
          "",
          "SGST",
          "",
          "IGST",
          "",
          "Amount",
        ],
        [
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "Rate",
          "Amt.",
          "Rate",
          "Amt.",
          "Rate",
          "Amt.",
          "",
        ],
      ],
      body: tableData,
      theme: "grid",
      styles: {
        fontSize: 9,
        cellPadding: 1,
        halign: "center",
        valign: "middle",
        lineColor: [0, 0, 0],
        lineWidth: 0.2,
      },
      headStyles: {
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
        fontStyle: "bold",
        fontSize: 7.5,
        halign: "center",
        valign: "middle",
        lineColor: [0, 0, 0],
        lineWidth: 0.4,
      },
      columnStyles: {
        0: { cellWidth: 11, halign: "center" },
        1: { cellWidth: 27, halign: "left" },
        2: { cellWidth: 15, halign: "center" },
        3: { cellWidth: 9, halign: "center" },
        4: { cellWidth: 12, halign: "center" },
        5: { cellWidth: 12, halign: "right" },
        6: { cellWidth: 15, halign: "right" },
        7: { cellWidth: 9, halign: "center" },
        8: { cellWidth: 12, halign: "right" },
        9: { cellWidth: 9, halign: "center" },
        10: { cellWidth: 12, halign: "right" },
        11: { cellWidth: 9, halign: "center" },
        12: { cellWidth: 12, halign: "right" },
        13: { cellWidth: 15, halign: "right" },
      },
      didParseCell: function (data) {
        if (data.row.index === tableData.length - 1) {
          data.cell.styles.fontStyle = "bold";
          data.cell.styles.fillColor = [255, 255, 255];
        }
      },
    });

    // Footer Section
    const footerY = doc.lastAutoTable.finalY + 5;
    const footerHeight = 60;

    // Left footer box
    drawBox(10, footerY, pageWidth / 2 - 10, footerHeight);

    // Right footer box
    drawBox(pageWidth / 2, footerY, pageWidth / 2 - 10, footerHeight);

    // Left footer content
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text(
      `Rupees ${toWords.convert(serviceinvoiceData?.totalPayableAmount  || serviceinvoiceData.grandTotal)} Only`,
      12,
      footerY + 8
    );

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.text(
      `Bank name: ${bankDtails[0]?.bankName || "Bank of Baroda"}`,
      12,
      footerY + 16
    );
    doc.text(
      `A/C No: ${bankDtails[0]?.accountNumber || "37250200000354"}`,
      12,
      footerY + 20
    );
    doc.text(
      `IFSC Code: ${bankDtails[0]?.ifscCode || "BARB0STAGAR"}`,
      12,
      footerY + 24
    );
    doc.text(
      `Branch: ${
        bankDtails[0]?.branch ||
        "Garia Station Road, Kolkata Branch, Kolkata- 700 084"
      }`,
      12,
      footerY + 28
    );

    // Right footer content
    let rightYPos = footerY + 8;
    const rightBoxContentStartX = pageWidth / 2 + 5;
    const rightBoxContentEndX = pageWidth - 15;

    // CGST
    doc.text("Add: CGST:", rightBoxContentStartX, rightYPos);
    doc.text(cgstTotal.toFixed(2), rightBoxContentEndX, rightYPos, {
      align: "right",
    });
    rightYPos += 4;

    // SGST
    doc.text("Add: SGST:", rightBoxContentStartX, rightYPos);
    doc.text(sgstTotal.toFixed(2), rightBoxContentEndX, rightYPos, {
      align: "right",
    });
    rightYPos += 4;

    // IGST
    doc.text("Add: IGST:", rightBoxContentStartX, rightYPos);
    doc.text(igstTotal.toFixed(2), rightBoxContentEndX, rightYPos, {
      align: "right",
    });
    rightYPos += 4;

    doc.setFont("helvetica", "bold");
    // Total Tax Amount
    doc.text("Total Tax Amount:", rightBoxContentStartX, rightYPos);
    doc.text(totalTaxAmount.toFixed(2), rightBoxContentEndX, rightYPos, {
      align: "right",
    });
    rightYPos += 4;

    doc.setFont("helvetica", "normal");
    // Transportation Charges
    doc.text("Transportation Charges:", rightBoxContentStartX, rightYPos);
    doc.text(
      (serviceinvoiceData.transportationCharges).toString(),
      rightBoxContentEndX,
      rightYPos,
      { align: "right" }
    );
    rightYPos += 4;

      // Add underline after transportation charges
    // doc.line(rightBoxContentStartX, rightYPos, rightBoxContentEndX, rightYPos);
    // rightYPos += 4; // Move down further for next line

    doc.setFont("helvetica", "bold");
    // Grand Total
    doc.text("Grand Total:", rightBoxContentStartX, rightYPos);
    doc.text(
      serviceinvoiceData.grandTotal.toFixed(2),
      rightBoxContentEndX,
      rightYPos,
      { align: "right" }
    );

    rightYPos += 4;
    doc.setFont("helvetica", "bold");

    doc.text("Round Off :", rightBoxContentStartX, rightYPos);
    doc.text((serviceinvoiceData?.roundOff || 0).toString(), rightBoxContentEndX, rightYPos, { align: 'right' });
     rightYPos += 4;

    // Add underline after transportation charges
    doc.line(rightBoxContentStartX, rightYPos, rightBoxContentEndX, rightYPos);
    rightYPos += 4; // Move down further for next line

    doc.setFont("helvetica", "bold");
    doc.text("Total Payable Amount :", rightBoxContentStartX, rightYPos);
     doc.text((serviceinvoiceData?.totalPayableAmount || serviceinvoiceData?.grandTotal).toString(), rightBoxContentEndX, rightYPos, { align: 'right' });
     rightYPos += 4; 

    // Signature section
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.text("Authorised Signatory", pageWidth - 15, footerY + 56, {
      align: "right",
    });
    doc.text(`FOR ${companyName}`, pageWidth - 15, footerY + 48, {
      align: "right",
    });

    // Save the PDF
    doc.save(`Tax_Invoice_${serviceinvoiceData.invoiceNumber}.pdf`);
  };

  // Rest of your component JSX remains the same...
  const invoiceData = {
    company: {
      name: companyName,
      certification: "An ISO 9001- 2015 Certified company",
      address: companyAddress,
      city: "KOLKATA- 700 064",
      phone: `Phone no: ${companyPhone}`,
      email: `e-mail ID :  ${companyEmail}`,
      gstin: `${companyGST}`,
      state: `${companyState}`,
    },
    invoice: {
      reverseCharges: "",
      invoiceNo: "SE/049/2025-26",
      invoiceDate: "06.04.2025",
      billingMonth: "June 2025",
      transportationMode: "",
      ewayNo: "",
      dateOfSupply: "",
      placeOfSupply: "",
    },
    billedTo: {
      company: "SWIGGY LIMITED",
      address: "Shaila Tower, 1st Floor, Plot- J1/6, Block EP & GP, Sec-V",
      city: "Salt Lake City, Kolkata -700091",
      gstin: "19AAFCB7707D1ZR",
      poNo: "PO/FY25-26/003680",
      date: "06.04.2025",
    },
    consignee: {
      address: "",
      phone: "",
      gstin: "",
      state: "",
    },
    items: [
      {
        slNo: 1,
        description: "TEA, MILK AND COFFEE",
        hsnCode: "4011",
        qty: 100,
        unit: "Nos",
        rate: 120.0,
        amount: 12000.0,
        cgstRate: 9,
        cgstAmt: 1080.0,
        sgstRate: 9,
        sgstAmt: 1080.0,
        igstRate: 0.0,
        igstAmt: 0.0,
        totalAmount: 14160.0,
      },
      {
        slNo: 2,
        description: "SUGAR",
        hsnCode: "1701",
        qty: 50,
        unit: "Nos",
        rate: 120.0,
        amount: 6000.0,
        cgstRate: 9,
        cgstAmt: 540.0,
        sgstRate: 9,
        sgstAmt: 540.0,
        igstRate: 0.0,
        igstAmt: 0.0,
        totalAmount: 7080.0,
      },
      {
        slNo: 3,
        description: "MILK TETRA PACK",
        hsnCode: "4011",
        qty: 80,
        unit: "Nos",
        rate: 74.0,
        amount: 5920.0,
        cgstRate: 9,
        cgstAmt: 532.8,
        sgstRate: 9,
        sgstAmt: 532.8,
        igstRate: 0.0,
        igstAmt: 0.0,
        totalAmount: 6985.6,
      },
      {
        slNo: 4,
        description: "CUPS",
        hsnCode: "3904",
        qty: 6000,
        unit: "NOS",
        rate: 0.8,
        amount: 4800.0,
        cgstRate: 9,
        cgstAmt: 432.0,
        sgstRate: 9,
        sgstAmt: 432.0,
        igstRate: 0.0,
        igstAmt: 0.0,
        totalAmount: 5664.0,
      },
    ],
    totals: {
      subtotal: 28720.0,
      cgstTotal: 2584.8,
      sgstTotal: 2584.8,
      igstTotal: 0,
      taxableAmount: 28720.0,
      totalTaxAmount: 5169.6,
      grandTotal: 33889.6,
    },
    bank: {
      name: "Bank of Baroda",
      accountNo: "37250200000354",
      ifscCode: "BARB0STAGAR",
      branch: "Garia Station Road, Kolkata Branch, Kolkata- 700 084",
    },
    amountInWords: "Rupees Thirty Three Thousand Eight Hundred Ninety Only",
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      {/* Header */}
      <div className="text-center mb-6 border-2 border-black">
        <div className="bg-gray-100 p-4">
          <h1 className="text-xl font-bold mb-2">{invoiceData.company.name}</h1>
          <p className="text-sm mb-1">{invoiceData.company.certification}</p>
          <p className="text-sm mb-1">{invoiceData.company.address}</p>
          <p className="text-sm mb-2">{invoiceData.company.city}</p>
        </div>
        <div className="flex justify-between p-2 text-xs">
          <div>
            <p>GSTIN: {invoiceData.company.gstin}</p>
            <p>STATE: {invoiceData.company.state}</p>
          </div>
          <div>
            <p>{invoiceData.company.phone}</p>
            <p>{invoiceData.company.email}</p>
          </div>
        </div>
      </div>

      {/* Tax Invoice Title */}
      <div className="text-center bg-gray-200 border border-black p-2 mb-4">
        <h2 className="font-bold">Tax Invoice</h2>
      </div>

      {/* Invoice Details Section */}
      <div className="grid grid-cols-2 border border-black mb-4">
        <div className="border-r border-black p-3">
          <div className="mb-4">
            <p className="text-xs mb-1">
              Invoice No: {serviceinvoiceData.invoiceNumber}
            </p>
            <p className="text-xs mb-1">
              Invoice Date: {serviceinvoiceData.date}
            </p>
            <p className="text-xs">
              Billing Month:{" "}
              {new Date(serviceinvoiceData.date).toLocaleString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>

          <div className="mt-4">
            <p className="text-xs font-semibold mb-2">
              Details of Receiver Billed To:
            </p>
            <p className="text-xs font-bold mb-1">
              {serviceinvoiceData.receiverDetails.name}
            </p>
            <p className="text-xs mb-1">
              {serviceinvoiceData.receiverDetails.address}
            </p>

            <p className="text-xs mb-1">
              GSTIN: {serviceinvoiceData.receiverDetails.gstin}
            </p>
            <p className="text-xs mb-1">PO NO: {serviceinvoiceData.poNumber}</p>
            <p className="text-xs">DATE: {serviceinvoiceData.poDate}</p>
          </div>
        </div>

        <div className="p-3">
          <div className="mb-4">
            <p className="text-xs mb-1">
              Transportation mode: {invoiceData.invoice.transportationMode}
            </p>
            <p className="text-xs mb-1">
              E-way no: {invoiceData.invoice.ewayNo}
            </p>
            <p className="text-xs mb-1">
              Date of Supply: {invoiceData.invoice.dateOfSupply}
            </p>
            <p className="text-xs">
              Place of Supply: {invoiceData.invoice.placeOfSupply}
            </p>
          </div>

          <div className="mt-4">
            <p className="text-xs font-semibold mb-2">
              Details of Consignee Shipped To:
            </p>
            <p className="text-xs mb-1">
              Address: {serviceinvoiceData.receiverDetails.deliveryAddress}
            </p>
            <p className="text-xs mb-1">
              Phone No: {serviceinvoiceData.receiverDetails.phoneNumber}
            </p>
            <p className="text-xs mb-1">
              GSTIN: {serviceinvoiceData.receiverDetails.gstin}
            </p>
            <p className="text-xs">
              State: {serviceinvoiceData.receiverDetails.state}
            </p>
          </div>
        </div>
      </div>

      {/* Declaration */}
      <div className="border border-black p-2 mb-4">
        <p className="text-xs">
          Declaration: We declare that this invoice show the actual price of
          goods described and that all particular are true and correct.
        </p>
      </div>

      {/* Items Table */}
      <div className="border border-black mb-4">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-black p-2">Sl no</th>
              <th className="border border-black p-2">Item Description</th>
              <th className="border border-black p-2">HSN code</th>
              <th className="border border-black p-2">Qty.</th>
              <th className="border border-black p-2">Unit</th>
              <th className="border border-black p-2">Rate</th>
              <th className="border border-black p-2">Amount</th>
              <th className="border border-black p-2" colSpan="2">
                CGST
              </th>
              <th className="border border-black p-2" colSpan="2">
                SGST
              </th>
              <th className="border border-black p-2" colSpan="2">
                IGST
              </th>
              <th className="border border-black p-2">Amount</th>
            </tr>
            <tr className="bg-gray-50">
              <th className="border border-black p-1"></th>
              <th className="border border-black p-1"></th>
              <th className="border border-black p-1"></th>
              <th className="border border-black p-1"></th>
              <th className="border border-black p-1"></th>
              <th className="border border-black p-1"></th>
              <th className="border border-black p-1"></th>
              <th className="border border-black p-1">Rate</th>
              <th className="border border-black p-1">Amt.</th>
              <th className="border border-black p-1">Rate</th>
              <th className="border border-black p-1">Amt.</th>
              <th className="border border-black p-1">Rate</th>
              <th className="border border-black p-1">Amt.</th>
              <th className="border border-black p-1"></th>
            </tr>
          </thead>
          <tbody>
            {serviceinvoiceData.items.map((item, i) => (
              <tr key={i}>
                <td className="border border-black p-2 text-center">{i + 1}</td>
                <td className="border border-black p-2">{item.description}</td>
                <td className="border border-black p-2 text-center">
                  {item.hsnCode}
                </td>
                <td className="border border-black p-2 text-center">
                  {item.quantity}
                </td>
                <td className="border border-black p-2 text-center">
                  {item.uom}
                </td>
                <td className="border border-black p-2 text-right">
                  {item.sellingPrice}
                </td>
                <td className="border border-black p-2 text-right">
                  {item.grossAmount}
                </td>
                <td className="border border-black p-2 text-center">
                  {item.cgst || 0}%
                </td>
                <td className="border border-black p-2 text-right">
                  {item.grossAmount * (item.cgst / 100) || 0}
                </td>
                <td className="border border-black p-2 text-center">
                  {item.sgst || 0}%
                </td>
                <td className="border border-black p-2 text-right">
                  {item.grossAmount * (item.sgst / 100) || 0}
                </td>
                <td className="border border-black p-2 text-center">
                  {item.igst || 0}%
                </td>
                <td className="border border-black p-2 text-right">
                  {item.grossAmount * (item.igst / 100) || 0}
                </td>
                <td className="border border-black p-2 text-right">
                  {item.amount.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>

          {/* Totals */}
          <tfoot>
            <tr className="font-semibold bg-gray-100">
              <td className="border border-black p-2 text-right" colSpan={7}>
                Total
              </td>
              <td className="border border-black p-2"></td>
              <td className="border border-black p-2 text-right">
                {serviceinvoiceData.items
                  .reduce(
                    (acc, curr) =>
                      acc +
                      (parseFloat((curr.grossAmount * curr.cgst) / 100) || 0),
                    0
                  )
                  .toFixed(2)}
              </td>
              <td className="border border-black p-2"></td>
              <td className="border border-black p-2 text-right">
                {serviceinvoiceData.items
                  .reduce(
                    (acc, curr) =>
                      acc + ((curr.grossAmount * curr.sgst) / 100 || 0),
                    0
                  )
                  .toFixed(2)}
              </td>
              <td className="border border-black p-2"></td>
              <td className="border border-black p-2 text-right">
                {serviceinvoiceData.items
                  .reduce(
                    (acc, curr) =>
                      acc +
                      (parseFloat((curr.grossAmount * curr.igst) / 100) || 0),
                    0
                  )
                  .toFixed(2)}
              </td>
              <td className="border border-black p-2 text-right">
                {serviceinvoiceData.grandTotal.toFixed(2)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Footer Section */}
      <div className="grid grid-cols-2 border border-black">
        <div className="border-r border-black p-3">
          <p className="text-xs font-semibold mb-2">
          Rupees  {toWords.convert(serviceinvoiceData?.totalPayableAmount || serviceinvoiceData.grandTotal)} Only
          </p>

          <div className="mt-4">
            <p className="text-xs mb-1">Bank name: {bankDtails[0]?.bankName}</p>
            <p className="text-xs mb-1">
              A/C No: {bankDtails[0]?.accountNumber}
            </p>
            <p className="text-xs mb-1">IFSC Code: {bankDtails[0]?.ifscCode}</p>
            <p className="text-xs">Branch: {bankDtails[0]?.branch}</p>
          </div>
        </div>

        <div className="p-3">
          <div className="text-xs space-y-1 mb-4">
            <div className="flex justify-between">
              <span>Add: CGST</span>
              <span>
                {serviceinvoiceData.items
                  .reduce(
                    (acc, curr) =>
                      acc +
                      (parseFloat((curr.grossAmount * curr.cgst) / 100) || 0),
                    0
                  )
                  .toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Add: SGST</span>
              <span>
                {serviceinvoiceData.items
                  .reduce(
                    (acc, curr) =>
                      acc + ((curr.grossAmount * curr.sgst) / 100 || 0),
                    0
                  )
                  .toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Add: IGST</span>
              <span>
                {serviceinvoiceData.items
                  .reduce(
                    (acc, curr) =>
                      acc +
                      (parseFloat((curr.grossAmount * curr.igst) / 100) || 0),
                    0
                  )
                  .toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>Total Tax Amount</span>
              <span>
                {(
                  serviceinvoiceData.items.reduce(
                    (acc, curr) =>
                      acc +
                      (parseFloat(curr.grossAmount) *
                        parseFloat(curr.cgst || 0)) /
                        100,
                    0
                  ) +
                  serviceinvoiceData.items.reduce(
                    (acc, curr) =>
                      acc +
                      (parseFloat(curr.grossAmount) *
                        parseFloat(curr.sgst || 0)) /
                        100,
                    0
                  ) +
                  serviceinvoiceData.items.reduce(
                    (acc, curr) =>
                      acc +
                      (parseFloat(curr.grossAmount) *
                        parseFloat(curr.igst || 0)) /
                        100,
                    0
                  )
                ).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Transportation Charges:</span>
              <span>{serviceinvoiceData.transportationCharges || 0}</span>
            </div>

            <div className="flex justify-between font-bold ">
              <span>Grand Total :</span>
              <span>{serviceinvoiceData.grandTotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between font-bold ">
              <span>Round OFf :</span>
              <span>{serviceinvoiceData?.roundOff || 0}</span>
            </div>

            <div className="flex justify-between font-bold border-t pt-1">
              <span>Total Payable Amount :</span>
              <span>
                {serviceinvoiceData?.totalPayableAmount ||
                  serviceinvoiceData.grandTotal.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="text-right">
            <p className="text-xs mb-2">For {companyName}</p>
            <div className="h-12 flex items-end justify-end">
              <p className="text-xs">Authorised Signatory</p>
            </div>
          </div>
        </div>
      </div>

      {/* Download Button */}
      <div className="mt-6 text-center">
        <button
          onClick={downloadPDF}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
        >
          Download PDF
        </button>
      </div>
    </div>
  );
};

export default ServicePdfPage;
