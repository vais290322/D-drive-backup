import React, { useState, useEffect } from "react";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import axios from "axios";
import Logo from "../../../assets/mns.jpg";
import { ToWords } from "to-words";
const bankUrl = import.meta.env.VITE_BASE_URL_Local;
function MnsProductPdf({ invoiceData }) {
  // const printRef = useRef();
  
  const [fetchedData, setFetchedData] = useState([]);
  const fetchBankDetails = async () => {
    const response = await axios.get(`${bankUrl}/api/v1/bank/getBankDetails`);
    // console.log("API Response:", response.data.data);

    // Check if data exists in response

    const bankData = response.data.data;
    console.log(bankData[0]);
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
  const supplierAddress = "456 Supplier Street, Los Angeles, CA 90001";
  const supplierEmail = "contact@xyzsupplies.com";
  const supplierPhone = "+1 (987) 654-3210";
  const gst = "19AAQCM5971R1Z5";
  const state = "West Bengal (19)";

  // const handlePrint = useReactToPrint({
  //   content: () => printRef.current,
  // });

  const contentRef = useRef(null);
  
  const handlePrint = useReactToPrint({
    content: () => contentRef.current,
    documentTitle: `Invoice-${invoiceData?.invoiceNumber || 'download'}`,
    onAfterPrint: () => console.log('PDF downloaded successfully!'),
    removeAfterPrint: true
  });

  return (
    <div
      className="w-[210mm] h-[297mm] mx-auto bg-white font-poppins"
      style={{
        boxSizing: "border-box",
      }}
    >
      <div className="border-[20px] border-[#095992] "  ref={contentRef}>
        <div className="p-6">
          {/* Header Section */}
          <div className="text-center mb-4">
            <h1 className="text-[24px] font-bold text-[#232B77]">
              PRODUCT INVOICE
            </h1>
            <div className="h-[2px] w-[350px] bg-[#4250d3] mx-auto mt-1"></div>
          </div>

          {/* Company Info Section */}
          <div className="flex justify-between items-start">
            <div className="flex flex-col items-start gap-4">
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
            <div>
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
                  Email: <span className="text-[#027bd1]">{supplierEmail}</span>
                </p>
                <p className="text-[#232B77]">
                  Phone: <span className="text-[#027bd1]">{supplierPhone}</span>
                </p>
              </div>
            </div>
          </div>

          {/* PO Information */}
          <div className="bg-blue-50 p-4 mt-6 " >
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
              </div>
              <div className="flex flex-col gap-1">
                <h1 className="text-lg font-semibold text-[#232B77] pb-2">
                  INVOICE INFORMATION
                </h1>
                <p className="text-[#232B77] font-semibold text-sm">
                  INVOICE Number: <span className="text-[#027bd1]">{invoiceData?.invoiceNumber}</span>
                </p>
                <p className="text-[#232B77] font-semibold text-sm">
                  INVOICE Date: <span className="text-[#027bd1]">{invoiceData?.date}</span>
                </p>
                {/* <p className="text-[#232B77] font-semibold text-sm">
                  Order Number: <span className="text-[#027bd1]">{poDate}</span>
                </p> */}
              </div>
            </div>

            {/* Products Table */}
            <div className="mt-6">
              <table className="w-full border-collapse border border-gray-300">
                <thead className="bg-[#027bd1] text-white text-sm">
                  <tr>
                    <th className="border p-2">SL No</th>
                    <th className="border p-2">Description</th>
                    <th className="border p-2">HSN Code</th>
                    <th className="border p-2">Qty</th>
                    <th className="border p-2">Rate</th>
                    <th className="border p-2">Tax Amount</th>
                    <th className="border p-2">CGST</th>
                    <th className="border p-2">SGST</th>
                    <th className="border p-2">IGST</th>
                    <th className="border p-2">Amount</th>
                  </tr>
                </thead>
                <tbody className="text-[#027bd1] text-center text-sm">
                  {invoiceData &&
                    invoiceData.items.map((e, i) => {
                      return (
                        <>
                          <tr key={i}>
                            <td className="border p-2">{i + 1}</td>
                            <td className="border p-2">{e.itemName}</td>
                            <td className="border p-2">{e.hsnCode}</td>
                            <td className="border p-2">{e.quantity}</td>
                            <td className="border p-2">{e.taxRate}</td>
                            <td className="border p-2">{e.taxAmount}</td>
                            <td className="border p-2">{e.cgst}</td>
                            <td className="border p-2">{e.sgst}</td>
                            <td className="border p-2">{e.igst}</td>
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
                <p className="text-[#232B77] font-semibold mb-4">{words}</p>
                <div className="text-sm">
                  <p className="text-[#232B77]">
                    Bank Name:{" "}
                    <span className="text-[#027bd1]">
                      {fetchedData.bankName}
                    </span>
                  </p>
                  <p className="text-[#232B77]">
                    Branch:{" "}
                    <span className="text-[#027bd1]">
                      {fetchedData.branchName}
                    </span>
                  </p>
                  <p className="text-[#232B77]">
                    Account Number:{" "}
                    <span className="text-[#027bd1]">
                      {fetchedData.accountNumber}
                    </span>
                  </p>
                  <p className="text-[#232B77]">
                    Account Holder Name:{" "}
                    <span className="text-[#027bd1]">
                      {fetchedData.accountHolderName}
                    </span>
                  </p>
                  <p className="text-[#232B77]">
                    IFS Code:{" "}
                    <span className="text-[#027bd1]">
                      {fetchedData.ifscCode}
                    </span>
                  </p>
                </div>
              </div>
              <div className="w-1/3 text-lg font-semibold">
                <div className="flex justify-between  ">
                  <p className="text-[#232B77]">Taxable Amount</p>
                  <p className="text-[#027bd1]">{invoiceData.taxableAmount}</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-[#232B77]">CGST</p>
                  <p className="text-[#027bd1]">
                    {invoiceData.items?.reduce(
                      (acc, cur) => acc + (cur.cgst * cur.grossAmount) / 100,
                      0
                    )}
                    /-
                  </p>
                </div>
                <div className="flex justify-between">
                  <p className="text-[#232B77]">SGST</p>
                  <p className="text-[#027bd1]">
                    {invoiceData.items?.reduce(
                      (acc, cur) => acc + (cur.sgst * cur.grossAmount) / 100,
                      0
                    )}
                    /-
                  </p>
                </div>
                <div className="flex justify-between">
                  <p className="text-[#232B77]">IGST</p>
                  <p className="text-[#027bd1]">
                    {invoiceData.items?.reduce(
                      (acc, cur) => acc + (cur.igst * cur.grossAmount) / 100,
                      0
                    )}
                    /-
                  </p>
                </div>
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
                <div className="flex justify-between">
                  <p className="text-[#232B77]">Transportain Charges</p>
                  <p className="text-[#027bd1]">0/-</p>
                </div>

                <div className="flex justify-between">
                  <p className="text-[#232B77]">Grand Total</p>
                  <p className="text-[#027bd1]">{invoiceData.grandTotal}</p>
                </div>
                <div className="h-[1px] w-full bg-[#232B77]"></div>
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
                <p className="text-[#232B77] text-sm">Authorized Signature</p>
                <p className="text-[#232B77] text-sm">(Procurement Manager)</p>
              </div>
            </div>

            <div className="text-center mt-6 text-sm text-[#232B77]">
              <p>This is Computer Generated Invoice No Signature Required</p>
            </div>
          </div>
        </div>
      </div>
      <button
        className="rounded-md bg-blue-800 py-1.5 px-3 border border-transparent text-center text-xl text-white transition-all shadow-sm hover:shadow focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-blue-600 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none mt-1.5"
        onClick={()=>window.print()}
      >
        Print Invoice
      </button>
      {/* <button
          className="rounded-md bg-green-600 py-1.5 px-3 border border-transparent text-center text-xl text-white transition-all shadow-sm hover:shadow focus:bg-green-700 focus:shadow-none active:bg-green-700 hover:bg-green-500 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
          onClick={handlePrint}
        >
          Download PDF
        </button> */}
    </div>
  );
}

export default MnsProductPdf;


