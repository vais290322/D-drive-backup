import axios from "axios";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useEffect, useRef, useState } from "react";
import { ToWords } from "to-words";
import Logo from "../../../assets/mns.jpg";
import QrCodeComponent from "../../../component/QRCode/QrCodeComponent";

const bankUrl = import.meta.env.VITE_BASE_URL_Local;

function MnsProductPdf({ invoiceData }) {
  // const printRef = useRef();
  // console.log(invoiceData);
  // const [invoiceData, setInvoiceData] = useState(null);
  const [fetchedData, setFetchedData] = useState([]);
  const fetchBankDetails = async () => {
    const response = await axios.get(`${bankUrl}/api/v1/bank/all`);
    const bankData = response.data.data;
    // console.log("hi", bankData[0]);
    setFetchedData(bankData[0]);
  };

  useEffect(() => {
    fetchBankDetails();
  }, []);

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
      invoiceData.totalPayableAmount || invoiceData?.grandTotal || 0
    )
  );
  // const amount=999.50
  // const words = numberToWords(amount);
  // console.log(words.toUpperCase());

  // console.log(invoiceData);
  // const componentRef = useRef();
  const poNumber = "N/A";
  const poDate = "N/A";
  const orderNo = "PO/FY24-25/040352";
  const supplierName = "MNS Secure Solutions Pvt. Ltd.";
  const supplierAddress = "AB-79, SALT LAKE CITY, SECTOR-I, KOLKATA-700064";
  const supplierEmail = "info@mnssecuresolutions.com";
  const supplierPhone = "+91 91477 17001 / 033 4060 2144";
  const gst = "19AAQCM5971R1Z6";
  const state = "West Bengal (19)";
  const iso = import.meta.env.VITE_REACT_ISO;
  const terms = import.meta.env.VITE_REACT_MNS_TERM;
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

  const componentRef = useRef(null);

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
    pdf.text("TAX INVOICE", pageWidth / 2, 20, { align: "center" });

    // Underline
    // pdf.setDrawColor(0, 0, 0);
    // pdf.setLineWidth(2);
    // pdf.line(100, 22, 120, 22);

    // Company Info Section
    pdf.setFontSize(10);
    pdf.setTextColor(0, 0, 0);
    pdf.setFont("helvetica", "bold");
    pdf.text("MNS Secure Solutions Pvt. Ltd.", 20, 35);
    pdf.setFontSize(8);
    pdf.setFont("helvetica", "bold");
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

    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(0, 0, 0); // Dark gray
    pdf.text(gst, 35, 47);
    pdf.text(state, 35, 52);
    pdf.text(cinNo, 35, 56);

    pdf.text(supplierEmail, 135, 47);
    pdf.text(supplierPhone, 135, 52);

    pdf.setDrawColor(0, 0, 0);
    pdf.setLineWidth(0.5);
    pdf.line(80, 22, 130, 22);

    // Separator line below company details to reserve space for header on all pages
    pdf.setDrawColor(0, 0, 0);
    pdf.setLineWidth(0.5);
    pdf.line(10, 57, 200, 57);
  }


  const handleDownloadPdf = () => {
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

    // Buyer Details Section - Left side (only on first page)
    pdf.setFontSize(10);
    pdf.setTextColor(0, 0, 0);
    pdf.setFont("helvetica", "bold");
    pdf.text("INVOICE DETAILS", 20, 65);

    pdf.setFontSize(8);
    pdf.text("Buyer Name:", 20, 72);
    pdf.text("Address:", 20, 77);
    // pdf.text("State:", 20, 84);
    pdf.text("Phone:", 20, 89);
    pdf.text("Vendor Code:", 20, 94);
    pdf.text("Location:", 20, 99);
    pdf.text("GSTIN:", 20, 104);

    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(0, 0, 0);
    pdf.text(invoiceData.receiverDetails.name.toUpperCase(), 50, 72);

    const buyerAddress = invoiceData.receiverDetails.address || " ";
    const buyerAddressLines = pdf.splitTextToSize(buyerAddress, 60);
    pdf.text(buyerAddressLines, 50, 77);

    // pdf.text(invoiceData.receiverDetails.state || " ", 50, 84);
    pdf.text(invoiceData.receiverDetails.phoneNumber || " ", 50, 89);
    pdf.text(invoiceData.vendorCode || " ", 50, 94);
    pdf.text(invoiceData.location || "", 50, 99);
    pdf.text(invoiceData.receiverDetails.gstin || " ", 50, 104);

    // Invoice Information - Right side (only on first page)
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(0, 0, 0);
    pdf.text("INVOICE INFORMATION", 120, 65);

    pdf.setFontSize(8);
    pdf.text("Invoice Number:", 120, 72);
    pdf.text("Invoice Date:", 120, 77);
    pdf.text("PO INFORMATION", 120, 85);
    pdf.text("PO Number:", 120, 90);
    pdf.text("PO Date:", 120, 95);
    pdf.text("State:", 120, 100);

    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(0, 0, 0);
    pdf.text(invoiceData?.invoiceNumber || " ", 160, 72);
    pdf.text(
      new Date(invoiceData?.date).toLocaleDateString("en-GB") || " ",
      160,
      77
    );
    pdf.text(invoiceData?.poNumber || " ", 160, 90);
    pdf.text(
      invoiceData?.poDate && new Date(invoiceData?.poDate).toLocaleDateString("en-GB") || " ",
      160,
      95
    );
    pdf.text(invoiceData.receiverDetails.state || " ", 160, 100);

    // Separator below header area on first page
    pdf.setDrawColor(0, 0, 0);
    pdf.setLineWidth(0.5);
    pdf.line(10, 108, 200, 108);

    // One autoTable call that auto-paginates items
    pdf.autoTable({
      startY: firstPageStartY,
      head: [
        [
          "SL No",
          "Description",
          "HSN Code",
          "Qty",
          "Price",
          // "Rate",
          ...(invoiceData.taxGroup === "State Tax"
            ? ["CGST(%)", "SGST(%)"]
            : invoiceData.taxGroup === "Other Tax"
              ? ["IGST(%)"]
              : []),
          "Disc",
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
        item.sellingPrice,
        // item.taxRate,
        ...(invoiceData.taxGroup === "State Tax"
          ? [item.cgst, item.sgst]
          : invoiceData.taxGroup === "Other Tax"
            ? [item.igst]
            : []),
        item.discountAmount,
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
        textColor: [0, 0, 0],
        fontSize: 8,
        halign: "left",
        fontStyle: "bold",
      },
      columnStyles: {
        0: { cellWidth: 8 },
        1: { halign: "left", cellWidth: 40 },
        2: { halign: "left", cellWidth: 15 },
        3: { halign: "left", cellWidth: 12 },
        4: { halign: "left", cellWidth: 18 },
        ...(invoiceData.taxGroup === "State Tax"
          ? { 5: { cellWidth: 12 }, 6: { cellWidth: 12 }, 7: { cellWidth: 16 } }
          : invoiceData.taxGroup === "Other Tax"
            ? { 5: { cellWidth: 16 }, 6: { cellWidth: 16 } }
            : { 5: { cellWidth: 25 } }),
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

    // Add bank details - Left side
    pdf.setFontSize(8);
    pdf.text("Bank Name:", 15, finalY + 10);
    pdf.text("Branch:", 15, finalY + 15);
    pdf.text("Account Number:", 15, finalY + 20);
    pdf.text("Account Holder Name:", 15, finalY + 30);
    pdf.text("IFSC Code:", 15, finalY + 25);
    pdf.text("Terms & Conditions:", 15, finalY + 40);

    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(0, 0, 0);
    pdf.text(
      invoiceData?.bankName || fetchedData?.bankName || "sample bank",
      50,
      finalY + 10
    );
    pdf.text(
      invoiceData?.branch || fetchedData?.branch || "sample branch",
      50,
      finalY + 15
    );
    pdf.text(
      invoiceData?.accountNumber ||
      fetchedData?.accountNumber ||
      "sample account number",
      50,
      finalY + 20
    );
    pdf.text(
      invoiceData?.ifscCode || fetchedData?.ifscCode || "sample ifsc code",
      50,
      finalY + 25
    );

    const maxAccountHolderWidth = 40;
    const accountHolderName =
      invoiceData?.accountHolderName ||
      fetchedData?.accountHolderName ||
      "sample account holder name";
    const accountHolderLines = pdf.splitTextToSize(
      accountHolderName,
      maxAccountHolderWidth
    );
    accountHolderLines.forEach((line, index) => {
      pdf.text(line, 50, finalY + 30 + index * 4);
    });
    finalY += (accountHolderLines.length - 1) * 4;

    const noteText = `1. ALL PAYMENT SHOULD BE MADE BY CROSS CHEQUE DRAWN IN FAVOUR OF MNS SECURE SOLUTIONS PVT LTD.`;
    const noteText2 = `2. DEMAND DARFT/PAY ORDER/CROSSED CHEQUE/NEFT/ RTGS SHOULD BE RELEASED WITH IN A 07 DAYS OF RECEIPT OF THE BILL OR ELSE INTEREST @10% P.A. WOULD BE LEVIED. THIS INTEREST ONCE LEVIED WILL NOT BE WAIVED UNDER ANY CIRCUMSTANCE.`;
    const maxWidth = 100;
    const wrappedText = pdf.splitTextToSize(noteText, maxWidth);
    pdf.text(wrappedText, 15, finalY + 45);
    const wrappedText2 = pdf.splitTextToSize(noteText2, maxWidth);
    pdf.text(wrappedText2, 15, finalY + 45 + wrappedText.length * 5);

    // Try to add QR code
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
            pdf.addImage(qrDataURL, "PNG", 90, finalY + 5, 30, 30);

            // Continue with the rest of the PDF after QR code is added
            addSummaryAndFinalize();
          })
          .catch((err) => {
            console.error("Error capturing QR code with html2canvas:", err);
            // Continue without QR code
            addSummaryAndFinalize();
          });
      } else {
        console.warn("QR code element not found in DOM");
        addSummaryAndFinalize();
      }
    } catch (qrError) {
      console.error("Error adding QR code:", qrError);
      // Continue without QR code
      addSummaryAndFinalize();
    }

    function addSummaryAndFinalize() {
      let currentY = finalY + 6;
      const lineSpacing = 6;

      // Add summary section - Right side (with better spacing)
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(0, 0, 0);

      // Always show Taxable Amount
      pdf.text("Taxable Amount:", 140, currentY);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(0, 0, 0);
      pdf.text(`${invoiceData.taxableAmount}/-`, 190, currentY, {
        align: "right",
      });
      currentY += lineSpacing;

      // Total Tax Amount - show only if greater than 0
      const totalTaxAmount =
        invoiceData.items?.reduce(
          (acc, cur) => acc + (cur.taxAmount || 0),
          0
        ) || 0;
      if (totalTaxAmount > 0) {
        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(0, 0, 0);
        pdf.text("Total Tax Amount:", 140, currentY);
        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(0, 0, 0);
        pdf.text(`${totalTaxAmount.toFixed(2)}/-`, 190, currentY, {
          align: "right",
        });
        currentY += lineSpacing;
      }

      // Transportation Charges - show only if greater than 0
      if (invoiceData.transportationCharges > 0) {
        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(0, 0, 0);
        pdf.text("Transportation Charges:", 140, currentY);
        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(0, 0, 0);
        pdf.text(`${invoiceData.transportationCharges}/-`, 190, currentY, {
          align: "right",
        });
        currentY += lineSpacing;
      }

      // Discount Amount - show only if greater than 0
      if (invoiceData.discount > 0) {
        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(0, 0, 0);
        pdf.text("Discount Amount:", 140, currentY);
        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(0, 0, 0);
        pdf.text(`${invoiceData.discount}/-`, 190, currentY, {
          align: "right",
        });
        currentY += lineSpacing;
      }
      // total - show only if greater than 0
      if (invoiceData.grandTotal > 0) {
        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(0, 0, 0);
        pdf.text("Total:", 140, currentY);
        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(0, 0, 0);
        pdf.text(`${(invoiceData.grandTotal || 0).toFixed(2)}/-`, 190, currentY, {
          align: "right",
        });
        currentY += lineSpacing;
      }
      // round off Amount - show only if greater than 0
      if (invoiceData.roundOff > 0) {
        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(0, 0, 0);
        pdf.text("Round Off:", 140, currentY);
        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(0, 0, 0);
        pdf.text(`${invoiceData.roundOff}/-`, 190, currentY, {
          align: "right",
        });
        currentY += lineSpacing;
      }

      // Add line before grand total
      currentY += 2;
      pdf.setDrawColor(0, 0, 0);
      pdf.setLineWidth(0.5);
      pdf.line(140, currentY, 190, currentY);

      // Grand Total
      currentY += 4;
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(0, 0, 0);
      pdf.text("Payable Amount:", 140, currentY);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(0, 0, 0);
      pdf.text(
        `${(invoiceData?.totalPayableAmount || invoiceData?.grandTotal)?.toFixed(2)
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

      // Add signature line
      currentY += 9;
      pdf.setDrawColor(0, 0, 0);
      pdf.line(140, currentY, 185, currentY);

      // Add signature label
      currentY += 5;
      pdf.setFontSize(8);
      pdf.text("Authorized Signature", 156, currentY);

      // Add footer with proper spacing
      currentY += 12;
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(9);
      pdf.text(
        "This is Computer Generated Invoice No Signature Required",
        105,
        currentY + 3,
        { align: "center" }
      );

      // Save the PDF
      pdf.save(`invoice-mns-${invoiceData?.invoiceNumber || "download"}.pdf`);
    }
  };

  return (
    <>
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
      <div
        className="w-[250mm] h-[297mm] mx-auto bg-white font-poppins"
        style={{
          boxSizing: "border-box",
        }}
      >
        <div className="" ref={componentRef}>
          <div className="p-6">
            {/* Header Section */}
            <div className="text-center mb-4">
              <h1 className="text-[24px] font-bold text-[#232B77]">
                TAX INVOICE
              </h1>
              <div className="h-[2px] w-[350px] bg-[#4250d3] mx-auto mt-4"></div>
            </div>

            {/* Company Info Section */}
            <div className="flex items-center justify-between ">
              <div className="flex flex-col items-start gap-4 w-1/2">
                <img src={Logo} alt="MNS Logo" className="h-12 w-28" />
                <div className="text-sm">
                  <p className="text-[#232B77] font-semibold">
                    GSTIN: <span className="text-[#027bd1]">{gst}</span>
                  </p>
                  <p className="text-[#232B77] font-semibold">
                    STATE: <span className="text-[#027bd1]">{state}</span>
                  </p>
                  <p className="text-[#232B77] font-semibold">
                    <span className="text-[#027bd1]">{iso}</span>
                  </p>
                  <p className="text-[#232B77] font-semibold">
                    CIN NO :  <span className="text-[#027bd1]">{cinNo}</span>
                  </p>
                </div>
              </div>
              <div className="pl-64">
                <h2 className="text-lg font-bold text-[#232B77] mb-2">
                  COMPANY DETAILS:
                </h2>
                <div className="text-sm font-semibold">
                  <p className="text-[#232B77]">
                    Company Name:{" "}
                    <span className="text-[#027bd1]">{supplierName}</span>
                  </p>
                  <p className="text-[#232B77]">
                    Address:{" "}
                    <span className="text-[#027bd1]">{supplierAddress}</span>
                  </p>
                  <p className="text-[#232B77]">
                    Email:{" "}
                    <span className="text-[#027bd1]">{supplierEmail}</span>
                  </p>
                  <p className="text-[#232B77]">
                    Phone:{" "}
                    <span className="text-[#027bd1]">{supplierPhone}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* PO Information */}
            <div className="bg-blue-50 p-4 mt-6 ">
              <div className="flex justify-between mt-2">
                <div className="flex flex-col gap-1">
                  <h1 className="text-lg font-semibold text-[#232B77] pb-2">
                    BUYER DETAILS
                  </h1>
                  <p className="text-[#232B77] font-semibold text-sm">
                    Buyer Name:{" "}
                    <span className="text-[#027bd1]">
                      {invoiceData.receiverDetails.name.toUpperCase()}
                    </span>
                  </p>
                  <p className="text-[#232B77] font-semibold text-sm">
                    Address:{" "}
                    <span className="text-[#027bd1]">
                      {invoiceData.receiverDetails.address}
                    </span>
                  </p>
                  <p className="text-[#232B77] font-semibold text-sm">
                    State:{" "}
                    <span className="text-[#027bd1]">
                      {invoiceData.receiverDetails.state}
                    </span>
                  </p>
                  <p className="text-[#232B77] font-semibold text-sm">
                    Phone:{" "}
                    <span className="text-[#027bd1]">
                      {invoiceData.receiverDetails.phoneNumber}
                    </span>
                  </p>

                  <p className="text-[#232B77] font-semibold text-sm">
                    Vendor Code:{" "}
                    <span className="text-[#027bd1]">
                      {invoiceData?.vendorCode || " "}
                    </span>
                  </p>
                  <p className="text-[#232B77] font-semibold text-sm">
                    Location :{" "}
                    <span className="text-[#027bd1]">
                      {invoiceData?.location || " "}
                    </span>
                  </p>
                  <p className="text-[#232B77] font-semibold text-sm">
                    GSTIN:{" "}
                    <span className="text-[#027bd1]">
                      {invoiceData.receiverDetails?.gstin || " "}
                    </span>
                  </p>
                </div>
                <div className="flex flex-col gap-1">
                  <h1 className="text-lg font-semibold text-[#232B77] pb-2">
                    INVOICE INFORMATION
                  </h1>
                  <p className="text-[#232B77] font-semibold text-sm">
                    INVOICE Number:{" "}
                    <span className="text-[#027bd1]">
                      {invoiceData?.invoiceNumber}
                    </span>
                  </p>
                  <p className="text-[#232B77] font-semibold text-sm">
                    INVOICE Date:{" "}
                    <span className="text-[#027bd1]">
                      {new Date(invoiceData?.date).toLocaleDateString("en-GB")}
                    </span>
                  </p>
                  <h1 className="text-lg font-semibold text-[#232B77] pb-1">
                    PO INFORMATION
                  </h1>
                  <p className="text-[#232B77] font-semibold text-sm">
                    Po Number:{" "}
                    <span className="text-[#027bd1]">
                      {invoiceData?.poNumber}
                    </span>
                  </p>
                  <p className="text-[#232B77] font-semibold text-sm">
                    Po Date:{" "}
                    <span className="text-[#027bd1]">
                      {" "}
                      {invoiceData?.poDate && new Date(invoiceData?.poDate).toLocaleDateString(
                        "en-GB"
                      )}{" "}
                    </span>
                  </p>
                </div>
              </div>

              {/* Products Table */}
              <div className="mt-6">
                <table className="w-full border-collapse border border-gray-300">
                  <thead className="bg-[#027bd1] text-white text-sm">
                    <tr>
                      <th className="border p-2">SL No</th>
                      <th className="border p-2" style={{ width: "25%" }}>
                        Description
                      </th>
                      <th className="border p-2">HSN Code</th>
                      <th className="border p-2">Qty</th>
                      <th className="border p-2">Price</th>
                      {/* <th className="border p-2">Rate</th> */}

                      {invoiceData.taxGroup === "State Tax" ? (
                        <>
                          <th className="border p-2">CGST(%)</th>
                          <th className="border p-2">SGST (%)</th>
                        </>
                      ) : invoiceData.taxGroup === "Other Tax" ? (
                        <>
                          <th className="border p-2">IGST (%)</th>
                        </>
                      ) : invoiceData.taxGroup === "No Tax" ? (
                        <></>
                      ) : null}
                      <th className="border p-2">Taxable Amount</th>
                      <th className="border p-2">Tax Amount</th>
                      <th className="border p-2">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="text-[#027bd1] text-center text-sm">
                    {invoiceData &&
                      invoiceData?.items?.map((e, i) => {
                        return (
                          <>
                            <tr key={i}>
                              <td className="border p-2">{i + 1}</td>
                              <td
                                className="border p-2 text-left"
                                style={{
                                  maxWidth: "200px",
                                  wordWrap: "break-word",
                                }}
                              >
                                <div>{e.itemName}</div>
                                {e?.description && (
                                  <div className="text-xs mt-1 text-gray-600">
                                    ({e.description})
                                  </div>
                                )}
                              </td>
                              <td className="border p-2">{e.hsnCode}</td>
                              <td className="border p-2">{e.quantity}</td>
                              <td className="border p-2">{e.sellingPrice}</td>
                              {/* <td className="border p-2">{e.taxRate}</td> */}

                              {invoiceData.taxGroup === "State Tax" ? (
                                <>
                                  <td className="border p-2">{e.cgst}</td>
                                  <td className="border p-2">{e.sgst}</td>
                                </>
                              ) : invoiceData.taxGroup === "Other Tax" ? (
                                <>
                                  <td className="border p-2">{e.igst}</td>
                                </>
                              ) : invoiceData.taxGroup === "No Tax" ? (
                                <></>
                              ) : null}
                              <td className="border p-2">{e.netAmount}</td>
                              <td className="border p-2">{e.taxAmount}</td>

                              <td className="border p-2">{e.amount}</td>
                            </tr>
                          </>
                        );
                      })}
                  </tbody>
                </table>
              </div>

              {/* Summary Section */}
              <div className="flex justify-between mt-6">
                <div className="w-1/2">
                  <p className="text-[#232B77] font-semibold mb-4">
                    {words.toUpperCase()}
                  </p>
                  <div className="text-sm">
                    <p className="text-[#232B77]">
                      Bank Name:{" "}
                      <span className="text-[#027bd1]">
                        {invoiceData?.bankName ||
                          fetchedData?.bankName ||
                          "sample bank"}
                      </span>
                    </p>
                    <p className="text-[#232B77]">
                      Branch:{" "}
                      <span className="text-[#027bd1]">
                        {invoiceData?.branch ||
                          fetchedData?.branch ||
                          "sample branch"}
                      </span>
                    </p>
                    <p className="text-[#232B77]">
                      Account Number:{" "}
                      <span className="text-[#027bd1]">
                        {invoiceData?.accountNumber ||
                          fetchedData?.accountNumber ||
                          "sample account number"}
                      </span>
                    </p>
                    <p className="text-[#232B77]">
                      Account Holder Name:{" "}
                      <span className="text-[#027bd1]">
                        {invoiceData?.accountHolderName ||
                          fetchedData?.accountHolderName ||
                          "sample account holder name"}
                      </span>
                    </p>
                    <p className="text-[#232B77]">
                      IFSC Code:{" "}
                      <span className="text-[#027bd1]">
                        {invoiceData?.ifscCode ||
                          fetchedData?.ifscCode ||
                          "sample ifsc code"}
                      </span>
                    </p>
                  </div>
                </div>

                {/* <div className="w-1/2 qr-code-container canvas ">
                  <div className="flex justify-between mb-2">
                    <QrCodeComponent data={invoiceData} />
                  </div>
                </div> */}

                <div className="w-1/3 text-sm font-semibold">
                  <div className="flex justify-between  ">
                    <p className="text-[#232B77]">Gross Amount</p>
                    <p className="text-[#027bd1]">
                      {invoiceData.items
                        .reduce(
                          (sum, item) =>
                            sum + parseFloat(item.grossAmount || 0),
                          0
                        )
                        .toFixed(2)}
                      /-
                    </p>
                  </div>

                  <div className="flex justify-between  ">
                    <p className="text-[#232B77]">Discount</p>
                    <p className="text-[#027bd1]">
                      {invoiceData.discount.toFixed(2)}/-
                    </p>
                  </div>

                  <div className="flex justify-between  ">
                    <p className="text-[#232B77]">Taxable</p>
                    <p className="text-[#027bd1]">
                      {invoiceData.taxableAmount.toFixed(2)}/-
                    </p>
                  </div>

                  {/* <div className="flex justify-between">
                    <p className="text-[#232B77]">Tax Rate</p>
                    <p className="text-[#027bd1]">
                      {invoiceData.items?.reduce(
                        (acc, cur) => acc + cur.taxRate,
                        0
                      )}
                      %
                    </p>
                  </div> */}

                  {/* <div className="flex justify-between">
                    <p className="text-[#232B77]">SGST</p>
                    <p className="text-[#027bd1]">
                      {invoiceData.items[0]?.sgst || 0}%
                    </p>
                  </div> */}
                  {/* <div className="flex justify-between">
                    <p className="text-[#232B77]">IGST</p>
                    <p className="text-[#027bd1]">
                      {invoiceData.items[0]?.igst || 0}%
                    </p>
                  </div> */}

                  <div className="flex justify-between">
                    <p className="text-[#232B77]">Tax</p>
                    <p className="text-[#027bd1]">
                      {invoiceData.taxAmount.toFixed(2)}
                      /-
                    </p>
                  </div>

                  <div className="flex justify-between">
                    <p className="text-[#232B77]">Grand Total</p>
                    <p className="text-[#027bd1]">
                      {invoiceData.grandTotal.toFixed(2)}
                      /-
                    </p>
                  </div>

                  {invoiceData.transportationCharges > 0 && (
                    <div className="flex justify-between">
                      <p className="text-[#232B77]">Transportain Charges</p>
                      <p className="text-[#027bd1]">
                        {Number(invoiceData.transportationCharges).toFixed(2) ||
                          0}
                        /-
                      </p>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <p className="text-[#232B77]">Total</p>
                    <p className="text-[#027bd1]">
                      {(invoiceData.grandTotal + Number(invoiceData.transportationCharges)).toFixed(2)}
                      /-
                    </p>
                  </div>
                  {invoiceData.roundOff > 0 && (
                    <div className="flex justify-between">
                      <p className="text-[#232B77]">Round off</p>
                      <p className="text-[#027bd1]">
                        {invoiceData?.roundOff?.toFixed(2)}/-
                      </p>
                    </div>
                  )}
                  <div className="h-[1px] w-full bg-[#232B77] my-2"></div>
                  <div className="flex justify-between">
                    <p className="text-[#232B77]">Payable Amount</p>
                    <p className="text-[#027bd1]">
                      {invoiceData?.totalPayableAmount > 0
                        ? invoiceData?.totalPayableAmount?.toFixed(2)
                        : invoiceData?.grandTotal?.toFixed(2)}/-
                    </p>
                  </div>
                </div>
              </div>

              {/* Signature Section */}
              <div className="flex items-end justify-end mt-2">
                <div>
                  <p className="text-[#232B77] font-semibold ">
                    For MNS Secure Solutions Pvt. Ltd.
                  </p>
                  {/* <div className="h-[1px] w-[200px] bg-[#232B77]"></div> */}
                  <p className="text-[#232B77] text-sm mt-10 ml-10">
                    Authorized Signature
                  </p>
                </div>
              </div>

              <div className="text-center mt-6 text-sm text-[#232B77]">
                <p>This is Computer Generated Invoice No Signature Required</p>
              </div>
            </div>
          </div>
        </div>
        <div className="text-center mt-4">
          <button
            onClick={handleDownloadPdf}
            className="bg-blue-500 hover:bg-blue-600 mb-4 transition-colors cursor-pointer text-white px-6 py-2 rounded-lg shadow-md font-medium"
          >
            Download PDF
          </button>
        </div>
      </div>
    </>
  );
}

export default MnsProductPdf;
