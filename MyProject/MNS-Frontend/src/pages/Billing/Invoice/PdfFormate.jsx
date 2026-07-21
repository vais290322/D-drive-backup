import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";

const ViewPDF = ({invoiceData}) => {
    const belowTwenty = [
        "zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten",
        "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"
      ];
      const tens = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];
      const thousands = ["", "thousand", "million", "billion"];
    
      const numberToWords = (num) => {
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
    
        return result.trim();
      };
    
      const helper = (num) => {
        if (num === 0) return "";
        if (num < 20) return belowTwenty[num] + " ";
        if (num < 100) return tens[Math.floor(num / 10)] + " " + helper(num % 10);
        return belowTwenty[Math.floor(num / 100)] + " hundred " + helper(num % 100);
      };
    
      // Invoice data destructuring
      const invoiceNumber = invoiceData.invoiceNumber;
      const date = invoiceData.date;
      const gst = "GSTN-3251276";
      const paymenttype = invoiceData.paymentType;
      const name = invoiceData.receiverDetails.name;
      const address = invoiceData.receiverDetails.address;
      const state = invoiceData.receiverDetails.state;
      const gstNo = invoiceData.receiverDetails.gstin;
      const code = "N/A";
      const transportaionCharges = 0;
      const grandTotal = invoiceData.grandTotal;
    
      // Reference for the printable content
      const componentRef = useRef(null);
    
      // Setup react-to-print using the provided syntax
      const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: `Invoice_${invoiceNumber}`,
        onBeforePrint: () => console.log("Preparing to print..."),
        onAfterPrint: () => console.log("PDF downloaded successfully!"),
        pageStyle: `
          @page {
            size: A4;
            margin: 0;
          }
          @media print {
            body {
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
          }
        `,
      });
    
  return (
    <div>
      {/* Invoice Content */}
      <div
        className="w-[210mm] h-[297mm] mx-auto bg-white print:w-full print:h-full"
        ref={componentRef}
        style={{ boxSizing: "border-box" }}
      >
        <div className="border-[25px] border-[#095992]">
          <div className="p-5">
            {/* Header Section */}
            <div className="px-2">
              <div className="flex flex-col items-center justify-center">
                <h1 className="text-[40px] font-bold text-[#232B77]">
                  MNS
                </h1>
                <p className="h-[2px] w-[500px] bg-[#232B77]"></p>
                <p className="text-[16px] text-[#232B77] font-semibold">
                  SECOND FLOOR, 105/19, SHIL COLONY, DUMDUM ROAD, KOLKATA - 700064
                </p>
                <div className="w-full flex justify-between text-sm mt-1">
                  <div>
                    <p className="text-[#232B77] font-semibold text-sm">
                      GSTIN: <span className="text-[#027bd1]">{gst}</span>
                    </p>
                    <p className="text-[#232B77] font-semibold text-sm">
                      STATE: <span className="text-[#027bd1]">West Bengal (19)</span>
                    </p>
                  </div>
                  <div className="text-left">
                    <p className="text-[#232B77] font-semibold text-sm">
                      Email: <span className="text-[#027bd1]">snigdhaenterprise2023@gmail.com</span>
                    </p>
                    <p className="text-blue-800 font-semibold text-sm">
                      Phone: <span className="text-[#027bd1]">9073656557</span>
                    </p>
                  </div>
                </div>
              </div>
              {/* Invoice Details Section */}
              <div className="bg-blue-50 mt-1">
                <h2 className="text-center font-bold text-xl text-[#1F3180]">
                  TAX INVOICE
                </h2>
              </div>
              <div className="flex justify-between mb-4">
                <div>
                  <p className="text-[#232B77] font-semibold text-sm">
                    Invoice No: <span className="text-[#027bd1]">{invoiceNumber}</span>
                  </p>
                  <p className="text-[#232B77] font-semibold text-sm">
                    Invoice Date: <span className="text-[#027bd1]">{date}</span>
                  </p>
                </div>
                <div className="pr-10">
                  <p className="text-[#232B77] font-semibold text-sm">
                    Purchase Order No: <span className="text-[#027bd1]">{code}</span>
                  </p>
                  <p className="text-[#232B77] font-semibold text-sm">
                    Purchase Order Date: <span className="text-[#027bd1]">{code}</span>
                  </p>
                  <p className="text-[#232B77] font-semibold text-sm">
                    Payment Type: <span className="text-[#027bd1]">{paymenttype}</span>
                  </p>
                </div>
              </div>
              <div className="h-[2px] w-full bg-[#232B77]"></div>
              {/* Shipping Details */}
              <div className="flex justify-between mt-2">
                <div>
                  <h3 className="font-bold text-xl text-[#232B77] mb-2">
                    Shipping Details (Bill to)
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
                <div>
                  <h3 className="font-bold text-xl text-[#232B77] mb-2">
                    Shipping Details (Ship to)
                  </h3>
                  <p className="text-[#232B77] font-semibold text-sm">
                    Name: <span className="text-[#027bd1]">Snigdha Warehouse</span>
                  </p>
                  <p className="text-[#232B77] font-semibold text-sm">
                    Address: <span className="text-[#027bd1]">179 AJC BOSE ROAD KOLKATA-700014</span>
                  </p>
                  <p className="text-[#232B77] font-semibold text-sm">
                    State: <span className="text-[#027bd1]">West Bengal</span>
                  </p>
                  <p className="text-[#232B77] font-semibold text-sm">
                    GSTIN: <span className="text-[#027bd1]">19AAQCM5971R1Z5</span>
                  </p>
                  <p className="text-[#232B77] font-semibold text-sm">
                    Code: <span className="text-[#027bd1]">19</span>
                  </p>
                </div>
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
                    <th className="border-b border-gray-300 p-2">Gross Amount</th>
                    <th className="border-b border-gray-300 p-2">Dis. Amount</th>
                    <th className="border-b border-gray-300 p-2">Tax Per</th>
                    <th className="border-b border-gray-300 p-2">Tax Amount</th>
                    <th className="border-b border-gray-300 p-2">Amount</th>
                  </tr>
                </thead>
                <tbody className="text-[#027bd1] text-center font-semibold text-sm">
                  {invoiceData.items.map((item, index) => (
                    <tr key={index}>
                      <td className="border-b border-gray-300 p-2">{item.itemName}</td>
                      <td className="border-b border-gray-300 p-2">{item.hsnCode}</td>
                      <td className="border-b border-gray-300 p-2">{item.quantity}</td>
                      <td className="border-b border-gray-300 p-2">{item.unit}</td>
                      <td className="border-b border-gray-300 p-2">{item?.sellingPrice}</td>
                      <td className="border-b border-gray-300 p-2">{item.grossAmount}</td>
                      <td className="border-b border-gray-300 p-2">{item.discountRate}</td>
                      <td className="border-b border-gray-300 p-2">{item.taxRate}</td>
                      <td className="border-b border-gray-300 p-2">{item.taxAmount}</td>
                      <td className="border-b border-gray-300 p-2">{item.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {/* Footer Section */}
              <div className="flex gap-2">
                <div className="flex flex-col">
                  <div className="flex mt-2">
                    <table className="border-collapse border text-[10px] border-gray-300 mb-4">
                      <thead className="bg-[#027bd1] text-white py-10">
                        <tr>
                          <th className="border-b border-gray-300 p-2">HSN CODE</th>
                          <th className="border-b border-gray-300 p-2">TABLE AMT</th>
                          <th className="border-b border-gray-300 p-2">CGST%</th>
                          <th className="border-b border-gray-300 p-2">CGST AMT</th>
                          <th className="border-b border-gray-300 p-2">SGST%</th>
                          <th className="border-b border-gray-300 p-2">SGST AMT</th>
                          <th className="border-b border-gray-300 p-2">IGST%</th>
                          <th className="border-b border-gray-300 p-2">IGST AMT</th>
                        </tr>
                      </thead>
                      <tbody className="text-[#027bd1] text-center font-semibold">
                        {invoiceData.items.map((item, index) => (
                          <tr key={index}>
                            <td className="border-b border-gray-300 p-2">{item.hsnCode}</td>
                            <td className="border-b border-gray-300 p-2">{item.grossAmount}</td>
                            <td className="border-b border-gray-300 p-2">{item.cgst}</td>
                            <td className="border-b border-gray-300 p-2">
                              {(item.cgst * item.grossAmount) / 100}
                            </td>
                            <td className="border-b border-gray-300 p-2">{item.sgst}</td>
                            <td className="border-b border-gray-300 p-2">
                              {(item.sgst * item.grossAmount) / 100}
                            </td>
                            <td className="border-b border-gray-300 p-2">{item.igst}</td>
                            <td className="border-b border-gray-300 p-2">
                              {(item.igst * item.grossAmount) / 100}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="text-blue-900 font-semibold text-[17px] mb-2">
                    {numberToWords(invoiceData.grandTotal)} rupees only
                  </p>
                  <p className="text-blue-900 font-semibold text-sm">
                    Bank Name: <span className="text-[#027bd1]">State Bank of India</span>
                  </p>
                  <p className="text-blue-900 font-semibold text-sm">
                    Acc No: <span className="text-[#027bd1]">20512270830</span>
                  </p>
                  <p className="text-blue-900 font-semibold text-sm">
                    IFS Code: <span className="text-[#027bd1]">SBIN0001612</span>
                  </p>
                  <p className="text-blue-900 font-semibold text-sm">
                    Branch: <span className="text-[#027bd1]">Salt Lake, SECTOR-1,Kolkata</span>
                  </p>
                </div>
                <div>
                  <div className="flex gap-20 text-[#232B77] font-semibold text-sm">
                    <p className="pr-[13px]">Total Amount</p>
                    <p>
                      {invoiceData.items?.reduce((acc, cur) => acc + cur.grossAmount, 0)}/-
                    </p>
                  </div>
                  <div className="flex gap-20 justify-between text-[#232B77] font-semibold text-sm">
                    <p>Discount Amount</p>
                    <p>{invoiceData.discount}/-</p>
                  </div>
                  <div className="flex gap-20 justify-between text-[#232B77] font-semibold text-sm">
                    <p>Transportation Charges</p>
                    <p>{transportaionCharges}/-</p>
                  </div>
                  <div className="flex gap-20 justify-between text-[#232B77] font-semibold text-sm">
                    <p>Taxable Amount</p>
                    <p>
                      {invoiceData.items?.reduce((acc, cur) => acc + cur.taxAmount, 0)}/-
                    </p>
                  </div>
                  <div className="flex gap-20 justify-between text-[#232B77] font-semibold text-sm">
                    <p>CGST</p>
                    <p>
                      {invoiceData.items?.reduce(
                        (acc, cur) => acc + (cur.cgst * cur.grossAmount) / 100,
                        0
                      )}/-
                    </p>
                  </div>
                  <div className="flex gap-20 justify-between text-[#232B77] font-semibold text-sm">
                    <p>SGST</p>
                    <p>
                      {invoiceData.items?.reduce(
                        (acc, cur) => acc + (cur.sgst * cur.grossAmount) / 100,
                        0
                      )}/-
                    </p>
                  </div>
                  <div className="flex gap-20 justify-between text-[#232B77] font-semibold text-sm">
                    <p>Cess Amount</p>
                    <p>0/-</p>
                  </div>
                  <div className="flex gap-20 justify-between text-[#232B77] font-semibold text-sm">
                    <p>Post Tax</p>
                    <p>0/-</p>
                  </div>
                  <div className="flex gap-20 justify-between text-[#232B77] font-semibold text-sm">
                    <p>TCS</p>
                    <p>0/-</p>
                  </div>
                  <div className="flex gap-20 justify-between text-[#232B77] font-semibold text-sm">
                    <p>Round of Amount</p>
                    <p>0/-</p>
                  </div>
                  <div className="flex gap-20 justify-between text-[#232B77] font-bold text-[16px] mt-2">
                    <p>Grand Total</p>
                    <p>{grandTotal}/-</p>
                  </div>
                </div>
              </div>
              <div className="h-[2px] w-full bg-blue-900"></div>
              {/* Signature Section */}
              <div className="flex justify-between mt-2">
                <div>
                  <p className="text-[#232B77] font-semibold text-[16px] mb-16">
                    Received the Material in Good Condition
                  </p>
                  <p className="h-[1px] w-[62%] bg-blue-900"></p>
                  <p className="text-[#232B77] font-semibold text-sm">
                    Receiver's Signature & Seal
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[#232B77] font-semibold text-[16px] mb-16">
                    For Snigtha Enterprise
                  </p>
                  <p className="text-[#232B77] font-semibold text-sm">
                    Authorized Signature
                  </p>
                  <p className="text-[#232B77] font-semibold text-sm">
                    (Procurement Manager)
                  </p>
                </div>
              </div>
              <div className="h-[2px] w-full bg-blue-900"></div>
              <div className="text-center text-[16px] text-[#232B77]">
                <p>This is Computer Generated No Need To Signature</p>
                <p>Thank You!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* PDF Print/Download Button */}
      <div className="text-center mt-4">
        <button
          // onClick={handlePrint}
          onClick={() => window.print()}
          className="bg-blue-500 hover:bg-blue-600 transition-colors text-white px-6 py-2 rounded-lg shadow-md font-medium"
        >
          Print 
        </button>
        {/* <button
          onClick={handlePrint}
          className="bg-green-500 hover:bg-green-600 transition-colors text-white px-6 py-2 rounded-lg shadow-md font-medium"
        >
          Download PDF
        </button> */}
      </div>
    </div>
  )
}

export default ViewPDF