import React, { useState, useRef, useEffect } from "react";
import {
    FaFilePdf,
    FaFileExcel,
    FaSearch,
} from "react-icons/fa";
import { useReactToPrint } from "react-to-print";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import toast from "react-hot-toast";

// Mock data for demonstration
const mockInvoices = [
    {
        invoiceNumber: "SSPL/019/08.04.2025",
        date: "2025-04-08",
        receiverDetails: {
            name: "Swiggy Limited (Indore)",
            gstin: "23AAFCB77070122",
        },
        items: [
            {
                sacCode: "999651",
                description:
                    "Winning of SPL Amount - IFM Quarter-India One - Indore Location",
                unit: "NO",
                quantity: 1,
                amount: 375000,
                netAmount: 375000,
                taxRate: 18,
                cgst: 9,
                sgst: 9,
                taxAmount: 67500,
            },
        ],
        grandTotal: 442500,
    },
    {
        invoiceNumber: "SSPL/001/02.04.2025",
        date: "2025-04-02",
        receiverDetails: {
            name: "Swiggy Limited (Kolkata)",
            gstin: "19AAFCB77070122",
        },
        items: [
            {
                sacCode: "2106",
                description: "Pantry Items",
                unit: "NO",
                quantity: 1,
                amount: 8060,
                netAmount: 8060,
                taxRate: 18,
                cgst: 9,
                sgst: 9,
                taxAmount: 1450.8,
            },
        ],
        grandTotal: 9499.0,
    },
    {
        invoiceNumber: "PL/002/25-02.04.2025",
        date: "2025-04-02",
        receiverDetails: {
            name: "Swiggy Limited (Kolkata)",
            gstin: "19AAFCB77070122",
        },
        items: [
            {
                sacCode: "9965",
                description: "Transporting Cost",
                unit: "NO",
                quantity: 1,
                amount: 4200,
                netAmount: 4200,
                taxRate: 18,
                cgst: 9,
                sgst: 9,
                taxAmount: 756,
            },
            {
                sacCode: "996743",
                description: "Parking Arrangement",
                unit: "NO",
                quantity: 1,
                amount: 5300,
                netAmount: 5300,
                taxRate: 18,
                cgst: 9,
                sgst: 9,
                taxAmount: 954,
            },
            {
                sacCode: "5518",
                description: "Sound System",
                unit: "NO",
                quantity: 1,
                amount: 6000,
                netAmount: 6000,
                taxRate: 18,
                cgst: 9,
                sgst: 9,
                taxAmount: 1080,
            },
            {
                sacCode: "9401",
                description: "Arrangement of chairs,Tables",
                unit: "NO",
                quantity: 1,
                amount: 8500,
                netAmount: 8500,
                taxRate: 18,
                cgst: 9,
                sgst: 9,
                taxAmount: 1530,
            },
            {
                sacCode: "998533",
                description: "Industrial Cleaning",
                unit: "NO",
                quantity: 1,
                amount: 1500,
                netAmount: 1500,
                taxRate: 18,
                cgst: 9,
                sgst: 9,
                taxAmount: 270,
            },
            {
                sacCode: "4911",
                description: "Printing Materials",
                unit: "NO",
                quantity: 1,
                amount: 2500,
                netAmount: 2500,
                taxRate: 18,
                cgst: 9,
                sgst: 9,
                taxAmount: 450,
            },
        ],
        grandTotal: 33040,
    },
];

import { backendDomainA } from './../../../Common/index';

