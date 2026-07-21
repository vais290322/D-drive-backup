import axios from "axios";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import React, { useEffect, useRef, useState } from "react";
import QrCodeComponent from "../../../component/QRCode/QrCodeComponent";
const bankUrl = import.meta.env.VITE_BASE_URL_Local;
import { ToWords } from "to-words";

import "jspdf-autotable";

const ViewPDF = ({ invoiceData }) => {
  // console.log("charges in promofa invoice : ", invoiceData);
  const [bank, setBank] = useState("");
  const toWords = new ToWords();

  const iso = import.meta.env.VITE_REACT_ISO;
  const term = import.meta.env.VITE_REACT_TERM;

  const fetchBank = async () => {
    try {
      const response = await axios.get(`${bankUrl}/s/api/v1/bank/all`);
      if (response.data.success) {
        setBank(response.data.data[0]);
      }
    } catch (error) {
      console.error("Error fetching bank data:", error);
    }
  };

  useEffect(() => {
    fetchBank();
  }, []);

  // Invoice data destructuring
  const invoiceNumber = invoiceData.invoiceNumber;
  const date = invoiceData.date;
  const gst = "19BTFPR0457K2Z7";
  const paymenttype = invoiceData.paymentType;
  const name = invoiceData.receiverDetails.name;
  const address = invoiceData.receiverDetails.address;
  const state = invoiceData.receiverDetails.state;
  const gstNo = invoiceData.receiverDetails.gstin;
  const code = invoiceData.vendorCode || " ";
  const transportaionCharges = invoiceData.transportationCharges;
  const grandTotal = invoiceData.grandTotal;
  const totalPayableAmount =
    invoiceData?.totalPayableAmount || invoiceData?.grandTotal || 0;

  // Reference for the printable content
  const componentRef = useRef(null);

  const handleDownloadJsPdf = async () => {
  try {
    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 10;
    let yPosition = margin;

    // Function to draw header on any page
    const drawHeader = (pdf, iso, gst, margin) => {
      const pageWidth = pdf.internal.pageSize.getWidth();
      let headerY = margin;

      // Add border around the entire page
      pdf.setDrawColor(0, 0, 0);
      pdf.setLineWidth(0.5);
      pdf.rect(
        margin - 5,
        margin - 5,
        pageWidth - 2 * (margin - 5),
        pdf.internal.pageSize.getHeight() - 2 * (margin - 5)
      );

      // Header - Snigdha Proforma Invoice
      pdf.setFontSize(20);
      pdf.setFont("helvetica", "bold");
      const headerText = "Snigdha Enterprise";
      const headerWidth = pdf.getTextWidth(headerText);
      pdf.text(headerText, (pageWidth - headerWidth) / 2, headerY + 8);
      headerY += 15;

      // Company Address
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "normal");
      const addressText = "AB-79, SALT LAKE CITY, SECTOR-I, KOLKATA-700064";
      const addressWidth = pdf.getTextWidth(addressText);
      pdf.text(addressText, (pageWidth - addressWidth) / 2, headerY);
      headerY += 5;
      pdf.text(iso, (pageWidth - addressWidth) / 2, headerY);
      headerY += 8;

      // Company Details (Left and Right)
      pdf.setFontSize(9);
      pdf.setFont("helvetica", "bold");
      pdf.text(`GSTIN: ${gst}`, margin, headerY);
      pdf.text(
        "Email: snigdhaenterprise2015@gmail.com",
        pageWidth - 80,
        headerY
      );
      headerY += 4;
      pdf.text("STATE: West Bengal (19)", margin, headerY);
      pdf.text("Phone: +91 9073656557", pageWidth - 80, headerY);
      headerY += 8;

      // Add separator line after header
      pdf.setDrawColor(0, 0, 0);
      pdf.setLineWidth(0.5);
      pdf.line(margin, headerY, pageWidth - margin, headerY);
      headerY += 5;

      // Return the Y position where content should start
      return headerY;
    };

    // Override addPage to include header on new pages
    const originalAddPage = pdf.addPage;
    pdf.addPage = function () {
      originalAddPage.apply(this, arguments);
      // Draw header on new page and get starting Y position
      const startY = drawHeader(this, iso, gst, margin);
      // Store the starting Y position for content
      this._headerEndY = startY;
      return this;
    };

    // Draw header on first page and get starting position
    yPosition = drawHeader(pdf, iso, gst, margin);

    // PERFORMA INVOICE header
    pdf.setFillColor(245, 245, 245);
    pdf.rect(margin, yPosition - 2, pageWidth - 2 * margin, 8, "F");
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "bold");
    const performaText = "PERFORMA INVOICE";
    const performaWidth = pdf.getTextWidth(performaText);
    pdf.text(performaText, (pageWidth - performaWidth) / 2, yPosition + 3);
    yPosition += 12;

    // Invoice Details (Left and Right)
    pdf.setFontSize(9);
    pdf.setFont("helvetica", "bold");
    pdf.text("Invoice No:", margin, yPosition);
    pdf.setFont("helvetica", "normal");
    pdf.text(invoiceNumber, margin + 22, yPosition);

    pdf.setFont("helvetica", "bold");
    pdf.text("Payment Type:", pageWidth - 80, yPosition);
    pdf.setFont("helvetica", "normal");
    pdf.text(paymenttype, pageWidth - 50, yPosition);
    yPosition += 5;

    pdf.setFont("helvetica", "bold");
    pdf.text("Invoice Date:", margin, yPosition);
    pdf.setFont("helvetica", "normal");
    pdf.text(date, margin + 25, yPosition);

    pdf.setFont("helvetica", "bold");
    pdf.text("PO Date:", pageWidth - 80, yPosition);
    pdf.setFont("helvetica", "normal");
    pdf.text(
    invoiceData?.poDate ?  new Date(invoiceData?.poDate).toLocaleDateString("en-GB") :  "",
      pageWidth - 50,
      yPosition
    );
    yPosition += 5;

    pdf.setFont("helvetica", "bold");
    pdf.text("PO Number:", pageWidth - 80, yPosition);
    pdf.setFont("helvetica", "normal");
    pdf.text(invoiceData?.poNumber || "", pageWidth - 50, yPosition);
    yPosition += 8;

    // Horizontal line
    pdf.setLineWidth(0.5);
    pdf.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 8;

    // Shipping Details
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "bold");
    pdf.text("Shipping Details", margin, yPosition);
    yPosition += 8;

    pdf.setFontSize(9);
    pdf.text("Name:", margin, yPosition);
    pdf.setFont("helvetica", "normal");
    pdf.text(name, margin + 15, yPosition);
    yPosition += 4;

    pdf.setFont("helvetica", "bold");
    pdf.text("Address:", margin, yPosition);
    pdf.setFont("helvetica", "normal");
    const addressLines = pdf.splitTextToSize(address, 80);
    pdf.text(addressLines, margin + 18, yPosition);
    yPosition += addressLines.length * 4;

    pdf.setFont("helvetica", "bold");
    pdf.text("State:", margin, yPosition);
    pdf.setFont("helvetica", "normal");
    pdf.text(state, margin + 15, yPosition);
    yPosition += 4;

    pdf.setFont("helvetica", "bold");
    pdf.text("GSTIN:", margin, yPosition);
    pdf.setFont("helvetica", "normal");
    pdf.text(gstNo, margin + 18, yPosition);
    yPosition += 4;

    pdf.setFont("helvetica", "bold");
    pdf.text("Code:", margin, yPosition);
    pdf.setFont("helvetica", "normal");
    pdf.text(code, margin + 15, yPosition);
    yPosition += 10;

    // Main Items Table
    const mainTableHeaders = [
      "Item Name",
      "HSN/SAC",
      "Qty",
      "Unit",
      "Basic Rate",
      "Gross Amount",
      "Dis. Amount",
      "Tax Per",
      "Tax Amount",
      "Amount",
    ];

    const mainTableData = invoiceData.items.map((item) => [
      item.itemName || "",
      item.hsnCode || "",
      item.quantity || "",
      item.uom || "",
      item.sellingPrice || "",
      item.grossAmount || "",
      item.discountAmount || "",
      item.taxRate || "",
      item.taxAmount || "",
      item.amount || "",
    ]);

    pdf.autoTable({
      head: [mainTableHeaders],
      body: mainTableData,
      startY: yPosition,
      margin: { left: margin, right: margin },
      styles: { fontSize: 7, cellPadding: 1.5 },
      headStyles: { fillColor: [200, 200, 200], fontStyle: "bold" },
      didDrawPage: function (data) {
        // Only draw header on pages after the first one
        if (data.pageNumber > 1) {
          const headerEndY = drawHeader(pdf, iso, gst, margin);
          // Adjust the table's startY for subsequent pages
          if (data.pageNumber > 1) {
            data.settings.startY = headerEndY + 5;
          }
        }

        // Add Page Number
        const pageCount = pdf.internal.getNumberOfPages();
        pdf.setFontSize(8);
        pdf.text(
          `Page ${pageCount}`,
          pageWidth - 30,
          pdf.internal.pageSize.getHeight() - 10
        );
      },
    });

    yPosition = pdf.lastAutoTable.finalY + 8;

    // Check if we need a new page for HSN table
    if (yPosition > pageHeight - 40) {
      pdf.addPage();
      yPosition = pdf._headerEndY + 5;
    }

    // HSN Details Table
    const hsnTableHeaders = [
      "HSN CODE",
      "TABLE AMT",
      "CGST%",
      "CGST AMT",
      "SGST%",
      "SGST AMT",
      "IGST%",
      "IGST AMT",
    ];

    const hsnTableData = invoiceData.items.map((item) => [
      item.hsnCode || "",
      item.grossAmount || "",
      item.cgst || "",
      ((item.cgst * item.grossAmount) / 100).toFixed(2) || "",
      item.sgst || "",
      ((item.sgst * item.grossAmount) / 100).toFixed(2) || "",
      item.igst || "",
      ((item.igst * item.grossAmount) / 100).toFixed(2) || "",
    ]);

    pdf.autoTable({
      head: [hsnTableHeaders],
      body: hsnTableData,
      startY: yPosition,
      margin: {top:60, left: margin, right: margin - 70 },
      styles: {
        fontSize: 7,
        cellPadding: 1.5,
        textColor: [0, 0, 0],
        fillColor: [255, 255, 255],
      },
      headStyles: {
        fillColor: [200, 200, 200],
        textColor: [0, 0, 0],
        fontStyle: "bold",
        halign: "center",
      },
      bodyStyles: {
        halign: "center",
      },
      tableWidth: "wrap",
      didDrawPage: function (data) {
        // Only draw header on pages after the first one
        if (data.pageNumber > 1) {
          const headerEndY = drawHeader(pdf, iso, gst, margin);
          data.settings.startY = headerEndY + 5;
        }

        // Add Page Number
        const pageCount = pdf.internal.getNumberOfPages();
        pdf.setFontSize(8);
        pdf.text(
          `Page ${pageCount}`,
          pageWidth - 30,
          pdf.internal.pageSize.getHeight() - 10
        );
      },
    });

    yPosition = pdf.lastAutoTable.finalY + 8;

    // Check if we need a new page for remaining content
    if (yPosition > pageHeight - 100) {
      pdf.addPage();
      yPosition = pdf._headerEndY + 5;
    }

    // Amount in words
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "bold");
    const amountInWords =
      toWords.convert(totalPayableAmount || grandTotal) + " Rupees Only";
    const wordsLines = pdf.splitTextToSize(amountInWords, 100);
    pdf.text(wordsLines, margin, yPosition);
    yPosition += wordsLines.length * 5 + 5;

    // Bank Details
    pdf.setFontSize(9);
    pdf.text("Bank Name:", margin, yPosition);
    pdf.setFont("helvetica", "normal");
    pdf.text(bank?.bankName || "", margin + 22, yPosition);
    yPosition += 4;

    pdf.setFont("helvetica", "bold");
    pdf.text("Acc No:", margin, yPosition);
    pdf.setFont("helvetica", "normal");
    pdf.text(bank?.accountNumber || "", margin + 18, yPosition);
    yPosition += 4;

    pdf.setFont("helvetica", "bold");
    pdf.text("IFS Code:", margin, yPosition);
    pdf.setFont("helvetica", "normal");
    pdf.text(bank?.ifscCode || "", margin + 20, yPosition);
    yPosition += 4;

    pdf.setFont("helvetica", "bold");
    pdf.text("Branch:", margin, yPosition);
    pdf.setFont("helvetica", "normal");
    pdf.text(bank?.branch || "", margin + 18, yPosition);
    yPosition += 8;

    // Terms & Conditions
    pdf.setFont("helvetica", "bold");
    pdf.text("Terms & Conditions:", margin, yPosition);
    pdf.setFont("helvetica", "normal");

    // Split terms by periods and filter out empty strings
    const terms = term || "";
    const termsSentences = terms
      .split(".")
      .filter((sentence) => sentence.trim());

    // Calculate maximum width to prevent overlap with right side content
    const maxWidth = pageWidth / 2 - 20;

    // Add each condition on a new line with numbering
    termsSentences.forEach((sentence, index) => {
      const formattedSentence = sentence.trim();
      if (formattedSentence) {
        // Split long sentences into multiple lines if needed
        const wrappedText = pdf.splitTextToSize(
          `${index + 1}. ${formattedSentence}.`,
          maxWidth
        );

        wrappedText.forEach((line, lineIndex) => {
          pdf.text(
            line,
            margin + 2,
            yPosition + 5 + index * 8 + lineIndex * 4
          );
        });
      }
    });

    // Update yPosition to account for terms content
    yPosition += 5 + termsSentences.length * 4;

    // Summary section (Right side)
    const rightSummaryX = pageWidth - 70;
    let rightSummaryY = yPosition - 40;

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(9);

    const totalAmount =
      invoiceData.items?.reduce((acc, cur) => acc + cur.grossAmount, 0) || 0;
    pdf.text("Total Amount", rightSummaryX, rightSummaryY);
    pdf.text(`${totalAmount.toFixed(2)}/-`, rightSummaryX + 35, rightSummaryY);
    rightSummaryY += 5;

    if (invoiceData?.discount > 0) {
      pdf.text("Discount Amount", rightSummaryX, rightSummaryY);
      pdf.text(
        `${invoiceData.discount}/-`,
        rightSummaryX + 35,
        rightSummaryY
      );
      rightSummaryY += 5;
    }

    if (invoiceData?.transportationCharges > 0) {
      pdf.text("Transportation Charges", rightSummaryX, rightSummaryY);
      pdf.text(
        `${invoiceData.transportationCharges}/-`,
        rightSummaryX + 38,
        rightSummaryY
      );
      rightSummaryY += 5;
    }

    const taxableAmount =
      invoiceData.items?.reduce((acc, cur) => acc + cur.taxAmount, 0) || 0;
    pdf.text("Taxable Amount", rightSummaryX, rightSummaryY);
    pdf.text(`${taxableAmount}/-`, rightSummaryX + 35, rightSummaryY);
    rightSummaryY += 5;

    if (invoiceData?.taxGroup === "State Tax") {
      const cgstTotal =
        invoiceData.items?.reduce(
          (acc, cur) => acc + (cur.cgst * cur.grossAmount) / 100,
          0
        ) || 0;
      const sgstTotal =
        invoiceData.items?.reduce(
          (acc, cur) => acc + (cur.sgst * cur.grossAmount) / 100,
          0
        ) || 0;

      pdf.text("CGST", rightSummaryX, rightSummaryY);
      pdf.text(
        `${cgstTotal.toFixed(2)}/-`,
        rightSummaryX + 35,
        rightSummaryY
      );
      rightSummaryY += 5;

      pdf.text("SGST", rightSummaryX, rightSummaryY);
      pdf.text(
        `${sgstTotal.toFixed(2)}/-`,
        rightSummaryX + 35,
        rightSummaryY
      );
      rightSummaryY += 5;
    } else {
      const igstTotal =
        invoiceData.items?.reduce(
          (acc, cur) => acc + (cur.igst * cur.grossAmount) / 100,
          0
        ) || 0;
      pdf.text("IGST", rightSummaryX, rightSummaryY);
      pdf.text(
        `${igstTotal.toFixed(2)}/-`,
        rightSummaryX + 35,
        rightSummaryY
      );
      rightSummaryY += 5;
    }

    pdf.text("Grand Total:", rightSummaryX, rightSummaryY);
    pdf.text(`${grandTotal.toFixed(2)}/-`, rightSummaryX + 35, rightSummaryY);
    rightSummaryY += 5;

    pdf.text("Round Off:", rightSummaryX, rightSummaryY);
    pdf.text(
      `${invoiceData?.roundOff || 0}/-`,
      rightSummaryX + 35,
      rightSummaryY
    );
    rightSummaryY += 3;

    // Line before final total
    pdf.setDrawColor(0, 0, 0);
    pdf.setLineWidth(0.5);
    pdf.line(rightSummaryX, rightSummaryY, rightSummaryX + 50, rightSummaryY);
    rightSummaryY += 5;

    pdf.setFontSize(10);
    pdf.setFont("helvetica", "bold");
    pdf.text("Total Payable Amount:", rightSummaryX, rightSummaryY);
    pdf.text(
      `${totalPayableAmount.toFixed(2) || grandTotal.toFixed(2)}/-`,
      rightSummaryX + 40,
      rightSummaryY
    );

    // Signature section
    yPosition = Math.max(yPosition + 20, rightSummaryY + 15);

    // Check if we need a new page for signature section
    if (yPosition > pageHeight - 50) {
      pdf.addPage();
      yPosition = pdf._headerEndY + 10;
    }

    pdf.setDrawColor(0, 0, 0);
    pdf.setLineWidth(0.5);
    pdf.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 8;

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(10);
    pdf.text("Received the Material in Good Condition", margin, yPosition);
    pdf.text("Authorized Signature", pageWidth - 50, yPosition);
    yPosition += 15;

    pdf.setLineWidth(0.5);
    pdf.line(margin, yPosition, margin + 60, yPosition);
    yPosition += 5;

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(9);
    pdf.text("Receiver's Signature & Seal", margin, yPosition);
    pdf.text("(Procurement Manager)", pageWidth - 50, yPosition);
    yPosition += 10;

    // Final line and footer
    pdf.setDrawColor(0, 0, 0);
    pdf.setLineWidth(0.5);
    pdf.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 8;

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);
    const footerText1 = "This is Computer Generated No Need To Signature";
    const footerText2 = "Thank You!";
    const footer1Width = pdf.getTextWidth(footerText1);
    const footer2Width = pdf.getTextWidth(footerText2);

    pdf.text(footerText1, (pageWidth - footer1Width) / 2, yPosition);
    pdf.text(footerText2, (pageWidth - footer2Width) / 2, yPosition + 5);

    // Save the PDF
    pdf.save(
      `proforma-invoice-${invoiceData?.invoiceNumber || "download"}.pdf`
    );
  } catch (error) {
    console.error("PDF Generation Error:", error);
  }
};

  return (
    <div>
      <style>
        {`
          @media print {
            .no-print {
              display: none !important;
            }
            .print-container {
              width: 210mm;
              min-height: 297mm;
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            .print-content {
              margin: 0;
              padding: 0;
              min-height: 297mm;
            }
            .MuiDialogContent-root {
              padding: 0 !important;
            }
            /* Add these styles */
            html, body {
              height: 100%;
              margin: 0;
              padding: 0;
            }
          }
        `}
      </style>
      {/* Invoice Content */}
      <div
        className="w-[210mm] h-[297mm] mx-auto bg-white print:w-full print:h-full"
        ref={componentRef}
        style={{ boxSizing: "border-box" }}
      >
        <div className="">
          <div className="p-5">
            {/* Header Section */}
            <div className="px-2 flex flex-col gap-1">
              <div className="flex flex-col items-center justify-center">
                <h1 className="text-[40px] font-bold text-[#232B77]">
                  Snigdha Enterprise
                </h1>
                <p className="h-[3px] w-[500px] bg-[#232B77] my-4"></p>
                <p className="text-[16px] text-[#232B77] font-semibold">
                  AB-79, SALT LAKE CITY, SECTOR-I, KOLKATA-700064,
                </p>
                <div className="w-full flex justify-between text-sm mt-1">
                  <div>
                    <p className="text-[#232B77] font-semibold text-sm">
                      GSTIN: <span className="text-[#027bd1]">{gst}</span>
                    </p>
                    <p className="text-[#232B77] font-semibold text-sm">
                      STATE:{" "}
                      <span className="text-[#027bd1]">West Bengal (19)</span>
                    </p>
                  </div>
                  <div className="text-left">
                    <p className="text-[#232B77] font-semibold text-sm">
                      Email:{" "}
                      <span className="text-[#027bd1]">
                        snigdhaenterprise2015@gmail.com
                      </span>
                    </p>
                    <p className="text-blue-800 font-semibold text-sm">
                      Phone:{" "}
                      <span className="text-[#027bd1]"> +91 9073656557</span>
                    </p>
                  </div>
                </div>
              </div>
              {/* Invoice Details Section */}
              <div className="bg-blue-50 mt-1 flex justify-center items-center">
                <h2 className=" font-bold text-xl text-[#1F3180]">
                  PERFORMA INVOICE
                </h2>
              </div>
              <div className="flex justify-between mb-4">
                <div>
                  <p className="text-[#232B77] font-semibold text-sm">
                    Invoice No:{" "}
                    <span className="text-[#027bd1]">{invoiceNumber}</span>
                  </p>
                  <p className="text-[#232B77] font-semibold text-sm">
                    Invoice Date: <span className="text-[#027bd1]">{date}</span>
                  </p>
                </div>
                <div className="pr-10">
                  {/* <p className="text-[#232B77] font-semibold text-sm">
                    Purchase Order No:{" "}
                    <span className="text-[#027bd1]">{code}</span>
                  </p>
                  <p className="text-[#232B77] font-semibold text-sm">
                    Purchase Order Date:{" "}
                    <span className="text-[#027bd1]">{code}</span>
                  </p> */}
                  <p className="text-[#232B77] font-semibold text-sm">
                    Payment Type:{" "}
                    <span className="text-[#027bd1]">{paymenttype}</span>
                  </p>
                  <p className="text-[#232B77] font-semibold text-sm">
                    PO Date:{" "}
                    <span className="text-[#027bd1]">
                      {new Date(invoiceData?.poDate).toLocaleDateString() || ""}
                    </span>
                  </p>
                  <p className="text-[#232B77] font-semibold text-sm">
                    PO Number:{" "}
                    <span className="text-[#027bd1]">
                      {invoiceData?.poNumber}
                    </span>
                  </p>
                </div>
              </div>
              <div className="h-[2px] w-full bg-[#232B77]"></div>
              {/* Shipping Details */}
              <div className="flex justify-between my-2">
                <div>
                  <h3 className="font-bold text-xl text-[#232B77] mb-2">
                    Shipping Details
                  </h3>
                  <p className="text-[#232B77] font-semibold text-sm">
                    Name: <span className="text-[#027bd1]">{name}</span>
                  </p>
                  <p className="text-[#232B77] font-semibold text-sm">
                    Address: <span className="text-[#027bd1]">{address}</span>
                  </p>
                  <p className="text-[#232B77] font-semibold text-sm">
                    State: <span className="text-[#027bd1]">{state}</span>
                  </p>
                  <p className="text-[#232B77] font-semibold text-sm">
                    GSTIN: <span className="text-[#027bd1]">{gstNo}</span>
                  </p>
                  <p className="text-[#232B77] font-semibold text-sm">
                    Code: <span className="text-[#027bd1]">{code}</span>
                  </p>
                </div>
                {/* <div>
                  <h3 className="font-bold text-xl text-[#232B77] mb-2">
                    Shipping Details (Ship to)
                  </h3>
                  <p className="text-[#232B77] font-semibold text-sm">
                    Name:{" "}
                    <span className="text-[#027bd1]">Snigdha Warehouse</span>
                  </p>
                  <p className="text-[#232B77] font-semibold text-sm">
                    Address:{" "}
                    <span className="text-[#027bd1]">
                      179 AJC BOSE ROAD KOLKATA-700014
                    </span>
                  </p>
                  <p className="text-[#232B77] font-semibold text-sm">
                    State: <span className="text-[#027bd1]">West Bengal</span>
                  </p>
                  <p className="text-[#232B77] font-semibold text-sm">
                    GSTIN:{" "}
                    <span className="text-[#027bd1]">19AAQCM5971R1Z5</span>
                  </p>
                  <p className="text-[#232B77] font-semibold text-sm">
                    Code: <span className="text-[#027bd1]">19</span>
                  </p>
                </div> */}
              </div>
            </div>
            {/* Products Table */}
            <div className="bg-blue-50 p-4 rounded-2xl">
              <table className="w-full border-collapse border border-gray-300">
                <thead className="bg-[#027bd1] text-white text-sm">
                  <tr>
                    <th className="border-b border-gray-300 p-2">Item Name</th>
                    <th className="border-b border-gray-300 p-2">HSN/SAC</th>
                    <th className="border-b border-gray-300 p-2">Qty</th>
                    <th className="border-b border-gray-300 p-2">Unit</th>
                    <th className="border-b border-gray-300 p-2">Basic Rate</th>
                    <th className="border-b border-gray-300 p-2">
                      Gross Amount
                    </th>
                    <th className="border-b border-gray-300 p-2">
                      Dis. Amount
                    </th>
                    <th className="border-b border-gray-300 p-2">Tax Per</th>
                    <th className="border-b border-gray-300 p-2">Tax Amount</th>
                    <th className="border-b border-gray-300 p-2">Amount</th>
                  </tr>
                </thead>
                <tbody className="text-[#027bd1] text-center font-semibold text-sm">
                  {invoiceData.items.map((item, index) => {
                    return (
                      <>
                        <tr key={index}>
                          <td className="border-b border-gray-300 p-2">
                            {item.itemName}
                          </td>
                          <td className="border-b border-gray-300 p-2">
                            {item.hsnCode}
                          </td>
                          <td className="border-b border-gray-300 p-2">
                            {item.quantity}
                          </td>
                          <td className="border-b border-gray-300 p-2">
                            {item.uom}
                          </td>
                          <td className="border-b border-gray-300 p-2">
                            {item?.sellingPrice}
                          </td>
                          <td className="border-b border-gray-300 p-2">
                            {item.grossAmount}
                          </td>
                          <td className="border-b border-gray-300 p-2">
                            {item.discountAmount}
                          </td>
                          <td className="border-b border-gray-300 p-2">
                            {item.taxRate}
                          </td>
                          <td className="border-b border-gray-300 p-2">
                            {item.taxAmount}
                          </td>
                          <td className="border-b border-gray-300 p-2">
                            {item.amount}
                          </td>
                        </tr>
                      </>
                    );
                  })}
                </tbody>
              </table>
              {/* Footer Section */}
              <div className="flex gap-2 mb-2">
                <div className="flex flex-col">
                  <div className="flex mt-2">
                    <table className="border-collapse border text-[10px] border-gray-300 mb-4">
                      <thead className="bg-[#027bd1] text-white py-10">
                        <tr>
                          <th className="border-b border-gray-300 p-2">
                            HSN CODE
                          </th>
                          <th className="border-b border-gray-300 p-2">
                            TABLE AMT
                          </th>
                          <th className="border-b border-gray-300 p-2">
                            CGST%
                          </th>
                          <th className="border-b border-gray-300 p-2">
                            CGST AMT
                          </th>
                          <th className="border-b border-gray-300 p-2">
                            SGST%
                          </th>
                          <th className="border-b border-gray-300 p-2">
                            SGST AMT
                          </th>
                          <th className="border-b border-gray-300 p-2">
                            IGST%
                          </th>
                          <th className="border-b border-gray-300 p-2">
                            IGST AMT
                          </th>
                        </tr>
                      </thead>
                      <tbody className="text-[#027bd1] text-center font-semibold">
                        {invoiceData.items.map((item, index) => (
                          <tr key={index}>
                            <td className="border-b border-gray-300 p-2">
                              {item.hsnCode}
                            </td>
                            <td className="border-b border-gray-300 p-2">
                              {item.grossAmount}
                            </td>
                            <td className="border-b border-gray-300 p-2">
                              {item.cgst}
                            </td>
                            <td className="border-b border-gray-300 p-2">
                              {(item.cgst * item.grossAmount) / 100}
                            </td>
                            <td className="border-b border-gray-300 p-2">
                              {item.sgst}
                            </td>
                            <td className="border-b border-gray-300 p-2">
                              {(item.sgst * item.grossAmount) / 100}
                            </td>
                            <td className="border-b border-gray-300 p-2">
                              {item.igst}
                            </td>
                            <td className="border-b border-gray-300 p-2">
                              {(item.igst * item.grossAmount) / 100}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="text-blue-900 font-semibold text-[17px] mb-2">
                    {toWords.convert(totalPayableAmount || grandTotal)} Rupees
                    Only
                  </p>
                  <p className="text-blue-900 font-semibold text-sm">
                    Bank Name :{" "}
                    <span className="text-[#027bd1]">{bank?.bankName}</span>
                  </p>
                  <p className="text-blue-900 font-semibold text-sm">
                    Acc No : {""}{" "}
                    <span className="text-[#027bd1]">
                      {bank?.accountNumber}
                    </span>
                  </p>
                  <p className="text-blue-900 font-semibold text-sm">
                    IFS Code :{" "}
                    <span className="text-[#027bd1]">{bank?.ifscCode}</span>
                  </p>
                  <p className="text-blue-900 font-semibold text-sm">
                    Branch :{" "}
                    <span className="text-[#027bd1]">{bank?.branch}</span>
                  </p>
                </div>
                <div>
                  <div className="flex gap-20 text-[#232B77] font-semibold text-sm justify-between">
                    <p className="pr-[13px]">Total Amount</p>
                    <p>
                      {invoiceData.items?.reduce(
                        (acc, cur) => acc + cur.grossAmount,
                        0
                      ).toFixed(2)}
                      /-
                    </p>
                  </div>
                  {invoiceData?.discount > 0 && (
                    <div className="flex gap-20 justify-between text-[#232B77] font-semibold text-sm">
                      <p>Discount Amount</p>
                      <p>{invoiceData.discount}/-</p>
                    </div>
                  )}

                  {invoiceData?.transportationCharges > 0 && (
                    <div className="flex gap-20 justify-between text-[#232B77] font-semibold text-sm">
                      <p>Transportation Charges</p>
                      <p>{invoiceData?.transportationCharges || 0}/-</p>
                    </div>
                  )}

                  <div className="flex gap-20 justify-between text-[#232B77] font-semibold text-sm">
                    <p>Taxable Amount</p>
                    <p>
                      {invoiceData.items?.reduce(
                        (acc, cur) => acc + cur.taxAmount,
                        0
                      )}
                      /-
                    </p>
                  </div>
                  {invoiceData?.taxGroup === "State Tax" ? (
                    <>
                      <div className="flex gap-20 justify-between text-[#232B77] font-semibold text-sm">
                        <p>CGST</p>
                        <p>
                          {invoiceData.items?.reduce(
                            (acc, cur) =>
                              acc + (cur.cgst * cur.grossAmount) / 100,
                            0
                          )}
                          /-
                        </p>
                      </div>
                      <div className="flex gap-20 justify-between text-[#232B77] font-semibold text-sm">
                        <p>SGST</p>
                        <p>
                          {invoiceData.items?.reduce(
                            (acc, cur) =>
                              acc + (cur.sgst * cur.grossAmount) / 100,
                            0
                          )}
                          /-
                        </p>
                      </div>
                    </>
                  ) : (
                    <div className="flex gap-20 justify-between text-[#232B77] font-semibold text-sm">
                      <p>IGST</p>
                      <p>
                        {invoiceData.items?.reduce(
                          (acc, cur) =>
                            acc + (cur.igst * cur.grossAmount) / 100,
                          0
                        )}
                        /-
                      </p>
                    </div>
                  )}

                  <div className="flex gap-20 justify-between text-[#232B77] font-bold text-[16px] ">
                    <p>Grand Total :</p>
                    <p>{grandTotal}/-</p>
                  </div>
                  <div className="flex gap-20 justify-between text-[#232B77] font-bold text-[16px] ">
                    <p>Round Off : </p>
                    <p>{invoiceData?.roundOff}/-</p>
                  </div>
                  <div className="flex gap-20 justify-between text-[#232B77] font-bold text-[16px] border-t border-black pt-2">
                    <p>Total Payable Amount :</p>
                    <p>{totalPayableAmount || grandTotal}/-</p>
                  </div>
                </div>
              </div>
              <div className="h-[2px] w-full bg-blue-900 my-2"></div>
              {/* Signature Section */}
              <div className="flex justify-between">
                <div>
                  <p className="text-[#232B77] font-semibold text-[16px] mb-16">
                    Received the Material in Good Condition
                  </p>
                  <p className="h-[1px] w-[62%] bg-blue-900"></p>
                  <p className="text-[#232B77] font-semibold text-sm">
                    Receiver's Signature & Seal
                  </p>
                </div>

                <div className="w-1/2 mb-10">
                  <div className="flex justify-between mb-2">
                    <QrCodeComponent data={invoiceData} />
                  </div>
                </div>

                <div className="text-right">
                  {/* <p className="text-[#232B77] font-semibold text-[16px] mb-16">
                    For Snigtha Enterprise
                  </p> */}
                  <p className="text-[#232B77] font-semibold text-sm mt-8">
                    Authorized Signature
                  </p>
                  <p className="text-[#232B77] font-semibold text-sm">
                    (Procurement Manager)
                  </p>
                </div>
              </div>
              <div className="h-[2px] w-full bg-blue-900 my-2"></div>
              <div className="text-center text-[16px] text-[#232B77]">
                <p>This is Computer Generated No Need To Signature</p>
                <p>Thank You!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* PDF Print/Download Button */}
      <div className="text-center mt-18">
        <button
          onClick={handleDownloadJsPdf}
          className="bg-blue-500 cursor-pointer hover:bg-blue-600 transition-colors text-white px-6 py-2 rounded-lg shadow-md font-medium"
        >
          Download PDF
        </button>
      </div>
    </div>
  );
};

export default ViewPDF;
