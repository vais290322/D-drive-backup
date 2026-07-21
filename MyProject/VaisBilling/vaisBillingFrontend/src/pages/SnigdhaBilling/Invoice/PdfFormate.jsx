import axios from "axios";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import React, { useEffect, useRef, useState } from "react";
import QrCodeComponent from "../../../component/QRCode/QrCodeComponent";
const bankUrl = import.meta.env.VITE_BASE_URL_Local;
import { ToWords } from 'to-words';

const companyName= import.meta.env.VITE_REACT_COMPANY_NAME;
const companyAddress= import.meta.env.VITE_REACT_COMPANY_ADDRESS;
const companyGST= import.meta.env.VITE_REACT_COMPANY_GSTIN;
const companyPhone= import.meta.env.VITE_REACT_COMPANY_PHONE;
const companyEmail= import.meta.env.VITE_REACT_COMPANY_EMAIL;
const companyState= import.meta.env.VITE_REACT_COMPANY_STATE;

const ViewPDF = ({ invoiceData }) => {
  // console.log("charges in promofa invoice : ", invoiceData);
  const [bank, setBank] = useState("")
  const toWords = new ToWords();
  const fetchBank = async () => {
    try {
      const response = await axios.get(`${bankUrl}/s/api/v1/bank/all`);
      if (response.data.success) {
        setBank(response.data.data[0])
      }
    } catch (error) {
      console.error('Error fetching bank data:', error);
    }
  }

  useEffect(() => {
    fetchBank()
  })

  // Invoice data destructuring
  const invoiceNumber = invoiceData.invoiceNumber;
  const date = invoiceData.date;
  const gst = companyGST;
  const paymenttype = invoiceData.paymentType;
  const name = invoiceData.receiverDetails.name;
  const address = invoiceData.receiverDetails.address;
  const state = invoiceData.receiverDetails.state;
  const gstNo = invoiceData.receiverDetails.gstin;
  const code = invoiceData.receiverDetails.vendorCode || " ";
  const transportaionCharges = invoiceData.transportationCharges;
  const grandTotal = invoiceData.grandTotal;
  const totalPayableAmount = invoiceData?.totalPayableAmount || invoiceData?.grandTotal || 0;

  // Reference for the printable content
  const componentRef = useRef(null);

  // Setup react-to-print using the provided syntax
  const handleDownloadPdf = async () => {
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
        "bg-white": "#FFFFFF"
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
                <h1 className="text-[40px] font-bold text-[#232B77]">{companyName}</h1>
                <p className="h-[3px] w-[500px] bg-[#232B77] my-4"></p>
                <p className="text-[16px] text-[#232B77] font-semibold">
                  {companyAddress}
                </p>
                <div className="w-full flex justify-between text-sm mt-1">
                  <div>
                    <p className="text-[#232B77] font-semibold text-sm">
                      GSTIN: <span className="text-[#027bd1]">{gst}</span>
                    </p>
                    <p className="text-[#232B77] font-semibold text-sm">
                      STATE:{" "}
                      <span className="text-[#027bd1]">{companyState}</span>
                    </p>
                  </div>
                  <div className="text-left">
                    <p className="text-[#232B77] font-semibold text-sm">
                      Email:{" "}
                      <span className="text-[#027bd1]">
                        {companyEmail}
                      </span>
                    </p>
                    <p className="text-blue-800 font-semibold text-sm">
                      Phone: <span className="text-[#027bd1]">{companyPhone}</span>
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
                    <span className="text-[#027bd1]">{new Date(invoiceData?.poDate).toLocaleDateString() || ""}</span>
                  </p>
                  <p className="text-[#232B77] font-semibold text-sm">
                    PO Number:{" "}
                    <span className="text-[#027bd1]">{invoiceData?.poNumber}</span>
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
                    )
                  }

                  )}
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
                    {toWords.convert(totalPayableAmount || grandTotal)} Rupees Only
                  </p>
                  <p className="text-blue-900 font-semibold text-sm">
                    Bank Name :{" "}
                    <span className="text-[#027bd1]">{bank.bankName}</span>
                  </p>
                  <p className="text-blue-900 font-semibold text-sm">
                    Acc No : {""} <span className="text-[#027bd1]">{bank.accountNumber}</span>
                  </p>
                  <p className="text-blue-900 font-semibold text-sm">
                    IFS Code :{" "}
                    <span className="text-[#027bd1]">{bank.ifscCode}</span>
                  </p>
                  <p className="text-blue-900 font-semibold text-sm">
                    Branch :{" "}
                    <span className="text-[#027bd1]">
                      {bank.branch}
                    </span>
                  </p>
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
                  {
                    invoiceData?.discount > 0 && (
                      <div className="flex gap-20 justify-between text-[#232B77] font-semibold text-sm">
                        <p>Discount Amount</p>
                        <p>{invoiceData.discount}/-</p>
                      </div>
                    )
                  }

                  {
                    invoiceData?.transportationCharges > 0 && (<div className="flex gap-20 justify-between text-[#232B77] font-semibold text-sm">
                      <p>Transportation Charges</p>
                      <p>{invoiceData?.transportationCharges || 0}/-</p>
                    </div>)

                  }

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
                  {
                    invoiceData?.taxGroup === "State Tax" ? (
                      <>
                        <div className="flex gap-20 justify-between text-[#232B77] font-semibold text-sm">
                          <p>CGST</p>
                          <p>
                            {invoiceData.items?.reduce(
                              (acc, cur) => acc + (cur.cgst * cur.grossAmount) / 100,
                              0
                            )}
                            /-
                          </p>
                        </div>
                        <div className="flex gap-20 justify-between text-[#232B77] font-semibold text-sm">
                          <p>SGST</p>
                          <p>
                            {invoiceData.items?.reduce(
                              (acc, cur) => acc + (cur.sgst * cur.grossAmount) / 100,
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
                            (acc, cur) => acc + (cur.igst * cur.grossAmount) / 100,
                            0
                          )}
                          /-
                        </p>
                      </div>
                    )
                  }

                  <div className="flex gap-20 justify-between text-[#232B77] font-bold text-[16px] ">
                    <p>Grand Total :</p>
                    <p>{grandTotal}/-</p>
                  </div>
                  <div className="flex gap-20 justify-between text-[#232B77] font-bold text-[16px] ">
                    <p>Round Off : </p>
                    <p>{invoiceData?.roundOff}/-</p>
                  </div>
                  <div className="flex gap-20 justify-between text-[#232B77] font-bold text-[16px] border-t border-black  my-4">
                    <p>Total Payable Amount :</p>
                    <p>{totalPayableAmount || grandTotal  }/-</p>
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