const groupInvoices = (invoices) => {
    // console.log("invoices to group: ", invoices);
    return invoices.map((inv, idx) => {
        const items = inv.items || [];

        // Create expanded rows for each item within this invoice
        const expandedItems = items.map((item) => {
            let integrated = 0,
                central = 0,
                state = 0;
            if (inv.total?.cgst > 0 || inv.total?.sgst > 0) {
                central = Number(inv.total?.cgstAmount).toFixed(2);
                state = Number(inv.total?.sgstAmount).toFixed(2);
                integrated = 0;
            } else if (inv?.total?.igst > 0) {
                integrated = Number(inv.total?.igstAmount).toFixed(2);
                central = 0;
                state = 0;
            } else {
                integrated = 0;
                central = 0;
                state = 0;
            }

            return {
                invoiceNumber: inv.invoiceNumber,
                date: inv.date,
                customer: inv.receiverDetails?.name,
                gstin: inv.receiverDetails?.gstin,
                hsn: item.sacCode,
                description: item.itemName || item.description,
                uqc: item.unit || item.uom || "",
                quantity: inv?.receiverDetails?.monthYear,
                invoiceValue: inv.total?.totalPayableAmount,
                rate: inv.total?.igst > 0 ? inv.total?.igst : (Number(inv.total?.cgst) + Number(inv.total?.sgst)) + "%",
                taxableValue: item.netAmount || item.amount,
                integratedTaxAmount: integrated,
                centralTaxAmount: central,
                stateTaxAmount: state,
            };
        });

        return {
            slNo: idx + 1,
            invoiceNumber: inv.invoiceNumber,
            date: inv.date,
            customer: inv.receiverDetails?.name,
            gstin: inv.receiverDetails?.gstin,
            items: expandedItems,
            totalInvoiceValue: inv?.total?.totalPayableAmount || inv?.total?.grandTotal,
        };
    });
};

