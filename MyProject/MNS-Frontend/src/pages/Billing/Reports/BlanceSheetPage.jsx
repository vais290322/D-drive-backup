

import React, { useState, useRef } from 'react';
import { FaFilePdf, FaFileExcel, FaPrint, FaSearch, FaCalendarAlt } from 'react-icons/fa';
import { useReactToPrint } from 'react-to-print';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const BlanceSheetPage = () => {
  const [year, setYear] = useState(new Date().getFullYear());
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const componentRef = useRef();

  // Dummy data for Balance Sheet
  const balanceSheetData = {
    assets: [
      { id: 1, category: 'Current Assets', name: 'Cash and Cash Equivalents', amount: 1250000 },
      { id: 2, category: 'Current Assets', name: 'Accounts Receivable', amount: 875000 },
      { id: 3, category: 'Current Assets', name: 'Inventory', amount: 1450000 },
      { id: 4, category: 'Current Assets', name: 'Short-term Investments', amount: 650000 },
      { id: 5, category: 'Current Assets', name: 'Prepaid Expenses', amount: 125000 },
      { id: 6, category: 'Fixed Assets', name: 'Property, Plant and Equipment', amount: 3750000 },
      { id: 7, category: 'Fixed Assets', name: 'Less: Accumulated Depreciation', amount: -850000 },
      { id: 8, category: 'Fixed Assets', name: 'Land', amount: 2250000 },
      { id: 9, category: 'Intangible Assets', name: 'Goodwill', amount: 750000 },
      { id: 10, category: 'Intangible Assets', name: 'Patents and Trademarks', amount: 450000 },
      { id: 11, category: 'Other Assets', name: 'Long-term Investments', amount: 1850000 },
      { id: 12, category: 'Other Assets', name: 'Deferred Tax Assets', amount: 175000 },
    ],
    liabilities: [
      { id: 13, category: 'Current Liabilities', name: 'Accounts Payable', amount: 650000 },
      { id: 14, category: 'Current Liabilities', name: 'Short-term Loans', amount: 450000 },
      { id: 15, category: 'Current Liabilities', name: 'Current Portion of Long-term Debt', amount: 375000 },
      { id: 16, category: 'Current Liabilities', name: 'Accrued Expenses', amount: 225000 },
      { id: 17, category: 'Current Liabilities', name: 'Income Tax Payable', amount: 175000 },
      { id: 18, category: 'Long-term Liabilities', name: 'Long-term Debt', amount: 2750000 },
      { id: 19, category: 'Long-term Liabilities', name: 'Deferred Tax Liabilities', amount: 325000 },
      { id: 20, category: 'Long-term Liabilities', name: 'Pension Obligations', amount: 950000 },
    ],
    equity: [
      { id: 21, category: 'Shareholders\' Equity', name: 'Common Stock', amount: 3500000 },
      { id: 22, category: 'Shareholders\' Equity', name: 'Retained Earnings', amount: 2850000 },
      { id: 23, category: 'Shareholders\' Equity', name: 'Additional Paid-in Capital', amount: 1250000 },
      { id: 24, category: 'Shareholders\' Equity', name: 'Treasury Stock', amount: -750000 },
      { id: 25, category: 'Shareholders\' Equity', name: 'Accumulated Other Comprehensive Income', amount: 125000 },
    ]
  };

  // Filter data based on search query
  const filteredAssets = balanceSheetData.assets.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredLiabilities = balanceSheetData.liabilities.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredEquity = balanceSheetData.equity.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate totals
  const totalAssets = filteredAssets?.reduce((sum, item) => sum + item.amount, 0);
  const totalLiabilities = filteredLiabilities?.reduce((sum, item) => sum + item.amount, 0);
  const totalEquity = filteredEquity?.reduce((sum, item) => sum + item.amount, 0);
  const totalLiabilitiesAndEquity = totalLiabilities + totalEquity;

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  // Handle printing
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: 'Balance_Sheet',
  });

  // Handle Excel export
  const handleExcelExport = () => {
    // Prepare data for export
    const assetsData = filteredAssets.map(item => ({
      Category: item.category,
      'Account Name': item.name,
      Amount: item.amount
    }));
    
    const liabilitiesData = filteredLiabilities.map(item => ({
      Category: item.category,
      'Account Name': item.name,
      Amount: item.amount
    }));
    
    const equityData = filteredEquity.map(item => ({
      Category: item.category,
      'Account Name': item.name,
      Amount: item.amount
    }));

    // Create workbook with multiple sheets
    const workbook = XLSX.utils.book_new();
    
    // Add assets sheet
    const assetsWS = XLSX.utils.json_to_sheet(assetsData);
    XLSX.utils.book_append_sheet(workbook, assetsWS, "Assets");
    
    // Add liabilities sheet
    const liabilitiesWS = XLSX.utils.json_to_sheet(liabilitiesData);
    XLSX.utils.book_append_sheet(workbook, liabilitiesWS, "Liabilities");
    
    // Add equity sheet
    const equityWS = XLSX.utils.json_to_sheet(equityData);
    XLSX.utils.book_append_sheet(workbook, equityWS, "Equity");
    
    // Add summary sheet
    const summaryData = [
      { Summary: 'Total Assets', Amount: totalAssets },
      { Summary: 'Total Liabilities', Amount: totalLiabilities },
      { Summary: 'Total Equity', Amount: totalEquity },
      { Summary: 'Total Liabilities and Equity', Amount: totalLiabilitiesAndEquity }
    ];
    const summaryWS = XLSX.utils.json_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(workbook, summaryWS, "Summary");
    
    // Save file
    XLSX.writeFile(workbook, `Balance_Sheet_${year}.xlsx`);
  };

  // Handle PDF export
  const handlePdfExport = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(18);
    doc.text(`Balance Sheet - ${year}`, 14, 22);
    
    // Add assets table
    doc.setFontSize(14);
    doc.text('Assets', 14, 35);
    
    const assetsColumns = ["Category", "Account Name", "Amount"];
    const assetsRows = filteredAssets.map(item => [
      item.category,
      item.name,
      formatCurrency(item.amount).replace('₹', 'Rs.')
    ]);
    
    // Add total row for assets
    assetsRows.push([
      'Total',
      'Total Assets',
      formatCurrency(totalAssets).replace('₹', 'Rs.')
    ]);
    
    doc.autoTable({
      head: [assetsColumns],
      body: assetsRows,
      startY: 40,
      theme: 'grid',
      styles: { fontSize: 8 },
      headStyles: { fillColor: [66, 139, 202] }
    });
    
    // Add liabilities table
    const liabilitiesStartY = doc.lastAutoTable.finalY + 15;
    doc.setFontSize(14);
    doc.text('Liabilities', 14, liabilitiesStartY - 5);
    
    const liabilitiesColumns = ["Category", "Account Name", "Amount"];
    const liabilitiesRows = filteredLiabilities.map(item => [
      item.category,
      item.name,
      formatCurrency(item.amount).replace('₹', 'Rs.')
    ]);
    
    // Add total row for liabilities
    liabilitiesRows.push([
      'Total',
      'Total Liabilities',
      formatCurrency(totalLiabilities).replace('₹', 'Rs.')
    ]);
    
    doc.autoTable({
      head: [liabilitiesColumns],
      body: liabilitiesRows,
      startY: liabilitiesStartY,
      theme: 'grid',
      styles: { fontSize: 8 },
      headStyles: { fillColor: [66, 139, 202] }
    });
    
    // Add equity table
    const equityStartY = doc.lastAutoTable.finalY + 15;
    
    // Check if we need a new page
    if (equityStartY > 250) {
      doc.addPage();
      doc.setFontSize(14);
      doc.text('Equity', 14, 20);
      
      const equityColumns = ["Category", "Account Name", "Amount"];
      const equityRows = filteredEquity.map(item => [
        item.category,
        item.name,
        formatCurrency(item.amount).replace('₹', 'Rs.')
      ]);
      
      // Add total rows for equity and liabilities + equity
      equityRows.push([
        'Total',
        'Total Equity',
        formatCurrency(totalEquity).replace('₹', 'Rs.')
      ]);
      
      equityRows.push([
        'Total',
        'Total Liabilities and Equity',
        formatCurrency(totalLiabilitiesAndEquity).replace('₹', 'Rs.')
      ]);
      
      doc.autoTable({
        head: [equityColumns],
        body: equityRows,
        startY: 25,
        theme: 'grid',
        styles: { fontSize: 8 },
        headStyles: { fillColor: [66, 139, 202] }
      });
    } else {
      doc.setFontSize(14);
      doc.text('Equity', 14, equityStartY - 5);
      
      const equityColumns = ["Category", "Account Name", "Amount"];
      const equityRows = filteredEquity.map(item => [
        item.category,
        item.name,
        formatCurrency(item.amount).replace('₹', 'Rs.')
      ]);
      
      // Add total rows for equity and liabilities + equity
      equityRows.push([
        'Total',
        'Total Equity',
        formatCurrency(totalEquity).replace('₹', 'Rs.')
      ]);
      
      equityRows.push([
        'Total',
        'Total Liabilities and Equity',
        formatCurrency(totalLiabilitiesAndEquity).replace('₹', 'Rs.')
      ]);
      
      doc.autoTable({
        head: [equityColumns],
        body: equityRows,
        startY: equityStartY,
        theme: 'grid',
        styles: { fontSize: 8 },
        headStyles: { fillColor: [66, 139, 202] }
      });
    }
    
    doc.save(`Balance_Sheet_${year}.pdf`);
  };
  return (
    <div className="container mx-auto p-4 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6" ref={componentRef}>
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Balance Sheet</h1>
        
        {/* Filters and Actions */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 print:hidden">
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="flex items-center">
              <span className="mr-2 whitespace-nowrap">Year:</span>
              <select 
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="flex cursor-pointer flex-wrap gap-2 w-full md:w-auto justify-end">
            <button 
              onClick={handlePdfExport}
              className="flex items-center gap-1 bg-red-600 text-white px-3 py-2 rounded-md hover:bg-red-700"
            >
              <FaFilePdf /> PDF
            </button>
            <button 
              onClick={handleExcelExport}
              className="flex cursor-pointer items-center gap-1 bg-green-600 text-white px-3 py-2 rounded-md hover:bg-green-700"
            >
              <FaFileExcel /> Excel
            </button>
            <button 
              onClick={handlePrint}
              className="flex cursor-pointer items-center gap-1 bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700"
            >
              <FaPrint /> Print
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
            placeholder="Search accounts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        {/* Balance Sheet Tables */}
        <div className="grid grid-cols-1 gap-6">
          {/* Assets Table */}
          <div className="overflow-x-auto">
            <h2 className="text-xl font-semibold text-gray-700 mb-3">Assets</h2>
            <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account Name</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredAssets.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">{item.category}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{item.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 text-right">{formatCurrency(item.amount)}</td>
                  </tr>
                ))}
                <tr className="bg-blue-50 font-bold">
                  <td colSpan="2" className="px-4 py-3 text-sm text-gray-900">Total Assets</td>
                  <td className="px-4 py-3 text-sm text-blue-700 text-right">{formatCurrency(totalAssets)}</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          {/* Liabilities Table */}
          <div className="overflow-x-auto mt-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-3">Liabilities</h2>
            <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account Name</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredLiabilities.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">{item.category}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{item.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 text-right">{formatCurrency(item.amount)}</td>
                  </tr>
                ))}
                <tr className="bg-red-50 font-bold">
                  <td colSpan="2" className="px-4 py-3 text-sm text-gray-900">Total Liabilities</td>
                  <td className="px-4 py-3 text-sm text-red-700 text-right">{formatCurrency(totalLiabilities)}</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          {/* Equity Table */}
          <div className="overflow-x-auto mt-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-3">Equity</h2>
            <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account Name</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredEquity.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">{item.category}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{item.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 text-right">{formatCurrency(item.amount)}</td>
                  </tr>
                ))}
                <tr className="bg-green-50 font-bold">
                  <td colSpan="2" className="px-4 py-3 text-sm text-gray-900">Total Equity</td>
                  <td className="px-4 py-3 text-sm text-green-700 text-right">{formatCurrency(totalEquity)}</td>
                </tr>
                <tr className="bg-purple-50 font-bold">
                  <td colSpan="2" className="px-4 py-3 text-sm text-gray-900">Total Liabilities and Equity</td>
                  <td className="px-4 py-3 text-sm text-purple-700 text-right">{formatCurrency(totalLiabilitiesAndEquity)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 shadow-sm">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">Total Assets</h3>
            <p className="text-2xl font-bold text-blue-900">{formatCurrency(totalAssets)}</p>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 shadow-sm">
            <h3 className="text-lg font-semibold text-red-800 mb-2">Total Liabilities</h3>
            <p className="text-2xl font-bold text-red-900">{formatCurrency(totalLiabilities)}</p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 shadow-sm">
            <h3 className="text-lg font-semibold text-green-800 mb-2">Total Equity</h3>
            <p className="text-2xl font-bold text-green-900">{formatCurrency(totalEquity)}</p>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 shadow-sm">
            <h3 className="text-lg font-semibold text-purple-800 mb-2">Liabilities + Equity</h3>
            <p className="text-2xl font-bold text-purple-900">{formatCurrency(totalLiabilitiesAndEquity)}</p>
            {totalAssets === totalLiabilitiesAndEquity ? (
              <span className="inline-block mt-2 px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">Balanced ✓</span>
            ) : (
              <span className="inline-block mt-2 px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded">Unbalanced ✗</span>
            )}
          </div>
        </div>
        
        {/* Balance Check */}
        <div className="mt-6 p-4 rounded-lg bg-gray-50 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Balance Check</h3>
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-2 md:mb-0">
              <span className="text-gray-600">Assets = Liabilities + Equity:</span>
              <span className={`font-bold ${totalAssets === totalLiabilitiesAndEquity ? 'text-green-600' : 'text-red-600'}`}>
                {totalAssets === totalLiabilitiesAndEquity ? 'Balanced' : 'Unbalanced'}
              </span>
            </div>
            {totalAssets !== totalLiabilitiesAndEquity && (
              <div className="text-red-600">
                Difference: {formatCurrency(Math.abs(totalAssets - totalLiabilitiesAndEquity))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlanceSheetPage;