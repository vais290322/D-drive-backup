import React, { useState, useEffect } from "react";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import axios from "axios";
import Logo from "../../../assets/mns.jpg";
import { ToWords } from "to-words";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import QrCodeComponent from "../../../component/QRCode/QrCodeComponent";

const bankUrl = import.meta.env.VITE_BASE_URL_Local;
function MnsProductPdf({ invoiceData }) {
  // const printRef = useRef();
  // console.log(invoiceData.taxGroup);
  // const [invoiceData, setInvoiceData] = useState(null);
  const [fetchedData, setFetchedData] = useState([]);
  const fetchBankDetails = async () => {
    const response = await axios.get(`${bankUrl}/api/v1/bank/all`);
    // console.log("API Response:", response.data.data);
    // console.log("fgdfgdf", invoiceData);

    // Check if data exists in response

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
  const [words, setWords] = useState(toWords.convert(invoiceData.grandTotal));
  // const amount=999.50
  // const words = numberToWords(amount);
  // console.log(words.toUpperCase());

  // console.log(invoiceData);
  // const componentRef = useRef();
  const poNumber = "N/A";
  const poDate = "N/A";
  const orderNo = "PO/FY24-25/040352";
  const supplierName = "MNS Secure Solutions PVT LTD";
  const supplierAddress = "AB-79, SALT LAKE CITY, SECTOR-I, KOLKATA-700064";
  const supplierEmail = "info@mnssecuresolutions.com";
  const supplierPhone = "+91 9614544973";
  const gst = "19AAQCM5971R1Z6";
  const state = "West Bengal (19)";

  // const handlePrint = useReactToPrint({
  //   content: () => printRef.current,
  // });

  const componentRef = useRef(null);

  const handleDownloadPdfScreenshot = async () => {
    try {
      if (!componentRef.current) {
        console.error("Component reference is null.");
        return;
      }

      const input = componentRef.current;

      // Convert all colors to hex format
      const colorMap = {
        "bg-blue-50": "#eff6ff",
        "text-[#232B77]": "#232B77",
        "text-[#027bd1]": "#027BD1",
        "bg-[#027bd1]": "#027BD1",
        "bg-[#4250D3]": "#4250D3",
        "border-[#242323]": "#242323",
        "border-blue-300": "#93c5fd",
        "text-blue-900": "#1E3A8A",
        "bg-blue-900": "#1E3A8A",
        "text-blue-800": "#1E40AF",
        "text-[#1F3180]": "#1F3180",
        "text-white": "#FFFFFF",
        "border-gray-300": "#D1D5DB",
        "border-black": "#000000",
        "bg-white": "#FFFFFF",
      };

      // Pre-process the DOM to convert all colors before html2canvas
      const canvas = await html2canvas(input, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        imageTimeout: 2000,
        removeContainer: true,
        onclone: (clonedDoc) => {
          const clonedElements = clonedDoc.getElementsByTagName("*");
          Array.from(clonedElements).forEach((el) => {
            const classList = Array.from(el.classList);
            classList.forEach((className) => {
              if (colorMap[className]) {
                if (className.startsWith("bg-")) {
                  el.style.backgroundColor = colorMap[className];
                } else if (className.startsWith("text-")) {
                  el.style.color = colorMap[className];
                } else if (className.startsWith("border-")) {
                  el.style.borderColor = colorMap[className];
                  el.style.borderStyle = "solid";
                }
              }
            });
          });
        },
      });

      // Generate PDF with border
      const imgData = canvas.toDataURL("image/png", 1.0);
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      const margin = 15; // 15mm margin
      const borderWidth = 1; // 0.5mm border width
      let contentWidth = pdfWidth - 2 * margin;
      let contentHeight = (canvas.height * contentWidth) / canvas.width;

      // Ensure content fits within page
      if (contentHeight > pdfHeight - 2 * margin) {
        contentHeight = pdfHeight - 2 * margin;
        contentWidth = (canvas.width * contentHeight) / canvas.height;
      }

      // Draw border
      // Draw border covering full height
      pdf.setDrawColor(0, 0, 0); // Black color
      pdf.setLineWidth(borderWidth);
      pdf.rect(
        margin - borderWidth,
        margin - borderWidth,
        pdfWidth - 2 * (margin - borderWidth),
        pdfHeight - 2 * (margin - borderWidth)
      );

      // Add content image
      pdf.addImage(imgData, "PNG", margin, margin, contentWidth, contentHeight);

      pdf.save(`invoice-${invoiceData?.invoiceNumber || "download"}.pdf`);
    } catch (error) {
      // console.error("PDF Generation Error:", error);
    }
  };

  const handleDownloadPdf = () => {
    try {
      // Create new PDF document
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      // Add border to the entire page
      pdf.setDrawColor(0, 0, 0); // Black border
      pdf.setLineWidth(0.5);
      pdf.rect(6, 10, 198, 277);

      // Add MNS Logo directly from imported image
      try {
        // Convert the imported Logo to base64
        const img = new Image();
        img.src = Logo;

        img.onload = function () {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0);

          const logoDataURL = canvas.toDataURL("image/jpeg");
          pdf.addImage(logoDataURL, "JPEG", 20, 15, 28, 12);

          // Continue with the rest of the PDF generation
          continueWithPdf();
        };

        img.onerror = function () {
          // console.error("Error loading logo image");
          continueWithPdf();
        };
      } catch (logoError) {
        // console.error("Error adding logo:", logoError);
        continueWithPdf();
      }

      function continueWithPdf() {
        // Add header
        pdf.setFontSize(18);
        pdf.setTextColor(0, 0, 0); // Black text
        pdf.setFont("helvetica", "bold");
        pdf.text("TAX INVOICE", 105, 20, { align: "center" });

        // Add underline
        pdf.setDrawColor(0, 0, 0);
        pdf.setLineWidth(0.5);
        pdf.line(65, 22, 145, 22);

        // Company Info Section
        pdf.setFontSize(10);
        pdf.setTextColor(0, 0, 0);
        pdf.setFont("helvetica", "bold");
        pdf.text("MNS Secure Solutions PVT LTD", 20, 35);
        pdf.setFontSize(8);
        pdf.setFont("helvetica", "normal");
        pdf.text(supplierAddress, 20, 40);

        // Add company details (GSTIN, State, Email, Phone)
        pdf.setFontSize(8);
        pdf.setTextColor(0, 0, 0);
        pdf.setFont("helvetica", "bold");
        pdf.text("GSTIN:", 20, 47);
        pdf.text("STATE:", 20, 52);

        pdf.text("Email:", 120, 47);
        pdf.text("Phone:", 120, 52);

        pdf.setFont("helvetica", "normal");
        pdf.setTextColor(50, 50, 50); // Dark gray
        pdf.text(gst, 35, 47);
        pdf.text(state, 35, 52);

        pdf.text(supplierEmail, 135, 47);
        pdf.text(supplierPhone, 135, 52);

        // Add horizontal line
        pdf.setDrawColor(0, 0, 0);
        pdf.setLineWidth(0.5);
        pdf.line(10, 57, 200, 57);

        // Buyer Details Section - Left side
        pdf.setFontSize(10);
        pdf.setTextColor(0, 0, 0);
        pdf.setFont("helvetica", "bold");
        pdf.text("BUYER DETAILS", 20, 65);

        pdf.setFontSize(8);
        pdf.text("Buyer Name:", 20, 72);
        pdf.text("Address:", 20, 77);
        pdf.text("State:", 20, 84);
        pdf.text("Phone:", 20, 89);
        pdf.text("Vendor Code:", 20, 94);
        pdf.text("Location:", 20, 99);
        pdf.text("GSTIN:", 20, 104);

        pdf.setFont("helvetica", "normal");
        pdf.setTextColor(50, 50, 50);
        pdf.text(invoiceData.receiverDetails.name.toUpperCase(), 50, 72);

        // Handle address wrapping
        const buyerAddress = invoiceData.receiverDetails.address || " ";
        const buyerAddressLines = pdf.splitTextToSize(buyerAddress, 60);
        pdf.text(buyerAddressLines, 50, 77);

        pdf.text(invoiceData.receiverDetails.state || " ", 50, 84);
        pdf.text(invoiceData.receiverDetails.phoneNumber || " ", 50, 89);
        pdf.text(invoiceData.vendorCode || " ", 50, 94);
        pdf.text(invoiceData.location || "", 50, 99);
        pdf.text(invoiceData.receiverDetails.gstin || " ", 50, 104);

        // Invoice Information - Right side
        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(0, 0, 0);
        pdf.text("INVOICE INFORMATION", 120, 65);

        pdf.setFontSize(8);
        pdf.text("Invoice Number:", 120, 72);
        pdf.text("Invoice Date:", 120, 77);
        pdf.text("PO INFORMATION", 120, 85);
        pdf.text("PO Number:", 120, 90);
        pdf.text("PO Date:", 120, 95);

        pdf.setFont("helvetica", "normal");
        pdf.setTextColor(50, 50, 50);
        pdf.text(invoiceData?.invoiceNumber || " ", 160, 72);
        pdf.text(invoiceData?.date || " ", 160, 77);
        pdf.text(invoiceData?.poNumber || " ", 160, 90);
        pdf.text(
          new Date(invoiceData?.poDate).toLocaleDateString() || " ",
          160,
          95
        );

        // Add horizontal line
        pdf.setDrawColor(0, 0, 0);
        pdf.setLineWidth(0.5);
        pdf.line(10, 108, 200, 108);

        // Add items table with pagination support
        const itemsPerPage = 10; // Adjust based on your needs
        const totalItems = invoiceData?.items?.length || 0;
        const totalPages = Math.ceil(totalItems / itemsPerPage);

        // Process items in batches for pagination
        for (let pageNum = 0; pageNum < totalPages; pageNum++) {
          // If not the first page, add a new page
          if (pageNum > 0) {
            pdf.addPage();
            pdf.setDrawColor(0, 0, 0);
            pdf.setLineWidth(0.5);
            pdf.rect(10, 10, 190, 277);

            // Add header for continuation pages
            pdf.setFontSize(12);
            pdf.setTextColor(0, 0, 0);
            pdf.setFont("helvetica", "bold");
            pdf.text(
              `Invoice #${invoiceData?.invoiceNumber} (Page ${
                pageNum + 1
              } of ${totalPages})`,
              105,
              20,
              { align: "center" }
            );
            pdf.line(20, 25, 190, 25);
          }

          const startIdx = pageNum * itemsPerPage;
          const endIdx = Math.min(startIdx + itemsPerPage, totalItems);
          const pageItems = invoiceData?.items?.slice(startIdx, endIdx) || [];

          // Table starting Y position - different for first page vs continuation pages
          const tableStartY = pageNum === 0 ? 112 : 30;

          pdf.autoTable({
            startY: tableStartY,
            head: [
              [
                "SL No",
                "Description",
                "HSN Code",
                "Qty",
                "Price",
                "Rate",
                "Tax Amount",
                ...(invoiceData.taxGroup === "State Tax"
                  ? ["CGST(%)", "SGST(%)"]
                  : invoiceData.taxGroup === "Other Tax"
                  ? ["IGST(%)"]
                  : []),
                "Amount",
              ],
            ],
            body: pageItems.map((item, index) => {
              return [
                startIdx + index + 1,
                item.itemName +
                  (item?.description ? " (" + item.description + ")" : ""),
                item.hsnCode || "-",
                item.quantity,
                item.sellingPrice,
                item.taxRate,
                item.taxAmount,
                ...(invoiceData.taxGroup === "State Tax"
                  ? [item.cgst, item.sgst]
                  : invoiceData.taxGroup === "Other Tax"
                  ? [item.igst]
                  : []),
                item.netAmount,
              ];
            }),
            theme: "grid",
            headStyles: {
              fillColor: [50, 50, 50], // Dark gray
              textColor: [255, 255, 255],
              fontSize: 8,
              fontStyle: "bold",
              halign: "center",
            },
            bodyStyles: {
              textColor: [50, 50, 50], // Dark gray
              fontSize: 8,
              halign: "center",
            },
            columnStyles: {
              0: { cellWidth: 10 }, // SL No
              1: { halign: "left", cellWidth: 50 }, // Description
              // 2: { cellWidth: 20 }, // HSN Code
              // 3: { cellWidth: 10 }, // Qty
              // 4: { cellWidth: 15 }, // Rate
              // 5: { cellWidth: 20 }, // Tax Amount
              // Dynamic columns for tax percentages
              ...(invoiceData.taxGroup === "State Tax"
                ? {
                    6: { cellWidth: 20 },
                    7: { cellWidth: 20 },
                    8: { cellWidth: 25 },
                  }
                : invoiceData.taxGroup === "Other Tax"
                ? { 6: { cellWidth: 20 }, 7: { cellWidth: 25 } }
                : { 6: { cellWidth: 25 } }),
            },
            margin: { left: 10, right: 10 },
            styles: {
              overflow: "linebreak",
              cellPadding: 2,
            },
            tableWidth: 190,
            didDrawPage: (data) => {
              // Add page number at the bottom
              pdf.setFontSize(8);
              pdf.text(`Page ${pdf.internal.getNumberOfPages()}`, 105, 290, {
                align: "center",
              });
            },
          });

          // Only add summary on the last page
          if (pageNum === totalPages - 1) {
            // Get the final Y position after the table
            let finalY = pdf.autoTable.previous.finalY + 10;

            // Check if we need to add a new page for summary (if table takes too much space)
            if (finalY > 220) {
              pdf.addPage();
              pdf.setDrawColor(0, 0, 0);
              pdf.setLineWidth(0.5);
              pdf.rect(6, 10, 198, 277);
              finalY = 30;
            }

            // Add amount in words
            pdf.setFont("helvetica", "bold");
            pdf.setTextColor(0, 0, 0);
            pdf.setFontSize(10);
            pdf.text(`${words.toUpperCase()} ONLY`, 15, finalY);

            // Add bank details - Left side
            pdf.setFontSize(8);
            pdf.text("Bank Name:", 15, finalY + 10);
            pdf.text("Branch:", 15, finalY + 15);
            pdf.text("Account Number:", 15, finalY + 20);
            pdf.text("Account Holder Name:", 15, finalY + 25);
            pdf.text("IFS Code:", 15, finalY + 30);

            pdf.setFont("helvetica", "normal");
            pdf.setTextColor(50, 50, 50);
            pdf.text(fetchedData?.bankName || "sample bank", 50, finalY + 10);
            pdf.text(fetchedData?.branch || "sample branch", 50, finalY + 15);
            pdf.text(
              fetchedData?.accountNumber || "sample account number",
              50,
              finalY + 20
            );
            pdf.text(
              fetchedData?.accountHolderName || "sample account holder name",
              50,
              finalY + 25
            );
            pdf.text(
              fetchedData?.ifscCode || "sample ifsc code",
              50,
              finalY + 30
            );

            // Try to add QR code
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
                    pdf.addImage(qrDataURL, "PNG", 90, finalY + 5, 30, 30);

                    // Continue with the rest of the PDF after QR code is added
                    addSummaryAndFinalize();
                  })
                  .catch((err) => {
                    console.error(
                      "Error capturing QR code with html2canvas:",
                      err
                    );
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
              const lineSpacing = 12;

              // Add summary section - Right side (with better spacing)
              pdf.setFont("helvetica", "bold");
              pdf.setTextColor(0, 0, 0);

              // Always show Taxable Amount
              pdf.text("Taxable Amount:", 140, currentY);
              pdf.setFont("helvetica", "normal");
              pdf.setTextColor(50, 50, 50);
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
                pdf.setFont("helvetica", "normal");
                pdf.setTextColor(50, 50, 50);
                pdf.text(`${totalTaxAmount}/-`, 190, currentY, { align: "right" });
                currentY += lineSpacing;
              }

              // Transportation Charges - show only if greater than 0
              if (invoiceData.transportationCharges > 0) {
                pdf.setFont("helvetica", "bold");
                pdf.setTextColor(0, 0, 0);
                pdf.text("Transportation Charges:", 140, currentY);
                pdf.setFont("helvetica", "normal");
                pdf.setTextColor(50, 50, 50);
                pdf.text(
                  `${invoiceData.transportationCharges}/-`,
                  190,
                  currentY,
                  { align: "right" }
                );
                currentY += lineSpacing;
              }

              // Discount Amount - show only if greater than 0
              if (invoiceData.discount > 0) {
                pdf.setFont("helvetica", "bold");
                pdf.setTextColor(0, 0, 0);
                pdf.text("Discount Amount:", 140, currentY);
                pdf.setFont("helvetica", "normal");
                pdf.setTextColor(50, 50, 50);
                pdf.text(`${invoiceData.discount}/-`, 190, currentY, {
                  align: "right",
                });
                currentY += lineSpacing;
              }

              // Add line before grand total
              currentY += 4; // Small gap before line
              pdf.setDrawColor(0, 0, 0);
              pdf.setLineWidth(0.5);
              pdf.line(140, currentY, 190, currentY);

              // Grand Total
              currentY += 4; // Small gap after line
              pdf.setFont("helvetica", "bold");
              pdf.setTextColor(0, 0, 0);
              pdf.text("Grand Total:", 140, currentY);
              pdf.setFont("helvetica", "normal");
              pdf.setTextColor(50, 50, 50);
              pdf.text(`${invoiceData.grandTotal}/-`, 190, currentY, {
                align: "right",
              });

              // Add signature section with dynamic spacing
              currentY += 10; // Gap before signature
              pdf.setFont("helvetica", "bold");
              pdf.setTextColor(0, 0, 0);
              pdf.setFontSize(9);
              pdf.text("For MNS Secure Solutions PVT LTD", 185, currentY, {
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
              pdf.save(`invoice-mns-${invoiceData?.invoiceNumber || "download"}.pdf`);
            }
          }
        }
      }
    } catch (error) {
      console.error("PDF Generation Error:", error);
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
        className="w-[210mm] h-[297mm] mx-auto bg-white font-poppins"
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
                    <span className="text-[#027bd1]">{invoiceData?.date}</span>
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
                      {new Date(invoiceData?.poDate).toLocaleDateString()}{" "}
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
                      <th className="border p-2">Rate</th>
                      <th className="border p-2">Tax Amount</th>
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
                              <td className="border p-2">{e.taxRate}</td>
                              <td className="border p-2">{e.taxAmount}</td>
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
                        {fetchedData?.bankName || "sample bank"}
                      </span>
                    </p>
                    <p className="text-[#232B77]">
                      Branch:{" "}
                      <span className="text-[#027bd1]">
                        {fetchedData?.branch || "sample branch"}
                      </span>
                    </p>
                    <p className="text-[#232B77]">
                      Account Number:{" "}
                      <span className="text-[#027bd1]">
                        {fetchedData?.accountNumber || "sample account number"}
                      </span>
                    </p>
                    <p className="text-[#232B77]">
                      Account Holder Name:{" "}
                      <span className="text-[#027bd1]">
                        {fetchedData?.accountHolderName ||
                          "sample account holder name"}
                      </span>
                    </p>
                    <p className="text-[#232B77]">
                      IFS Code:{" "}
                      <span className="text-[#027bd1]">
                        {fetchedData?.ifscCode || "sample ifsc code"}
                      </span>
                    </p>
                  </div>
                </div>
                <div className="w-1/2 qr-code-container canvas ">
                  <div className="flex justify-between mb-2">
                    <QrCodeComponent data={invoiceData} />
                  </div>
                </div>

                <div className="w-1/3 text-lg font-semibold">
                  <div className="flex justify-between  ">
                    <p className="text-[#232B77]">Taxable Amount</p>
                    <p className="text-[#027bd1]">
                      {invoiceData.taxableAmount}
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
                    <p className="text-[#232B77]">Total Tax Amount</p>
                    <p className="text-[#027bd1]">
                      {invoiceData.items?.reduce(
                        (acc, cur) => acc + cur.taxAmount,
                        0
                      )}
                      /-
                    </p>
                  </div>
                  {invoiceData.transportationCharges > 0 && (
                    <div className="flex justify-between">
                      <p className="text-[#232B77]">Transportain Charges</p>
                      <p className="text-[#027bd1]">
                        {invoiceData.transportationCharges || 0}/-
                      </p>
                    </div>
                  )}
                  {invoiceData.discount >0  && (
                    <div className="flex justify-between">
                      <p className="text-[#232B77]">Discount Amount </p>
                      <p className="text-[#027bd1]">
                        {invoiceData.discount || 0}/-
                      </p>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <p className="text-[#232B77]">Grand Total</p>
                    <p className="text-[#027bd1]">{invoiceData.grandTotal}</p>
                  </div>
                  <div className="h-[1px] w-full bg-[#232B77] mt-5"></div>
                  {/* <div className="flex justify-between">
                  <p className="text-[#232B77]">Paid on 2 Jan</p>
                  <p className="text-[#027bd1]">900/-</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-[#232B77]">Balance Due</p>
                  <p className="text-[#027bd1]">4,340/-</p>
                </div>
                <div className="h-[1px] w-full bg-[#232B77] my-2"></div> */}
                </div>
              </div>

              {/* Signature Section */}
              <div className="flex items-end justify-end mt-2">
                <div>
                  <p className="text-[#232B77] font-semibold ">
                    For MNS Secure Solutions PVT LTD
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
            className="bg-blue-500 hover:bg-blue-600 transition-colors cursor-pointer text-white px-6 py-2 rounded-lg shadow-md font-medium"
          >
            Download PDF
          </button>
        </div>
      </div>
    </>
  );
}

export default MnsProductPdf;
