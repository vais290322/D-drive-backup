import { Download as DownloadIcon } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useEffect, useState } from "react";
import { ToWords } from "to-words";
import Logo from "../../../assets/mns.jpg";

export const MNSPurchasePdfDownloadButton = ({ invoiceData }) => {
  const toWords = new ToWords({
    localeCode: "en-IN",
    converterOptions: {
      currency: true,
      ignoreDecimal: false,
      ignoreZeroCurrency: false,
      doNotAddOnly: false,
      currencyOptions: {
        name: "Rupee",
        plural: "Rupees",
        symbol: "₹",
        fractionalUnit: {
          name: "Paisa",
          plural: "Paise",
          symbol: "",
        },
      },
    },
  });

  const [words, setWords] = useState(
    toWords.convert(
      invoiceData?.totalPayableAmount || invoiceData?.grandTotal || 0
    )
  );

  const supplierAddress = "AB-79, SALT LAKE CITY, SECTOR-I, KOLKATA-700064";
  const supplierEmail = "info@mnssecuresolutions.com";
  const supplierPhone = "+91 91477 17001 / 033 4060 2144";
  const gst = "19AAQCM5971R1Z6";
  const state = "West Bengal (19)";
  const iso = import.meta.env.VITE_REACT_ISO;
    const cinNo = "U80100WB2023PTC260127";

  let logoBase64 = null;

  function preloadLogo() {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = Logo;
      img.onload = function () {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        logoBase64 = canvas.toDataURL("image/png");
        resolve();
      };
      img.onerror = () => resolve();
    });
  }

  useEffect(() => {
    preloadLogo();
  }, []);

  function addHeader(pdf) {
    const pageWidth = pdf.internal.pageSize.getWidth();

    // Border for page
    pdf.setDrawColor(0, 0, 0);
    pdf.setLineWidth(0.5);
    pdf.rect(6, 10, 198, 277);

    if (logoBase64) {
      pdf.addImage(logoBase64, "PNG", 20, 15, 28, 12);
    }

    // TAX INVOICE Title
    pdf.setFontSize(18);
    pdf.setTextColor(0, 0, 0);
    pdf.setFont("helvetica", "bold");
    pdf.text("PURCHASE INVOICE", pageWidth / 2, 20, { align: "center" });

    // Underline
    pdf.setDrawColor(0, 0, 0);
    pdf.setLineWidth(0.5);
    pdf.line(65, 22, 145, 22);

    // Company Info Section
    pdf.setFontSize(10);
    pdf.setTextColor(0, 0, 0);
    pdf.setFont("helvetica", "bold");
    pdf.text("MNS Secure Solutions Pvt. Ltd.", 20, 35);
    pdf.setFontSize(8);
    pdf.setFont("helvetica", "normal");
    pdf.text(supplierAddress, 20, 39);
    pdf.text(iso, 20, 43);

    // Add company details (GSTIN, State, Email, Phone)
    pdf.setFontSize(8);
    pdf.setTextColor(0, 0, 0);
    pdf.setFont("helvetica", "bold");
    pdf.text("GSTIN:", 20, 47);
    pdf.text("STATE:", 20, 52);
    pdf.text("CIN NO:", 20, 56);

    pdf.text("Email:", 120, 47);
    pdf.text("Phone:", 120, 52);

    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(50, 50, 50); // Dark gray
    pdf.text(gst, 35, 47);
    pdf.text(state, 35, 52);
    pdf.text(cinNo, 35, 56);

    pdf.text(supplierEmail, 135, 47);
    pdf.text(supplierPhone, 135, 52);

    pdf.setDrawColor(0, 0, 0);
    pdf.setLineWidth(0.5);
    pdf.line(65, 22, 145, 22);

    // Separator line below company details to reserve space for header on all pages
    pdf.setDrawColor(0, 0, 0);
    pdf.setLineWidth(0.5);
    pdf.line(10, 57, 200, 57);
  }

  const handleDownloadPdf = () => {
    // console.log("invoiceData", invoiceData);

    // Ensure logo is loaded before PDF generation
    if (!logoBase64) {
      // Synchronously wait for logo to preload
      // eslint-disable-next-line no-async-promise-executor
      return (async () => {
        await preloadLogo();
        handleDownloadPdf();
      })();
    }

    const pdf = new jsPDF("p", "mm", "a4");

    // Reserve top space across continuation pages
    const headerReservedTop = 62;
    const firstPageStartY = 112;

    // First-page frame and header
    pdf.setDrawColor(0);
    pdf.setLineWidth(0.5);
    pdf.rect(6, 10, 198, 277);
    addHeader(pdf);

    // Vendor Details Section - Left side (only on first page)
    pdf.setFontSize(10);
    pdf.setTextColor(0, 0, 0);
    pdf.setFont("helvetica", "bold");
    pdf.text("VENDOR DETAILS", 20, 65);

    pdf.setFontSize(8);
    pdf.text("Vendor Name:", 20, 72);
    pdf.text("Address:", 20, 77);
    pdf.text("State:", 20, 84);
    pdf.text("Phone:", 20, 89);
    pdf.text("Vendor Code:", 20, 94);
    pdf.text("Location:", 20, 99);
    pdf.text("GSTIN:", 20, 104);

    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(50, 50, 50);
    pdf.text(invoiceData.receiverDetails.name.toUpperCase(), 50, 72);

    const buyerAddress = invoiceData.receiverDetails.address || " ";
    const buyerAddressLines = pdf.splitTextToSize(buyerAddress, 60);
    pdf.text(buyerAddressLines, 50, 77);

    pdf.text(invoiceData.receiverDetails.state || " ", 50, 84);
    pdf.text(invoiceData.receiverDetails.phoneNumber || " ", 50, 89);
    pdf.text(invoiceData.vendorCode || " ", 50, 94);
    pdf.text(invoiceData.location || "", 50, 99);
    pdf.text(invoiceData.receiverDetails.gstin || " ", 50, 104);

    // // Invoice Information - Right side (only on first page)
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(0, 0, 0);
    pdf.text("INVOICE INFORMATION", 120, 65);

    pdf.setFontSize(8);
    pdf.text("Invoice Number:", 120, 72);
    pdf.text("Invoice Date:", 120, 77);
    // pdf.text("PO INFORMATION", 120, 85);
    // pdf.text("PO Number:", 120, 90);
    // pdf.text("PO Date:", 120, 95);

    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(50, 50, 50);
    pdf.text(invoiceData?.invoiceNumber || " ", 160, 72);
    pdf.text(
      new Date(invoiceData?.date).toLocaleDateString("en-GB") || " ",
      160,
      77
    );
    // pdf.text(invoiceData?.poNumber || " ", 160, 90);
    // pdf.text(
    //   new Date(invoiceData?.date).toLocaleDateString("en-GB") || " ",
    //   160,
    //   95
    // );

    // // Separator below header area on first page
    pdf.setDrawColor(0, 0, 0);
    pdf.setLineWidth(0.5);
    pdf.line(10, 108, 200, 108);

    // // One autoTable call that auto-paginates items
    pdf.autoTable({
      startY: firstPageStartY,
      head: [
        [
          "SL No",
          "Description",
          "HSN Code",
          "Qty",
          "Price",
          "Rate",
          ...(invoiceData.taxGroup === "State Tax"
            ? ["CGST %", "SGST %"]
            : invoiceData.taxGroup === "Other Tax"
            ? ["IGST %"]
            : []),
          "Taxable Amount",
          "Tax Amount",
          "Amount",
        ],
      ],
      body: invoiceData.items.map((item, index) => [
        index + 1,
        item.itemName + (item?.description ? ` (${item.description})` : ""),
        item.hsnCode || "-",
        item.quantity,
        item.unitPrice,
        item.taxRate,
        ...(invoiceData.taxGroup === "State Tax"
          ? [item.cgst, item.sgst]
          : invoiceData.taxGroup === "Other Tax"
          ? [item.igst]
          : []),
        item.netAmount,
        item.taxAmount,
        item.amount,
      ]),
      theme: "grid",
      headStyles: {
        fillColor: [50, 50, 50],
        textColor: [255, 255, 255],
        fontSize: 8,
        fontStyle: "bold",
        halign: "center",
      },
      bodyStyles: {
        textColor: [50, 50, 50],
        fontSize: 8,
        halign: "center",
      },
      columnStyles: {
        0: { cellWidth: 10 },
        1: { halign: "left", cellWidth: 50 },
        ...(invoiceData.taxGroup === "State Tax"
          ? { 6: { cellWidth: 15 }, 7: { cellWidth: 15 }, 8: { cellWidth: 15 } }
          : invoiceData.taxGroup === "Other Tax"
          ? { 6: { cellWidth: 15 }, 7: { cellWidth: 15 } }
          : { 6: { cellWidth: 15 } }),
      },
      margin: { top: headerReservedTop, left: 10, right: 10 },
      styles: { overflow: "linebreak", cellPadding: 2 },
      tableWidth: 190,
      didDrawPage: (data) => {
        // Frame + header on every page
        pdf.setDrawColor(0);
        pdf.setLineWidth(0.5);
        pdf.rect(6, 10, 198, 277);
        addHeader(pdf);
        // Footer page number
        pdf.setFontSize(8);
        pdf.text(`Page ${pdf.internal.getNumberOfPages()}`, 105, 290, {
          align: "center",
        });
      },
    });

    // Add summary after table on last page
    let finalY = (pdf.autoTable.previous?.finalY || firstPageStartY) + 10;
    if (finalY > 220) {
      pdf.addPage();
      pdf.setDrawColor(0);
      pdf.setLineWidth(0.5);
      pdf.rect(6, 10, 198, 277);
      addHeader(pdf);
      finalY = headerReservedTop;
    }

    // Add amount in words
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(10);
    pdf.text(`${words.toUpperCase()} `, 15, finalY);
    let currentY = finalY + 6;
    const lineSpacing = 6;

    // Add summary section - Right side (with better spacing)
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(0, 0, 0);

    // Always show Taxable Amount
    pdf.text("Taxable Amount:", 140, currentY);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(50, 50, 50);
    pdf.text(`${invoiceData.taxableAmount.toFixed(2)}/-`, 190, currentY, {
      align: "right",
    });
    currentY += lineSpacing;

    // Total Tax Amount - show only if greater than 0
    const totalTaxAmount =
      invoiceData.items?.reduce((acc, cur) => acc + (cur.taxAmount || 0), 0) ||
      0;
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(0, 0, 0);
    pdf.text("Total Tax Amount:", 140, currentY);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(50, 50, 50);
    pdf.text(`${totalTaxAmount.toFixed(2) || "0.00"}/-`, 190, currentY, {
      align: "right",
    });
    currentY += lineSpacing;

    // Transportation Charges - show only if greater than 0

    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(0, 0, 0);
    pdf.text("Transportation : ", 140, currentY);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(50, 50, 50);
    pdf.text(
      `${invoiceData.transportationCharges || "0.00"}/-`,
      190,
      currentY,
      {
        align: "right",
      }
    );
    currentY += lineSpacing;

    // Discount Amount - show only if greater than 0
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(0, 0, 0);
    pdf.text("Discount Amount:", 140, currentY);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(50, 50, 50);
    pdf.text(`${invoiceData.discount || "0.00"}/-`, 190, currentY, {
      align: "right",
    });
    currentY += lineSpacing;
    // total Amount - show only if greater than 0
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(0, 0, 0);
    pdf.text("Total: ", 140, currentY);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(50, 50, 50);
    pdf.text(`${invoiceData.grandTotal || "0.00"}/-`, 190, currentY, {
      align: "right",
    });
    currentY += lineSpacing;
    // round off Amount - show only if greater than 0
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(0, 0, 0);
    pdf.text("Round Off:", 140, currentY);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(50, 50, 50);
    pdf.text(`${invoiceData.roundOff || "0.00"}/-`, 190, currentY, {
      align: "right",
    });
    currentY += lineSpacing;

    // Add line before grand total
    currentY += 1;
    pdf.setDrawColor(0, 0, 0);
    pdf.setLineWidth(0.5);
    pdf.line(140, currentY, 190, currentY);

    // Grand Total
    currentY += 4;
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(0, 0, 0);
    pdf.text("Payable Amount:", 140, currentY);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(50, 50, 50);
    pdf.text(
      `${
        invoiceData?.totalPayableAmount || invoiceData?.grandTotal?.toFixed(2)
      }/-`,
      190,
      currentY,
      { align: "right" }
    );

    // Add signature section with dynamic spacing
    currentY += 10;
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(9);
    pdf.text("For MNS Secure Solutions Pvt. Ltd.", 185, currentY, {
      align: "right",
    });

    // Add footer with proper spacing
    currentY += 8;
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(9);
    pdf.text(
      "This is Computer Generated Invoice No Signature Required",
      105,
      currentY,
      { align: "center" }
    );

    // Save the PDF
    pdf.save(
      `purchase-invoice-mns-${
        invoiceData?.invoiceNumber || "download"
      }.pdf`
    );
  };

  return (
    <IconButton
      onClick={handleDownloadPdf}
      size="small"
      title="Download Invoice"
    >
      <DownloadIcon
        fontSize="small"
        className="text-green-500 hover:bg-green-50"
      />
    </IconButton>
  );
};