const ServiceGstReportPage = () => {
    const [dateRange, setDateRange] = useState({ from: "", to: "" });
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [filterGstType, setFilterGstType] = useState("all");
    const [allinvoice, setAllInvoice] = useState(mockInvoices); // Using mock data for demo
    const componentRef = useRef();

    // Filter data based on search query and GST type
    const filteredData = allinvoice?.filter((item) => {
        // console.log("item from search : ",item)
        // Check if any item has HSN code that matches search query
        const hasMatchingHsn = item?.items?.some(itemData =>
            (itemData?.sacCode?.toLowerCase() || "").includes(searchQuery?.toLowerCase())
        );
        const matchesSearch =
            (item?.invoiceNumber?.toLowerCase() || "").includes(
                searchQuery?.toLowerCase()
            ) ||
            (item?.receiverDetails?.name?.toLowerCase() || "").includes(
                searchQuery?.toLowerCase()
            ) ||
            (item?.receiverDetails?.gstin?.toLowerCase() || "").includes(
                searchQuery?.toLowerCase()
            ) || hasMatchingHsn

        // Determine GST type based on invoice data structure
        const invoiceGstType =
            item?.total?.igstAmount > 0 && item?.total?.cgstAmount === 0 && item?.total?.sgstAmount === 0
                ? "igst"
                : "regular";

        const matchesGstType =
            filterGstType === "all" || invoiceGstType === filterGstType;

        let matchesDateRange = true;
        if (dateRange.from && dateRange.to) {
            const invoiceDate = new Date(item?.date);
            const fromDate = new Date(dateRange.from);
            const toDate = new Date(dateRange.to);

            // Set time to beginning and end of day to include the full day range
            fromDate.setHours(0, 0, 0, 0);
            toDate.setHours(23, 59, 59, 999);

            matchesDateRange = invoiceDate >= fromDate && invoiceDate <= toDate;
        }

        return matchesSearch && matchesGstType && matchesDateRange;
    });

    const groupedRows = groupInvoices(filteredData);

    // console.log("all invoice ; ",allinvoice)

    // === NEW: Pagination by invoice count ===
    const totalInvoices = groupedRows.length;
    const indexOfLastInvoice = currentPage * itemsPerPage;
    const indexOfFirstInvoice = indexOfLastInvoice - itemsPerPage;
    const paginatedInvoices = groupedRows.slice(
        indexOfFirstInvoice,
        indexOfLastInvoice
    );
    const totalPages = Math.ceil(totalInvoices / itemsPerPage);

    // Flatten all items FOR THOSE INVOICES ONLY
    const paginatedRows = [];
    paginatedInvoices.forEach((invoice) => {
        invoice.items.forEach((item, itemIndex) => {
            paginatedRows.push({
                ...item,
                isFirstItem: itemIndex === 0,
                itemCount: invoice.items.length,
                rowSpan: itemIndex === 0 ? invoice.items.length : 0,
            });
        });
    });

    // console.log("paginatedRows: ", groupedRows);
    // ========================================

    // Handle page change
    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            minimumFractionDigits: 2,
        }).format(amount);
    };



    // Handle Excel export (exports ALL filtered rows, not just current page)
    // Handle Excel export
    const handleExcelExport = () => {
        const allFilteredItems = [];
        groupedRows.forEach((invoice, idxInv) => {
            invoice.items.forEach((item) => {
                allFilteredItems.push({
                    "Sl. No.": idxInv + 1,
                    "Invoice No": item.invoiceNumber || "",
                    "Date": item.date ? new Date(item.date).toLocaleDateString() : "",
                    "Customer": item.customer || "",
                    "GSTIN": item.gstin || "",
                    "HSN": item.hsn,
                    "Description": item.description,
                    // "UQC": item.uqc,
                    "Total Quantity": item.quantity,
                    "Invoice Value": item.invoiceValue,
                    "Rate": item.rate,
                    "Taxable Value": item.taxableValue,
                    "Integrated Tax Amount": item.integratedTaxAmount,
                    "Central Tax Amount": item.centralTaxAmount,
                    "State/UT Tax Amount": item.stateTaxAmount,
                });
            });
        });

        // Calculate summary totals
        const invoiceValueTotal = groupedRows.reduce((total, invoice) => {
            return total + parseFloat(invoice.totalInvoiceValue || 0);
        }, 0);
        console.log("total value : ", groupedRows)

        const taxableValueTotal = allFilteredItems.reduce((total, item) => {
            return total + parseFloat(item["Taxable Value"] || 0);
        }, 0);

        const integratedTaxTotal = allFilteredItems.reduce((total, item) => {
            return total + parseFloat(item["Integrated Tax Amount"] || 0);
        }, 0);

        const centralTaxTotal = allFilteredItems.reduce((total, item) => {
            return total + parseFloat(item["Central Tax Amount"] || 0);
        }, 0);

        const stateTaxTotal = allFilteredItems.reduce((total, item) => {
            return total + parseFloat(item["State/UT Tax Amount"] || 0);
        }, 0);

        // Add summary row
        allFilteredItems.push({
            "Sl. No.": "Summary",
            "Invoice No": "",
            "Date": "",
            "Customer": "",
            "GSTIN": "",
            "HSN": "",
            "Description": "",
            // "UQC": "",
            "Total Quantity": "Total",
            "Invoice Value": invoiceValueTotal,
            "Rate": "",
            "Taxable Value": taxableValueTotal,
            "Integrated Tax Amount": integratedTaxTotal,
            "Central Tax Amount": centralTaxTotal,
            "State/UT Tax Amount": stateTaxTotal,
        });

        const worksheet = XLSX.utils.json_to_sheet(allFilteredItems);

        // Style the summary row
        const lastRow = allFilteredItems.length;
        const columns = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N",];

        columns.forEach(col => {
            const cellAddress = `${col}${lastRow}`;
            if (!worksheet[cellAddress]) return;
            worksheet[cellAddress].s = {
                fill: { fgColor: { rgb: "FFEB9C" } }, // Light yellow background
                font: { bold: true },
                border: {
                    top: { style: "thin" },
                    bottom: { style: "thin" },
                    left: { style: "thin" },
                    right: { style: "thin" }
                }
            };
        });

        // Get the header keys
        const headerKeys = Object.keys(allFilteredItems[0]);
        // Set header style: blue background, white bold text
        headerKeys.forEach((key, idx) => {
            const cellAddress = XLSX.utils.encode_cell({ r: 0, c: idx });
            if (!worksheet[cellAddress]) return;
            worksheet[cellAddress].s = {
                fill: { fgColor: { rgb: "4472C4" } }, // Blue
                font: { bold: true, color: { rgb: "FFFFFF" } }, // White bold
                alignment: { horizontal: "center", vertical: "center" }
            };
        });

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "GST Report");
        XLSX.writeFile(
            workbook,
            `Service_GST_Report_${new Date().toISOString().split("T")[0]}.xlsx`
        );
    };

    // Handle PDF export (exports ALL filtered rows, not just current page)
    const handlePdfExport = () => {
        const doc = new jsPDF({
            orientation: "landscape",
            unit: "mm",
            format: "a4",
        });

        doc.setFontSize(18);
        doc.text("Service GST Report for mns secure solutions private limited", 14, 18);

        if (dateRange.from && dateRange.to) {
            doc.setFontSize(12);
            doc.text(`Period: ${dateRange.from} to ${dateRange.to}`, 14, 26);
        }

        const tableColumn = [
            "Sl. No.",
            "Invoice No",
            "Date",
            "Customer",
            "GSTIN",
            "HSN",
            "Description",
            // "UQC",
            "Total Quantity",
            "Invoice Value",
            "Rate",
            "Taxable Value",
            "Integrated Tax Amount",
            "Central Tax Amount",
            "State Tax Amount",
        ];

        const allFilteredItems = [];
        groupedRows.forEach((invoice, idxInv) => {
            invoice.items.forEach((item) => {
                allFilteredItems.push([
                    idxInv + 1,
                    item.invoiceNumber || "",
                    item.date ? new Date(item.date).toLocaleDateString() : "",
                    item.customer || "",
                    item.gstin || "",
                    item.hsn,
                    item.description,
                    // item.uqc,
                    item.quantity,
                    item.invoiceValue,
                    item.rate,
                    item.taxableValue,
                    item.integratedTaxAmount,
                    item.centralTaxAmount,
                    item.stateTaxAmount,
                ]);
            });
        });

        doc.autoTable({
            head: [tableColumn],
            body: allFilteredItems,
            startY: 32,
            theme: "grid",
            styles: { fontSize: 7 },
            margin: { left: 10, right: 10 },
            headStyles: { fillColor: [66, 139, 202] },
        });

        doc.save(`Service_GST_Report_${new Date().toISOString().split("T")[0]}.pdf`);
    };

    const getAllInvoices = async () => {
        try {
            const getAllData = await fetch(`${backendDomainA}/api/v1/service/get-all`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const jsonData = await getAllData.json();
            // const reversedData = [...(jsonData.data || [])].reverse();
            const sortedData = [...(jsonData.data || [])].sort(
                (a, b) => new Date(a.date) - new Date(b.date)
            );
            toast.success("Successfully fetched Invoice Data");
            setAllInvoice(sortedData || []);
        } catch (error) {
            toast.error("Server error");
        }
    };

    useEffect(() => {
        getAllInvoices(); // Uncomment when you want to use real API
    }, []);

    return (
        <div className="container mx-auto p-4 bg-gray-50 min-h-screen">
            <div
                className="bg-white rounded-lg shadow-lg p-6 mb-6"
                ref={componentRef}
            >
                <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                    MNS Secure Solutions Private Limited
                </h1>
                <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">Service GST Report</h2>

                {/* Filters and Actions */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 print:hidden">
                    <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                        <div className="flex items-center">
                            <span className="mr-2 whitespace-nowrap">From:</span>
                            <input
                                type="date"
                                value={dateRange.from}
                                onChange={(e) =>
                                    setDateRange({ ...dateRange, from: e.target.value })
                                }
                                className="border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="flex items-center">
                            <span className="mr-2 whitespace-nowrap">To:</span>
                            <input
                                type="date"
                                value={dateRange.to}
                                onChange={(e) =>
                                    setDateRange({ ...dateRange, to: e.target.value })
                                }
                                className="border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="flex items-center">
                            <span className="mr-2 whitespace-nowrap">GST Type:</span>
                            <select
                                value={filterGstType}
                                onChange={(e) => setFilterGstType(e.target.value)}
                                className="border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="all">All</option>
                                <option value="regular">Regular (CGST/SGST)</option>
                                <option value="igst">IGST</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2 w-full md:w-auto justify-end">
                        <button
                            onClick={handlePdfExport}
                            className="flex items-center cursor-pointer gap-1 bg-red-600 text-white px-3 py-2 rounded-md hover:bg-red-700"
                        >
                            <FaFilePdf /> PDF
                        </button>
                        <button
                            onClick={handleExcelExport}
                            className="flex items-center cursor-pointer gap-1 bg-green-600 text-white px-3 py-2 rounded-md hover:bg-green-700"
                        >
                            <FaFileExcel /> Excel
                        </button>
                    </div>
                </div>

                {/* Search */}
                <div className="relative mb-6 print:hidden">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <FaSearch className="text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search by Invoice No, Customer, GSTIN, or HSN Code..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="min-w-full border-collapse border border-black">
                        <thead>
                            <tr className="bg-pink-200">
                                <th className="border border-black px-2 py-2 text-xs font-bold text-center">
                                    INV NO.
                                </th>
                                <th className="border border-black px-2 py-2 text-xs font-bold text-center">
                                    INV DATE
                                </th>
                                <th className="border border-black px-2 py-2 text-xs font-bold text-center">
                                    CUSTOMER NAME
                                </th>
                                <th className="border border-black px-2 py-2 text-xs font-bold text-center">
                                    GST NO.
                                </th>
                                <th className="border border-black px-2 py-2 text-xs font-bold text-center">
                                    HSN
                                </th>
                                <th
                                    className="border border-black px-2 py-2 text-xs font-bold text-center"
                                    style={{ maxWidth: "200px" }}
                                >
                                    Description
                                </th>
                                {/* <th className="border border-black px-2 py-2 text-xs font-bold text-center">
                                    UQC
                                </th> */}
                                <th className="border border-black px-2 py-2 text-xs font-bold text-center">
                                    Month
                                </th>
                                <th className="border border-black px-2 py-2 text-xs font-bold text-center">
                                    Invoice Value
                                </th>
                                <th className="border border-black px-2 py-2 text-xs font-bold text-center">
                                    Rate
                                </th>
                                <th className="border border-black px-2 py-2 text-xs font-bold text-center">
                                    Taxable Value
                                </th>
                                <th className="border border-black px-2 py-2 text-xs font-bold text-center">
                                    Integrated Tax Amount
                                </th>
                                <th className="border border-black px-2 py-2 text-xs font-bold text-center">
                                    Central Tax Amount
                                </th>
                                <th className="border border-black px-2 py-2 text-xs font-bold text-center">
                                    State/UT Tax Amount
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedRows.map((row, idx) => (
                                // console.log("row",row)
                                <tr key={idx} className="border border-black">
                                    {row.isFirstItem ? (
                                        <>
                                            <td
                                                className="border border-black px-2 py-1 text-xs text-center align-top"
                                                rowSpan={row.rowSpan}
                                            >
                                                {row.invoiceNumber}
                                            </td>
                                            <td
                                                className="border border-black px-2 py-1 text-xs text-center align-top"
                                                rowSpan={row.rowSpan}
                                            >
                                                {new Date(row.date).toLocaleDateString()}
                                            </td>
                                            <td
                                                className="border border-black px-2 py-1 text-xs align-top"
                                                rowSpan={row.rowSpan}
                                            >
                                                {row.customer}
                                                <br />
                                                <span className="text-xs text-gray-600">
                                                    {row.gstin}
                                                </span>
                                            </td>
                                            <td
                                                className="border border-black px-2 py-1 text-xs text-center align-top"
                                                rowSpan={row.rowSpan}
                                            >
                                                {row.gstin}
                                            </td>
                                        </>
                                    ) : null}

                                    <td className="border border-black px-2 py-1 text-xs text-center">
                                        {row.hsn}
                                    </td>
                                    <td
                                        className="border border-black px-2 py-1 text-xs overflow-hidden"
                                        style={{
                                            maxWidth: "200px",
                                            whiteSpace: "nowrap",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                        }}
                                        title={row.description}
                                    >
                                        {row.description}
                                    </td>
                                    {/* <td className="border border-black px-2 py-1 text-xs text-center">
                                        {row.uqc}
                                    </td> */}
                                    {
                                        row.isFirstItem ? (
                                            <td className="border border-black px-2 py-1 text-xs text-center" rowSpan={row.rowSpan}>
                                                {row.quantity}
                                            </td>
                                        ) : null
                                    }


                                    {row.isFirstItem ? (
                                        <td
                                            className="border border-black px-2 py-1 text-xs text-right align-top"
                                            rowSpan={row.rowSpan}
                                        >
                                            {formatCurrency(row.invoiceValue)}
                                        </td>
                                    ) : null}

                                    {
                                        row.isFirstItem ? (<td className="border border-black px-2 py-1 text-xs text-center" rowSpan={row.rowSpan} >
                                            {row.rate}
                                        </td>) : null
                                    }

                                    <td className="border border-black px-2 py-1 text-xs text-right">
                                        {row.taxableValue}
                                    </td>
                                    {
                                        row.isFirstItem ? (<td className="border border-black px-2 py-1 text-xs text-right" rowSpan={row.rowSpan}>
                                            {row.integratedTaxAmount || ""}
                                        </td>) : null
                                    }
                                    {
                                        row.isFirstItem ? (<td className="border border-black px-2 py-1 text-xs text-right" rowSpan={row.rowSpan}>
                                            {row.centralTaxAmount || ""}
                                        </td>) : null
                                    }

                                    {row.isFirstItem ? (<td className="border border-black px-2 py-1 text-xs text-right" rowSpan={row.rowSpan}>
                                        {row.stateTaxAmount || ""}
                                    </td>) : null}

                                </tr>
                            ))}

                            {/* Totals row FOR CURRENT PAGE */}
                            <tr className="bg-pink-100 font-bold border border-black">
                                <td
                                    colSpan={7}
                                    className="border border-black px-2 py-2 text-right font-bold"
                                >
                                    Total (this page)
                                </td>
                                <td className="border border-black px-2 py-2 text-right font-bold">
                                    {paginatedRows
                                        .reduce((acc, item) => {
                                            if (item.isFirstItem) {
                                                return acc + (parseFloat(item.invoiceValue) || 0);
                                            }
                                            return acc;
                                        }, 0)
                                        .toFixed(2)}
                                </td>
                                <td className="border border-black px-2 py-2"></td>
                                <td className="border border-black px-2 py-2 text-right font-bold">
                                    {paginatedRows
                                        .reduce((a, b) => a + (parseFloat(b.taxableValue) || 0), 0)
                                        .toFixed(2)}
                                </td>
                                <td className="border border-black px-2 py-2 text-right font-bold">
                                    {paginatedRows
                                        .reduce(
                                            (a, b) => a + (parseFloat(b.integratedTaxAmount) || 0),
                                            0
                                        )
                                        .toFixed(2)}
                                </td>
                                <td className="border border-black px-2 py-2 text-right font-bold">
                                    {paginatedRows
                                        .reduce(
                                            (a, b) => a + (parseFloat(b.centralTaxAmount) || 0),
                                            0
                                        )
                                        .toFixed(2)}
                                </td>
                                <td className="border border-black px-2 py-2 text-right font-bold">
                                    {paginatedRows
                                        .reduce(
                                            (a, b) => a + (parseFloat(b.stateTaxAmount) || 0),
                                            0
                                        )
                                        .toFixed(2)}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex flex-col sm:flex-row justify-between items-center mt-6 print:hidden">
                    <div className="flex items-center mb-4 sm:mb-0">
                        <span className="mr-2">Show</span>
                        <select
                            value={itemsPerPage}
                            onChange={(e) => {
                                setItemsPerPage(Number(e.target.value));
                                setCurrentPage(1);
                            }}
                            className="border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {[5, 10, 25, 50, 100, 500, 5000]?.map((size) => (
                                <option key={size} value={size}>
                                    {size}
                                </option>
                            ))}
                        </select>
                        <span className="ml-2">entries</span>
                    </div>

                    <div className="flex items-center">
                        <span className="mr-4 text-sm text-gray-600">
                            Showing{" "}
                            {totalInvoices === 0 ? 0 : indexOfFirstInvoice + 1} to{" "}
                            {Math.min(indexOfLastInvoice, totalInvoices)} of {totalInvoices}{" "}
                            entries
                        </span>

                        <div className="flex">
                            <button
                                onClick={() => handlePageChange(1)}
                                disabled={currentPage === 1}
                                className="px-3 py-1 cursor-pointer border rounded-l-md bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                First
                            </button>
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="px-3 py-1 cursor-pointer border-t border-b border-r bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Prev
                            </button>

                            {/* Page numbers */}
                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                let pageNum;
                                if (totalPages <= 5) {
                                    pageNum = i + 1;
                                } else if (currentPage <= 3) {
                                    pageNum = i + 1;
                                } else if (currentPage >= totalPages - 2) {
                                    pageNum = totalPages - 4 + i;
                                } else {
                                    pageNum = currentPage - 2 + i;
                                }
                                return (
                                    <button
                                        key={pageNum}
                                        onClick={() => handlePageChange(pageNum)}
                                        className={`px-3 py-1 cursor-pointer border-t border-b border-r ${currentPage === pageNum
                                            ? "bg-blue-600 text-white"
                                            : "bg-white text-gray-700 hover:bg-gray-100"
                                            }`}
                                    >
                                        {pageNum}
                                    </button>
                                );
                            })}

                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="px-3 py-1 cursor-pointer border-t border-b border-r bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Next
                            </button>
                            <button
                                onClick={() => handlePageChange(totalPages)}
                                disabled={currentPage === totalPages}
                                className="px-3 py-1 cursor-pointer border-t border-b border-r rounded-r-md bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Last
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ServiceGstReportPage;



