import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import Logo from "../../../assets/mns.jpg";

function MnsServicePdf({ invoiceData }) {
  const componentRef = useRef();

  // Default values in case invoiceData properties are undefined
  const gst = "19AAQCM5971R1Z5";
  const state = "West Bengal (19)";

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).replace(/\//g, ".");
  };

  return (
    <>
      {/* Style block for print settings */}
      <style>
        {`
          @media print {
            /* Hide all elements with no-print class during printing */
            .no-print {
              display: none !important;
            }
            /* Ensure the print area is formatted as A4 */
            .print-container {
              width: 210mm;
              height: 297mm;
              margin: 0 auto;
            }
          }
        `}
      </style>

      <div
        className="print-container bg-white font-poppins"
        ref={componentRef}
        style={{ boxSizing: "border-box" }}
      >
        <div className="border-[20px] border-[#095992]">
          <div className="p-6">
            {/* Header Section */}
            <div className="text-center mb-4">
              <h1 className="text-[28px] font-bold text-[#232B77]">
                INVOICE / TAX INVOICE / PERFORMANCE INVOICE
              </h1>
              {/* Horizontal line hidden on print */}
              <div className="no-print h-[3px] w-[350px] bg-[#4250D3] mx-auto mt-2"></div>
            </div>
            {/* Company Info Section */}
            <div className="px-6 mt-2">
              <div className="flex justify-between items-start">
                <div className="flex flex-col items-start">
                  <img src={Logo} alt="MNS Logo" className="h-12 w-28" />
                  <div className="text-sm">
                    <p className="text-[#232B77] font-semibold text-xl pt-2">
                      MNS SECURE SOLUTION
                    </p>
                    <p className="text-[#232B77] font-semibold">
                      CIN NO: <span className="text-[#027BD1]">{gst}</span>
                    </p>
                    <p className="text-[#232B77] font-semibold">
                      PHONE: <span className="text-[#027BD1]">{state}</span>
                    </p>
                  </div>
                </div>
                <div className="flex flex-col">
                  <p className="text-[#232B77] font-semibold">
                    Invoice NO:{" "}
                    <span className="text-[#027BD1]">
                      {invoiceData?.invoiceNumber || "N/A"}
                    </span>
                  </p>
                  <p className="text-[#232B77] font-semibold">
                    Invoice Date:{" "}
                    <span className="text-[#027BD1]">
                      {formatDate(invoiceData?.date)}
                    </span>
                  </p>
                  <p className="text-[#232B77] font-semibold">
                    Vendor Code:{" "}
                    <span className="text-[#027BD1]">
                      {invoiceData?._id?.substring(0, 8) || "N/A"}
                    </span>
                  </p>
                  <p className="text-[#232B77] font-semibold">
                    GST NO:{" "}
                    <span className="text-[#027BD1]">
                      {invoiceData?.receiverDetails?.gstin || "N/A"}
                    </span>
                  </p>
                  <p className="text-[#232B77] font-semibold">
                    Address:{" "}
                    <span className="text-[#027BD1]">
                      {invoiceData?.receiverDetails?.address || "N/A"}
                    </span>
                  </p>
                </div>
              </div>
              {/* PO Information */}
              <div className="bg-blue-50 p-4 mt-1">
                <div className="flex flex-col justify-between">
                  <h1 className="text-lg font-semibold text-[#232B77] pb-2">
                    To{" "}
                    {invoiceData?.customerName ||
                      invoiceData?.receiverDetails?.name ||
                      "N/A"}
                  </h1>
                  <p className="text-[#232B77] font-semibold text-sm">
                    {invoiceData?.receiverDetails?.address || "N/A"}
                  </p>
                  <p className="text-[#232B77] font-semibold text-sm">
                    GSTIN:{" "}
                    <span className="text-[#027BD1]">
                      {invoiceData?.receiverDetails?.gstin || "N/A"}
                    </span>
                  </p>
                  <p className="text-[#232B77] font-semibold text-sm">
                    PAN:{" "}
                    <span className="text-[#027BD1]">
                      {invoiceData?.receiverDetails?.panNo || "N/A"}
                    </span>
                  </p>
                  <p className="text-[#232B77] font-semibold text-sm pb-5">
                    Site:{" "}
                    <span className="text-[#027BD1]">
                      {invoiceData?.location || "N/A"}
                    </span>
                  </p>
                  <p className="text-[#232B77] font-semibold text-lg">
                    Bill On {formatDate(invoiceData?.date)}
                  </p>
                </div>
                {/* Products Table */}
                <div className="mt-2">
                  <table className="w-full border border-blue-300">
                    <thead className="bg-[#027BD1] text-white text-sm">
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
                            <td className="p-2">
                              {item.sacCode || "N/A"}
                            </td>
                            <td className="p-2">
                              {item.noOfPerson || "N/A"}
                            </td>
                            <td className="p-2">
                              {item.noOfDuites || "N/A"}
                            </td>
                            <td className="p-2">
                              {item.rate || "N/A"}/-
                            </td>
                            <td className="p-2">
                              {item.month || "N/A"}
                            </td>
                            <td className="p-2">
                              {item.amount || item.grossAmount || "N/A"}/-
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
                      Rupees{" "}
                      {invoiceData?.total?.grandTotal ||
                        invoiceData?.grandTotal ||
                        "N/A"}{" "}
                      Only
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
                        late payments incurring additional fees. Any disputes must
                        be raised within 7 days of receipt, but undisputed portions
                        remain payable on time.
                      </p>
                      <p className="text-[#232B77] text-sm mt-2">
                        <span className="font-semibold">
                          Liabilities & Policies:
                        </span>{" "}
                        Ownership of goods or services remains with MNS Secure
                        Solutions PVT LTD until full payment is made. The company is
                        not liable for indirect or consequential damages, & all
                        agreements are governed by Indian laws. Refunds, cancellations,
                        or amendments will follow the service agreement terms.
                      </p>
                    </div>
                  </div>
                  <div className="w-1/3">
                    <div className="flex justify-between text-sm">
                      <p className="text-[#232B77]">Total</p>
                      <p className="text-[#027BD1]">
                        {invoiceData?.total?.grossAmount ||
                          invoiceData?.grossAmount ||
                          "N/A"}
                        /-
                      </p>
                    </div>
                    <div className="flex justify-between text-sm">
                      <p className="text-[#232B77]">SGST</p>
                      <div className="flex gap-4">
                        <p className="text-[#027BD1]">
                          {invoiceData?.total?.sgst || "0"}%
                        </p>
                        <p className="text-[#027BD1]">
                          {invoiceData?.total?.sgst || "0"}/-
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-between text-sm">
                      <p className="text-[#232B77]">CGST</p>
                      <div className="flex gap-4">
                        <p className="text-[#027BD1]">
                          {invoiceData?.total?.cgst || "0"}%
                        </p>
                        <p className="text-[#027BD1]">
                          {invoiceData?.total?.cgst || "0"}/-
                        </p>
                      </div>
                    </div>
                    {/* Line divider hidden on print */}
                    <p className="no-print h-[2px] w-[14rem] bg-[#027BD1]"></p>
                    <div className="mt-4 flex justify-between text-sm">
                      <p className="text-[#232B77]">Net Payble Rs.</p>
                      <p className="text-[#027BD1]">
                        {invoiceData?.total?.grandTotal ||
                          invoiceData?.grandTotal ||
                          "N/A"}
                        /-
                      </p>
                    </div>
                    <div className="mt-8">
                      <p className="text-[#232B77] font-semibold text-right">
                        For MNS Secure Solutions PVT LTD
                      </p>
                      <div className="mt-8 text-right">
                        <p className="text-[#232B77]">
                          Authorized Signature
                        </p>
                        <p className="text-[#232B77] text-sm">
                          (Procurement Manager)
                        </p>
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
      {/* 
        If you have an invoice preview container or a cross/close button elsewhere in your UI,
        ensure you add the class "no-print" to them so they won't be printed.
      */}
      {/* Print Button wrapped in a container with no-print class so it won't appear in print */}
      <div className="no-print flex items-center justify-center mt-10">
        <button
          onClick={() => window.print()}
          className="bg-blue-500 hover:bg-blue-600 transition-colors text-white px-6 py-2 rounded-lg shadow-md font-medium"
        >
          Print
        </button>
      </div>
    </>
  );
}

export default MnsServicePdf;
