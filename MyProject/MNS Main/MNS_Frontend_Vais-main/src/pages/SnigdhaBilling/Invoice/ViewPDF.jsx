import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import QrCodeComponent from "../../../component/QRCode/QrCodeComponent";
import { ToWords } from "to-words";
import * as XLSX from "xlsx";
import ExcelJS from "exceljs";

const bankUrl = import.meta.env.VITE_BASE_URL_Local;

const ViewPDF = ({ invoiceData }) => {
  // console.log("invoiceData", invoiceData);
  const toWords = new ToWords();

  const [bankdetails, setBankdetails] = useState({});

  const fetchBankData = async () => {
    try {
      const response = await axios.get(`${bankUrl}/s/api/v1/bank/all`);
      if (response) {
        setBankdetails(response?.data?.data[0]);
        // const bank = response?.data?.data[0]
      }
    } catch (error) {
      console.error("Error fetching bank details:", error);
    }
  };

  useEffect(() => {
    fetchBankData();
  }, []);

  // Invoice data destructuring
  const invoiceNumber = invoiceData?.invoiceNumber;
  const date = invoiceData?.date;
  const gst = "GSTN-19BTFPR0457K2Z7";
  const paymenttype = invoiceData?.paymentType;
  const name = invoiceData?.receiverDetails?.name;
  const address = invoiceData?.receiverDetails?.address;
  const state = invoiceData?.receiverDetails?.state;
  const gstNo = invoiceData?.receiverDetails?.gstin;
  const code = invoiceData?.vendorCode || " ";
  const transportationCharges =
    Number(invoiceData?.transportationCharges).toFixed(2) || "0";
  const grandTotal = Number(invoiceData?.grandTotal).toFixed(2) || 0;
  const grossAmount = invoiceData.items.reduce(
    (sum, item) => sum + parseFloat(Number(item.grossAmount) || 0),
    0
  );
  const taxableAmount = Number(invoiceData?.taxableAmount).toFixed(2) || 0.0;
  const taxAmount = Number(invoiceData?.taxAmount).toFixed(2) || 0.0;
  const roundOff = Number(invoiceData?.roundOff).toFixed(2) || 0.0;
  const totalPayableAmount =
    Number(invoiceData?.totalPayableAmount).toFixed(2) || 0.0;

  const iso = import.meta.env.VITE_REACT_ISO;
  const term = import.meta.env.VITE_REACT_TERM;

  // Reference for the printable content
  const componentRef = useRef(null);

  const handleDownloadPdf1 = async () => {
    try {
      if (!componentRef.current) {
        console.error("Component reference is null.");
        return;
      }
      // Wait for QR code to render completely
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Create a more structured PDF with border
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      // Add border to the entire page
      pdf.setDrawColor(0, 0, 0); // Black border
      pdf.setLineWidth(0.5);
      pdf.rect(6, 10, 198, 277);

      const termsText =
        term ||
        "Our payment terms are net 15 days. A late fee of 1.5% per month will be applied to overdue balances.";

      // Split terms by period and filter out empty strings
      const termsSentences = termsText
        .split(".")
        .filter((sentence) => sentence.trim());

      // Maximum width for terms text in mm
      const maxWidth = 100;

      // Add event handler for new pages
      const originalAddPage = pdf.addPage;
      pdf.addPage = function () {
        originalAddPage.apply(this, arguments);
        // Draw border on each new page
        this.setDrawColor(0, 0, 0);
        this.setLineWidth(0.5);
        this.rect(6, 10, 198, 277);
        return this;
      };

      // Add header - REDUCED SPACING
      pdf.setFontSize(16); // Reduced from 18
      pdf.setTextColor(0, 0, 0);
      pdf.setFont("helvetica", "bold");
      pdf.text("SNIGDHA ENTERPRISE", 105, 18, { align: "center" }); // Y reduced from 20

      // Add underline
      pdf.setDrawColor(0, 0, 0);
      pdf.setLineWidth(0.5);
      pdf.line(55, 20, 155, 20); // Y reduced from 22

      // Add address - REDUCED SPACING
      pdf.setFontSize(9); // Reduced from 10
      pdf.setTextColor(0, 0, 0);
      pdf.text("AB-79, SALT LAKE CITY, SECTOR-I, KOLKATA - 700064", 105, 25, {
        // Y reduced from 28
        align: "center",
      });
      pdf.text(iso, 105, 30, {
        // Y reduced from 28
        align: "center",
      });

      // Add company details - REDUCED SPACING
      pdf.setFontSize(8);
      pdf.setTextColor(0, 0, 0);
      pdf.setFont("helvetica", "bold");
      pdf.text("GSTIN:", 20, 34); // Y reduced from 35
      pdf.text("STATE:", 20, 39); // Y reduced from 40

      pdf.text("Email:", 120, 34); // Y reduced from 35
      pdf.text("Phone:", 120, 39); // Y reduced from 40

      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(50, 50, 50);
      pdf.text(gst, 35, 34); // Y reduced from 35
      pdf.text("West Bengal (19)", 35, 39); // Y reduced from 40

      pdf.text("snigdhaenterprise2015@gmail.com", 135, 34); // Y reduced from 35
      pdf.text("9073656557", 135, 39); // Y reduced from 40

      // Add TAX INVOICE header - REDUCED SPACING
      pdf.setFillColor(240, 240, 240);
      pdf.rect(10, 42, 190, 7, "F"); // Y reduced from 45, height reduced from 8 to 7
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(13); // Reduced from 14
      pdf.text("TAX INVOICE", 105, 47, { align: "center" }); // Y reduced from 51

      // Add invoice details - REDUCED SPACING
      pdf.setFontSize(9);
      pdf.setTextColor(0, 0, 0);
      pdf.setFont("helvetica", "bold");
      pdf.text("Invoice No:", 15, 57); // Y reduced from 61
      pdf.text("Invoice Date:", 15, 63); // Y reduced from 67
      pdf.text("Payment Type:", 15, 69); // Y reduced from 73
      pdf.text("GSTIN:", 15, 75); // Y reduced from 79

      // Add invoice details - values
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(50, 50, 50);
      pdf.text(invoiceNumber || "N/A", 40, 57); // Y reduced from 61
      pdf.text(new Date(date).toLocaleDateString("en-GB") || "N/A", 40, 63); // Y reduced from 67
      pdf.text(paymenttype || "N/A", 40, 69); // Y reduced from 73
      pdf.text(gst || "N/A", 40, 75); // Y reduced from 79

      // Add horizontal line
      pdf.setDrawColor(0, 0, 0);
      pdf.setLineWidth(0.5);
      pdf.line(10, 79, 200, 79); // Y reduced from 83

      // Continue with the rest of the PDF generation with black and white colors
      // Add shipping details headers - REDUCED SPACING
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(10); // Reduced from 11
      pdf.text("Shipping Details (Bill to)", 15, 86); // Y reduced from 91
      pdf.text("Shipping Details (Ship to)", 120, 86); // Y reduced from 91

      // Add shipping details - REDUCED SPACING
      pdf.setFontSize(8); // Reduced from 9
      pdf.text("Name:", 15, 93); // Y reduced from 99
      pdf.text("Address:", 15, 99); // Y reduced from 105
      pdf.text("State:", 15, 109); // Y reduced from 115
      pdf.text("GSTIN:", 15, 115); // Y reduced from 121
      pdf.text("Code:", 15, 121); // Y reduced from 127

      // Add shipping details - values with word wrapping for addresses
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(50, 50, 50);
      pdf.text(name || "N/A", 35, 93); // Y reduced from 99

      // Handle address wrapping for Bill to
      const billToAddress = address || "N/A";
      const billToAddressLines = pdf.splitTextToSize(billToAddress, 70);
      pdf.text(billToAddressLines, 35, 99); // Y reduced from 105

      pdf.text(state || "N/A", 35, 109); // Y reduced from 115
      pdf.text(gstNo || "N/A", 35, 115); // Y reduced from 121
      pdf.text(code || "N/A", 35, 121); // Y reduced from 127

      // Add shipping details - right side - REDUCED SPACING
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(0, 0, 0);
      pdf.text("Name:", 120, 93); // Y reduced from 99
      pdf.text("Address:", 120, 99); // Y reduced from 105
      pdf.text("GSTIN:", 120, 109); // Y reduced from 115
      pdf.text("PO Number :", 120, 115); // Y reduced from 122
      pdf.text("PO Date :", 120, 121); // Y reduced from 127

      // Add shipping details - values with word wrapping
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(50, 50, 50);
      pdf.text(invoiceData?.receiverDetails?.name || "N/A", 140, 93); // Y reduced from 99

      // Handle address wrapping for Ship to
      const shipToAddress =
        invoiceData?.receiverDetails?.deliveryAddress || "N/A";
      const shipToAddressLines = pdf.splitTextToSize(shipToAddress, 60);
      pdf.text(shipToAddressLines, 140, 99); // Y reduced from 105

      pdf.text(invoiceData?.receiverDetails?.gstin || "N/A", 140, 109); // Y reduced from 115
      pdf.text(invoiceData?.poNumber || " ", 140, 115); // Y reduced from 122
      pdf.text(
        new Date(invoiceData?.poDate).toLocaleDateString("en-GB") || " ",
        140,
        121
      ); // Y reduced from 127

      // Add items table - OPTIMIZED
      pdf.autoTable({
        startY: 125, // Y reduced from 130
        head: [
          [
            "Sl.No",
            "Item Name",
            "HSN/SAC",
            "Qty",
            "Unit",
            "Rate",
            "Amount",
            "Tax %",
            "Tax Amount",
            "Amount",
          ],
        ],
        body:
          invoiceData?.items?.map((item, index) => {
            // Further limit description length to save space
            const description = item?.description
              ? item.description.length > 200 // Reduced from 500
                ? item.description.substring(0, 200) + "..."
                : item.description
              : "";

            return [
              index + 1,
              item.itemName + (description ? " (" + description + ")" : ""),
              item.hsnCode || "-",
              item.quantity,
              item.unit || "Pcs",
              item.sellingPrice,
              item.grossAmount,
              item.taxRate || "0.00",
              item.taxAmount || "0.00",
              item.amount,
            ];
          }) || [],
        theme: "grid",
        headStyles: {
          fillColor: [50, 50, 50],
          textColor: [255, 255, 255],
          fontSize: 7, // Reduced from 8
          fontStyle: "bold",
          halign: "center",
        },
        bodyStyles: {
          textColor: [50, 50, 50],
          fontSize: 7, // Reduced from 8
          halign: "center",
        },
        columnStyles: {
          1: { halign: "left", cellWidth: 40 },
        },
        margin: { left: 10, right: 10 },
        styles: {
          overflow: "linebreak",
          cellPadding: 1.5, // Reduced from 1.9
          lineHeight: 1.1, // Added to reduce line height
        },
        tableWidth: 190,
        didParseCell: function (data) {
          // Reduce row height for all cells
          if (data.section === "body") {
            data.cell.styles.minCellHeight = 0.8; // Reduce minimum cell height
          }
        },
      });

      // Get the final Y position after the table
      const finalY = pdf.autoTable.previous.finalY + 3; // Reduced from 5

      // Add HSN summary table with grouped HSN codes - OPTIMIZED
      pdf.autoTable({
        startY: finalY,
        head: [
          (() => {
            // Conditional headers based on tax group
            const taxGroup = invoiceData?.taxGroup;
            if (taxGroup === "State Tax") {
              return [
                "HSN CODE",
                "TABLE AMT",
                "CGST%",
                "CGST AMT",
                "SGST%",
                "SGST AMT",
                "TOTAL TAX",
              ];
            } else if (taxGroup === "Other Tax") {
              return ["HSN CODE", "TABLE AMT", "IGST%", "IGST AMT"];
            } else {
              // Default case - show all columns
              return [
                "HSN CODE",
                "TABLE AMT",
                "CGST%",
                "CGST AMT",
                "SGST%",
                "SGST AMT",
                "TOTAL TAX",
                "IGST%",
                "IGST AMT",
              ];
            }
          })(),
        ],
        body: (() => {
          // Group items by HSN code and tax rate
          // [existing code for HSN grouping]
          // ... keep the existing body generation code ...
          const hsnGroups = {};
          let totalTableAmt = 0;
          let totalCgstAmt = 0;
          let totalSgstAmt = 0;
          let totalIgstAmt = 0;

          invoiceData?.items?.forEach((item) => {
            const hsnCode = item.hsnCode || "-";
            const taxRate = item.taxRate || "0";
            const groupKey = `${hsnCode}_${taxRate}`;

            if (!hsnGroups[groupKey]) {
              hsnGroups[groupKey] = {
                hsnCode: hsnCode,
                tableAmt: 0,
                cgstPercent: item.cgst || 0,
                cgstAmt: 0,
                sgstPercent: item.sgst || 0,
                sgstAmt: 0,
                igstPercent: item.igst || 0,
                igstAmt: 0,
              };
            }

            // Sum up amounts for the same HSN code and tax rate
            const grossAmount = parseFloat(item.grossAmount || 0);
            const cgstAmount = (parseFloat(item.cgst || 0) * grossAmount) / 100;
            const sgstAmount = (parseFloat(item.sgst || 0) * grossAmount) / 100;
            const igstAmount = (parseFloat(item.igst || 0) * grossAmount) / 100;

            hsnGroups[groupKey].tableAmt += grossAmount;
            hsnGroups[groupKey].cgstAmt += cgstAmount;
            hsnGroups[groupKey].sgstAmt += sgstAmount;
            hsnGroups[groupKey].igstAmt += igstAmount;

            // Add to totals
            totalTableAmt += grossAmount;
            totalCgstAmt += cgstAmount;
            totalSgstAmt += sgstAmount;
            totalIgstAmt += igstAmount;
          });

          // Convert grouped data to array format for the table based on tax group
          const taxGroup = invoiceData?.taxGroup;
          const rows = Object.values(hsnGroups).map((data) => {
            if (taxGroup === "State Tax") {
              const totalTax =
                parseFloat(data.cgstAmt) + parseFloat(data.sgstAmt);
              return [
                data.hsnCode,
                data.tableAmt.toFixed(2),
                data.cgstPercent,
                data.cgstAmt.toFixed(2),
                data.sgstPercent,
                data.sgstAmt.toFixed(2),
                totalTax.toFixed(2),
              ];
            } else if (taxGroup === "Other Tax") {
              return [
                data.hsnCode,
                data.tableAmt.toFixed(2),
                data.igstPercent,
                data.igstAmt.toFixed(2),
              ];
            } else {
              // Default case - show all columns
              const totalTax =
                parseFloat(data.cgstAmt) + parseFloat(data.sgstAmt);
              return [
                data.hsnCode,
                data.tableAmt.toFixed(2),
                data.cgstPercent,
                data.cgstAmt.toFixed(2),
                data.sgstPercent,
                data.sgstAmt.toFixed(2),
                totalTax.toFixed(2),
                data.igstPercent,
                data.igstAmt.toFixed(2),
              ];
            }
          });

          // Add total row
          if (taxGroup === "State Tax") {
            const totalTax = totalCgstAmt + totalSgstAmt;
            rows.push([
              "Total",
              totalTableAmt.toFixed(2),
              "",
              totalCgstAmt.toFixed(2),
              "",
              totalSgstAmt.toFixed(2),
              totalTax.toFixed(2),
            ]);
          } else if (taxGroup === "Other Tax") {
            rows.push([
              "Total",
              totalTableAmt.toFixed(2),
              "",
              totalIgstAmt.toFixed(2),
            ]);
          } else {
            const totalTax = totalCgstAmt + totalSgstAmt;
            rows.push([
              "Total",
              totalTableAmt.toFixed(2),
              "",
              totalCgstAmt.toFixed(2),
              "",
              totalSgstAmt.toFixed(2),
              totalTax.toFixed(2),
              "",
              totalIgstAmt.toFixed(2),
            ]);
          }

          return rows;
        })(),
        theme: "grid",
        headStyles: {
          fillColor: [50, 50, 50],
          textColor: [255, 255, 255],
          fontSize: 6, // Reduced from 7
          fontStyle: "bold",
          halign: "center",
        },
        bodyStyles: {
          textColor: [50, 50, 50],
          fontSize: 6, // Reduced from 7
          halign: "center",
        },
        // Style for the total row
        didParseCell: function (data) {
          if (data.row.index === data.table.body.length - 1) {
            data.cell.styles.fontStyle = "bold";
            data.cell.styles.fillColor = [240, 240, 240];
            data.cell.styles.textColor = [0, 0, 0];
          }
        },
        margin: { left: 10, right: 10 },
        tableWidth: 120,
        styles: {
          cellPadding: 1, // Reduced padding
        },
      });

      // Get the final Y position after the HSN table
      let hsnTableY = pdf.autoTable.previous.finalY + 3; // Reduced from 5

      // IMPORTANT: Increased threshold for new page to allow more content on first page
      // Check if we need to add a new page based on remaining space
      if (hsnTableY > 240) {
        // Increased from 230
        pdf.addPage();
        pdf.setDrawColor(0, 0, 0);
        pdf.setLineWidth(0.5);
        pdf.rect(6, 10, 198, 277);

        // Reset Y position for the new page
        hsnTableY = 20;
      }

      // Add amount in words - REDUCED SPACING
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(9); // Reduced from 10
      pdf.text(
        `${toWords.convert(totalPayableAmount || grandTotal)} RUPEES ONLY`,
        15,
        hsnTableY + 2
      );

      // Add bank details - REDUCED SPACING
      pdf.setFontSize(7); // Reduced from 8
      pdf.text("Bank Name:", 15, hsnTableY + 6); // Reduced from +8
      pdf.text("Acc No:", 15, hsnTableY + 11); // Reduced from +14
      pdf.text("IFS Code:", 15, hsnTableY + 16); // Reduced from +20
      pdf.text("Branch:", 15, hsnTableY + 21); // Reduced from +26
      pdf.text("Term & Condition:", 15, hsnTableY + 27); // add new line for terms

      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(50, 50, 50);
      pdf.text(bankdetails?.bankName || "sample bank", 40, hsnTableY + 6); // Reduced from +8
      pdf.text(
        bankdetails?.accountNumber || "sample Number",
        40,
        hsnTableY + 11 // Reduced from +14
      );
      pdf.text(bankdetails?.ifscCode || "sample Code", 40, hsnTableY + 16); // Reduced from +20
      pdf.text(bankdetails?.branch || "sample Branch", 40, hsnTableY + 21); // Reduced from +26

      termsSentences.forEach((sentence, index) => {
        // Trim the sentence and add a period back
        const formattedSentence = sentence.trim() + ".";

        // Split long sentences into multiple lines
        const wrappedText = pdf.splitTextToSize(formattedSentence, maxWidth);

        // Calculate Y position for each line
        wrappedText.forEach((line, lineIndex) => {
          pdf.text(line, 15, finalY + 52 + index * 5 + lineIndex * 5);
        });
      });

      // Add summary section with dynamic positioning - REDUCED SPACING
      let currentY = hsnTableY + 6; // Reduced from +8
      const lineSpacing = 5; // Reduced from 6

      // Show Discount Amount only if greater than 0
      if (invoiceData?.discount > 0) {
        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(0, 0, 0);
        pdf.text("Discount Amount:", 140, currentY);
        pdf.setFont("helvetica", "normal");
        pdf.setTextColor(50, 50, 50);
        pdf.text(`${invoiceData?.discount}/-`, 190, currentY, {
          align: "right",
        });
        currentY += lineSpacing;
      }

      // Always show Total Amount
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(0, 0, 0);
      pdf.text("Taxable Amount:", 140, currentY);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(50, 50, 50);
      pdf.text(`${taxableAmount}/-`, 190, currentY, { align: "right" });
      currentY += lineSpacing;

      // Show Taxable Amount if greater than 0
      if (parseFloat(taxAmount) > 0) {
        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(0, 0, 0);
        pdf.text("Tax Amount:", 140, currentY);
        pdf.setFont("helvetica", "normal");
        pdf.setTextColor(50, 50, 50);
        pdf.text(`${taxAmount}/-`, 190, currentY, { align: "right" });
        currentY += lineSpacing;
      }

      // Add grand total - REDUCED SPACING
      currentY += 3; // Reduced from 4
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(9); // Reduced from 10
      pdf.text("Grand Total:", 140, currentY);
      pdf.text(`${grandTotal}/-`, 190, currentY, { align: "right" });
      currentY += lineSpacing;

      // Show Transportation Charges only if greater than 0
      if (parseFloat(transportationCharges) > 0) {
        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(0, 0, 0);
        pdf.text("Transportation Charges:", 140, currentY);
        pdf.setFont("helvetica", "normal");
        pdf.setTextColor(50, 50, 50);
        pdf.text(`${transportationCharges}/-`, 190, currentY, {
          align: "right",
        });
        currentY += lineSpacing;
      }

      // Show round off Amount if greater than 0
      if (roundOff > 0) {
        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(0, 0, 0);
        pdf.text("Round Off :", 140, currentY + 5); // Reduced from +6
        pdf.setFont("helvetica", "normal");
        pdf.setTextColor(50, 50, 50);
        pdf.text(`${roundOff}/-`, 190, currentY, { align: "right" });
        currentY += lineSpacing;
      }

      // Add line before grand total - REDUCED SPACING
      currentY += 6; // Reduced from 8
      pdf.setDrawColor(0, 0, 0);
      pdf.setLineWidth(0.5);
      pdf.line(140, currentY, 195, currentY);

      // Add total payable amount
      currentY += 3; // Reduced from 4
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(9); // Reduced from 10
      pdf.text("Total Payable Amount : ", 140, currentY);
      pdf.text(`${totalPayableAmount}/-`, 196, currentY, { align: "right" });

      // Update hsnTableY for subsequent content
      hsnTableY = currentY;

      // Add horizontal line - REDUCED SPACING
      pdf.setDrawColor(30, 58, 138);
      pdf.setLineWidth(0.5);
      pdf.line(10, hsnTableY + 30, 200, hsnTableY + 30); // Reduced from +45

      // IMPORTANT: Increased threshold for new page check
      // Check if we need to add a new page for signature section
      if (hsnTableY + 75 > 277) {
        // Reduced from +90
        pdf.addPage();
        pdf.setDrawColor(0, 0, 0);
        pdf.setLineWidth(0.5);
        pdf.rect(6, 10, 198, 277);
        // Reset Y position for the new page
        hsnTableY = 20;
      }

      // Add signature section - REDUCED SPACING
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(8); // Reduced from 9
      pdf.text("Received the Material in Good Condition", 15, hsnTableY + 35); // Reduced from +55
      pdf.text("For Snigdha Enterprise", 185, hsnTableY + 35, {
        // Reduced from +55
        align: "right",
      });

      // Capture QR code directly from DOM
      try {
        // First try to find QR code in the component
        const qrCodeElement = document.querySelector(
          ".qr-code-container canvas, .qr-code canvas"
        );

        if (qrCodeElement) {
          html2canvas(qrCodeElement, {
            backgroundColor: null,
            scale: 3, // Higher scale for better quality
          })
            .then((canvas) => {
              const qrDataURL = canvas.toDataURL("image/png");
              pdf.addImage(qrDataURL, "PNG", 90, hsnTableY + 30, 30, 30); // Reduced from +50

              // Continue with the rest of the PDF after QR code is added
              finalizePdf();
            })
            .catch((err) => {
              console.error("Error capturing QR code with html2canvas:", err);
              // Continue without QR code
              finalizePdf();
            });
        } else {
          console.warn("QR code element not found in DOM");
          finalizePdf();
        }
      } catch (qrError) {
        console.error("Error adding QR code:", qrError);
        // Continue without QR code
        finalizePdf();
      }

      // Function to finalize the PDF after QR code handling
      function finalizePdf() {
        // Add signature lines - REDUCED SPACING
        pdf.setDrawColor(0, 0, 0);
        pdf.line(15, hsnTableY + 45, 80, hsnTableY + 45); // Reduced from +70
        pdf.line(130, hsnTableY + 45, 185, hsnTableY + 45); // Reduced from +70

        // Add signature labels
        pdf.setFontSize(7); // Reduced from 8
        pdf.text("Receiver's Signature & Seal", 15, hsnTableY + 50); // Reduced from +75
        pdf.text("Authorized Signature", 185, hsnTableY + 50, {
          // Reduced from +75
          align: "right",
        });

        // Add horizontal line
        pdf.setDrawColor(0, 0, 0);
        pdf.line(10, hsnTableY + 60, 200, hsnTableY + 60); // Reduced from +80

        // Add footer
        pdf.setTextColor(0, 0, 0);
        pdf.setFontSize(8); // Reduced from 9
        pdf.text(
          "This is Computer Generated No Need To Signature",
          105,
          hsnTableY + 65, // Reduced from +85
          { align: "center" }
        );
        pdf.text("Thank You!", 105, hsnTableY + 70, { align: "center" }); // Reduced from +90

        // Remove loading indicator
        try {
          const loadingDiv = document.querySelector(
            'div[style*="position: fixed"]'
          );
          if (loadingDiv && document.body.contains(loadingDiv)) {
            document.body.removeChild(loadingDiv);
          }
        } catch (error) {
          console.warn("Error removing loading indicator:", error);
        }

        // Save the PDF
        pdf.save(
          `Snigdha-Product-Invoice-${
            invoiceData?.invoiceNumber || "download"
          }.pdf`
        );
      }
    } catch (error) {
      console.error("PDF Generation Error:", error);
      // ... rest of error handling code ...
    }
  };

  const handleDownloadPdf = async () => {
    try {
      if (!componentRef.current) {
        console.error("Component reference is null.");
        return;
      }
      // Wait for QR code to render completely
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Create a more structured PDF with border
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      // Function to add header content to any page
      const addHeaderContent = (pdf) => {
        // console.log(
        //   "Adding header content to page",
        //   pdf.internal.getCurrentPageInfo().pageNumber
        // );
        // Add header
        pdf.setFontSize(16);
        pdf.setTextColor(0, 0, 0);
        pdf.setFont("helvetica", "bold");
        pdf.text("SNIGDHA ENTERPRISE", 105, 18, { align: "center" });

        // Add underline
        pdf.setDrawColor(0, 0, 0);
        pdf.setLineWidth(0.5);
        pdf.line(55, 20, 155, 20);

        // Add address
        pdf.setFontSize(9);
        pdf.setTextColor(0, 0, 0);
        pdf.text("AB-79, SALT LAKE CITY, SECTOR-I, KOLKATA - 700064", 105, 25, {
          align: "center",
        });
        pdf.text(iso, 105, 30, {
          align: "center",
        });

        // Add company details
        pdf.setFontSize(8);
        pdf.setTextColor(0, 0, 0);
        pdf.setFont("helvetica", "bold");
        pdf.text("GSTIN:", 20, 34);
        pdf.text("STATE:", 20, 39);

        pdf.text("Email:", 120, 34);
        pdf.text("Phone:", 120, 39);

        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(0, 0, 0);
        pdf.text(gst, 35, 34);
        pdf.text("West Bengal (19)", 35, 39);

        pdf.text("snigdhaenterprise2015@gmail.com", 135, 34);
        pdf.text("9073656557", 135, 39);

        // Add a separator line after header
        pdf.setDrawColor(0, 0, 0);
        pdf.setLineWidth(0.5);
        pdf.line(10, 43, 200, 43);

        // Return the Y position where content can start after header (with some padding)
        return 48; // This gives space after the separator line
      };

      // Add border to the entire page
      pdf.setDrawColor(0, 0, 0);
      pdf.setLineWidth(0.5);
      pdf.rect(6, 6, 198, 289);

      const termsText =
        term ||
        "Our payment terms are net 15 days. A late fee of 1.5% per month will be applied to overdue balances.";

      // Split terms by period and filter out empty strings
      const termsSentences = termsText
        .split(".")
        .filter((sentence) => sentence.trim());

      // Maximum width for terms text in mm (left half of page)
      const maxWidth = 90;

      // Add header content to first page
      let currentY = addHeaderContent(pdf);

      // Modify the original addPage function to include header
      const originalAddPage = pdf.addPage;
      pdf.addPage = function () {
        originalAddPage.apply(this, arguments);
        // Draw border on each new page
        this.setDrawColor(0, 0, 0);
        this.setLineWidth(0.5);
        this.rect(6, 6, 198, 289); // Use same border as first page

        // Add header content to new page and return the Y position for content
        const headerEndY = addHeaderContent(this);

        // Store the header end position for use by other functions
        this._headerEndY = headerEndY;

        return this;
      };

      // Add TAX INVOICE header
      pdf.setFillColor(240, 240, 240);
      pdf.rect(10, currentY - 2, 190, 7, "F");
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(13);
      pdf.setFont("helvetica", "bold");
      pdf.text("TAX INVOICE", 105, currentY + 3, { align: "center" });

      // Add invoice details
      currentY += 12;
      pdf.setFontSize(9);
      pdf.setTextColor(0, 0, 0);
      pdf.setFont("helvetica", "bold");
      pdf.text("Invoice No:", 15, currentY);
      pdf.text("Invoice Date:", 15, currentY + 6);
      pdf.text("Payment Type:", 15, currentY + 12);
      pdf.text("GSTIN:", 15, currentY + 18);

      // Add invoice details - values
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(0, 0, 0);
      pdf.text(invoiceNumber || "N/A", 40, currentY);
      pdf.text(
        new Date(date).toLocaleDateString("en-GB") || "N/A",
        40,
        currentY + 6
      );
      pdf.text(paymenttype || "N/A", 40, currentY + 12);
      pdf.text(gst || "N/A", 40, currentY + 18);

      // Add horizontal line
      currentY += 22;
      pdf.setDrawColor(0, 0, 0);
      pdf.setLineWidth(0.5);
      pdf.line(10, currentY, 200, currentY);

      // Continue with shipping details
      currentY += 5;
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(10);
      pdf.text("Shipping Details (Bill to)", 15, currentY);
      pdf.text("Shipping Details (Ship to)", 120, currentY);

      // Add shipping details
      currentY += 7;
      pdf.setFontSize(8);
      pdf.text("Name:", 15, currentY);
      pdf.text("Address:", 15, currentY + 6);
      pdf.text("State:", 15, currentY + 16);
      pdf.text("GSTIN:", 15, currentY + 22);
      pdf.text("Code:", 15, currentY + 28);

      // Add shipping details - values with word wrapping for addresses
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(0, 0, 0);
      pdf.text(name || "N/A", 35, currentY);

      // Handle address wrapping for Bill to
      const billToAddress = address || "N/A";
      const billToAddressLines = pdf.splitTextToSize(billToAddress, 70);
      pdf.text(billToAddressLines, 35, currentY + 6);

      pdf.text(state || "N/A", 35, currentY + 16);
      pdf.text(gstNo || "N/A", 35, currentY + 22);
      pdf.text(code || "N/A", 35, currentY + 28);

      // Add shipping details - right side
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(0, 0, 0);
      pdf.text("Name:", 120, currentY);
      pdf.text("Address:", 120, currentY + 6);
      pdf.text("GSTIN:", 120, currentY + 16);
      pdf.text("PO Number :", 120, currentY + 22);
      pdf.text("PO Date :", 120, currentY + 28);

      // Add shipping details - values with word wrapping
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(0, 0, 0);
      pdf.text(invoiceData?.receiverDetails?.name || "N/A", 140, currentY);

      // Handle address wrapping for Ship to
      const shipToAddress =
        invoiceData?.receiverDetails?.deliveryAddress || "N/A";
      const shipToAddressLines = pdf.splitTextToSize(shipToAddress, 60);
      pdf.text(shipToAddressLines, 140, currentY + 6);

      pdf.text(
        invoiceData?.receiverDetails?.gstin || "N/A",
        140,
        currentY + 16
      );
      pdf.text(invoiceData?.poNumber || " ", 140, currentY + 22);
      pdf.text(
       invoiceData?.poDate ? new Date(invoiceData?.poDate).toLocaleDateString("en-GB") :  " ",
        140,
        currentY + 28
      );

      // Add items table - OPTIMIZED
      pdf.autoTable({
        startY: currentY + 35,
        head: [
          [
            "Sl.No",
            "Item Name",
            "HSN/SAC",
            "Qty",
            "Unit",
            "Rate",
            "Amount",
            "Disc %",
            "Taxable Amount",
            "Tax %",
            "Tax Amount",
            "Amount",
          ],
        ],
        body:
          invoiceData?.items?.map((item, index) => {
            // Further limit description length to save space
            const description = item?.description
              ? item.description.length > 200
                ? item.description.substring(0, 200) + "..."
                : item.description
              : "";

            return [
              index + 1,
              item.itemName + (description ? " (" + description + ")" : ""),
              item.hsnCode || "-",
              item.quantity,
              item.uom || "",
              item.sellingPrice.toFixed(2) || 0,
              item.grossAmount.toFixed(2) || 0,
              item.discountRate || 0,
              item.netAmount.toFixed(2) || 0,
              item.taxRate || "0.00",
              item.taxAmount.toFixed(2) || "0.00",
              item.amount.toFixed(2) || 0,
            ];
          }) || [],
        theme: "grid",
        headStyles: {
          fillColor: [50, 50, 50],
          textColor: [255, 255, 255],
          fontSize: 7,
          fontStyle: "bold",
          halign: "center",
        },
        bodyStyles: {
          textColor: [0, 0, 0],
          fontSize: 7,
          halign: "center",
          fontStyle: "bold",
        },
        columnStyles: {
          1: { halign: "left", cellWidth: 40 },
        },
        margin: { top: 50, left: 10, right: 10 },
        styles: {
          overflow: "linebreak",
          cellPadding: 1.5,
          lineHeight: 1.1,
        },
        tableWidth: 190,
        didParseCell: function (data) {
          // Reduce row height for all cells
          if (data.section === "body") {
            data.cell.styles.minCellHeight = 0.8;
          }
        },
        // Add didDrawPage callback to ensure header on new pages created by autoTable
        didDrawPage: function (data) {
          // For pages after the first one, ensure content starts after header
          if (data.pageNumber > 1) {
            // The autoTable will automatically handle positioning after our addPage override
            // No need to manually adjust startY here
          }
        },
      });

      // Get the final Y position after the table
      const finalY = pdf.autoTable.previous.finalY + 3;

      // Add HSN summary table with grouped HSN codes - OPTIMIZED
      pdf.autoTable({
        startY: finalY,
        head: [
          (() => {
            // Conditional headers based on tax group
            const taxGroup = invoiceData?.taxGroup;
            if (taxGroup === "State Tax") {
              return [
                "HSN CODE",
                "TABLE AMT",
                "CGST%",
                "CGST AMT",
                "SGST%",
                "SGST AMT",
                "TOTAL TAX",
              ];
            } else if (taxGroup === "Other Tax") {
              return ["HSN CODE", "TABLE AMT", "IGST%", "IGST AMT"];
            } else {
              // Default case - show all columns
              return [
                "HSN CODE",
                "TABLE AMT",
                "CGST%",
                "CGST AMT",
                "SGST%",
                "SGST AMT",
                "TOTAL TAX",
                "IGST%",
                "IGST AMT",
              ];
            }
          })(),
        ],
        body: (() => {
          // Group items by HSN code and tax rate
          const hsnGroups = {};
          let totalTableAmt = 0;
          let totalCgstAmt = 0;
          let totalSgstAmt = 0;
          let totalIgstAmt = 0;

          invoiceData?.items?.forEach((item) => {
            const hsnCode = item.hsnCode || "-";
            const taxRate = item.taxRate || "0";
            const groupKey = `${hsnCode}_${taxRate}`;

            if (!hsnGroups[groupKey]) {
              hsnGroups[groupKey] = {
                hsnCode: hsnCode,
                tableAmt: 0,
                cgstPercent: item.cgst || 0,
                cgstAmt: 0,
                sgstPercent: item.sgst || 0,
                sgstAmt: 0,
                igstPercent: item.igst || 0,
                igstAmt: 0,
              };
            }

            // Sum up amounts for the same HSN code and tax rate
            const netAmount = parseFloat(item.netAmount || 0);
            const cgstAmount = (parseFloat(item.cgst || 0) * netAmount) / 100;
            const sgstAmount = (parseFloat(item.sgst || 0) * netAmount) / 100;
            const igstAmount = (parseFloat(item.igst || 0) * netAmount) / 100;

            hsnGroups[groupKey].tableAmt += netAmount;
            hsnGroups[groupKey].cgstAmt += cgstAmount;
            hsnGroups[groupKey].sgstAmt += sgstAmount;
            hsnGroups[groupKey].igstAmt += igstAmount;

            // Add to totals
            totalTableAmt += netAmount;
            totalCgstAmt += cgstAmount;
            totalSgstAmt += sgstAmount;
            totalIgstAmt += igstAmount;
          });

          // Convert grouped data to array format for the table based on tax group
          const taxGroup = invoiceData?.taxGroup;
          const rows = Object.values(hsnGroups).map((data) => {
            if (taxGroup === "State Tax") {
              const totalTax =
                parseFloat(data.cgstAmt) + parseFloat(data.sgstAmt);
              return [
                data.hsnCode,
                data.tableAmt.toFixed(2),
                data.cgstPercent,
                data.cgstAmt.toFixed(2),
                data.sgstPercent,
                data.sgstAmt.toFixed(2),
                totalTax.toFixed(2),
              ];
            } else if (taxGroup === "Other Tax") {
              return [
                data.hsnCode,
                data.tableAmt.toFixed(2),
                data.igstPercent,
                data.igstAmt.toFixed(2),
              ];
            } else {
              // Default case - show all columns
              const totalTax =
                parseFloat(data.cgstAmt) + parseFloat(data.sgstAmt);
              return [
                data.hsnCode,
                data.tableAmt.toFixed(2),
                data.cgstPercent,
                data.cgstAmt.toFixed(2),
                data.sgstPercent,
                data.sgstAmt.toFixed(2),
                totalTax.toFixed(2),
                data.igstPercent,
                data.igstAmt.toFixed(2),
              ];
            }
          });

          // Add total row
          if (taxGroup === "State Tax") {
            const totalTax = totalCgstAmt + totalSgstAmt;
            rows.push([
              "Total",
              totalTableAmt.toFixed(2),
              "",
              totalCgstAmt.toFixed(2),
              "",
              totalSgstAmt.toFixed(2),
              totalTax.toFixed(2),
            ]);
          } else if (taxGroup === "Other Tax") {
            rows.push([
              "Total",
              totalTableAmt.toFixed(2),
              "",
              totalIgstAmt.toFixed(2),
            ]);
          } else {
            const totalTax = totalCgstAmt + totalSgstAmt;
            rows.push([
              "Total",
              totalTableAmt.toFixed(2),
              "",
              totalCgstAmt.toFixed(2),
              "",
              totalSgstAmt.toFixed(2),
              totalTax.toFixed(2),
              "",
              totalIgstAmt.toFixed(2),
            ]);
          }

          return rows;
        })(),
        theme: "grid",
        headStyles: {
          fillColor: [50, 50, 50],
          textColor: [255, 255, 255],
          fontSize: 6,
          fontStyle: "bold",
          halign: "center",
        },
        bodyStyles: {
          textColor: [0, 0, 0],
          fontSize: 6,
          halign: "center",
          fontStyle: "bold",
        },
        // Style for the total row
        didParseCell: function (data) {
          if (data.row.index === data.table.body.length - 1) {
            data.cell.styles.fontStyle = "bold";
            data.cell.styles.fillColor = [240, 240, 240];
            data.cell.styles.textColor = [0, 0, 0];
          }
        },
        margin: { top: 50, left: 10, right: 10 },
        tableWidth: 120,
        styles: {
          cellPadding: 1,
        },
        // Add didDrawPage callback for HSN table as well
        didDrawPage: function (data) {
          // For pages after the first one, content positioning is handled by addPage override
          if (data.pageNumber > 1) {
            // The header space is already accounted for in our addPage function
          }
        },
      });

      // Get the final Y position after the HSN table
      let hsnTableY = pdf.autoTable.previous.finalY + 3;

      // Check if we need to add a new page based on remaining space
      if (hsnTableY > 190) {
        pdf.addPage();
        // Reset Y position for the new page (header is already added by addPage override)
        // Start content right after the header
        hsnTableY = pdf._headerEndY || 50; // Use stored header end position
      }

      // Continue with rest of the content...
      // Add amount in words
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(9);
      pdf.text(
        `${toWords.convert(totalPayableAmount || grandTotal)} RUPEES ONLY`,
        15,
        hsnTableY + 2
      );

      // Add bank details
      pdf.setFontSize(7);
      pdf.text("Bank Name:", 15, hsnTableY + 6);
      pdf.text("Acc No:", 15, hsnTableY + 11);
      pdf.text("IFS Code:", 15, hsnTableY + 16);
      pdf.text("Branch:", 15, hsnTableY + 21);

      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(0, 0, 0);
      pdf.text(bankdetails?.bankName || "sample bank", 40, hsnTableY + 6);
      pdf.text(
        bankdetails?.accountNumber || "sample Number",
        40,
        hsnTableY + 11
      );
      pdf.text(bankdetails?.ifscCode || "sample Code", 40, hsnTableY + 16);
      pdf.text(bankdetails?.branch || "sample Branch", 40, hsnTableY + 21);

      // Add Terms & Conditions (Left side) - PROPERLY POSITIONED
      let termsY = hsnTableY + 27;
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(0, 0, 0);
      pdf.text("Term & Condition:", 15, termsY);
      pdf.setFont("helvetica", "bold");
      termsY += 5;

      termsSentences.forEach((sentence, index) => {
        const formattedSentence = sentence.trim() + ".";
        const wrappedText = pdf.splitTextToSize(formattedSentence, maxWidth);

        wrappedText.forEach((line) => {
          pdf.text(line, 15, termsY);
          termsY += 4;
        });

        termsY += 1;
      });

      // Add summary section with dynamic positioning
      let summaryY = hsnTableY + 6;
      const lineSpacing = 5;

      // Show Discount Amount only if greater than 0
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(0, 0, 0);
      pdf.text("Gross Amount:", 140, summaryY);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(0, 0, 0);
      pdf.text(`${grossAmount}/-`, 190, summaryY, {
        align: "right",
      });
      summaryY += lineSpacing;

      // Show Discount Amount only if greater than 0
      if (invoiceData?.discount > 0) {
        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(0, 0, 0);
        pdf.text("Discount Amount:", 140, summaryY);
        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(0, 0, 0);
        pdf.text(`${invoiceData?.discount}/-`, 190, summaryY, {
          align: "right",
        });
        summaryY += lineSpacing;
      }

      // Always show Total Amount
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(0, 0, 0);
      pdf.text("Taxable Amount:", 140, summaryY);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(0, 0, 0);
      pdf.text(`${taxableAmount}/-`, 190, summaryY, { align: "right" });
      summaryY += lineSpacing;

      // Show Tax Amount if greater than 0
      if (parseFloat(taxAmount) > 0) {
        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(0, 0, 0);
        pdf.text("Tax Amount:", 140, summaryY);
        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(0, 0, 0);
        pdf.text(`${taxAmount}/-`, 190, summaryY, { align: "right" });
        summaryY += lineSpacing;
      }

      // Add grand total
      summaryY += 3;
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(9);
      pdf.text("Grand Total:", 140, summaryY);
      pdf.text(`${grandTotal}/-`, 190, summaryY, { align: "right" });
      summaryY += lineSpacing;

      // Show Transportation Charges only if greater than 0
      if (parseFloat(transportationCharges) > 0) {
        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(0, 0, 0);
        pdf.text("Transportation Charges:", 140, summaryY);
        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(0, 0, 0);
        pdf.text(`${transportationCharges}/-`, 190, summaryY, {
          align: "right",
        });
        summaryY += lineSpacing;
      }

      // Show round off Amount if greater than 0
      if (roundOff > 0) {
        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(0, 0, 0);
        pdf.text("Round Off :", 140, summaryY + 5);
        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(0, 0, 0);
        pdf.text(`${roundOff}/-`, 190, summaryY + 5, { align: "right" });
        summaryY += lineSpacing;
      }

      // Add line before total payable amount
      summaryY += 6;
      pdf.setDrawColor(0, 0, 0);
      pdf.setLineWidth(0.5);
      pdf.line(140, summaryY, 195, summaryY);

      // Add total payable amount
      summaryY += 5;
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(9);
      pdf.text("Total Payable Amount : ", 140, summaryY);
      pdf.text(`${totalPayableAmount}/-`, 196, summaryY, { align: "right" });

      // Calculate the next Y position after both sections
      const nextY = Math.max(termsY + 10, summaryY + 10);

      console.log("Next Y Position:", nextY);

      // Check if we need to add a new page for signature section
      let signatureHeight = 9;
      let pageHeight = 270;

      if (nextY + signatureHeight > pageHeight) {
        pdf.addPage();
        // Start after header on new page using stored position
        hsnTableY = pdf._headerEndY || 50;
      } else {
        hsnTableY = nextY - 25;
      }

      // Add signature section
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(8);
      pdf.text("Received the Material in Good Condition", 15, hsnTableY + 25);
      pdf.text("For Snigdha Enterprise", 185, hsnTableY + 25, {
        align: "right",
      });

      // Capture QR code directly from DOM
      try {
        const qrCodeElement = document.querySelector(
          ".qr-code-container canvas, .qr-code canvas"
        );

        if (qrCodeElement) {
          html2canvas(qrCodeElement, {
            backgroundColor: null,
            scale: 3,
          })
            .then((canvas) => {
              const qrDataURL = canvas.toDataURL("image/png");
              pdf.addImage(qrDataURL, "PNG", 90, hsnTableY + 20, 30, 30);
              finalizePdf();
            })
            .catch((err) => {
              console.error("Error capturing QR code with html2canvas:", err);
              finalizePdf();
            });
        } else {
          console.warn("QR code element not found in DOM");
          finalizePdf();
        }
      } catch (qrError) {
        console.error("Error adding QR code:", qrError);
        finalizePdf();
      }

      // Function to finalize the PDF after QR code handling
      function finalizePdf() {
        // Add signature lines
        pdf.setDrawColor(0, 0, 0);
        pdf.line(15, hsnTableY + 35, 80, hsnTableY + 35);
        pdf.line(130, hsnTableY + 35, 185, hsnTableY + 35);

        // Add signature labels
        pdf.setFontSize(7);
        pdf.text("Receiver's Signature & Seal", 15, hsnTableY + 40);
        pdf.text("Authorized Signature", 185, hsnTableY + 40, {
          align: "right",
        });

        // Add horizontal line
        pdf.setDrawColor(0, 0, 0);
        pdf.line(10, hsnTableY + 50, 200, hsnTableY + 50);

        // Add footer
        pdf.setTextColor(0, 0, 0);
        pdf.setFontSize(8);
        pdf.text(
          "This is Computer Generated No Need To Signature",
          105,
          hsnTableY + 54,
          { align: "center" }
        );
        pdf.text("Thank You!", 105, hsnTableY + 58, { align: "center" });

        // Remove loading indicator
        try {
          const loadingDiv = document.querySelector(
            'div[style*="position: fixed"]'
          );
          if (loadingDiv && document.body.contains(loadingDiv)) {
            document.body.removeChild(loadingDiv);
          }
        } catch (error) {
          console.warn("Error removing loading indicator:", error);
        }

        // Save the PDF
        pdf.save(
          `Snigdha-Product-Invoice-${
            invoiceData?.invoiceNumber || "download"
          }.pdf`
        );
      }
    } catch (error) {
      console.error("PDF Generation Error:", error);
      toast.error("An error occurred while generating the PDF.");
    }
  };

  // Enhanced Excel export function with QR Code using ExcelJS

  const handleExcelExport = async () => {
    try {
      // Create a new workbook and worksheet
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Invoice");

      let currentRow = 1;

      // Company Header
      worksheet.mergeCells(`A${currentRow}:J${currentRow}`);
      worksheet.getCell(`A${currentRow}`).value = "SNIGDHA ENTERPRISE";
      worksheet.getCell(`A${currentRow}`).font = { bold: true, size: 16 };
      worksheet.getCell(`A${currentRow}`).alignment = { horizontal: "center" };
      currentRow++;

      worksheet.mergeCells(`A${currentRow}:J${currentRow}`);
      worksheet.getCell(`A${currentRow}`).value =
        "AB-79, SALT LAKE CITY, SECTOR-I, KOLKATA - 700064";
      worksheet.getCell(`A${currentRow}`).alignment = { horizontal: "center" };
      currentRow++;

      // Company details
      worksheet.getCell(`A${currentRow}`).value = `GSTIN: ${gst || "N/A"}`;
      worksheet.getCell(`E${currentRow}`).value =
        "Email: snigdhaenterprise2015@gmail.com";
      currentRow++;

      worksheet.getCell(`A${currentRow}`).value = "State: West Bengal (19)";
      worksheet.getCell(`E${currentRow}`).value = "Phone: 9073656557";
      currentRow += 2;

      // TAX INVOICE header
      worksheet.mergeCells(`A${currentRow}:J${currentRow}`);
      worksheet.getCell(`A${currentRow}`).value = "TAX INVOICE";
      worksheet.getCell(`A${currentRow}`).font = { bold: true, size: 14 };
      worksheet.getCell(`A${currentRow}`).alignment = { horizontal: "center" };
      worksheet.getCell(`A${currentRow}`).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFE0E0E0" },
      };
      currentRow += 2;

      // Invoice Details
      worksheet.getCell(`A${currentRow}`).value = "Invoice No:";
      worksheet.getCell(`B${currentRow}`).value = invoiceNumber || "N/A";
      currentRow++;

      worksheet.getCell(`A${currentRow}`).value = "Invoice Date:";
      worksheet.getCell(`B${currentRow}`).value =
        new Date(date).toLocaleDateString("en-GB") || "N/A";
      currentRow++;

      worksheet.getCell(`A${currentRow}`).value = "Payment Type:";
      worksheet.getCell(`B${currentRow}`).value = paymenttype || "N/A";
      currentRow++;

      worksheet.getCell(`A${currentRow}`).value = "GSTIN:";
      worksheet.getCell(`B${currentRow}`).value = gst || "N/A";
      currentRow += 2;

      // Shipping Details Headers
      worksheet.getCell(`A${currentRow}`).value = "Shipping Details (Bill to)";
      worksheet.getCell(`A${currentRow}`).font = { bold: true };
      worksheet.getCell(`E${currentRow}`).value = "Shipping Details (Ship to)";
      worksheet.getCell(`E${currentRow}`).font = { bold: true };
      currentRow++;

      // Shipping Details Content
      const shippingRows = [
        [
          "Name:",
          name || "N/A",
          "Name:",
          invoiceData?.receiverDetails?.name || "N/A",
        ],
        [
          "Address:",
          address || "N/A",
          "Address:",
          invoiceData?.receiverDetails?.deliveryAddress || "N/A",
        ],
        ["State:", state || "N/A", "State:", "N/A"],
        [
          "GSTIN:",
          gstNo || "N/A",
          "GSTIN:",
          invoiceData?.receiverDetails?.gstin || "N/A",
        ],
        ["Code:", code || "N/A", "PO Number:", invoiceData?.poNumber || "N/A"],
        [
          "",
          "",
          "PO Date:",
          new Date(invoiceData?.poDate).toLocaleDateString("en-GB") || "N/A",
        ],
      ];

      shippingRows.forEach((row) => {
        worksheet.getCell(`A${currentRow}`).value = row[0];
        worksheet.getCell(`B${currentRow}`).value = row[1];
        worksheet.getCell(`E${currentRow}`).value = row[2];
        worksheet.getCell(`F${currentRow}`).value = row[3];
        currentRow++;
      });

      currentRow += 1;

      // Items Table Header
      const itemsHeaderRow = currentRow;
      const headers = [
        "Sl.No",
        "Item Name",
        "HSN/SAC",
        "Qty",
        "Unit",
        "Ratec",
        "Amount",
        "Tax %",
        "Tax Amount",
        "Total Amount",
      ];
      headers.forEach((header, index) => {
        const cell = worksheet.getCell(itemsHeaderRow, index + 1);
        cell.value = header;
        cell.font = { bold: true };
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFD0D0D0" },
        };
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      });
      currentRow++;

      // Items Data
      invoiceData?.items?.forEach((item, index) => {
        const description = item?.description
          ? item.description.length > 200
            ? item.description.substring(0, 200) + "..."
            : item.description
          : "";

        const itemNameWithDesc =
          item.itemName + (description ? " (" + description + ")" : "");

        const rowData = [
          index + 1,
          itemNameWithDesc,
          item.hsnCode || "-",
          item.quantity || 0,
          item.unit || "Pcs",
          item.sellingPrice || 0,
          item.grossAmount || 0,
          item.taxRate || "0.00",
          item.taxAmount || "0.00",
          item.amount || 0,
        ];

        rowData.forEach((data, colIndex) => {
          const cell = worksheet.getCell(currentRow, colIndex + 1);
          cell.value = data;
          cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
          };
        });
        currentRow++;
      });

      currentRow += 2;

      // HSN Summary Table
      if (invoiceData?.items?.length > 0) {
        // HSN Summary Title
        worksheet.getCell(`A${currentRow}`).value = "HSN Summary:";
        worksheet.getCell(`A${currentRow}`).font = { bold: true, size: 12 };
        currentRow++;

        // Group items by HSN code and tax rate
        const hsnGroups = {};
        let totalTableAmt = 0;
        let totalCgstAmt = 0;
        let totalSgstAmt = 0;
        let totalIgstAmt = 0;

        invoiceData.items.forEach((item) => {
          const hsnCode = item.hsnCode || "-";
          const taxRate = item.taxRate || "0";
          const groupKey = `${hsnCode}_${taxRate}`;

          if (!hsnGroups[groupKey]) {
            hsnGroups[groupKey] = {
              hsnCode: hsnCode,
              tableAmt: 0,
              cgstPercent: item.cgst || 0,
              cgstAmt: 0,
              sgstPercent: item.sgst || 0,
              sgstAmt: 0,
              igstPercent: item.igst || 0,
              igstAmt: 0,
            };
          }

          const grossAmount = parseFloat(item.grossAmount || 0);
          const cgstAmount = (parseFloat(item.cgst || 0) * grossAmount) / 100;
          const sgstAmount = (parseFloat(item.sgst || 0) * grossAmount) / 100;
          const igstAmount = (parseFloat(item.igst || 0) * grossAmount) / 100;

          hsnGroups[groupKey].tableAmt += grossAmount;
          hsnGroups[groupKey].cgstAmt += cgstAmount;
          hsnGroups[groupKey].sgstAmt += sgstAmount;
          hsnGroups[groupKey].igstAmt += igstAmount;

          totalTableAmt += grossAmount;
          totalCgstAmt += cgstAmount;
          totalSgstAmt += sgstAmount;
          totalIgstAmt += igstAmount;
        });

        // HSN table headers based on tax group
        const taxGroup = invoiceData?.taxGroup;
        let hsnHeaders = [];

        if (taxGroup === "State Tax") {
          hsnHeaders = [
            "HSN CODE",
            "TABLE AMT",
            "CGST%",
            "CGST AMT",
            "SGST%",
            "SGST AMT",
            "TOTAL TAX",
          ];
        } else if (taxGroup === "Other Tax") {
          hsnHeaders = ["HSN CODE", "TABLE AMT", "IGST%", "IGST AMT"];
        } else {
          hsnHeaders = [
            "HSN CODE",
            "TABLE AMT",
            "CGST%",
            "CGST AMT",
            "SGST%",
            "SGST AMT",
            "TOTAL TAX",
            "IGST%",
            "IGST AMT",
          ];
        }

        // Add HSN Summary Headers
        hsnHeaders.forEach((header, index) => {
          const cell = worksheet.getCell(currentRow, index + 1);
          cell.value = header;
          cell.font = { bold: true };
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFE0E0E0" },
          };
          cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
          };
        });
        currentRow++;

        // Add HSN Summary Data
        Object.values(hsnGroups).forEach((data) => {
          let rowData = [];

          if (taxGroup === "State Tax") {
            const totalTax =
              parseFloat(data.cgstAmt) + parseFloat(data.sgstAmt);
            rowData = [
              data.hsnCode,
              data.tableAmt.toFixed(2),
              data.cgstPercent,
              data.cgstAmt.toFixed(2),
              data.sgstPercent,
              data.sgstAmt.toFixed(2),
              totalTax.toFixed(2),
            ];
          } else if (taxGroup === "Other Tax") {
            rowData = [
              data.hsnCode,
              data.tableAmt.toFixed(2),
              data.igstPercent,
              data.igstAmt.toFixed(2),
            ];
          } else {
            const totalTax =
              parseFloat(data.cgstAmt) + parseFloat(data.sgstAmt);
            rowData = [
              data.hsnCode,
              data.tableAmt.toFixed(2),
              data.cgstPercent,
              data.cgstAmt.toFixed(2),
              data.sgstPercent,
              data.sgstAmt.toFixed(2),
              totalTax.toFixed(2),
              data.igstPercent,
              data.igstAmt.toFixed(2),
            ];
          }

          rowData.forEach((data, colIndex) => {
            const cell = worksheet.getCell(currentRow, colIndex + 1);
            cell.value = data;
            cell.border = {
              top: { style: "thin" },
              left: { style: "thin" },
              bottom: { style: "thin" },
              right: { style: "thin" },
            };
          });
          currentRow++;
        });

        // Add HSN Summary Total Row
        let totalRowData = [];
        if (taxGroup === "State Tax") {
          const totalTax = totalCgstAmt + totalSgstAmt;
          totalRowData = [
            "Total",
            totalTableAmt.toFixed(2),
            "",
            totalCgstAmt.toFixed(2),
            "",
            totalSgstAmt.toFixed(2),
            totalTax.toFixed(2),
          ];
        } else if (taxGroup === "Other Tax") {
          totalRowData = [
            "Total",
            totalTableAmt.toFixed(2),
            "",
            totalIgstAmt.toFixed(2),
          ];
        } else {
          const totalTax = totalCgstAmt + totalSgstAmt;
          totalRowData = [
            "Total",
            totalTableAmt.toFixed(2),
            "",
            totalCgstAmt.toFixed(2),
            "",
            totalSgstAmt.toFixed(2),
            totalTax.toFixed(2),
            "",
            totalIgstAmt.toFixed(2),
          ];
        }

        totalRowData.forEach((data, colIndex) => {
          const cell = worksheet.getCell(currentRow, colIndex + 1);
          cell.value = data;
          cell.font = { bold: true };
          cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
          };
        });
        currentRow += 2;
      }

      // Amount in Words
      worksheet.mergeCells(`A${currentRow}:J${currentRow}`);
      worksheet.getCell(`A${currentRow}`).value = `${toWords.convert(
        totalPayableAmount || grandTotal
      )} RUPEES ONLY`;
      worksheet.getCell(`A${currentRow}`).font = { bold: true };
      currentRow += 2;

      // Financial Summary
      const summaryData = [];
      if (invoiceData?.discount > 0) {
        summaryData.push(["Discount Amount:", `${invoiceData.discount}/-`]);
      }
      summaryData.push(["Taxable Amount:", `${taxableAmount}/-`]);
      if (parseFloat(transportationCharges) > 0) {
        summaryData.push([
          "Transportation Charges:",
          `${transportationCharges}/-`,
        ]);
      }
      if (parseFloat(taxAmount) > 0) {
        summaryData.push(["Tax Amount:", `${taxAmount}/-`]);
      }
      summaryData.push(["Grand Total:", `${grandTotal}/-`]);
      if (parseFloat(roundOff) > 0) {
        summaryData.push(["Round Off:", `${roundOff}/-`]);
      }
      summaryData.push(["Total Payable Amount:", `${totalPayableAmount}/-`]);

      summaryData.forEach((row) => {
        worksheet.getCell(`H${currentRow}`).value = row[0];
        worksheet.getCell(`H${currentRow}`).font = { bold: true };
        worksheet.getCell(`I${currentRow}`).value = row[1];
        currentRow++;
      });

      currentRow += 2;

      // Add QR Code
      try {
        const qrCodeElement = document.querySelector(
          ".qr-code-container canvas, .qr-code canvas"
        );

        if (qrCodeElement) {
          // Convert canvas to blob
          const canvas = qrCodeElement;
          const dataURL = canvas.toDataURL("image/png");
          const base64Data = dataURL.split(",")[1];

          // Add QR code as image
          const qrImageId = workbook.addImage({
            base64: base64Data,
            extension: "png",
          });

          // Position QR code
          worksheet.addImage(qrImageId, {
            tl: { col: 4, row: currentRow - 8 }, // Top-left position
            ext: { width: 100, height: 100 }, // Size
          });

          // Add QR code label
          worksheet.getCell(`E${currentRow}`).value = "QR Code";
          worksheet.getCell(`E${currentRow}`).font = { bold: true };
        } else {
          worksheet.getCell(`E${currentRow}`).value = "QR Code not available";
          console.warn("QR code element not found");
        }
      } catch (qrError) {
        console.error("Error adding QR code:", qrError);
        worksheet.getCell(`E${currentRow}`).value = "QR Code error";
      }

      currentRow += 2;

      // Bank Details
      if (bankdetails && Object.keys(bankdetails).length > 0) {
        worksheet.getCell(`A${currentRow}`).value = "Bank Details:";
        worksheet.getCell(`A${currentRow}`).font = { bold: true };
        currentRow++;

        worksheet.getCell(`A${currentRow}`).value = "Bank Name:";
        worksheet.getCell(`B${currentRow}`).value =
          bankdetails?.bankName || "sample bank";
        currentRow++;

        worksheet.getCell(`A${currentRow}`).value = "Acc No:";
        worksheet.getCell(`B${currentRow}`).value =
          bankdetails?.accountNumber || "sample Number";
        currentRow++;

        worksheet.getCell(`A${currentRow}`).value = "IFSC Code:";
        worksheet.getCell(`B${currentRow}`).value =
          bankdetails?.ifscCode || "sample Code";
        currentRow++;

        worksheet.getCell(`A${currentRow}`).value = "Branch:";
        worksheet.getCell(`B${currentRow}`).value =
          bankdetails?.branch || "sample Branch";
        currentRow += 2;
      }

      // Signature Section
      worksheet.getCell(`A${currentRow}`).value =
        "Received the Material in Good Condition";
      worksheet.getCell(`H${currentRow}`).value = "For Snigdha Enterprise";
      currentRow += 3;

      worksheet.getCell(`A${currentRow}`).value = "Receiver's Signature & Seal";
      worksheet.getCell(`H${currentRow}`).value = "Authorized Signature";
      currentRow += 2;

      // Footer
      worksheet.mergeCells(`A${currentRow}:J${currentRow}`);
      worksheet.getCell(`A${currentRow}`).value =
        "This is Computer Generated No Need To Signature";
      worksheet.getCell(`A${currentRow}`).alignment = { horizontal: "center" };
      currentRow++;

      worksheet.mergeCells(`A${currentRow}:J${currentRow}`);
      worksheet.getCell(`A${currentRow}`).value = "Thank You!";
      worksheet.getCell(`A${currentRow}`).alignment = { horizontal: "center" };
      worksheet.getCell(`A${currentRow}`).font = { bold: true };

      // Set column widths
      worksheet.columns = [
        { width: 15 }, // A
        { width: 30 }, // B
        { width: 15 }, // C
        { width: 10 }, // D
        { width: 10 }, // E
        { width: 15 }, // F
        { width: 15 }, // G
        { width: 10 }, // H
        { width: 15 }, // I
        { width: 15 }, // J
      ];

      // Generate and download the file
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Invoice_${
        invoiceNumber || invoiceData?.invoiceNumber || "download"
      }.xlsx`;
      link.click();
      window.URL.revokeObjectURL(url);

      console.log(
        "Excel file with QR code and HSN Summary exported successfully"
      );
    } catch (error) {
      console.error("Excel Export Error:", error);
      alert(
        "Error generating Excel file with QR code and HSN Summary. Please try again."
      );
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
                  SNIGDHA ENTERPRISE
                </h1>
                <p className="h-[3px] w-[500px] bg-[#232B77] my-4"></p>
                <p className="text-[16px] text-[#232B77] font-semibold">
                  AB-79, SALT LAKE CITY, SECTOR-I, KOLKATA - 700064
                </p>
                <p className="text-[16px] text-[#232B77] font-semibold">
                  {iso}
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
                      Phone: <span className="text-[#027bd1]">9073656557</span>
                    </p>
                  </div>
                </div>
              </div>
              {/* Invoice Details Section */}
              <div className="bg-blue-50 mt-1 flex justify-center items-center">
                <h2 className=" font-bold text-xl text-[#1F3180]">
                  TAX INVOICE
                </h2>
              </div>
              <div className="flex justify-between mb-4">
                <div>
                  <p className="text-[#232B77] font-semibold text-sm">
                    Invoice No:{" "}
                    <span className="text-[#027bd1]">{invoiceNumber}</span>
                  </p>
                  <p className="text-[#232B77] font-semibold text-sm">
                    Invoice Date:{" "}
                    <span className="text-[#027bd1]">
                      {new Date(date).toLocaleDateString("en-GB")}
                    </span>
                    {/* Invoice Date: <span className="text-[#027bd1]">{date}</span> */}
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
                </div>
              </div>
              <div className="h-[2px] w-full bg-[#232B77]"></div>
              {/* Shipping Details */}
              <div className="flex justify-between my-2">
                <div>
                  <h3 className="font-bold text-xl text-[#232B77] mb-2">
                    Shipping Details (Bill to)
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
                <div>
                  <h3 className="font-bold text-xl text-[#232B77] mb-2">
                    Shipping Details (Ship to)
                  </h3>
                  <p className="text-[#232B77] font-semibold text-sm">
                    Name:{" "}
                    <span className="text-[#027bd1]">
                      {invoiceData?.receiverDetails?.name}
                    </span>
                  </p>
                  <p className="text-[#232B77] font-semibold text-sm">
                    Address:{" "}
                    <span className="text-[#027bd1]">
                      {invoiceData?.receiverDetails?.deliveryAddress || " "}
                    </span>
                  </p>
                  {/* <p className="text-[#232B77] font-semibold text-sm">
              State: <span className="text-[#027bd1]">West Bengal</span>
            </p> */}
                  <p className="text-[#232B77] font-semibold text-sm">
                    GSTIN:{" "}
                    <span className="text-[#027bd1]">
                      {invoiceData?.receiverDetails?.gstin || " "}{" "}
                    </span>
                  </p>

                  <h3 className="font-bold text-xl text-[#232B77] mb-2">
                    PO Informaion
                  </h3>

                  <p className="text-[#232B77] font-semibold text-sm">
                    PO Number :{" "}
                    <span className="text-[#027bd1]">
                      {invoiceData?.poNumber || " "}{" "}
                    </span>
                  </p>

                  <p className="text-[#232B77] font-semibold text-sm">
                    PO Date :{" "}
                    <span className="text-[#027bd1]">
                      {invoiceData?.poDate || " "}{" "}
                    </span>
                  </p>
                </div>
              </div>
            </div>
            {/* Products Table */}
            <div className="bg-blue-50 p-4 rounded-2xl">
              <table className="w-full border-collapse border border-gray-300">
                <thead className="bg-[#027bd1] text-white text-sm">
                  <tr>
                    <th
                      className="border-b border-gray-300 p-2"
                      style={{ width: "25%" }}
                    >
                      Item Name
                    </th>
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
                  {invoiceData?.items?.map((item, index) => (
                    <tr key={index}>
                      <td
                        className="border p-2 text-left"
                        style={{ maxWidth: "200px", wordWrap: "break-word" }}
                      >
                        <div>{item.itemName}</div>
                        {item?.description && (
                          <div className="text-xs mt-1 text-gray-600">
                            ({item.description})
                          </div>
                        )}
                      </td>
                      <td className="border-b border-gray-300 p-2">
                        {item.hsnCode}
                      </td>
                      <td className="border-b border-gray-300 p-2">
                        {item.quantity}
                      </td>
                      <td className="border-b border-gray-300 p-2">
                        {item.unit || item.uom || "pcs"}
                      </td>
                      <td className="border-b border-gray-300 p-2">
                        {item?.sellingPrice}
                      </td>
                      <td className="border-b border-gray-300 p-2">
                        {item.grossAmount}
                      </td>
                      <td className="border-b border-gray-300 p-2">
                        {item.discountRate}
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
                  ))}
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
                        {(() => {
                          // Group items by HSN code and tax rate
                          const hsnGroups = {};

                          invoiceData?.items?.forEach((item) => {
                            const hsnCode = item.hsnCode || "-";
                            const taxRate = item.taxRate || "0";
                            const groupKey = `${hsnCode}_${taxRate}`;

                            if (!hsnGroups[groupKey]) {
                              hsnGroups[groupKey] = {
                                hsnCode: hsnCode,
                                taxRate: taxRate,
                                tableAmt: 0,
                                cgstPercent: item.cgst || 0,
                                cgstAmt: 0,
                                sgstPercent: item.sgst || 0,
                                sgstAmt: 0,
                                igstPercent: item.igst || 0,
                                igstAmt: 0,
                              };
                            }

                            // Sum up amounts for the same HSN code and tax rate
                            const netAmount = parseFloat(item.netAmount || 0);
                            const cgstAmount =
                              (parseFloat(item.cgst || 0) * netAmount) / 100;
                            const sgstAmount =
                              (parseFloat(item.sgst || 0) * netAmount) / 100;
                            const igstAmount =
                              (parseFloat(item.igst || 0) * netAmount) / 100;

                            hsnGroups[groupKey].tableAmt += netAmount;
                            hsnGroups[groupKey].cgstAmt += cgstAmount;
                            hsnGroups[groupKey].sgstAmt += sgstAmount;
                            hsnGroups[groupKey].igstAmt += igstAmount;
                          });

                          // Convert grouped data to array for rendering
                          return Object.values(hsnGroups).map((data, index) => (
                            <tr key={index}>
                              <td className="border-b border-gray-300 p-2">
                                {data.hsnCode}
                              </td>
                              <td className="border-b border-gray-300 p-2">
                                {data.tableAmt.toFixed(2)}
                              </td>
                              <td className="border-b border-gray-300 p-2">
                                {data.cgstPercent}
                              </td>
                              <td className="border-b border-gray-300 p-2">
                                {data.cgstAmt.toFixed(2)}
                              </td>
                              <td className="border-b border-gray-300 p-2">
                                {data.sgstPercent}
                              </td>
                              <td className="border-b border-gray-300 p-2">
                                {data.sgstAmt.toFixed(2)}
                              </td>
                              <td className="border-b border-gray-300 p-2">
                                {data.igstPercent}
                              </td>
                              <td className="border-b border-gray-300 p-2">
                                {data.igstAmt.toFixed(2)}
                              </td>
                            </tr>
                          ));
                        })()}
                      </tbody>
                    </table>
                  </div>
                  <p className="text-blue-900 font-semibold text-[17px] mb-2">
                    {toWords.convert(totalPayableAmount || grandTotal)} RUPEES
                    ONLY
                  </p>
                  <p className="text-blue-900 font-semibold text-sm">
                    Bank Name:{" "}
                    <span className="text-[#027bd1]">
                      {bankdetails?.bankName || "sample bank"}
                    </span>
                  </p>
                  <p className="text-blue-900 font-semibold text-sm">
                    Acc No:{" "}
                    <span className="text-[#027bd1]">
                      {bankdetails?.accountNumber || "sample Number"}
                    </span>
                  </p>
                  <p className="text-blue-900 font-semibold text-sm">
                    IFS Code:{" "}
                    <span className="text-[#027bd1]">
                      {bankdetails?.ifscCode || "sample Code"}
                    </span>
                  </p>
                  <p className="text-blue-900 font-semibold text-sm">
                    Branch:{" "}
                    <span className="text-[#027bd1]">
                      {bankdetails?.branch || "sample Branch"}
                    </span>
                  </p>

                  <div className="text-blue-900 font-semibold text-sm mt-2">
                    <p className="mb-1">Terms & Conditions:</p>
                    {term
                      ?.split(".")
                      .filter((condition) => condition.trim())
                      .map((condition, index) => (
                        <p key={index} className="text-[#027bd1] ml-2 mb-1">
                          {index + 1}. {condition.trim()}
                          {condition.trim() && "."}
                        </p>
                      ))}
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[#232B77] font-semibold text-sm">
                    <p className="pr-[13px]">Gross</p>
                    <p>
                      {invoiceData?.items
                        ?.reduce(
                          (sum, item) =>
                            sum + parseFloat(item.grossAmount || 0),
                          0
                        )
                        .toFixed(2)}
                      /-
                    </p>
                  </div>
                  <div className="flex justify-between text-[#232B77] font-semibold text-sm">
                    <p className="pr-[13px]">Discount</p>
                    <p>
                      -{invoiceData?.discount.toFixed(2)}
                      /-
                    </p>
                  </div>
                  <div className="flex justify-between text-[#232B77] font-semibold text-sm">
                    <p className="pr-[13px]">Taxable</p>
                    <p>
                      {invoiceData?.taxableAmount.toFixed(2)}
                      /-
                    </p>
                  </div>
                  <div className="flex justify-between text-[#232B77] font-semibold text-sm">
                    <p className="pr-[13px]">Tax Amount</p>
                    <p>
                      {invoiceData?.taxAmount}
                      /-
                    </p>
                  </div>

                  <div className="flex gap-20 justify-between text-[#232B77] font-semibold text-sm">
                    <p>Grand Total</p>
                    <p>{invoiceData?.grandTotal.toFixed(2) || 0}/-</p>
                  </div>

                  <div className="flex gap-20 justify-between text-[#232B77] font-semibold text-sm">
                    <p>Transportation Charges</p>
                    <p>{invoiceData.transportationCharges.toFixed(2) || 0}/-</p>
                  </div>

                  <div className="flex gap-20 justify-between text-[#232B77] font-semibold text-sm">
                    <p>Total</p>
                    <p>
                      {Number(invoiceData.grandTotal.toFixed(2) || 0) + 
                        Number(invoiceData.transportationCharges.toFixed(2) || 0)}
                      /-
                    </p>
                  </div>

                  <div className="flex gap-20 justify-between text-[#232B77] font-semibold text-sm">
                    <p>RoundOff</p>
                    <p>{invoiceData.roundOff.toFixed(2) || 0}/-</p>
                  </div>

                  <br />
                  <p className="h-[1px] w-[300px] bg-[#232B77]"></p>
                  <div className="flex gap-20 justify-between text-[#232B77] font-bold text-[16px] mt-2">
                    <p> Total Payable</p>
                    <p>{invoiceData?.totalPayableAmount.toFixed(2) || 0}/-</p>
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

                <div className="w-1/2 mb-10 qr-code-container canvas ">
                  <div className="flex justify-between mb-2">
                    <QrCodeComponent data={invoiceData} />
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-[#232B77] font-semibold text-[16px] mb-16">
                    For Snigdha Enterprise
                  </p>
                  <p className="text-[#232B77] font-semibold text-sm">
                    Authorized Signature
                  </p>
                  {/* <p className="text-[#232B77] font-semibold text-sm">
              (Procurement Manager)
            </p> */}
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
      <div className="text-center mt-14 gap-2 flex items-center justify-center">
        <button
          onClick={handleDownloadPdf}
          className="bg-blue-500 cursor-pointer hover:bg-purple-600 transition-colors text-white px-6 py-2 rounded-lg shadow-md font-medium"
        >
          Download PDF
        </button>
        <button
          onClick={handleExcelExport}
          className="bg-green-500 cursor-pointer hover:bg-yellow-600 transition-colors text-white px-6 py-2 rounded-lg shadow-md font-medium"
        >
          Download excel
        </button>
      </div>
    </div>
  );
};

export default ViewPDF;
