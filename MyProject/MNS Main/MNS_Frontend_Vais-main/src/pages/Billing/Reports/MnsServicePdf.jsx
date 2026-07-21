import React, { useEffect, useRef, useState } from "react";
import Logo from "../../../assets/mns.jpg";
import jsPDF from "jspdf";
import { ToWords } from "to-words";
import "jspdf-autotable";
import { backendDomainA } from "../../../Common/index";
import axios from "axios";

function MnsServicePdf({ invoiceData, header = "TAX", isProforma = false }) {
  const iso = import.meta.env.VITE_REACT_ISO;
  const term = import.meta.env.VITE_REACT_MNS_TERM;
  const [bankDtails, setBankDtails] = useState([]);
  // console.log("Invoice Data:", invoiceData);

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
      invoiceData?.total?.totalPayableAmount || invoiceData?.total?.grandTotal
    )
  );

  const fetchBanks = async () => {
    try {
      const response = await axios.get(`${backendDomainA}/api/v1/bank/all`);
      // console.log(response.data.data);
      setBankDtails(response.data.data || []);
    } catch (error) {
      console.error("Error fetching banks:", error);
    }
  };

  useEffect(() => {
    fetchBanks();
  }, []);

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date
      .toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
      .replace(/\//g, ".");
  };

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

  const componentRef = useRef();

  const supplierName = "MNS Secure Solutions Pvt. Ltd.";
  const supplierAddress = "AB-79, SALT LAKE CITY, SECTOR-I, KOLKATA-700064";
  const supplierEmail = "info@mnssecuresolutions.com";
  const supplierPhone = "+91 91477 17001 / 033 4060 2144";;
  const gst = "19AAQCM5971R1Z6";
  const state = "West Bengal (19)";
  const cinNo = "U80100WB2023PTC260127";

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
    pdf.text(`${header} INVOICE`, pageWidth / 2, 20, { align: "center" });

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
    if (header === "TAX") {
      pdf.line(80, 22, 130, 22);
    } else {
      pdf.line(68, 22, 140, 22);
    }
    // Separator line below company details to reserve space for header on all pages
    pdf.setDrawColor(0, 0, 0);
    pdf.setLineWidth(0.5);
    pdf.line(10, 57, 200, 57);
  }

  const handleDownloadPdf = () => {
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
    const firstPageStartY = 118;

    // First-page frame and header
    pdf.setDrawColor(0);
    pdf.setLineWidth(0.5);
    pdf.rect(6, 10, 198, 277);
    addHeader(pdf);

    // Buyer Details Section - Left side (only on first page)
    pdf.setFontSize(8);
    pdf.setTextColor(0, 0, 0);
    pdf.setFont("helvetica", "bold");
    pdf.text("INVOICE DETAILS ", 20, 62);

    pdf.setFontSize(5);
    pdf.text("To:", 20, 68);
    pdf.text("Address:", 20, 72);
    pdf.text("State:", 20, 84);

    if (invoiceData.receiverDetails.phoneNumber) pdf.text("Phone:", 20, 89);

    pdf.text("Vendor Code:", 20, 94);
    pdf.text("Location:", 20, 99);
    pdf.text("GSTIN:", 20, 104);

    pdf.text("SITE:", 120, 94);
    pdf.text("PF:", 120, 99);
    pdf.text("ESI:", 120, 104);
    pdf.text("Service Period:", 120, 109);

    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(0, 0, 0);
    pdf.text(invoiceData.receiverDetails.name.toUpperCase(), 50, 68);

    const buyerAddress = invoiceData.receiverDetails.address || " ";
    const buyerAddressLines = pdf.splitTextToSize(buyerAddress, 60);
    pdf.text(buyerAddressLines, 50, 72);

    pdf.text(invoiceData.receiverDetails.state || " ", 50, 84);

    if (invoiceData.receiverDetails.phoneNumber)
      pdf.text(invoiceData.receiverDetails.phoneNumber || " ", 50, 89);
    pdf.text(invoiceData.vendorCode || "", 50, 94);
    pdf.text(invoiceData.location || "", 50, 99);
    pdf.text(invoiceData.receiverDetails.gstin || " ", 50, 104);

    pdf.text(invoiceData?.location || " ", 160, 94);
    pdf.text(invoiceData?.receiverDetails?.pf || " ", 160, 99);
    pdf.text(invoiceData?.receiverDetails?.esi || " ", 160, 104);
    pdf.text(
      `${invoiceData?.receiverDetails?.formDate
        ? new Date(
          invoiceData.receiverDetails.formDate
        ).toLocaleDateString("en-GB")
        : ""
      }${invoiceData?.receiverDetails?.formDate &&
        invoiceData?.receiverDetails?.toDate
        ? " to "
        : ""
      }${invoiceData?.receiverDetails?.toDate
        ? new Date(
          invoiceData.receiverDetails.toDate
        ).toLocaleDateString("en-GB")
        : ""
      }`,
      160,
      109
    );


    // Invoice Information - Right side (only on first page)
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(0, 0, 0);
    pdf.text("INVOICE INFORMATION", 120, 65);

    pdf.setFontSize(5);
    pdf.text("Invoice Number:", 120, 72);
    pdf.text("Invoice Date:", 120, 77);
    // pdf.text("PO INFORMATION", 120, 85);
    pdf.text("PO Number:", 120, 82);
    pdf.text("PO Date:", 120, 87);

    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(0, 0, 0);
    pdf.text(invoiceData?.invoiceNumber || " ", 160, 72);
    pdf.text(
      new Date(invoiceData?.date).toLocaleDateString("en-GB") || " ",
      160,
      77
    );
    pdf.text(invoiceData?.receiverDetails?.poNumber || " ", 160, 82);
    pdf.text(
      invoiceData?.receiverDetails?.poDate
        ? new Date(
          invoiceData.receiverDetails.poDate
        ).toLocaleDateString("en-GB")
        : "",
      160,
      87
    );


    // Separator below header area on first page
    pdf.setDrawColor(0, 0, 0);
    pdf.setLineWidth(0.5);
    pdf.line(10, 112, 200, 112);

    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(0, 0, 0);
    pdf.text(
      `Bill for the month of ${invoiceData?.receiverDetails?.monthYear || ""}, ${invoiceData?.receiverDetails?.year || ""}`,
      20,
      116
    );

    // One autoTable call that auto-paginates items
    pdf.autoTable({
      startY: firstPageStartY,
      head: [
        [
          "SL No",
          "Description",
          "HSN Code",
          "No of Persons",
          "No of Duties",
          "Rate per month per Person",
          "Month Days",
          "Amount(Rs)",
        ],
      ],
      body: invoiceData.items.map((item, index) => [
        index + 1,
        item.description || item.itemName || "N/A",
        item.sacCode || "N/A",
        item.noOfPerson || "N/A",
        item.noOfDuites || "N/A",
        `${item.rate || "N/A"}/-`,
        item.month || "N/A",
        `${item?.amount?.toFixed(2) || item.grossAmount?.toFixed(2) || "N/A"
        }/-`,
      ]),
      theme: "grid",
      headStyles: {
        // fillColor: [50, 50, 50],
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
        fontSize: 6,
        fontStyle: "bold",
        halign: "center",

        // BOLD BORDER FOR HEADER
        lineWidth: 0.2,
        lineColor: [0, 0, 0],
      },
      bodyStyles: {
        textColor: [0, 0, 0],
        fontSize: 6,
        halign: "center",
        fontStyle: "bold",

        // LIGHT BORDER FOR ALL BODY CELLS
        lineWidth: 0.2,
        lineColor: [0, 0, 0],
      },
      columnStyles: {
        0: { cellWidth: 10 },
        1: { halign: "left", cellWidth: 50 },
        ...(invoiceData.taxGroup === "State Tax"
          ? { 6: { cellWidth: 20 }, 7: { cellWidth: 20 }, 8: { cellWidth: 25 } }
          : invoiceData.taxGroup === "Other Tax"
            ? { 6: { cellWidth: 20 }, 7: { cellWidth: 25 } }
            : { 6: { cellWidth: 25 } }),
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
      didDrawCell: (data) => {
        // After table is drawn, draw outer border only around table
        if (
          data.section === "body" &&
          data.row.index === invoiceData.items.length - 1
        ) {
          const table = data.table;
          pdf.setDrawColor(0);
          pdf.setLineWidth(0.2);

          // pdf.rect(table.pageStartX, table.pageStartY, table.width, table.height);
        }
      },
    });

    // Add summary after table on last page
    let finalY = (pdf.autoTable.previous?.finalY || firstPageStartY) + 5;
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
    pdf.setFontSize(8);
    pdf.text("Remarks:", 15, finalY);

    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(0, 0, 0);
    pdf.text(invoiceData?.remark || "", 33, finalY);

    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(10);
    pdf.text(`${words.toUpperCase()} `, 15, finalY + 5);
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
    pdf.text(invoiceData?.bankName || "", 50, finalY + 10);
    pdf.text(invoiceData?.branch || "", 50, finalY + 15);
    pdf.text(
      invoiceData?.accountNumber || "",
      50,
      finalY + 20
    );
    pdf.text(invoiceData?.ifscCode || "", 50, finalY + 25);

    const maxAccountHolderWidth = 40;
    const accountHolderName =
      invoiceData?.accountHolderName || "";
    const accountHolderLines = pdf.splitTextToSize(
      accountHolderName,
      maxAccountHolderWidth
    );
    accountHolderLines.forEach((line, index) => {
      pdf.text(line, 50, finalY + 30 + index * 4);
    });
    finalY += (accountHolderLines.length - 1) * 4;

    const noteText = `1. ALL PAYMENT SHOULD BE MADE BY CROSS CHEQUE DRAWN IN FAVOUR OF MNS SECURE SOLUTIONS PVT LTD.`;
    const noteText2 = `2. DEMAND DARFT/PAY ORDER/CROSSED CHEQUE/NEFT/RTGS SHOULD BE RELEASED WITH IN A 07 DAYS OF RECEIPT OF THE BILL OR ELSE INTEREST @10% P.A. WOULD BE LEVIED. THIS INTEREST ONCE LEVIED WILL NOT BE WAIVED UNDER ANY CIRCUMSTANCE.`;
    const maxWidth = 100;
    const wrappedText = pdf.splitTextToSize(noteText, maxWidth);
    pdf.text(wrappedText, 15, finalY + 45);
    const wrappedText2 = pdf.splitTextToSize(noteText2, maxWidth);
    pdf.text(wrappedText2, 15, finalY + 45 + wrappedText.length * 5);

    addSummaryAndFinalize();

    function addSummaryAndFinalize() {
      let currentY = finalY + 9;
      const lineSpacing = 6;

      // Add summary section - Right side (with better spacing)
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(0, 0, 0);
      // Always show Taxable Amount
      pdf.text("Taxable Amount:", 140, currentY);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(0, 0, 0);
      pdf.text(
        `${invoiceData?.total?.grossAmount?.toFixed(2) ||
        invoiceData?.grossAmount ||
        "N/A"
        }/-`,
        190,
        currentY,
        {
          align: "right",
        }
      );
      currentY += lineSpacing;

      if (invoiceData.taxGroup === "Other Tax") {
        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(0, 0, 0);
        pdf.text(`IGST (${invoiceData?.total?.igst}%):`, 140, currentY);
        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(0, 0, 0);
        pdf.text(
          `${invoiceData?.total?.igstAmount?.toFixed(2) ||
          (
            (invoiceData?.total?.grossAmount *
              invoiceData?.total?.igst) /
            100
          )?.toFixed(2) ||
          "0"}/-`,
          190,
          currentY,
          {
            align: "right",
          }
        );
        currentY += lineSpacing;
      } else {
        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(0, 0, 0);
        pdf.text(`CGST (${invoiceData?.total?.cgst}%):`, 140, currentY);
        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(0, 0, 0);
        pdf.text(
          `${invoiceData?.total?.cgstAmount?.toFixed(2) ||
          (
            (invoiceData?.total?.grossAmount *
              invoiceData?.total?.cgst) /
            100
          )?.toFixed(2) ||
          "0"}/-`,
          190,
          currentY,
          {
            align: "right",
          }
        );
        currentY += lineSpacing;

        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(0, 0, 0);
        pdf.text(`SGST (${invoiceData?.total?.sgst}%):`, 140, currentY);
        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(0, 0, 0);
        pdf.text(
          `${invoiceData?.total?.sgstAmount?.toFixed(2) ||
          (
            (invoiceData?.total?.grossAmount *
              invoiceData?.total?.sgst) /
            100
          )?.toFixed(2) ||
          "0"}/-`,
          190,
          currentY,
          {
            align: "right",
          }
        );
        currentY += lineSpacing;
      }

      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(0, 0, 0);
      pdf.text("Total:", 140, currentY);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(0, 0, 0);
      pdf.text(
        `${invoiceData?.total?.grandTotal?.toFixed(2) || "N/A"}/-`,
        190,
        currentY,
        {
          align: "right",
        }
      );
      currentY += lineSpacing;

      if (invoiceData?.total?.roundOff > 0) {
        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(0, 0, 0);
        pdf.text("Round Off:", 140, currentY);
        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(0, 0, 0);
        pdf.text(
          `${invoiceData?.total?.roundOff?.toFixed(2) || "N/A"}/-`,
          190,
          currentY,
          {
            align: "right",
          }
        );
        currentY += lineSpacing;
      }

      // Add line before grand total
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
        `${invoiceData?.total?.totalPayableAmount?.toFixed(2) ||
        invoiceData?.total?.grandTotal?.toFixed(2) ||
        "N/A"
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
      currentY += 14;
      pdf.setDrawColor(0, 0, 0);
      pdf.line(140, currentY, 185, currentY);

      // Add signature label
      currentY += 5;
      pdf.setFontSize(8);
      pdf.text("Authorized Signature", 156, currentY);

      // Add footer with clamped Y to avoid overlap and stay within frame
      const footerY = Math.min(286, Math.max(currentY + 12, 280));
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(9);
      pdf.text(
        "This is Computer Generated Invoice No Signature Required",
        105,
        footerY,
        { align: "center" }
      );

      // Save the PDF
      pdf.save(
        `service${isProforma ? "-proforma" : ""}-invoice-mns-${invoiceData?.invoiceNumber || "download"
        }.pdf`
      );
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
        className="print-container bg-white font-poppins min-h-screen"
        ref={componentRef}
      >
        <div className="">
          <div className="p-6">
            {/* Header Section */}
            <div className="text-center mb-4">
              <h1 className="text-[40px] font-bold text-[#232B77] my-3">
                {header} INVOICE
              </h1>
              {/* Horizontal line hidden on print */}
              <div className="no-print h-[3px] w-[350px] bg-[#4250D3] mx-auto"></div>
            </div>
            {/* Company Info Section */}
            <div className="px-6 mt-2">
              <div className="flex justify-between items-start px-10">
                <div className="flex flex-col items-start">
                  <img src={Logo} alt="MNS Logo" className="h-12 w-28" />
                  <div className="text-lg pl-2">
                    <p className="text-[#232B77] font-semibold text-2xl pt-2">
                      MNS SECURE SOLUTIONS PRIVATE LIMITED
                    </p>
                    <p className="text-[#232B77]   ">{iso}</p>
                    <p className="text-[#232B77] font-semibold text-xl">
                      CIN NO:{" "}
                      <span className="text-[#027BD1]">
                        {" "}
                        U80100WB2023PTC260127
                      </span>
                    </p>
                    <p className="text-[#232B77] font-semibold text-xl">
                      PHONE: <span className="text-[#027BD1]">{state}</span>
                    </p>
                    <p className="text-[#232B77] font-semibold text-xl">
                      ADDRESS:{" "}
                      <span className="text-[#027BD1]">
                        AB-79, SALT LAKE CITY, SECTOR-I, KOLKATA-700064
                      </span>
                    </p>
                  </div>
                </div>
                <div className="flex flex-col pl-36">
                  <h1 className="text-[#232B77] text-xl font-semibold pb-2">
                    INVOICE DETAILS:
                  </h1>
                  <p className="text-[#232B77] font-semibold text-xl">
                    Invoice NO:{" "}
                    <span className="text-[#027BD1] text-xl">
                      {invoiceData?.invoiceNumber || " "}
                    </span>
                  </p>
                  <p className="text-[#232B77] font-semibold text-xl">
                    Invoice Date:{" "}
                    <span className="text-[#027BD1] text-xl">
                      {formatDate(invoiceData?.date)}
                    </span>
                  </p>
                  <p className="text-[#232B77] font-semibold text-xl">
                    Vendor Code:{" "}
                    <span className="text-[#027BD1] text-xl">
                      {invoiceData?.receiverDetails?.vendorCode || " "}
                    </span>
                  </p>
                  <p className="text-[#232B77] font-semibold text-xl">
                    GST NO:{" "}
                    <span className="text-[#027BD1] text-xl">
                      {invoiceData?.receiverDetails?.gstin || " "}
                    </span>
                  </p>
                  <p className="text-[#232B77] font-semibold text-xl">
                    Address:{" "}
                    <span className="text-[#027BD1] text-xl">
                      {invoiceData?.receiverDetails?.address || " "}
                    </span>
                  </p>
                </div>
              </div>
              {/* PO Information */}
              <div className="bg-blue-50 p-4 mt-8">
                <div className="flex flex-col justify-between">
                  <h1 className="text-[#232B77] text-xl font-semibold pb-2">
                    SERVICE DETAILS:
                  </h1>
                  <div className="flex justify-between">
                    <div>
                      <h1 className="text-lg font-semibold text-[#232B77] pb-2">
                        To{" "}
                        {invoiceData?.customerName ||
                          invoiceData?.receiverDetails?.name ||
                          "N/A"}
                      </h1>
                      <p className="text-[#232B77] font-semibold text-sm">
                        {invoiceData?.receiverDetails?.address || " "}
                      </p>
                      <p className="text-[#232B77] font-semibold text-sm">
                        GSTIN:{" "}
                        <span className="text-[#027BD1]">
                          {invoiceData?.receiverDetails?.gstin || " "}
                        </span>
                      </p>

                      <p className="text-[#232B77] font-semibold text-sm pb-5">
                        Site:{" "}
                        <span className="text-[#027BD1]">
                          {invoiceData?.location || " "}
                        </span>
                      </p>
                      <p className="text-[#232B77] font-semibold text-lg">
                        Bill For The Month of{" "}
                        {invoiceData?.receiverDetails?.monthYear},{" "}
                        {invoiceData?.receiverDetails?.year}
                      </p>
                    </div>

                    <div>
                      <p className="text-[#232B77] font-semibold text-sm pb-5">
                        PO Date:{" "}
                        <span className="text-[#027BD1]">
                          {invoiceData?.receiverDetails?.poDate
                            ? new Date(
                              invoiceData.receiverDetails.poDate
                            ).toLocaleDateString("en-GB")
                            : ""}
                        </span>
                      </p>
                      <p className="text-[#232B77] font-semibold text-sm pb-5">
                        PO Number:{" "}
                        <span className="text-[#027BD1]">
                          {invoiceData?.receiverDetails?.poNumber || " "}
                        </span>
                      </p>
                      <p className="text-[#232B77] font-semibold text-sm pb-5">
                        PF:{" "}
                        <span className="text-[#027BD1]">
                          {invoiceData?.receiverDetails?.pf || " "}
                        </span>
                      </p>
                      <p className="text-[#232B77] font-semibold text-sm pb-5">
                        ESI:{" "}
                        <span className="text-[#027BD1]">
                          {invoiceData?.receiverDetails?.esi || " "}
                        </span>
                      </p>
                      <p className="text-[#232B77] font-semibold text-sm pb-5">
                        Service Period:{" "}
                        <span className="text-[#027BD1]">
                          {invoiceData?.receiverDetails?.formDate
                            ? new Date(
                              invoiceData.receiverDetails.formDate
                            ).toLocaleDateString("en-GB")
                            : ""}
                        </span>{" "}
                        to{" "}
                        <span className="text-[#027BD1]">
                          {invoiceData?.receiverDetails?.toDate
                            ? new Date(
                              invoiceData.receiverDetails.toDate
                            ).toLocaleDateString("en-GB")
                            : ""}
                        </span>
                      </p>

                    </div>
                  </div>
                </div>
                {/* Products Table */}
                <div className="mt-2">
                  <table className="w-full border border-blue-300">
                    <thead className="bg-[#027BD1] text-white text-sm ">
                      <tr>
                        <th className="p-2">SL No</th>
                        <th className="p-2">Description</th>
                        <th className="p-2">HSN Code</th>
                        <th className="p-2">No of Persons</th>
                        <th className="p-2">No of Duties</th>
                        <th className="p-2">Rate per month per Person</th>
                        <th className="p-2">Month Days</th>
                        <th className="p-2">Amount(Rs)</th>
                      </tr>
                    </thead>
                    <tbody className="text-[#027BD1] text-center text-sm">
                      {Array.isArray(invoiceData?.items) ? (
                        invoiceData.items.map((item, index) => (
                          <tr key={index} className="border border-blue-300">
                            <td className="p-2">{index + 1}</td>
                            <td className="p-2">
                              {item.description || item.itemName || "N/A"}
                            </td>
                            <td className="p-2">{item.sacCode || "N/A"}</td>
                            <td className="p-2">{item.noOfPerson || "N/A"}</td>
                            <td className="p-2">{item.noOfDuites || "N/A"}</td>
                            <td className="p-2">{item.rate || "N/A"}/-</td>
                            <td className="p-2">{item.month || "N/A"}</td>
                            <td className="p-2">
                              {item?.amount?.toFixed(2) ||
                                item.grossAmount?.toFixed(2) ||
                                "N/A"}
                              /-
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr className="border border-blue-300">
                          <td colSpan="8" className="p-2">
                            No items available
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                {/* Summary Section */}
                <div className=" flex gap-2 mt-2 items-center">
                  <span className="text-[#232B77] font-semibold text-lg">
                    Remarks :
                  </span>
                  <p>{invoiceData.remark || " "}</p>
                </div>
                <div className="flex justify-between mt-2">
                  <div className="w-1/2">
                    <p className="text-[#232B77] font-semibold text-lg">
                      {toWords.convert(
                        invoiceData?.total?.totalPayableAmount ||
                        invoiceData?.total?.grandTotal
                      )}{" "}

                    </p>

                    <p>Bank Details </p>

                    <p className="text-[#232B77] font-semibold text-lg">
                      Bank Name :{" "}
                      <span className="text-sky-600">
                        {invoiceData?.bankName || bankDtails[0]?.bankName}
                      </span>
                    </p>
                    <p className="text-[#232B77] font-semibold text-lg">
                      Branch :{" "}
                      <span className="text-sky-600">
                        {invoiceData?.branch || bankDtails[0]?.branch}
                      </span>
                    </p>
                    <p className="text-[#232B77] font-semibold text-lg">
                      Account Number :{" "}
                      <span className="text-sky-600">
                        {invoiceData?.accountNumber ||
                          bankDtails[0]?.accountNumber}
                      </span>
                    </p>
                    <p className="text-[#232B77] font-semibold text-lg">
                      IFSC :{" "}
                      <span className="text-sky-600">
                        {invoiceData?.ifscCode || bankDtails[0]?.ifscCode}
                      </span>
                    </p>
                    <p className="text-[#232B77] font-semibold text-lg">
                      Account Holder Name :{" "}
                      <span className="text-sky-600">
                        {invoiceData?.accountHolderName ||
                          bankDtails[0]?.accountHolderName}
                      </span>
                    </p>

                    <div className="mt-4">
                      <p className="text-[#232B77] font-semibold text-lg">
                        Terms & Conditions:
                      </p>

                      <div className="text-blue-900 font-semibold text-sm mt-2">
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
                      {/* <p className="text-[#232B77] text-sm mt-2">
                        <span className="font-semibold">
                          Payment & Disputes:
                        </span>{" "}
                        Invoices are payable within 30 days of issuance, with
                        late payments incurring additional fees. Any disputes
                        must be raised within 7 days of receipt, but undisputed
                        portions remain payable on time.
                      </p>
                      <p className="text-[#232B77] text-sm mt-2">
                        <span className="font-semibold">
                          Liabilities & Policies:
                        </span>{" "}
                        Ownership of goods or services remains with MNS Secure
                        Solutions PVT LTD until full payment is made. The
                        company is not liable for indirect or consequential
                        damages, & all agreements are governed by Indian laws.
                        Refunds, cancellations, or amendments will follow the
                        service agreement terms.
                      </p> */}
                    </div>
                  </div>

                  <div className="w-1/3">
                    <div className="flex justify-between text-sm">
                      <p className="text-[#232B77] text-xl font-bold">Total</p>
                      <p className="text-[#027BD1]">
                        {invoiceData?.total?.grossAmount?.toFixed(2) ||
                          invoiceData?.grossAmount ||
                          "N/A"}
                        /-
                      </p>
                    </div>
                    {invoiceData?.total?.cgst > 0 && (
                      <div className="flex justify-between text-sm">
                        <p className="text-[#232B77] text-xl font-bold">
                          CGST{" "}
                          <span className="text-lg font-semibold">
                            ({invoiceData?.total?.cgst || "0"} %)
                          </span>
                        </p>
                        <div className="flex gap-4">
                          <p className="text-[#027BD1]">
                            {invoiceData?.total?.cgstAmount?.toFixed(2) ||
                              (
                                (invoiceData?.total?.grossAmount *
                                  invoiceData?.total?.cgst) /
                                100
                              )?.toFixed(2) ||
                              "0"}
                            /-
                          </p>
                        </div>
                      </div>
                    )}
                    {invoiceData?.total?.sgst > 0 && (
                      <div className="flex justify-between text-sm">
                        <p className="text-[#232B77] text-xl font-bold">
                          SGST{" "}
                          <span className="text-lg font-semibold">
                            ({invoiceData?.total?.sgst || "0"} %)
                          </span>
                        </p>
                        <div className="flex gap-4">
                          <p className="text-[#027BD1]">
                            {invoiceData?.total?.sgstAmount?.toFixed(2) ||
                              (
                                (invoiceData?.total?.grossAmount *
                                  invoiceData?.total?.sgst) /
                                100
                              )?.toFixed(2) ||
                              "0"}
                            /-
                          </p>
                        </div>
                      </div>
                    )}

                    {invoiceData?.total?.igst > 0 && (
                      <div className="flex justify-between text-sm">
                        <p className="text-[#232B77] text-xl font-bold">
                          IGST{" "}
                          <span className="text-lg font-semibold">
                            ({invoiceData?.total?.igst || "0"} %)
                          </span>
                        </p>
                        <div className="flex gap-4">
                          <p className="text-[#027BD1]">
                            {invoiceData?.total?.igstAmount?.toFixed(2) ||
                              (
                                (invoiceData?.total?.grossAmount *
                                  invoiceData?.total?.igst) /
                                100
                              )?.toFixed(2) ||
                              "0"}
                            %
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="flex justify-between">
                      <p className="text-[#232B77] text-lg font-semibold">
                        Grand Total
                      </p>
                      <p className="text-[#027bd1]">
                        {invoiceData?.total?.grandTotal?.toFixed(2)}
                        /-
                      </p>
                    </div>

                    {invoiceData.total.roundOff > 0 && (
                      <div className="flex justify-between">
                        <p className="text-[#232B77] text-lg font-semibold">
                          Round off
                        </p>
                        <p className="text-[#027bd1]">
                          {invoiceData?.total?.roundOff?.toFixed(2)}
                          /-
                        </p>
                      </div>
                    )}
                    <p className="no-print h-[2px] bg-[#027BD1] my-2"></p>
                    <div className=" flex justify-between text-sm">
                      <p className="text-[#232B77] text-xl font-bold">
                        Net Payble Rs.
                      </p>
                      <p className="text-[#027BD1] font-bold text-xl">
                        {invoiceData?.total?.totalPayableAmount?.toFixed(2) ||
                          invoiceData?.total?.grandTotal?.toFixed(2) ||
                          "N/A"}
                        /-
                      </p>
                    </div>
                    <div className="mt-8">
                      <p className="text-[#232B77] font-semibold text-right">
                        For MNS Secure Solutions Pvt. Ltd.
                      </p>
                      <div className="mt-8 text-right">
                        <p className="text-[#232B77]">Authorized Signature</p>
                        <p className="text-[#232B77] mt-2">E.&O.E.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="no-print flex items-center justify-center mt-10 gap-2">
        <button
          onClick={handleDownloadPdf}
          className="bg-blue-500 cursor-pointer hover:bg-blue-600 transition-colors text-white px-6 py-2 rounded-lg shadow-md font-medium"
        >
          Download PDF
        </button>
      </div>
    </>
  );
}

export default MnsServicePdf;
