import axios from "axios";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useEffect, useRef, useState } from "react";
import { ToWords } from "to-words";
import Logo from "../../../assets/mns.jpg";
import QrCodeComponent from "../../../component/QRCode/QrCodeComponent";


const bankUrl = import.meta.env.VITE_BASE_URL_Local;

const ViewPDF = ({ invoiceData }) => {
  // console.log("charges in promofa invoice : ", invoiceData);
  const [bank, setBank] = useState("");


  // const toWords = new ToWords();

  const fetchBank = async () => {
    try {
      const response = await axios.get(`${bankUrl}/api/v1/bank/all`);
      if (response.data.success) {
        setBank(response.data.data[0]);
      }
    } catch (error) {
      console.error("Error fetching bank data:", error);
    }
  };

  useEffect(() => {
    fetchBank();
  });

  // Invoice data destructuring
  const invoiceNumber = invoiceData.invoiceNumber;
  const date = invoiceData.date;
  const paymenttype = invoiceData.paymentType;
  const name = invoiceData.receiverDetails.name;
  const address = invoiceData.receiverDetails.address;
  const gstNo = invoiceData.receiverDetails.gstin;
  const code = invoiceData.receiverDetails.vendorCode || " ";
  const transportaionCharges = invoiceData.transportationCharges;
  const grandTotal = Math.floor(invoiceData.grandTotal);
  const totalPayableAmount = invoiceData.totalPayableAmount;
  const roundOff = invoiceData.roundOff || 0;
  const cinNo = "U80100WB2023PTC260127";

  const term = import.meta.env.VITE_REACT_MNS_TERM;

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

  const supplierName = "MNS Secure Solutions Pvt. Ltd.";
  const supplierAddress = "AB-79, SALT LAKE CITY, SECTOR-I, KOLKATA-700064";
  const supplierEmail = "info@mnssecuresolutions.com";
  const supplierPhone = "+91 91477 17001 / 033 4060 2144";
  const gst = "19AAQCM5971R1Z6";
  const state = "West Bengal (19)";
  const iso = import.meta.env.VITE_REACT_ISO;

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
    pdf.text("PROFORMA INVOICE", pageWidth / 2, 20, { align: "center" });

    // Underline
    // pdf.setDrawColor(0, 0, 0);
    // pdf.setLineWidth(0.5);
    // pdf.line(65, 22, 145, 22);

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
    pdf.setTextColor(0, 0, 0); // black
    pdf.text(gst, 35, 47);
    pdf.text(state, 35, 52);
    pdf.text(cinNo, 35, 56);

    pdf.text(supplierEmail, 135, 47);
    pdf.text(supplierPhone, 135, 52);

    pdf.setDrawColor(0, 0, 0);
    pdf.setLineWidth(0.5);
    pdf.line(72, 22, 138, 22);

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
    pdf.text("State:", 20, 84);
    pdf.text("Phone:", 20, 89);
    pdf.text("Vendor Code:", 20, 94);
    pdf.text("Location:", 20, 99);
    pdf.text("GSTIN:", 20, 104);

    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(0, 0, 0); // black
    pdf.text(invoiceData.receiverDetails.name.toUpperCase(), 50, 72);

    const buyerAddress = invoiceData.receiverDetails.address || " ";
    const buyerAddressLines = pdf.splitTextToSize(buyerAddress, 60);
    pdf.text(buyerAddressLines, 50, 77);

    pdf.text(invoiceData.receiverDetails.state || " ", 50, 84);
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
      new Date(invoiceData?.poDate).toLocaleDateString("en-GB") || " ",
      160,
      95
    );

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
          ? [item.igst || item.taxRate]
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
        fontSize: 6,
        fontStyle: "bold",
        halign: "center",
      },
      bodyStyles: {
        textColor: [0, 0, 0],
        fontSize: 6,
        halign: "left",
        fontStyle:"bold",
      },
      columnStyles: {
        0: { cellWidth: 10 },
        1: { halign: "left", cellWidth: 40 },
        2: { halign: "left", cellWidth: 12 },
        3: { halign: "left", cellWidth: 10 },
        4: { halign: "left", cellWidth: 16 },
        ...(invoiceData.taxGroup === "State Tax"
          ? { 5: {halign:"left" ,cellWidth: 10 }, 6: {halign:"left" ,cellWidth: 10 }, 7: {halign:"left", cellWidth: 16 } }
          : invoiceData.taxGroup === "Other Tax"
          ? { 5: {halign:"left" ,cellWidth: 12 }, 6: {halign:"left" ,cellWidth: 16 },  }
          : { 5: {halign:"left" ,cellWidth: 10 } }),
          8: {halign:"left" ,cellWidth: 20 },
          9: {halign:"left" ,cellWidth: 20 },
          10: {halign:"left" ,cellWidth: 20 },
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

    pdf.setDrawColor(0, 0, 0);
    pdf.setLineWidth(0.5);
    pdf.line(10, 108, 200, 108);

   

    // HSN/Tax summary table (starts after items table)
    // const hsnStartY = (pdf.autoTable.previous?.finalY || firstPageStartY) + 10;
    // pdf.autoTable({
    //   startY: Math.max(hsnStartY, headerReservedTop),
    //   head: [
    //     [
    //       "HSN Code",
    //       "TABLE AMOUNT",
    //       "CGST %",
    //       "CGST AMOUNT",
    //       "SGST %",
    //       "SGST AMOUNT",
    //       "IGST %",
    //       "IGST AMOUNT",
    //     ],
    //   ],
    //   body: invoiceData.items.map((item) => [
    //     item.hsnCode || "-",
    //     item.grossAmount ?? item.tableAmount ?? 0,
    //     item.cgst ?? 0,
    //     ((item.cgst ?? 0) * (item.grossAmount ?? 0)) / 100,
    //     item.sgst ?? 0,
    //     ((item.sgst ?? 0) * (item.grossAmount ?? 0)) / 100,
    //     item.igst ?? 0,
    //     ((item.igst ?? 0) * (item.grossAmount ?? 0)) / 100,
    //   ]),
    //   theme: "grid",
    //   headStyles: {
    //     fillColor: [50, 50, 50],
    //     textColor: [255, 255, 255],
    //     fontSize: 8,
    //     fontStyle: "bold",
    //     halign: "center",
    //   },
    //   bodyStyles: {
    //     textColor: [50, 50, 50],
    //     fontSize: 8,
    //     halign: "center",
    //   },
    //   margin: { top: headerReservedTop, left: 10, right: 30 },
    //   styles: { overflow: "linebreak", cellPadding: 2 },
    //   tableWidth: 120,
    //   didDrawPage: (data) => {
    //     pdf.setDrawColor(0);
    //     pdf.setLineWidth(0.5);
    //     pdf.rect(6, 10, 198, 277);
    //     addHeader(pdf);
    //     pdf.setFontSize(8);
    //     pdf.text(`Page ${pdf.internal.getNumberOfPages()}`, 105, 290, {
    //       align: "center",
    //     });
    //   },
    // });

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
      invoiceData?.bankName || bank?.bankName || "sample bank",
      50,
      finalY + 10
    );
    pdf.text(
      invoiceData?.branch || bank?.branch || "sample branch",
      50,
      finalY + 15
    );
    pdf.text(
      invoiceData?.accountNumber ||
        bank?.accountNumber ||
        "sample account number",
      50,
      finalY + 20
    );
    pdf.text(
      invoiceData?.ifscCode || bank?.ifscCode || "sample ifsc code",
      50,
      finalY + 25
    );

    const maxAccountHolderWidth = 40;
    const accountHolderName =
      invoiceData?.accountHolderName ||
      bank?.accountHolderName ||
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

    try {
      const qrCodeElement = document.querySelector(
        ".qr-code, .qr-code-container, .qr-code canvas, .qr-code-container canvas"
      );

      if (qrCodeElement) {
        html2canvas(qrCodeElement, {
          backgroundColor: null,
          scale: 3,
          useCORS: true,
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
      pdf.text(`${invoiceData.taxableAmount.toFixed(2)}/-`, 190, currentY, {
        align: "right",
      });
      currentY += lineSpacing;

      // Total Tax Amount - show only if greater than 0
      const totalTaxAmount =
        invoiceData.items?.reduce(
          (acc, cur) => acc + (cur.taxAmount || 0),
          0
        ) || 0;
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(0, 0, 0);
      pdf.text("Total Tax Amount:", 140, currentY);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(0, 0, 0);
      pdf.text(`${totalTaxAmount.toFixed(2) || "0.00"}/-`, 190, currentY, {
        align: "right",
      });
      currentY += lineSpacing;

      // Transportation Charges - show only if greater than 0

      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(0, 0, 0);
      pdf.text("Transportation Charges:", 140, currentY);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(0, 0, 0);
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
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(0, 0, 0);
      pdf.text(`${invoiceData.discount || "0.00"}/-`, 190, currentY, {
        align: "right",
      });
      currentY += lineSpacing;

      // total - show only if greater than 0
      if (invoiceData.roundOff > 0) {
        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(0, 0, 0);
        pdf.text("Total:", 140, currentY);
        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(0, 0, 0);
        pdf.text(`${invoiceData.grandTotal}/-`, 190, currentY, {
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
      currentY += 4;
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

      // Add signature line
      currentY += 9;
      pdf.setDrawColor(0, 0, 0);
      pdf.line(140, currentY, 185, currentY);

      // Add signature label
      currentY += 5;
      pdf.setFontSize(8);
      pdf.text("Authorized Signature", 156, currentY);

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
        `product-proforma-invoice-mns-${
          invoiceData?.invoiceNumber || "download"
        }.pdf`
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
        className="w-[210mm] h-[300mm] mx-auto bg-white print:w-full print:h-full"
        ref={componentRef}
        style={{ boxSizing: "border-box" }}
      >
        <div className="">
          <div className="">
            {/* Header Section */}
            <div className="px-2 flex flex-col gap-1">
              <div className="flex flex-col items-center justify-center">
                <h1 className="text-[40px] font-bold text-[#232B77]">
                  MNS SECURE SOLUTIONS PVT. LTD.
                </h1>
                <p className="h-[3px] w-[700px] bg-[#232B77] my-4"></p>
                <p className="text-[16px] text-[#232B77] font-semibold">
                  AB-79, SALT LAKE CITY, SECTOR-I, KOLKATA-700064,
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
                    <p className="text-[#232B77] font-semibold text-sm">
                      CIN NO:{" "}
                      <span className="text-[#027bd1]">{cinNo}</span>
                    </p>
                  </div>
                  <div className="text-left">
                    <p className="text-[#232B77] font-semibold text-sm">
                      Email:{" "}
                      <span className="text-[#027bd1]">
                        info@mnssecuresolutions.com
                      </span>
                    </p>
                    <p className="text-blue-800 font-semibold text-sm">
                      Phone:{" "}
                      <span className="text-[#027bd1]"> +91 9614544973</span>
                    </p>
                  </div>
                </div>
              </div>
              {/* Invoice Details Section */}
              <div className="bg-blue-50 mt-1 flex justify-center items-center">
                <h2 className=" font-bold text-xl text-[#1F3180]">
                  PROFORMA INVOICE
                </h2>
              </div>

              <div className="flex justify-between mb-2">
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
              <div className="flex justify-between my-1">
                {/* <div className="flex  justify-between bg-red-400"> */}
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
                </div>
                <div>
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
                {/* </div> */}

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
                            {item.unit}
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
                      </>
                    );
                  })}
                </tbody>
              </table>
              <div className="flex gap-2 mb-2">
                <div className="flex flex-col">
                  <div className="flex mt-2">
                    {/* <table className="border-collapse border text-[10px] border-gray-300 mb-4">
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
                    </table> */}
                  </div>
                  <p className="text-blue-900 font-semibold text-[17px] mb-2">
                    {toWords.convert(totalPayableAmount || grandTotal)} Rupees
                    Only
                  </p>
                  <p className="text-blue-900 font-semibold text-sm">
                    Bank Name:
                    <span className="text-[#027bd1]">
                      {invoiceData?.bankName || bank?.bankName || ""}
                    </span>
                  </p>
                  <p className="text-blue-900 font-semibold text-sm">
                    Acc No:{" "}
                    <span className="text-[#027bd1]">
                      {invoiceData?.accountNumber || bank?.accountNumber || ""}
                    </span>
                  </p>
                  <p className="text-blue-900 font-semibold text-sm">
                    IFSC Code:{" "}
                    <span className="text-[#027bd1]">
                      {invoiceData?.ifscCode || bank?.ifscCode || ""}
                    </span>
                  </p>
                  <p className="text-blue-900 font-semibold text-sm">
                    Branch:{" "}
                    <span className="text-[#027bd1]">
                      {invoiceData?.branch || bank?.branch || ""}
                    </span>
                  </p>
                  <p className="text-blue-900 font-semibold text-sm">
                    Account Holder:{" "}
                    <span className="text-[#027bd1]">
                      {invoiceData?.accountHolderName || bank?.accountHolderName || ""}
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
                  <div className="flex gap-20 text-[#232B77] font-semibold text-sm">
                    <p className="pr-[13px]">Total Amount</p>
                    <p>
                      {invoiceData.items?.reduce(
                        (acc, cur) => acc + cur.grossAmount,
                        0
                      )}
                      /-
                    </p>
                  </div>
                  {invoiceData?.discount > 0 && (
                    <div className="flex gap-20 justify-between text-[#232B77] font-semibold text-sm">
                      <p>Discount Amount</p>
                      <p>{invoiceData.discount.toFixed(2)}/-</p>
                    </div>
                  )}

                  {invoiceData?.transportationCharges > 0 && (
                    <div className="flex gap-20 justify-between text-[#232B77] font-semibold text-sm">
                      <p>Transportation Charges</p>
                      <p>
                        {invoiceData?.transportationCharges.toFixed(2) || 0}/-
                      </p>
                    </div>
                  )}

                  <div className="flex gap-20 justify-between text-[#232B77] font-semibold text-sm">
                    <p>Taxable Amount</p>
                    <p>
                      {parseFloat(invoiceData.items?.reduce(
                        (acc, cur) => acc + cur.taxAmount,
                        0
                      )).toFixed(2)}
                      /-
                    </p>
                  </div>
                  {invoiceData?.taxGroup === "State Tax" ? (
                    <>
                      <div className="flex gap-20 justify-between text-[#232B77] font-semibold text-sm">
                        <p>CGST</p>
                        <p>
                          {parseFloat(invoiceData.items?.reduce(
                            (acc, cur) =>
                              acc +
                              (cur.cgst * cur.grossAmount.toFixed(2)) / 100,
                            0
                          )).toFixed(2)}
                          /-
                        </p>
                      </div>
                      <div className="flex gap-20 justify-between text-[#232B77] font-semibold text-sm">
                        <p>SGST</p>
                        <p>
                          {parseFloat(invoiceData.items?.reduce(
                            (acc, cur) =>
                              acc +
                              (cur.sgst * cur.grossAmount.toFixed(2)) / 100,
                            0
                          )).toFixed(2)}
                          /-
                        </p>
                      </div>
                    </>
                  ) : (
                    <div className="flex gap-20 justify-between text-[#232B77] font-semibold text-sm">
                      <p>IGST</p>
                      <p>
                        {parseFloat(invoiceData.items?.reduce(
                          (acc, cur) =>
                            acc + (cur.taxRate * cur.netAmount.toFixed(2)) / 100,
                          0
                        )).toFixed(2)}
                        /-
                      </p>
                    </div>
                  )}
                  {roundOff > 0 && (
                    <div className="flex gap-20 justify-between text-[#232B77] font-semibold text-sm">
                      <p>Round Off</p>
                      <p>{roundOff}/-</p>
                    </div>
                  )}
                  <div className="h-[2px] w-full bg-blue-900 my-2"></div>
                  {/* Total Payable Amount Section */}

                  <div className="flex gap-20 justify-between text-[#232B77] font-bold text-[16px] mt-2">
                    <p>Payable Amount</p>
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

                {/* <div className="w-1/2 mb-10">
                  <div className="flex justify-between mb-2">
                    <QrCodeComponent data={invoiceData} />
                  </div>
                </div> */}

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
      <div className="text-center mt-24">
        <button
          onClick={handleDownloadPdf}
          className="bg-blue-500 cursor-pointer hover:bg-blue-600 transition-colors text-white px-6 py-2 rounded-lg shadow-md font-medium"
        >
          Download PDF
        </button>
      </div>
    </div>
  );
};

export default ViewPDF;
