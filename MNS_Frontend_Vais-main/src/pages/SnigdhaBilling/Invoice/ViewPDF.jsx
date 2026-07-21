import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import QrCodeComponent from "../../../component/QRCode/QrCodeComponent";

const bankUrl = import.meta.env.VITE_BASE_URL_Local;

const ViewPDF = ({ invoiceData }) => {
  console.log("invoiceData", invoiceData);

  const [bankdetails, setBankdetails] = useState({});

  const fetchBankData = async () => {
    try {
      const response = await axios.get(`${bankUrl}/s/api/v1/bank/all`);
      if (response) {
        setBankdetails(response?.data?.data[0]);
        // const bank = response?.data?.data[0]
      }
    } catch (error) {
      console.error("Error fetching bank details:", error);
    }
  };

  useEffect(() => {
    fetchBankData();
  }, []);

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

  // Invoice data destructuring
  const invoiceNumber = invoiceData?.invoiceNumber;
  const date = invoiceData?.date;
  const gst = "GSTN-19BTFPR0457K2Z7";
  const paymenttype = invoiceData?.paymentType;
  const name = invoiceData?.receiverDetails?.name;
  const address = invoiceData?.receiverDetails?.address;
  const state = invoiceData?.receiverDetails?.state;
  const gstNo = invoiceData?.receiverDetails?.gstin;
  const code = invoiceData?.vendorCode || " ";
  const transportationCharges = invoiceData?.transportationCharges || "0";
  const grandTotal = Math.floor(invoiceData?.grandTotal || 0);

  // Reference for the printable content
  const componentRef = useRef(null);

  const handleDownloadPdfWithScreenshort = async () => {
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

  // color version of pdf

  const handleDownloadPdfColorVersion = async () => {
    try {
      if (!componentRef.current) {
        console.error("Component reference is null.");
        return;
      }

      // Create a loading indicator
      const loadingDiv = document.createElement("div");
      loadingDiv.style.position = "fixed";
      loadingDiv.style.top = "0";
      loadingDiv.style.left = "0";
      loadingDiv.style.width = "100%";
      loadingDiv.style.height = "100%";
      loadingDiv.style.backgroundColor = "rgba(255, 255, 255, 0.7)";
      loadingDiv.style.display = "flex";
      loadingDiv.style.justifyContent = "center";
      loadingDiv.style.alignItems = "center";
      loadingDiv.style.zIndex = "9999";
      loadingDiv.innerHTML =
        '<div style="background: white; padding: 20px; border-radius: 5px; box-shadow: 0 0 10px rgba(0,0,0,0.2);">Generating PDF...</div>';
      document.body.appendChild(loadingDiv);

      // Wait for QR code to render completely
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Create a more structured PDF with border
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      // Add border to the entire page
      pdf.setDrawColor(0, 0, 0);
      pdf.setLineWidth(0.5);
      pdf.rect(6, 10, 198, 277);

      // Add header
      pdf.setFontSize(18);
      pdf.setTextColor(35, 43, 119); // #232B77
      pdf.setFont("helvetica", "bold");
      pdf.text("SNIGDHA ENTERPRISE", 105, 20, { align: "center" });

      // Add underline
      pdf.setDrawColor(35, 43, 119);
      pdf.setLineWidth(0.5);
      pdf.line(55, 22, 155, 22);

      // Add address
      pdf.setFontSize(10);
      pdf.setTextColor(0, 0, 0);
      pdf.text("AB-79, SALT LAKE CITY, SECTOR-I, KOLKATA - 700064", 105, 28, {
        align: "center",
      });

      // Add company details (GSTIN, State, Email, Phone)
      pdf.setFontSize(8);
      pdf.setTextColor(35, 43, 119);
      pdf.setFont("helvetica", "bold");
      pdf.text("GSTIN:", 20, 35);
      pdf.text("STATE:", 20, 40);

      pdf.text("Email:", 120, 35);
      pdf.text("Phone:", 120, 40);

      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(2, 123, 209);
      pdf.text(gst, 35, 35);
      pdf.text("West Bengal (19)", 35, 40);

      pdf.text("snigdhaenterprise2015@gmail.com", 135, 35);
      pdf.text("9073656557", 135, 40);

      // Add TAX INVOICE header
      pdf.setFillColor(239, 246, 255); // bg-blue-50
      pdf.rect(10, 45, 190, 8, "F");
      pdf.setTextColor(35, 43, 119);
      pdf.setFontSize(14);
      pdf.text("TAX INVOICE", 105, 51, { align: "center" });

      // Add invoice details - left side
      pdf.setFontSize(9);
      pdf.setTextColor(35, 43, 119);
      pdf.setFont("helvetica", "bold");
      pdf.text("Invoice No:", 15, 61);
      pdf.text("Invoice Date:", 15, 67);
      pdf.text("Payment Type:", 15, 73);
      pdf.text("GSTIN:", 15, 79);

      // Add invoice details - values
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(2, 123, 209); // #027bd1
      pdf.text(invoiceNumber || "N/A", 40, 61);
      pdf.text(date || "N/A", 40, 67);
      pdf.text(paymenttype || "N/A", 40, 73);
      pdf.text(gst || "N/A", 40, 79);

      // Add horizontal line
      pdf.setDrawColor(35, 43, 119);
      pdf.setLineWidth(0.5);
      pdf.line(10, 83, 200, 83);

      // Add shipping details headers
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(35, 43, 119);
      pdf.setFontSize(11);
      pdf.text("Shipping Details (Bill to)", 15, 91);
      pdf.text("Shipping Details (Ship to)", 120, 91);

      // Add shipping details - left side
      pdf.setFontSize(9);
      pdf.text("Name:", 15, 99);
      pdf.text("Address:", 15, 105);
      pdf.text("State:", 15, 115);
      pdf.text("GSTIN:", 15, 121);
      pdf.text("Code:", 15, 127);

      // Add shipping details - values with word wrapping for addresses
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(2, 123, 209);
      pdf.text(name || "N/A", 35, 99);

      // Handle address wrapping for Bill to
      const billToAddress = address || "N/A";
      const billToAddressLines = pdf.splitTextToSize(billToAddress, 70); // Limit width to 70mm
      pdf.text(billToAddressLines, 35, 105);

      pdf.text(state || "N/A", 35, 115);
      pdf.text(gstNo || "N/A", 35, 121);
      pdf.text(code || "N/A", 35, 127);

      // Add shipping details - right side
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(35, 43, 119);
      pdf.text("Name:", 120, 99);
      pdf.text("Address:", 120, 105);
      pdf.text("GSTIN:", 120, 115);

      // Add shipping details - values with word wrapping
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(2, 123, 209);
      pdf.text(invoiceData?.receiverDetails?.name || "N/A", 140, 99);

      // Handle address wrapping for Ship to
      const shipToAddress =
        invoiceData?.receiverDetails?.deliveryAddress || "N/A";
      const shipToAddressLines = pdf.splitTextToSize(shipToAddress, 60); // Limit width to 60mm
      pdf.text(shipToAddressLines, 140, 105);

      pdf.text(invoiceData?.receiverDetails?.gstin || "N/A", 140, 115);

      // Add items table
      pdf.autoTable({
        startY: 130,
        head: [
          [
            "Item Name",
            "HSN/SAC",
            "Qty",
            "Unit",
            "Rate",
            "Amount",
            "Tax %",
            "Tax Amount",
            "Amount",
          ],
        ],
        body:
          invoiceData?.items?.map((item) => {
            // Limit description length and add ellipsis if too long
            const description = item?.description
              ? item.description.length > 500
                ? item.description.substring(0, 500) + "..."
                : item.description
              : "";

            return [
              item.itemName + (description ? " (" + description + ")" : ""),
              item.hsnCode || "-",
              item.quantity,
              item.unit || "Pcs",
              item.sellingPrice,
              item.grossAmount,
              item.taxRate || "0.00",
              item.taxAmount || "0.00",
              item.amount,
            ];
          }) || [],
        theme: "grid",
        headStyles: {
          fillColor: [2, 123, 209],
          textColor: [255, 255, 255],
          fontSize: 8,
          fontStyle: "bold",
          halign: "center",
        },
        bodyStyles: {
          textColor: [2, 123, 209],
          fontSize: 8,
          halign: "center",
        },
        columnStyles: {
          0: { halign: "left", cellWidth: 40 },
        },
        margin: { left: 10, right: 10 },
        styles: {
          overflow: "linebreak",
          cellPadding: 2,
        },
        tableWidth: 190,
      });

      // Get the final Y position after the table
      const finalY = pdf.autoTable.previous.finalY + 5;

      // Add HSN summary table
      pdf.autoTable({
        startY: finalY,
        head: [
          [
            "HSN CODE",
            "TABLE AMT",
            "CGST%",
            "CGST AMT",
            "SGST%",
            "SGST AMT",
            "IGST%",
            "IGST AMT",
          ],
        ],
        body:
          invoiceData?.items?.map((item) => [
            item.hsnCode || "-",
            item.grossAmount,
            item.cgst || "0",
            ((item.cgst * item.grossAmount) / 100).toFixed(2),
            item.sgst || "0",
            ((item.sgst * item.grossAmount) / 100).toFixed(2),
            item.igst || "0",
            ((item.igst * item.grossAmount) / 100).toFixed(2),
          ]) || [],
        theme: "grid",
        headStyles: {
          fillColor: [2, 123, 209],
          textColor: [255, 255, 255],
          fontSize: 7,
          fontStyle: "bold",
          halign: "center",
        },
        bodyStyles: {
          textColor: [2, 123, 209],
          fontSize: 7,
          halign: "center",
        },
        margin: { left: 10, right: 10 },
        tableWidth: 120,
      });

      // Get the final Y position after the HSN table
      let hsnTableY = pdf.autoTable.previous.finalY + 5;

      // Check if we need to add a new page based on remaining space
      if (hsnTableY > 220) {
        pdf.addPage();
        pdf.setDrawColor(0, 0, 0);
        pdf.setLineWidth(0.5);
        pdf.rect(10, 10, 190, 277);
        // Reset Y position for the new page
        hsnTableY = 20;
      }

      // Add amount in words
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(30, 58, 138); // text-blue-900
      pdf.setFontSize(10);
      pdf.text(`${numberToWords(grandTotal)} RUPEES ONLY`, 15, hsnTableY);

      // Add bank details
      pdf.setFontSize(8);
      pdf.text("Bank Name:", 15, hsnTableY + 8);
      pdf.text("Acc No:", 15, hsnTableY + 14);
      pdf.text("IFS Code:", 15, hsnTableY + 20);
      pdf.text("Branch:", 15, hsnTableY + 26);

      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(2, 123, 209);
      pdf.text(bankdetails?.bankName || "sample bank", 40, hsnTableY + 8);
      pdf.text(
        bankdetails?.accountNumber || "sample Number",
        40,
        hsnTableY + 14
      );
      pdf.text(bankdetails?.ifscCode || "sample Code", 40, hsnTableY + 20);
      pdf.text(bankdetails?.branch || "sample Branch", 40, hsnTableY + 26);

      // Add summary section with dynamic positioning
      let currentY = hsnTableY;
      const lineSpacing = 6;

      // Always show Total Amount
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(0, 0, 0);
      pdf.text("Total Amount:", 140, currentY);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(50, 50, 50);
      pdf.text(`${totalAmount}/-`, 190, currentY, { align: "right" });
      currentY += lineSpacing;

      // Show Discount Amount only if greater than 0
      if (invoiceData?.discount > 0) {
        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(0, 0, 0);
        pdf.text("Discount Amount:", 140, currentY);
        pdf.setFont("helvetica", "normal");
        pdf.setTextColor(50, 50, 50);
        pdf.text(`${invoiceData?.discount}/-`, 190, currentY, { align: "right" });
        currentY += lineSpacing;
      }

      // Show Transportation Charges only if greater than 0
      if (parseFloat(transportationCharges) > 0) {
        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(0, 0, 0);
        pdf.text("Transportation Charges:", 140, currentY);
        pdf.setFont("helvetica", "normal");
        pdf.setTextColor(50, 50, 50);
        pdf.text(`${transportationCharges}/-`, 190, currentY, { align: "right" });
        currentY += lineSpacing;
      }

      // Show Taxable Amount if greater than 0
      if (parseFloat(taxableAmount) > 0) {
        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(0, 0, 0);
        pdf.text("Taxable Amount:", 140, currentY);
        pdf.setFont("helvetica", "normal");
        pdf.setTextColor(50, 50, 50);
        pdf.text(`${taxableAmount}/-`, 190, currentY, { align: "right" });
        currentY += lineSpacing;
      }

      // Show Tax amounts based on tax group
      if (invoiceData?.taxGroup === "State Tax") {
        // Show CGST if greater than 0
        if (parseFloat(totalCGST) > 0) {
          pdf.setFont("helvetica", "bold");
          pdf.setTextColor(0, 0, 0);
          pdf.text("CGST:", 140, currentY);
          pdf.setFont("helvetica", "normal");
          pdf.setTextColor(50, 50, 50);
          pdf.text(`${totalCGST}/-`, 190, currentY, { align: "right" });
          currentY += lineSpacing;
        }

        // Show SGST if greater than 0
        if (parseFloat(totalSGST) > 0) {
          pdf.setFont("helvetica", "bold");
          pdf.setTextColor(0, 0, 0);
          pdf.text("SGST:", 140, currentY);
          pdf.setFont("helvetica", "normal");
          pdf.setTextColor(50, 50, 50);
          pdf.text(`${totalSGST}/-`, 190, currentY, { align: "right" });
          currentY += lineSpacing;
        }
      } else if (invoiceData?.taxGroup === "Other Tax") {
        // Show IGST if greater than 0
        const totalIGST = invoiceData?.items
          ?.reduce(
            (acc, cur) =>
              acc +
              (parseFloat(cur.igst || 0) * parseFloat(cur.grossAmount || 0)) /
                100,
            0
          )
          .toFixed(2);

        if (parseFloat(totalIGST) > 0) {
          pdf.setFont("helvetica", "bold");
          pdf.setTextColor(0, 0, 0);
          pdf.text("IGST:", 140, currentY);
          pdf.setFont("helvetica", "normal");
          pdf.setTextColor(50, 50, 50);
          pdf.text(`${totalIGST}/-`, 190, currentY, { align: "right" });
          currentY += lineSpacing;
        }
      }

      // Add line before grand total
      currentY += 4; // Add some space before line
      pdf.setDrawColor(0, 0, 0);
      pdf.setLineWidth(0.5);
      pdf.line(140, currentY, 190, currentY);

      // Add grand total
      currentY += 6; // Add space after line
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(10);
      pdf.text("Grand Total:", 140, currentY);
      pdf.text(`${grandTotal}/-`, 190, currentY, { align: "right" });

      // Update hsnTableY for subsequent content
      hsnTableY = currentY;

      // Add horizontal line
      pdf.setDrawColor(30, 58, 138); // bg-blue-900
      pdf.setLineWidth(0.5);
      pdf.line(10, hsnTableY + 45, 200, hsnTableY + 45);

      // Check if we need to add a new page for signature section
      if (hsnTableY + 90 > 277) {
        pdf.addPage();
        pdf.setDrawColor(0, 0, 0);
        pdf.setLineWidth(0.5);
        pdf.rect(6, 10, 198, 277);
        // Reset Y position for the new page
        hsnTableY = 20;
      }

      // Add signature section
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(35, 43, 119);
      pdf.setFontSize(9);
      pdf.text("Received the Material in Good Condition", 15, hsnTableY + 55);
      pdf.text("For Snigdha Enterprise", 185, hsnTableY + 55, {
        align: "right",
      });

      // Capture QR code directly from DOM
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
              pdf.addImage(qrDataURL, "PNG", 90, hsnTableY + 50, 30, 30);

              // Continue with the rest of the PDF after QR code is added
              finalizePdf();
            })
            .catch((err) => {
              console.error("Error capturing QR code with html2canvas:", err);
              // Continue without QR code
              finalizePdf();
            });
        } else {
          console.warn("QR code element not found in DOM");
          finalizePdf();
        }
      } catch (qrError) {
        console.error("Error adding QR code:", qrError);
        // Continue without QR code
        finalizePdf();
      }

      // Function to finalize the PDF after QR code handling
      function finalizePdf() {
        // Add signature lines
        pdf.setDrawColor(30, 58, 138);
        pdf.line(15, hsnTableY + 70, 80, hsnTableY + 70);
        pdf.line(130, hsnTableY + 70, 185, hsnTableY + 70);

        // Add signature labels
        pdf.setFontSize(8);
        pdf.text("Receiver's Signature & Seal", 15, hsnTableY + 75);
        pdf.text("Authorized Signature", 185, hsnTableY + 75, {
          align: "right",
        });

        // Add horizontal line
        pdf.setDrawColor(30, 58, 138);
        pdf.line(10, hsnTableY + 80, 200, hsnTableY + 80);

        // Add footer
        pdf.setTextColor(35, 43, 119);
        pdf.setFontSize(9);
        pdf.text(
          "This is Computer Generated No Need To Signature",
          105,
          hsnTableY + 85,
          { align: "center" }
        );
        pdf.text("Thank You!", 105, hsnTableY + 90, { align: "center" });

        // Remove loading indicator
        document.body.removeChild(loadingDiv);

        // Save the PDF
        pdf.save(`invoice-${invoiceData?.invoiceNumber || "download"}.pdf`);
      }
    } catch (error) {
      console.error("PDF Generation Error:", error);
      // Remove loading indicator if there's an error
      const loadingDiv = document.querySelector(
        'div[style*="position: fixed"]'
      );
      if (loadingDiv) document.body.removeChild(loadingDiv);
    }
  };

  const handleDownloadPdf = async () => {
    try {
      if (!componentRef.current) {
        console.error("Component reference is null.");
        return;
      }

      // Create a loading indicator
      // const loadingDiv = document.createElement('div');
      // loadingDiv.style.position = 'fixed';
      // loadingDiv.style.top = '0';
      // loadingDiv.style.left = '0';
      // loadingDiv.style.width = '100%';
      // loadingDiv.style.height = '100%';
      // loadingDiv.style.backgroundColor = 'rgba(255, 255, 255, 0.7)';
      // loadingDiv.style.display = 'flex';
      // loadingDiv.style.justifyContent = 'center';
      // loadingDiv.style.alignItems = 'center';
      // loadingDiv.style.zIndex = '9999';
      // loadingDiv.innerHTML = '<div style="background: white; padding: 20px; border-radius: 5px; box-shadow: 0 0 10px rgba(0,0,0,0.2);">Generating PDF...</div>';
      // document.body.appendChild(loadingDiv);

      // Wait for QR code to render completely
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Create a more structured PDF with border
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      // Add border to the entire page
      pdf.setDrawColor(0, 0, 0); // Black border
      pdf.setLineWidth(0.5);
      pdf.rect(6, 10, 198, 277);

      // Add header
      pdf.setFontSize(18);
      pdf.setTextColor(0, 0, 0); // Black text instead of blue
      pdf.setFont("helvetica", "bold");
      pdf.text("SNIGDHA ENTERPRISE", 105, 20, { align: "center" });

      // Add underline
      pdf.setDrawColor(0, 0, 0); // Black underline instead of blue
      pdf.setLineWidth(0.5);
      pdf.line(55, 22, 155, 22);

      // Add address
      pdf.setFontSize(10);
      pdf.setTextColor(0, 0, 0);
      pdf.text("AB-79, SALT LAKE CITY, SECTOR-I, KOLKATA - 700064", 105, 28, {
        align: "center",
      });

      // Add company details (GSTIN, State, Email, Phone)
      pdf.setFontSize(8);
      pdf.setTextColor(0, 0, 0); // Black text instead of blue
      pdf.setFont("helvetica", "bold");
      pdf.text("GSTIN:", 20, 35);
      pdf.text("STATE:", 20, 40);

      pdf.text("Email:", 120, 35);
      pdf.text("Phone:", 120, 40);

      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(50, 50, 50); // Dark gray instead of blue
      pdf.text(gst, 35, 35);
      pdf.text("West Bengal (19)", 35, 40);

      pdf.text("snigdhaenterprise2015@gmail.com", 135, 35);
      pdf.text("9073656557", 135, 40);

      // Add TAX INVOICE header
      pdf.setFillColor(240, 240, 240); // Light gray background instead of blue
      pdf.rect(10, 45, 190, 8, "F");
      pdf.setTextColor(0, 0, 0); // Black text
      pdf.setFontSize(14);
      pdf.text("TAX INVOICE", 105, 51, { align: "center" });

      // Add invoice details - left side
      pdf.setFontSize(9);
      pdf.setTextColor(0, 0, 0); // Black text
      pdf.setFont("helvetica", "bold");
      pdf.text("Invoice No:", 15, 61);
      pdf.text("Invoice Date:", 15, 67);
      pdf.text("Payment Type:", 15, 73);
      pdf.text("GSTIN:", 15, 79);

      // Add invoice details - values
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(50, 50, 50); // Dark gray instead of blue
      pdf.text(invoiceNumber || "N/A", 40, 61);
      pdf.text(date || "N/A", 40, 67);
      pdf.text(paymenttype || "N/A", 40, 73);
      pdf.text(gst || "N/A", 40, 79);

      // Add horizontal line
      pdf.setDrawColor(0, 0, 0); // Black line instead of blue
      pdf.setLineWidth(0.5);
      pdf.line(10, 83, 200, 83);

      // Continue with the rest of the PDF generation with black and white colors
      // Add shipping details headers
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(0, 0, 0); // Changed from blue to black
      pdf.setFontSize(11);
      pdf.text("Shipping Details (Bill to)", 15, 91);
      pdf.text("Shipping Details (Ship to)", 120, 91);

      // Add shipping details - left side
      pdf.setFontSize(9);
      pdf.text("Name:", 15, 99);
      pdf.text("Address:", 15, 105);
      pdf.text("State:", 15, 115);
      pdf.text("GSTIN:", 15, 121);
      pdf.text("Code:", 15, 127);

      // Add shipping details - values with word wrapping for addresses
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(50, 50, 50); // Changed from blue to dark gray
      pdf.text(name || "N/A", 35, 99);

      // Handle address wrapping for Bill to
      const billToAddress = address || "N/A";
      const billToAddressLines = pdf.splitTextToSize(billToAddress, 70); // Limit width to 70mm
      pdf.text(billToAddressLines, 35, 105);

      pdf.text(state || "N/A", 35, 115);
      pdf.text(gstNo || "N/A", 35, 121);
      pdf.text(code || "N/A", 35, 127);

      // Add shipping details - right side
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(0, 0, 0); // Changed from blue to black
      pdf.text("Name:", 120, 99);
      pdf.text("Address:", 120, 105);
      pdf.text("GSTIN:", 120, 115);
      pdf.text("PO Number :", 120, 122);
      pdf.text("PO Date :", 120, 127);

      // Add shipping details - values with word wrapping
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(50, 50, 50); // Changed from blue to dark gray
      pdf.text(invoiceData?.receiverDetails?.name || "N/A", 140, 99);

      // Handle address wrapping for Ship to
      const shipToAddress =
        invoiceData?.receiverDetails?.deliveryAddress || "N/A";
      const shipToAddressLines = pdf.splitTextToSize(shipToAddress, 60); // Limit width to 60mm
      pdf.text(shipToAddressLines, 140, 105);

      pdf.text(invoiceData?.receiverDetails?.gstin || "N/A", 140, 115);
      pdf.text(invoiceData?.poNumber || " ", 140, 122);
      pdf.text(invoiceData?.poDate || " ", 140, 127);

      // Add items table
      pdf.autoTable({
        startY: 130,
        head: [
          [
            "Item Name",
            "HSN/SAC",
            "Qty",
            "Unit",
            "Rate",
            "Amount",
            "Tax %",
            "Tax Amount",
            "Amount",
          ],
        ],
        body:
          invoiceData?.items?.map((item) => {
            // Limit description length and add ellipsis if too long
            const description = item?.description
              ? item.description.length > 500
                ? item.description.substring(0, 500) + "..."
                : item.description
              : "";

            return [
              item.itemName + (description ? " (" + description + ")" : ""),
              item.hsnCode || "-",
              item.quantity,
              item.unit || "Pcs",
              item.sellingPrice,
              item.grossAmount,
              item.taxRate || "0.00",
              item.taxAmount || "0.00",
              item.amount,
            ];
          }) || [],
        theme: "grid",
        headStyles: {
          fillColor: [50, 50, 50], // Dark gray instead of blue
          textColor: [255, 255, 255],
          fontSize: 8,
          fontStyle: "bold",
          halign: "center",
        },
        bodyStyles: {
          textColor: [50, 50, 50], // Dark gray instead of blue
          fontSize: 8,
          halign: "center",
        },
        columnStyles: {
          0: { halign: "left", cellWidth: 40 },
        },
        margin: { left: 10, right: 10 },
        styles: {
          overflow: "linebreak",
          cellPadding: 2,
        },
        tableWidth: 190,
      });

      // Get the final Y position after the table
      const finalY = pdf.autoTable.previous.finalY + 5;

      // Add HSN summary table with grouped HSN codes
      pdf.autoTable({
        startY: finalY,
        head: [
          [
            "HSN CODE",
            "TABLE AMT",
            "CGST%",
            "CGST AMT",
            "SGST%",
            "SGST AMT",
            "IGST%",
            "IGST AMT",
          ],
        ],
        body: (() => {
          // Group items by HSN code
          const hsnGroups = {};

          invoiceData?.items?.forEach((item) => {
            const hsnCode = item.hsnCode || "-";
            if (!hsnGroups[hsnCode]) {
              hsnGroups[hsnCode] = {
                tableAmt: 0,
                cgstPercent: item.cgst || 0,
                cgstAmt: 0,
                sgstPercent: item.sgst || 0,
                sgstAmt: 0,
                igstPercent: item.igst || 0,
                igstAmt: 0,
              };
            }

            // Sum up amounts for the same HSN code
            hsnGroups[hsnCode].tableAmt += parseFloat(item.grossAmount || 0);
            hsnGroups[hsnCode].cgstAmt +=
              (parseFloat(item.cgst || 0) * parseFloat(item.grossAmount || 0)) /
              100;
            hsnGroups[hsnCode].sgstAmt +=
              (parseFloat(item.sgst || 0) * parseFloat(item.grossAmount || 0)) /
              100;
            hsnGroups[hsnCode].igstAmt +=
              (parseFloat(item.igst || 0) * parseFloat(item.grossAmount || 0)) /
              100;
          });

          // Convert grouped data to array format for the table
          return Object.entries(hsnGroups).map(([hsnCode, data]) => [
            hsnCode,
            data.tableAmt.toFixed(2),
            data.cgstPercent,
            data.cgstAmt.toFixed(2),
            data.sgstPercent,
            data.sgstAmt.toFixed(2),
            data.igstPercent,
            data.igstAmt.toFixed(2),
          ]);
        })(),
        theme: "grid",
        headStyles: {
          fillColor: [50, 50, 50], // Dark gray instead of blue
          textColor: [255, 255, 255],
          fontSize: 7,
          fontStyle: "bold",
          halign: "center",
        },
        bodyStyles: {
          textColor: [50, 50, 50], // Dark gray instead of blue
          fontSize: 7,
          halign: "center",
        },
        margin: { left: 10, right: 10 },
        tableWidth: 120,
      });

      // Get the final Y position after the HSN table
      let hsnTableY = pdf.autoTable.previous.finalY + 5;

      // Check if we need to add a new page based on remaining space
      if (hsnTableY > 220) {
        pdf.addPage();
        pdf.setDrawColor(0, 0, 0);
        pdf.setLineWidth(0.5);
        pdf.rect(6, 10, 198, 277);
        // Reset Y position for the new page
        hsnTableY = 20;
      }

      // Add amount in words
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(0, 0, 0); // Black text instead of blue
      pdf.setFontSize(10);
      pdf.text(`${numberToWords(grandTotal)} RUPEES ONLY`, 15, hsnTableY);

      // Add bank details
      pdf.setFontSize(8);
      pdf.text("Bank Name:", 15, hsnTableY + 8);
      pdf.text("Acc No:", 15, hsnTableY + 14);
      pdf.text("IFS Code:", 15, hsnTableY + 20);
      pdf.text("Branch:", 15, hsnTableY + 26);

      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(50, 50, 50); // Dark gray instead of blue
      pdf.text(bankdetails?.bankName || "sample bank", 40, hsnTableY + 8);
      pdf.text(
        bankdetails?.accountNumber || "sample Number",
        40,
        hsnTableY + 14
      );
      pdf.text(bankdetails?.ifscCode || "sample Code", 40, hsnTableY + 20);
      pdf.text(bankdetails?.branch || "sample Branch", 40, hsnTableY + 26);

      // Add summary section with dynamic positioning
      let currentY = hsnTableY;
      const lineSpacing = 6;

      // Always show Total Amount
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(0, 0, 0);
      pdf.text("Total Amount:", 140, currentY);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(50, 50, 50);
      pdf.text(`${totalAmount}/-`, 190, currentY, { align: "right" });
      currentY += lineSpacing;

      // Show Discount Amount only if greater than 0
      if (invoiceData?.discount > 0) {
        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(0, 0, 0);
        pdf.text("Discount Amount:", 140, currentY);
        pdf.setFont("helvetica", "normal");
        pdf.setTextColor(50, 50, 50);
        pdf.text(`${invoiceData?.discount}/-`, 190, currentY, { align: "right" });
        currentY += lineSpacing;
      }

      // Show Transportation Charges only if greater than 0
      if (parseFloat(transportationCharges) > 0) {
        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(0, 0, 0);
        pdf.text("Transportation Charges:", 140, currentY);
        pdf.setFont("helvetica", "normal");
        pdf.setTextColor(50, 50, 50);
        pdf.text(`${transportationCharges}/-`, 190, currentY, { align: "right" });
        currentY += lineSpacing;
      }

      // Show Taxable Amount if greater than 0
      if (parseFloat(taxableAmount) > 0) {
        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(0, 0, 0);
        pdf.text("Taxable Amount:", 140, currentY);
        pdf.setFont("helvetica", "normal");
        pdf.setTextColor(50, 50, 50);
        pdf.text(`${taxableAmount}/-`, 190, currentY, { align: "right" });
        currentY += lineSpacing;
      }

      // Show Tax amounts based on tax group
      if (invoiceData?.taxGroup === "State Tax") {
        // Show CGST if greater than 0
        if (parseFloat(totalCGST) > 0) {
          pdf.setFont("helvetica", "bold");
          pdf.setTextColor(0, 0, 0);
          pdf.text("CGST:", 140, currentY);
          pdf.setFont("helvetica", "normal");
          pdf.setTextColor(50, 50, 50);
          pdf.text(`${totalCGST}/-`, 190, currentY, { align: "right" });
          currentY += lineSpacing;
        }

        // Show SGST if greater than 0
        if (parseFloat(totalSGST) > 0) {
          pdf.setFont("helvetica", "bold");
          pdf.setTextColor(0, 0, 0);
          pdf.text("SGST:", 140, currentY);
          pdf.setFont("helvetica", "normal");
          pdf.setTextColor(50, 50, 50);
          pdf.text(`${totalSGST}/-`, 190, currentY, { align: "right" });
          currentY += lineSpacing;
        }
      } else if (invoiceData?.taxGroup === "Other Tax") {
        // Show IGST if greater than 0
        const totalIGST = invoiceData?.items
          ?.reduce(
            (acc, cur) =>
              acc +
              (parseFloat(cur.igst || 0) * parseFloat(cur.grossAmount || 0)) /
                100,
            0
          )
          .toFixed(2);

        if (parseFloat(totalIGST) > 0) {
          pdf.setFont("helvetica", "bold");
          pdf.setTextColor(0, 0, 0);
          pdf.text("IGST:", 140, currentY);
          pdf.setFont("helvetica", "normal");
          pdf.setTextColor(50, 50, 50);
          pdf.text(`${totalIGST}/-`, 190, currentY, { align: "right" });
          currentY += lineSpacing;
        }
      }

      // Add line before grand total
      currentY += 4; // Add some space before line
      pdf.setDrawColor(0, 0, 0);
      pdf.setLineWidth(0.5);
      pdf.line(140, currentY, 190, currentY);

      // Add grand total
      currentY += 6; // Add space after line
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(10);
      pdf.text("Grand Total:", 140, currentY);
      pdf.text(`${grandTotal}/-`, 190, currentY, { align: "right" });

      // Update hsnTableY for subsequent content
      hsnTableY = currentY;

      // Add horizontal line
      pdf.setDrawColor(30, 58, 138); // bg-blue-900
      pdf.setLineWidth(0.5);
      pdf.line(10, hsnTableY + 45, 200, hsnTableY + 45);

      // Check if we need to add a new page for signature section
      if (hsnTableY + 90 > 277) {
        pdf.addPage();
        pdf.setDrawColor(0, 0, 0);
        pdf.setLineWidth(0.5);
        pdf.rect(6, 10, 198, 277);
        // Reset Y position for the new page
        hsnTableY = 20;
      }

      // Add signature section
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(0, 0, 0); // Black text instead of blue
      pdf.setFontSize(9);
      pdf.text("Received the Material in Good Condition", 15, hsnTableY + 55);
      pdf.text("For Snigdha Enterprise", 185, hsnTableY + 55, {
        align: "right",
      });

      // Capture QR code directly from DOM
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
              pdf.addImage(qrDataURL, "PNG", 90, hsnTableY + 50, 30, 30);

              // Continue with the rest of the PDF after QR code is added
              finalizePdf();
            })
            .catch((err) => {
              console.error("Error capturing QR code with html2canvas:", err);
              // Continue without QR code
              finalizePdf();
            });
        } else {
          console.warn("QR code element not found in DOM");
          finalizePdf();
        }
      } catch (qrError) {
        console.error("Error adding QR code:", qrError);
        // Continue without QR code
        finalizePdf();
      }

      // Function to finalize the PDF after QR code handling
      function finalizePdf() {
        // Add signature lines
        pdf.setDrawColor(0, 0, 0); // Black line instead of blue
        pdf.line(15, hsnTableY + 70, 80, hsnTableY + 70);
        pdf.line(130, hsnTableY + 70, 185, hsnTableY + 70);

        // Add signature labels
        pdf.setFontSize(8);
        pdf.text("Receiver's Signature & Seal", 15, hsnTableY + 75);
        pdf.text("Authorized Signature", 185, hsnTableY + 75, {
          align: "right",
        });

        // Add horizontal line
        pdf.setDrawColor(0, 0, 0); // Black line instead of blue
        pdf.line(10, hsnTableY + 80, 200, hsnTableY + 80);

        // Add footer
        pdf.setTextColor(0, 0, 0); // Black text instead of blue
        pdf.setFontSize(9);
        pdf.text(
          "This is Computer Generated No Need To Signature",
          105,
          hsnTableY + 85,
          { align: "center" }
        );
        pdf.text("Thank You!", 105, hsnTableY + 90, { align: "center" });

        // Remove loading indicator
        try {
          const loadingDiv = document.querySelector(
            'div[style*="position: fixed"]'
          );
          if (loadingDiv && document.body.contains(loadingDiv)) {
            document.body.removeChild(loadingDiv);
          }
        } catch (error) {
          console.warn("Error removing loading indicator:", error);
        }

        // Save the PDF
        pdf.save(`invoice-${invoiceData?.invoiceNumber || "download"}.pdf`);
      }
    } catch (error) {
      console.error("PDF Generation Error:", error);
      // Remove loading indicator if there's an error
      const loadingDiv = document.querySelector(
        'div[style*="position: fixed"]'
      );
      if (loadingDiv) document.body.removeChild(loadingDiv);
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
                <h1 className="text-[40px] font-bold text-[#232B77]">
                  SNIGDHA ENTERPRISE
                </h1>
                <p className="h-[3px] w-[500px] bg-[#232B77] my-4"></p>
                <p className="text-[16px] text-[#232B77] font-semibold">
                  AB-79, SALT LAKE CITY, SECTOR-I, KOLKATA - 700064
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
                  </div>
                  <div className="text-left">
                    <p className="text-[#232B77] font-semibold text-sm">
                      Email:{" "}
                      <span className="text-[#027bd1]">
                        snigdhaenterprise2015@gmail.com
                      </span>
                    </p>
                    <p className="text-blue-800 font-semibold text-sm">
                      Phone: <span className="text-[#027bd1]">9073656557</span>
                    </p>
                  </div>
                </div>
              </div>
              {/* Invoice Details Section */}
              <div className="bg-blue-50 mt-1 flex justify-center items-center">
                <h2 className=" font-bold text-xl text-[#1F3180]">
                  TAX INVOICE
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
                </div>
              </div>
              <div className="h-[2px] w-full bg-[#232B77]"></div>
              {/* Shipping Details */}
              <div className="flex justify-between my-2">
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
                    Name:{" "}
                    <span className="text-[#027bd1]">
                      {invoiceData?.receiverDetails?.name}
                    </span>
                  </p>
                  <p className="text-[#232B77] font-semibold text-sm">
                    Address:{" "}
                    <span className="text-[#027bd1]">
                      {invoiceData?.receiverDetails?.deliveryAddress || " "}
                    </span>
                  </p>
                  {/* <p className="text-[#232B77] font-semibold text-sm">
              State: <span className="text-[#027bd1]">West Bengal</span>
            </p> */}
                  <p className="text-[#232B77] font-semibold text-sm">
                    GSTIN:{" "}
                    <span className="text-[#027bd1]">
                      {invoiceData?.receiverDetails?.gstin || " "}{" "}
                    </span>
                  </p>

                  <h3 className="font-bold text-xl text-[#232B77] mb-2">
                    PO Informaion
                  </h3>

                  <p className="text-[#232B77] font-semibold text-sm">
                    PO Number :{" "}
                    <span className="text-[#027bd1]">
                      {invoiceData?.poNumber || " "}{" "}
                    </span>
                  </p>

                  <p className="text-[#232B77] font-semibold text-sm">
                    PO Date :{" "}
                    <span className="text-[#027bd1]">
                      {invoiceData?.poDate || " "}{" "}
                    </span>
                  </p>
                </div>
              </div>
            </div>
            {/* Products Table */}
            <div className="bg-blue-50 p-4 rounded-2xl">
              <table className="w-full border-collapse border border-gray-300">
                <thead className="bg-[#027bd1] text-white text-sm">
                  <tr>
                    <th
                      className="border-b border-gray-300 p-2"
                      style={{ width: "25%" }}
                    >
                      Item Name
                    </th>
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
                  {invoiceData?.items?.map((item, index) => (
                    <tr key={index}>
                      <td
                        className="border p-2 text-left"
                        style={{ maxWidth: "200px", wordWrap: "break-word" }}
                      >
                        <div>{item.itemName}</div>
                        {item?.description && (
                          <div className="text-xs mt-1 text-gray-600">
                            ({item.description})
                          </div>
                        )}
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
                  ))}
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
                        {(() => {
                          // Group items by HSN code
                          const hsnGroups = {};

                          invoiceData?.items?.forEach((item) => {
                            const hsnCode = item.hsnCode || "-";
                            if (!hsnGroups[hsnCode]) {
                              hsnGroups[hsnCode] = {
                                tableAmt: 0,
                                cgstPercent: item.cgst || 0,
                                cgstAmt: 0,
                                sgstPercent: item.sgst || 0,
                                sgstAmt: 0,
                                igstPercent: item.igst || 0,
                                igstAmt: 0,
                              };
                            }

                            // Sum up amounts for the same HSN code
                            hsnGroups[hsnCode].tableAmt += parseFloat(
                              item.grossAmount || 0
                            );
                            hsnGroups[hsnCode].cgstAmt +=
                              (parseFloat(item.cgst || 0) *
                                parseFloat(item.grossAmount || 0)) /
                              100;
                            hsnGroups[hsnCode].sgstAmt +=
                              (parseFloat(item.sgst || 0) *
                                parseFloat(item.grossAmount || 0)) /
                              100;
                            hsnGroups[hsnCode].igstAmt +=
                              (parseFloat(item.igst || 0) *
                                parseFloat(item.grossAmount || 0)) /
                              100;
                          });

                          // Convert grouped data to array for rendering
                          return Object.entries(hsnGroups).map(
                            ([hsnCode, data], index) => (
                              <tr key={index}>
                                <td className="border-b border-gray-300 p-2">
                                  {hsnCode}
                                </td>
                                <td className="border-b border-gray-300 p-2">
                                  {data.tableAmt.toFixed(2)}
                                </td>
                                <td className="border-b border-gray-300 p-2">
                                  {data.cgstPercent}
                                </td>
                                <td className="border-b border-gray-300 p-2">
                                  {data.cgstAmt.toFixed(2)}
                                </td>
                                <td className="border-b border-gray-300 p-2">
                                  {data.sgstPercent}
                                </td>
                                <td className="border-b border-gray-300 p-2">
                                  {data.sgstAmt.toFixed(2)}
                                </td>
                                <td className="border-b border-gray-300 p-2">
                                  {data.igstPercent}
                                </td>
                                <td className="border-b border-gray-300 p-2">
                                  {data.igstAmt.toFixed(2)}
                                </td>
                              </tr>
                            )
                          );
                        })()}
                      </tbody>
                    </table>
                  </div>
                  <p className="text-blue-900 font-semibold text-[17px] mb-2">
                    {numberToWords(grandTotal)} RUPEES ONLY
                  </p>
                  <p className="text-blue-900 font-semibold text-sm">
                    Bank Name:{" "}
                    <span className="text-[#027bd1]">
                      {bankdetails?.bankName || "sample bank"}
                    </span>
                  </p>
                  <p className="text-blue-900 font-semibold text-sm">
                    Acc No:{" "}
                    <span className="text-[#027bd1]">
                      {bankdetails?.accountNumber || "sample Number"}
                    </span>
                  </p>
                  <p className="text-blue-900 font-semibold text-sm">
                    IFS Code:{" "}
                    <span className="text-[#027bd1]">
                      {bankdetails?.ifscCode || "sample Code"}
                    </span>
                  </p>
                  <p className="text-blue-900 font-semibold text-sm">
                    Branch:{" "}
                    <span className="text-[#027bd1]">
                      {bankdetails?.branch || "sample Branch"}
                    </span>
                  </p>
                </div>
                <div>
                  <div className="flex gap-20 text-[#232B77] font-semibold text-sm">
                    <p className="pr-[13px]">Total Amount</p>
                    <p>
                      {invoiceData?.items
                        ?.reduce(
                          (acc, cur) => acc + parseFloat(cur.grossAmount || 0),
                          0
                        )
                        .toFixed(2)}
                      /-
                    </p>
                  </div>

                  {invoiceData?.discount && invoiceData?.discount > 0 && (
                    <div className="flex gap-20 justify-between text-[#232B77] font-semibold text-sm">
                      <p>Discount Amount</p>
                      <p>{invoiceData?.discount}/-</p>
                    </div>
                  )}

                  {transportationCharges && transportationCharges > 0 && (
                    <div className="flex gap-20 justify-between text-[#232B77] font-semibold text-sm">
                      <p>Transportation Charges</p>
                      <p>{transportationCharges || 0}/-</p>
                    </div>
                  )}

                  <div className="flex gap-20 justify-between text-[#232B77] font-semibold text-sm">
                    <p>Taxable Amount</p>
                    <p>
                      {invoiceData?.items
                        ?.reduce(
                          (acc, cur) => acc + parseFloat(cur.taxAmount || 0),
                          0
                        )
                        .toFixed(2)}
                      /-
                    </p>
                  </div>

                  {invoiceData?.taxGroup === "State Tax" && (
                    <>
                      <div className="flex gap-20 justify-between text-[#232B77] font-semibold text-sm">
                        <p>CGST </p>
                        <p>
                          {invoiceData?.items
                            ?.reduce(
                              (acc, cur) =>
                                acc +
                                (parseFloat(cur.cgst || 0) *
                                  parseFloat(cur.grossAmount || 0)) /
                                  100,
                              0
                            )
                            .toFixed(2) ||
                            invoiceData?.taxAmount / 2 ||
                            0}
                          /-
                        </p>
                      </div>
                      <div className="flex gap-20 justify-between text-[#232B77] font-semibold text-sm">
                        <p>SGST </p>
                        <p>
                          {invoiceData?.items
                            ?.reduce(
                              (acc, cur) =>
                                acc +
                                (parseFloat(cur.sgst || 0) *
                                  parseFloat(cur.grossAmount || 0)) /
                                  100,
                              0
                            )
                            .toFixed(2) ||
                            invoiceData?.taxAmount / 2 ||
                            0}
                          /-
                        </p>
                      </div>
                    </>
                  )}
                  {invoiceData?.taxGroup === "Other Tax" && (
                    <div className="flex gap-20 justify-between text-[#232B77] font-semibold text-sm">
                      <p>IGST </p>
                      <p>
                        {invoiceData?.items
                          ?.reduce(
                            (acc, cur) =>
                              acc +
                              (parseFloat(cur.igst || 0) *
                                parseFloat(cur.grossAmount || 0)) /
                                100,
                            0
                          )
                          .toFixed(2) ||
                          invoiceData?.taxAmount ||
                          0}
                        /-
                      </p>
                    </div>
                  )}

                  <p className="h-[1px] w-[300px] bg-[#232B77]"></p>
                  <div className="flex gap-20 justify-between text-[#232B77] font-bold text-[16px] mt-2">
                    <p>Grand Total</p>
                    <p>{grandTotal}/-</p>
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

                <div className="w-1/2 mb-10 qr-code-container canvas ">
                  <div className="flex justify-between mb-2">
                    <QrCodeComponent data={invoiceData} />
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-[#232B77] font-semibold text-[16px] mb-16">
                    For Snigdha Enterprise
                  </p>
                  <p className="text-[#232B77] font-semibold text-sm">
                    Authorized Signature
                  </p>
                  {/* <p className="text-[#232B77] font-semibold text-sm">
              (Procurement Manager)
            </p> */}
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
      <div className="text-center mt-14">
        <button
          onClick={handleDownloadPdf}
          className="bg-blue-500 hover:bg-blue-600 transition-colors text-white px-6 py-2 rounded-lg shadow-md font-medium"
        >
          Download PDF
        </button>
      </div>
    </div>
  );
};

export default ViewPDF;
