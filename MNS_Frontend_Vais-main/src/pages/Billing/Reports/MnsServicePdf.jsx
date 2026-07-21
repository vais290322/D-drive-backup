import React, { useRef } from "react";
import Logo from "../../../assets/mns.jpg";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

function MnsServicePdf({ invoiceData, header }) {
  const componentRef = useRef();
  const gst = "19AAQCM5971R1Z6";
  const state ="+91 9614544973";

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

  // number to word
  const belowTwenty = [
    "zero",
    "one",
    "two",
    "three",
    "four",
    "five",
    "six",
    "seven",
    "eight",
    "nine",
    "ten",
    "eleven",
    "twelve",
    "thirteen",
    "fourteen",
    "fifteen",
    "sixteen",
    "seventeen",
    "eighteen",
    "nineteen",
  ];

  const tens = [
    "",
    "",
    "twenty",
    "thirty",
    "forty",
    "fifty",
    "sixty",
    "seventy",
    "eighty",
    "ninety",
  ];

  const thousands = ["", "thousand", "million", "billion"];
  const numberToWords = (num) => {
    if (!num) return "zero";
    num = Math.floor(num);
    if (num === 0) return "zero";

    let result = "";
    let thousandCounter = 0;

    while (num > 0) {
      if (num % 1000 !== 0) {
        result = helper(num % 1000) + thousands[thousandCounter] + " " + result;
      }
      num = Math.floor(num / 1000);
      thousandCounter++;
    }

    return result.trim().toUpperCase();
  };

  const helper = (num) => {
    if (num === 0) return "";
    if (num < 20) return belowTwenty[num] + " ";
    if (num < 100) return tens[Math.floor(num / 10)] + " " + helper(num % 10);
    return belowTwenty[Math.floor(num / 100)] + " hundred " + helper(num % 100);
  };

  const handleDownloadPdf = async () => {
    try {
      if (!componentRef.current) {
        console.error("Component reference is null.");
        return;
      }

      const input = componentRef.current;

      // Convert Tailwind's oklch colors to hex
      const colorMap = {
        "bg-blue-50": "#eff6ff",
        "text-[#232B77]": "#232B77",
        "text-[#027BD1]": "#027BD1",
        "bg-[#027BD1]": "#027BD1",
        "bg-[#4250D3]": "#4250D3",
        "border-[#242323]": "#242323",
        "border-blue-300": "#93c5fd",
      };

      // Create canvas
      const canvas = await html2canvas(input, {
        scale: 1.2, // Lower scale for smaller file size
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
      const imgData = canvas.toDataURL("image/jpeg", 0.7); // Use JPEG and lower quality
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
        className="print-container bg-white font-poppins min-h-screen"
        ref={componentRef}
      >
        <div className="">
          <div className="p-6">
            {/* Header Section */}
            <div className="text-center mb-4">
              <h1 className="text-[40px] font-bold text-[#232B77] my-3">
                TAX {header} INVOICE
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
                      MNS SECURE SOLUTION
                    </p>
                    <p className="text-[#232B77] font-semibold text-xl">
                      CIN NO: <span className="text-[#027BD1]">{gst}</span>
                    </p>
                    <p className="text-[#232B77] font-semibold text-xl">
                      PHONE: <span className="text-[#027BD1]">{state}</span>
                    </p>
                  </div>
                </div>
                <div className="flex flex-col">
                <h1 className="text-[#232B77] text-xl font-semibold pb-2">INVOICE DETAILS:</h1>
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
              <div className="bg-blue-50 p-4 mt-20">
                <div className="flex flex-col justify-between">
                <h1 className="text-[#232B77] text-xl font-semibold pb-2">SERVICE DETAILS:</h1>
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
                  {/* <p className="text-[#232B77] font-semibold text-sm">
                    PAN:{" "}
                    <span className="text-[#027BD1]">
                      {invoiceData?.receiverDetails?.panNo || " "}
                    </span>
                  </p> */}
                  <p className="text-[#232B77] font-semibold text-sm pb-5">
                    Site:{" "}
                    <span className="text-[#027BD1]">
                      {invoiceData?.location || " "}
                    </span>
                  </p>
                  <p className="text-[#232B77] font-semibold text-lg">
                    Bill On Month of {invoiceData?.receiverDetails?.monthYear}, {invoiceData?.receiverDetails?.year}
                  </p>
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
                              {item.amount.toFixed(2) || item.grossAmount.toFixed(2) || "N/A"}/-
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
                <div className="flex justify-between mt-6">
                  <div className="w-1/2">
                    <p className="text-[#232B77] font-semibold text-lg">
                      {numberToWords(
                        invoiceData?.total?.grandTotal ||
                          invoiceData?.grandTotal
                      )}{" "}
                      RUPEES ONLY
                    </p>
                    <div className="mt-4">
                      <p className="text-[#232B77] font-semibold text-lg">
                        Terms & Conditions:
                      </p>
                      <p className="text-[#232B77] text-sm mt-2">
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
                      </p>
                    </div>
                  </div>
                  <div className="w-1/3">
                    <div className="flex justify-between text-sm">
                      <p className="text-[#232B77] text-xl font-bold">Total</p>
                      <p className="text-[#027BD1]">
                        {invoiceData?.total?.grossAmount.toFixed(2) ||
                          invoiceData?.grossAmount ||
                          "N/A"}
                        /-
                      </p>
                    </div>
                    {invoiceData?.total?.cgst > 0 && (
                      <div className="flex justify-between text-sm">
                        <p className="text-[#232B77] text-xl font-bold">CGST <span className="text-lg font-semibold">({invoiceData?.total?.cgst || "0"} %)</span></p>
                        <div className="flex gap-4">
                          <p className="text-[#027BD1]">
                            {invoiceData?.total?.cgstAmount?.toFixed(2) || (invoiceData?.total?.grossAmount * invoiceData?.total?.cgst / 100).toFixed(2) || "0"}
                            /-
                          </p>
                        </div>
                      </div>
                    )}
                    {invoiceData?.total?.sgst > 0 && (
                      <div className="flex justify-between text-sm">
                        <p className="text-[#232B77] text-xl font-bold">SGST <span className="text-lg font-semibold">({invoiceData?.total?.sgst || "0"} %)</span></p>
                        <div className="flex gap-4">
                          <p className="text-[#027BD1]">
                            {invoiceData?.total?.sgstAmount?.toFixed(2) || (invoiceData?.total?.grossAmount * invoiceData?.total?.sgst / 100).toFixed(2) || "0"}
                            /-
                          </p>
                        </div>
                      </div>
                    )}

                    {invoiceData?.total?.igst > 0 && (
                      <div className="flex justify-between text-sm">
                        <p className="text-[#232B77] text-xl font-bold">IGST <span className="text-lg font-semibold">({invoiceData?.total?.igst || "0"} %)</span></p>
                        <div className="flex gap-4">
                          <p className="text-[#027BD1]">
                            {invoiceData?.total?.igstAmount?.toFixed(2) || (invoiceData?.total?.grossAmount * invoiceData?.total?.igst / 100).toFixed(2) || "0"}%
                          </p>
                        </div>
                      </div>
                    )}
                    <p className="no-print h-[2px] bg-[#027BD1] my-2"></p>
                    <div className=" flex justify-between text-sm">
                      <p className="text-[#232B77] text-xl font-bold">Net Payble Rs.</p>
                      <p className="text-[#027BD1] font-bold text-xl">
                        {invoiceData?.total?.grandTotal.toFixed(2) ||
                          invoiceData?.grandTotal.toFixed(2) ||
                          "N/A"}
                        /-
                      </p>
                    </div>
                    <div className="mt-8">
                      <p className="text-[#232B77] font-semibold text-right">
                        For MNS Secure Solutions PVT LTD
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

      <div className="no-print flex items-center justify-center mt-10">
        <button
          onClick={handleDownloadPdf}
          className="bg-blue-500 hover:bg-blue-600 transition-colors text-white px-6 py-2 rounded-lg shadow-md font-medium"
        >
          Download PDF
        </button>
      </div>
    </>
  );
}

export default MnsServicePdf;