import React, { useState, useEffect } from "react";
import { backendDomainA, backendDomainS } from "../../../Common/index";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { ToWords } from "to-words";

import QrCodeComponent from "../../../component/QRCode/QrCodeComponent";

const ServicePdfPage = ({ serviceinvoiceData }) => {
  const [bankDtails, setBankDtails] = useState([]);
  // console.log("serviceinvoiceData ", serviceinvoiceData);

  const term = import.meta.env.VITE_REACT_TERM;

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
      doc.setDrawColor(0, 0, 0);
      doc.setLineWidth(0.2);
      if (fillColor) {
        doc.setFillColor(fillColor);
        doc.rect(x, y, width, height, "FD");
      } else {
        doc.rect(x, y, width, height);
      }
    };

    // Function to draw header on every page
    const drawHeader = () => {
      // Company Header with border
      drawBox(10, 10, pageWidth - 20, 35, 240);

      // Company name
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.text("SNIGDHA ENTERPRISE", pageWidth / 2, 20, { align: "center" });

      // Certification
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text("An ISO 9001- 2015 Certified company", pageWidth / 2, 26, {
        align: "center",
      });

      // Address
      doc.text("AB-79, SALT LAKE, SEC-I", pageWidth / 2, 32, {
        align: "center",
      });
      doc.text("KOLKATA- 700 064", pageWidth / 2, 38, { align: "center" });

      // GSTIN and Phone in footer of header box
      doc.setFontSize(8);
      doc.text("GSTIN: 19BTFPR0457K2Z7", 12, 50);
      doc.text("STATE: West Bengal (19)", 12, 54);
      doc.text("Phone no: (033) 4060 2144", pageWidth - 75, 50);
      doc.text(
        "e-mail ID : snigdhaenterprise2015@gmail.com",
        pageWidth - 75,
        54
      );
    };

    // Draw header on first page
    drawHeader();

    // Calculate totals FIRST - before using them
    const totalGrossAmount = serviceinvoiceData.items.reduce(
      (acc, curr) => acc + curr.grossAmount,
      0
    );
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

    // Prepare table data FIRST - before using it
    const tableData = serviceinvoiceData.items.map((item, i) => [
      (i + 1).toString(),
      item.description,
      item.hsnCode,
      item.quantity.toString(),
      item.uom,
      Number(item.sellingPrice).toFixed(2),
      Number(item.grossAmount).toFixed(2),
      `${item.cgst || 0}%`,
      (item.grossAmount * (item.cgst / 100) || 0).toFixed(2),
      `${item.sgst || 0}%`,
      (item.grossAmount * (item.sgst / 100) || 0).toFixed(2),
      `${item.igst || 0}%`,
      (item.grossAmount * (item.igst / 100) || 0).toFixed(2),
      item.amount.toFixed(2),
    ]);

    // Add totals row to tableData
    tableData.push([
      "",
      "",
      "",
      "",
      "",
      "Total",
      totalGrossAmount.toFixed(2),
      "",
      cgstTotal.toFixed(2),
      "",
      sgstTotal.toFixed(2),
      "",
      igstTotal.toFixed(2),
      serviceinvoiceData.grandTotal.toFixed(2),
    ]);

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
    const maxAddressWidth = pageWidth / 2 - 25;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    let yPos = 78;

    doc.text(
      `Invoice No: ${serviceinvoiceData.invoiceNumber}`,
      leftBoxX + 6,
      yPos
    );
    yPos += 5;
    doc.text(
      `Invoice Date: ${new Date(serviceinvoiceData.date).toLocaleDateString(
        "en-GB"
      )}`,
      leftBoxX + 6,
      yPos
    );
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

    doc.setFont("helvetica", "bold");
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

    doc.setFont("helvetica", "bold");
    const shippedToAddress = serviceinvoiceData.receiverDetails.deliveryAddress;
    const wrappedShippedAddress = doc.splitTextToSize(
      shippedToAddress,
      maxAddressWidth
    );
    let shipY = yPos;
    doc.text("Details of Consignee Shipped To:", rightBoxX + 2, shipY);
    shipY += 5;

    wrappedShippedAddress.forEach((line, index) => {
      doc.text(line, rightBoxX + 2, shipY);
      shipY += 4;
    });

    // Adjust subsequent content positions based on the wrapped text height
    const maxY = Math.max(yPos, shipY);
    yPos = maxY + 2;

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

    // Create table using autoTable - NOW tableData is defined
    doc.autoTable({
      startY: 148,
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
        fontSize: 5,
        cellPadding: 1,
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
      bodyStyles: {
        textColor: [0, 0, 0],
        fontStyle: "bold",
      },
      columnStyles: {
        0: { cellWidth: 11, halign: "center" },
        1: { cellWidth: 27, halign: "left" },
        2: { cellWidth: 15, halign: "center" },
        3: { cellWidth: 9, halign: "center" },
        4: { cellWidth: 12, halign: "center" },
        5: { cellWidth: 12, halign: "right" },
        6: { cellWidth: 15, halign: "right" },
        7: { cellWidth: 10, halign: "center" },
        8: { cellWidth: 12, halign: "right" },
        9: { cellWidth: 10, halign: "center" },
        10: { cellWidth: 13, halign: "right" },
        11: { cellWidth: 10, halign: "center" },
        12: { cellWidth: 16, halign: "right" },
        13: { cellWidth: 18, halign: "right" },
      },
      margin: { top: 80, left: 10, right: 10 },
      didDrawPage: function (data) {
        // Draw header on every page
        drawHeader();

        // Tax Invoice Title on every page
        drawBox(10, 60, pageWidth - 20, 8, 220);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.text("Tax Invoice", pageWidth / 2, 66, { align: "center" });

        // Page numbering
        const pageCount = doc.internal.getNumberOfPages();
        doc.setFontSize(8);
        doc.text(
          `Page  ${pageCount}`,
          pageWidth - 20,
          doc.internal.pageSize.height - 10
        );
      },
    });

    // Prepare HSN summary data
    const hsnSummary = {};
    serviceinvoiceData.items.forEach((item) => {
      const hsnCode = item.hsnCode || "N/A";
      const cgstPercent = item.cgst || 0;
      const sgstPercent = item.sgst || 0;
      const igstPercent = item.igst || 0;

      const groupKey = `${hsnCode}_${cgstPercent}_${sgstPercent}_${igstPercent}`;

      if (!hsnSummary[groupKey]) {
        hsnSummary[groupKey] = {
          hsnCode: hsnCode,
          taxableValue: 0,
          cgstPercent: cgstPercent,
          sgstPercent: sgstPercent,
          igstPercent: igstPercent,
          cgst: 0,
          sgst: 0,
          igst: 0,
          totalTax: 0,
        };
      }
      const hsnItem = hsnSummary[groupKey];
      hsnItem.taxableValue += item.grossAmount;
      const cgstAmount = (item.grossAmount * cgstPercent) / 100 || 0;
      const sgstAmount = (item.grossAmount * sgstPercent) / 100 || 0;
      const igstAmount = (item.grossAmount * igstPercent) / 100 || 0;
      hsnItem.cgst += cgstAmount;
      hsnItem.sgst += sgstAmount;
      hsnItem.igst += igstAmount;
      hsnItem.totalTax += cgstAmount + sgstAmount + igstAmount;
    });

    const hsnSummaryTableData = Object.values(hsnSummary).map((values) => [
      values.hsnCode,
      values.taxableValue.toFixed(2),
      values.cgstPercent.toString(),
      values.cgst.toFixed(2),
      values.sgstPercent.toString(),
      values.sgst.toFixed(2),
      values.igstPercent.toString(),
      values.igst.toFixed(2),
      values.totalTax.toFixed(2),
    ]);

    if (hsnSummaryTableData.length > 0) {
      const totalHsnTaxableValue = Object.values(hsnSummary).reduce(
        (acc, curr) => acc + curr.taxableValue,
        0
      );
      const totalHsnCgst = Object.values(hsnSummary).reduce(
        (acc, curr) => acc + curr.cgst,
        0
      );
      const totalHsnSgst = Object.values(hsnSummary).reduce(
        (acc, curr) => acc + curr.sgst,
        0
      );
      const totalHsnIgst = Object.values(hsnSummary).reduce(
        (acc, curr) => acc + curr.igst,
        0
      );
      const totalHsnTax = totalHsnCgst + totalHsnSgst + totalHsnIgst;

      hsnSummaryTableData.push([
        "Total",
        totalHsnTaxableValue.toFixed(2),
        "",
        totalHsnCgst.toFixed(2),
        "",
        totalHsnSgst.toFixed(2),
        "",
        totalHsnIgst.toFixed(2),
        totalHsnTax.toFixed(2),
      ]);

      doc.autoTable({
        startY: doc.lastAutoTable.finalY + 2,
        head: [
          [
            "HSN CODE",
            "TABLE AMT",
            "CGST%",
            "CGST AMT",
            "SGST%",
            "SGST AMT",
            "IGST%",
            "IGST AMT",
            "TOTAL TAX",
          ],
        ],
        body: hsnSummaryTableData,
        theme: "grid",
        styles: {
          fontSize: 5,
          cellPadding: 1,
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
        bodyStyles: {
          textColor: [0, 0, 0],
          fontStyle: "bold",
        },
        columnStyles: {
          0: { halign: "center" },
          1: { halign: "right" },
          2: { halign: "center" },
          3: { halign: "right" },
          4: { halign: "center" },
          5: { halign: "right" },
          6: { halign: "center" },
          7: { halign: "right" },
          8: { halign: "right" },
        },
        tableWidth: pageWidth * 0.7, // << set width to 70%
        // margin: { top: 80, left: (pageWidth - pageWidth * 0.7) / 2 }, // center table
        didParseCell: function (data) {
          if (data.row.index === hsnSummaryTableData.length - 1) {
            data.cell.styles.fontStyle = "bold";
          }
        },
        margin: { top: 80, left: 10, right: 10 },
        didDrawPage: function (data) {
          // Draw header on every page for HSN table as well
          drawHeader();

          // Tax Invoice Title on every page
          drawBox(10, 60, pageWidth - 20, 8, 220);
          doc.setFont("helvetica", "bold");
          doc.setFontSize(12);
          doc.text("Tax Invoice", pageWidth / 2, 66, { align: "center" });

          // Page numbering
          const pageCount = doc.internal.getNumberOfPages();
          doc.setFontSize(8);
          doc.text(
            `Page  ${pageCount}`,
            pageWidth - 20,
            doc.internal.pageSize.height - 10
          );
        },
      });
    }

    // ... rest of your footer content (bank details, terms & conditions, etc.) ...
    const TAndCmaxWidth = pageWidth / 2 - 18;

    // Calculate required height for the footer content
    let leftFooterHeight = 0;
    const amountInWords = `Rupees ${toWords.convert(
      serviceinvoiceData?.totalPayableAmount || serviceinvoiceData.grandTotal
    )} Only`;
    const wrappedAmount = doc.splitTextToSize(
      amountInWords,
      pageWidth / 2 - 30
    );
    leftFooterHeight += 8 + wrappedAmount.length * 4; // amount in words
    leftFooterHeight += 20; // bank details (4 lines * 4 + space)
    leftFooterHeight += 10; // T&C header + space

    const terms = term || "";
    const termsSentences = terms.split(".").filter((s) => s.trim());
    termsSentences.forEach((sentence, index) => {
      const wrappedText = doc.splitTextToSize(
        `${index + 1}. ${sentence}.`,
        TAndCmaxWidth
      );
      leftFooterHeight += wrappedText.length * 4;
      if (index < termsSentences.length - 1) {
        leftFooterHeight += 2; // space between conditions
      }
    });

    let rightFooterHeight = 0;
    rightFooterHeight += 8 * 5; // 8 lines of totals, with 5pt spacing
    rightFooterHeight += 8; // 2 underlines
    rightFooterHeight += 30; // QR code + signature space

    const requiredFooterHeight =
      Math.max(leftFooterHeight, rightFooterHeight) + 6; // Add padding

    let footerY = doc.lastAutoTable.finalY + 8;
    if (footerY + requiredFooterHeight > pageHeight - 1) {
      console.log(
        "height : ",
        footerY + requiredFooterHeight,
        pageHeight - 1,
        footerY,
        requiredFooterHeight
      );
      doc.addPage();
      footerY = 15;
    }

    // Draw footer boxes
    drawBox(10, footerY, pageWidth / 2 - 10, requiredFooterHeight);
    drawBox(pageWidth / 2, footerY, pageWidth / 2 - 10, requiredFooterHeight);

    // --- Left footer content ---
    let leftY = footerY + 8;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    wrappedAmount.forEach((line) => {
      doc.text(line, 12, leftY);
      leftY += 4;
    });

    leftY += 4;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.text(
      `Bank name: ${bankDtails[0]?.bankName || "Bank of Baroda"}`,
      12,
      leftY
    );
    leftY += 4;
    doc.text(
      `A/C No: ${bankDtails[0]?.accountNumber || "37250200000354"}`,
      12,
      leftY
    );
    leftY += 4;
    doc.text(
      `IFSC Code: ${bankDtails[0]?.ifscCode || "BARB0STAGAR"}`,
      12,
      leftY
    );
    leftY += 4;
    doc.text(
      `Branch: ${
        bankDtails[0]?.branch ||
        "Garia Station Road, Kolkata Branch, Kolkata- 700 084"
      }`,
      12,
      leftY
    );

    leftY += 8;
    doc.setFont("helvetica", "bold");
    doc.text("Terms & Conditions:", 12, leftY);
    leftY += 6;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    termsSentences.forEach((sentence, index) => {
      const formattedSentence = sentence.trim();
      if (formattedSentence) {
        const wrappedText = doc.splitTextToSize(
          `${index + 1}. ${formattedSentence}.`,
          TAndCmaxWidth
        );
        wrappedText.forEach((line) => {
          doc.text(line, 12, leftY);
          leftY += 4;
        });
        leftY += 2;
      }
    });

    // --- Right footer content ---
    let rightYPos = footerY + 8;
    const rightBoxContentStartX = pageWidth / 2 + 5;
    const rightBoxContentEndX = pageWidth - 15;

    doc.text("Add: CGST:", rightBoxContentStartX, rightYPos);
    doc.text(cgstTotal.toFixed(2), rightBoxContentEndX, rightYPos, {
      align: "right",
    });
    rightYPos += 4;

    doc.text("Add: SGST:", rightBoxContentStartX, rightYPos);
    doc.text(sgstTotal.toFixed(2), rightBoxContentEndX, rightYPos, {
      align: "right",
    });
    rightYPos += 4;

    doc.text("Add: IGST:", rightBoxContentStartX, rightYPos);
    doc.text(igstTotal.toFixed(2), rightBoxContentEndX, rightYPos, {
      align: "right",
    });
    rightYPos += 4;

    doc.setFont("helvetica", "bold");
    doc.text("Total Tax Amount:", rightBoxContentStartX, rightYPos);
    doc.text(totalTaxAmount.toFixed(2), rightBoxContentEndX, rightYPos, {
      align: "right",
    });
    rightYPos += 4;

    doc.setFont("helvetica", "bold");
    doc.text("Transportation Charges:", rightBoxContentStartX, rightYPos);
    doc.text(
      serviceinvoiceData.transportationCharges.toString(),
      rightBoxContentEndX,
      rightYPos,
      { align: "right" }
    );
    rightYPos += 4;

    doc.setFont("helvetica", "bold");
    doc.text("Grand Total:", rightBoxContentStartX, rightYPos);
    doc.text(
      serviceinvoiceData.grandTotal.toFixed(2),
      rightBoxContentEndX,
      rightYPos,
      { align: "right" }
    );
    rightYPos += 4;

    doc.text("Round Off :", rightBoxContentStartX, rightYPos);
    doc.text(
      (serviceinvoiceData?.roundOff || 0).toString(),
      rightBoxContentEndX,
      rightYPos,
      { align: "right" }
    );
    rightYPos += 4;

    doc.line(rightBoxContentStartX, rightYPos, rightBoxContentEndX, rightYPos);
    rightYPos += 4;

    doc.text("Total Payable Amount :", rightBoxContentStartX, rightYPos);
    doc.text(
      (
        serviceinvoiceData?.totalPayableAmount || serviceinvoiceData?.grandTotal
      ).toString(),
      rightBoxContentEndX,
      rightYPos,
      { align: "right" }
    );

    // --- Signature and QR Code Section ---
    const signatureYBase = footerY + requiredFooterHeight;

    function addSignatureSection() {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.text("For SNIGDHA ENTERPRISE", pageWidth - 15, signatureYBase - 22, {
        align: "right",
      });
      doc.text("Authorised Signatory", pageWidth - 15, signatureYBase - 14, {
        align: "right",
      });
    }

    try {
      const qrCodeElement = document.querySelector(
        ".qr-code-container canvas, .qr-code canvas"
      );
      if (qrCodeElement) {
        const qrDataURL = qrCodeElement.toDataURL("image/png");
        const qrSize = 25;
        const qrX = pageWidth / 2 + 10;
        const qrY = signatureYBase - 15 - qrSize; // Place above signature
        doc.addImage(qrDataURL, "PNG", qrX, qrY, qrSize, qrSize);
        addSignatureSection();
      } else {
        console.warn("QR code element not found");
        addSignatureSection();
      }
    } catch (qrError) {
      console.error("Error adding QR code:", qrError);
      addSignatureSection();
    }
    // Save the PDF
    doc.save(`Tax_Invoice_${serviceinvoiceData.invoiceNumber}.pdf`);
  };

  const invoiceData = {
    company: {
      name: "SNIGDHA ENTERPRISE",
      certification: "An ISO 9001- 2015 Certified company",
      address: "AB-79, SALT LAKE, SEC-I",
      city: "KOLKATA- 700 064",
      phone: "Phone no: (033) 4060 2144",
      email: "e-mail ID : snigdhaenterprise2015@gmail.com",
      gstin: "19BTFPR0457K2Z7",
      state: "West Bengal (19)",
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
                  {Number(item.grossAmount * (item.cgst / 100)).toFixed(2) || 0}
                </td>
                <td className="border border-black p-2 text-center">
                  {item.sgst || 0}%
                </td>
                <td className="border border-black p-2 text-right">
                  {Number(item.grossAmount * (item.sgst / 100)).toFixed(2) || 0}
                </td>
                <td className="border border-black p-2 text-center">
                  {item.igst || 0}%
                </td>
                <td className="border border-black p-2 text-right">
                  {Number(item.grossAmount * (item.igst / 100)).toFixed(2) || 0}
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
              <td className="border border-black p-2 text-right" colSpan={5}>
                Total
              </td>
              <td className="border border-black p-2"></td>
              <td className="border border-black p-2 text-right">
                {serviceinvoiceData.items
                  .reduce((acc, curr) => acc + curr.grossAmount, 0)
                  .toFixed(2)}
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

      {/* hsn summary table  */}
      <div className=" mb-4">
        <table className=" text-xs">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2">HSN CODE</th>
              <th className="border border-gray-300 p-2">TABLE AMT</th>
              <th className="border border-gray-300 p-2">CGST%</th>
              <th className="border border-gray-300 p-2">CGST AMT</th>
              <th className="border border-gray-300 p-2">SGST%</th>
              <th className="border border-gray-300 p-2">SGST AMT</th>
              <th className="border border-gray-300 p-2">IGST%</th>
              <th className="border border-gray-300 p-2">IGST AMT</th>
              <th className="border border-gray-300 p-2">TOTAL TAX</th>
            </tr>
          </thead>
          <tbody className="text-[#027bd1] text-center font-semibold">
            {(() => {
              // Group items by HSN code and tax rate
              const hsnGroups = {};
              let totalTableAmt = 0;
              let totalCgstAmt = 0;
              let totalSgstAmt = 0;
              let totalIgstAmt = 0;
              let totalTaxAmt = 0;

              serviceinvoiceData?.items?.forEach((item) => {
                const hsnCode = item.hsnCode || "-";
                const taxRate = item.taxRate || "0";
                const groupKey = `${hsnCode}_${taxRate}`;

                if (!hsnGroups[groupKey]) {
                  hsnGroups[groupKey] = {
                    hsnCode,
                    tableAmt: 0,
                    cgstPercent: item.cgst || 0,
                    cgstAmt: 0,
                    sgstPercent: item.sgst || 0,
                    sgstAmt: 0,
                    igstPercent: item.igst || 0,
                    igstAmt: 0,
                    totalTax: 0,
                  };
                }

                const grossAmount = parseFloat(item.grossAmount || 0);
                const cgstAmount =
                  (parseFloat(item.cgst || 0) * grossAmount) / 100;
                const sgstAmount =
                  (parseFloat(item.sgst || 0) * grossAmount) / 100;
                const igstAmount =
                  (parseFloat(item.igst || 0) * grossAmount) / 100;
                const totalTaxAmount = cgstAmount + sgstAmount + igstAmount;

                hsnGroups[groupKey].tableAmt += grossAmount;
                hsnGroups[groupKey].cgstAmt += cgstAmount;
                hsnGroups[groupKey].sgstAmt += sgstAmount;
                hsnGroups[groupKey].igstAmt += igstAmount;
                hsnGroups[groupKey].totalTax += totalTaxAmount;

                // Update totals
                totalTableAmt += grossAmount;
                totalCgstAmt += cgstAmount;
                totalSgstAmt += sgstAmount;
                totalIgstAmt += igstAmount;
                totalTaxAmt += totalTaxAmount;
              });

              return (
                <>
                  {Object.values(hsnGroups).map((data, index) => (
                    <tr key={index}>
                      <td className="border border-gray-300 p-2">
                        {data.hsnCode}
                      </td>
                      <td className="border border-gray-300 p-2">
                        {data.tableAmt.toFixed(2)}
                      </td>
                      <td className="border border-gray-300 p-2">
                        {data.cgstPercent}
                      </td>
                      <td className="border border-gray-300 p-2">
                        {data.cgstAmt.toFixed(2)}
                      </td>
                      <td className="border border-gray-300 p-2">
                        {data.sgstPercent}
                      </td>
                      <td className="border border-gray-300 p-2">
                        {data.sgstAmt.toFixed(2)}
                      </td>
                      <td className="border border-gray-300 p-2">
                        {data.igstPercent}
                      </td>
                      <td className="border border-gray-300 p-2">
                        {data.igstAmt.toFixed(2)}
                      </td>
                      <td className="border border-gray-300 p-2">
                        {data.totalTax.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                  {/* Total Summary Row */}
                  <tr className="font-bold bg-gray-50">
                    <td className="border border-gray-300 p-2">Total</td>
                    <td className="border border-gray-300 p-2">
                      {totalTableAmt.toFixed(2)}
                    </td>
                    <td className="border border-gray-300 p-2"></td>
                    <td className="border border-gray-300 p-2">
                      {totalCgstAmt.toFixed(2)}
                    </td>
                    <td className="border border-gray-300 p-2"></td>
                    <td className="border border-gray-300 p-2">
                      {totalSgstAmt.toFixed(2)}
                    </td>
                    <td className="border border-gray-300 p-2"></td>
                    <td className="border border-gray-300 p-2">
                      {totalIgstAmt.toFixed(2)}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {totalTaxAmt.toFixed(2)}
                    </td>
                  </tr>
                </>
              );
            })()}
          </tbody>
        </table>
      </div>

      {/* Footer Section */}
      <div className="grid grid-cols-2 border border-black">
        <div className="border-r border-black p-3">
          <p className="text-xs font-semibold mb-2">
            Rupees{" "}
            {toWords.convert(
              serviceinvoiceData?.totalPayableAmount ||
                serviceinvoiceData.grandTotal
            )}{" "}
            Only
          </p>

          <div className="mt-4">
            <p className="text-xs mb-1">Bank name: {bankDtails[0]?.bankName}</p>
            <p className="text-xs mb-1">
              A/C No: {bankDtails[0]?.accountNumber}
            </p>
            <p className="text-xs mb-1">IFSC Code: {bankDtails[0]?.ifscCode}</p>
            <p className="text-xs">Branch: {bankDtails[0]?.branch}</p>
          </div>

          <div className=" font-semibold text-sm mt-2">
            <p className="mb-1">Terms & Conditions:</p>
            {term
              ?.split(".")
              .filter((condition) => condition.trim())
              .map((condition, index) => (
                <p key={index} className=" ml-2 mb-1">
                  {index + 1}. {condition.trim()}
                  {condition.trim() && "."}
                </p>
              ))}
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

            {/* Add this in the JSX part where you want the QR code to appear */}
            <div className="w-1/2 mb-10 qr-code-container canvas qr-code">
              <div className="flex justify-between mb-2">
                <QrCodeComponent data={serviceinvoiceData} />
              </div>
            </div>
          </div>

          <div className="text-right">
            <p className="text-xs mb-2">For SNIGDHA ENTERPRISE</p>
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
          className="bg-blue-600 cursor-pointer hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
        >
          Download PDF
        </button>
      </div>
    </div>
  );
};

export default ServicePdfPage;
