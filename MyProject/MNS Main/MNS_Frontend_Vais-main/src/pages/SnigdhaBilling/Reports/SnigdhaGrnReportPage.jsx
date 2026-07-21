import {
  CalendarMonth as CalendarIcon,
  Close as CloseIcon,
  FileDownload as ExcelIcon,
  FilterList as FilterIcon,
  Info as InfoIcon,
  Inventory as InventoryIcon,
  PictureAsPdf as PdfIcon,
  Person as PersonIcon,
  Refresh as RefreshIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import {
  Button,
  CircularProgress,
  InputAdornment,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Divider,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { backendDomainS } from "../../../Common/index";
import jsPDF from "jspdf";
import "jspdf-autotable";
import ExcelJS from "exceljs";
import XLSX from "xlsx-js-style";

const SnigdhaGrnReportPage = () => {
  const [grns, setGrns] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("orders");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isGeneratingExcel, setIsGeneratingExcel] = useState(false);
  const [selectedGrn, setSelectedGrn] = useState(null);
  const [open, setOpen] = useState(false);

  const fetchAllGRN = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${backendDomainS}/api/v1/grn/`);
    //   console.log("Response :: ", response.data);
      setGrns(response.data.data);
      setError(null);
    } catch (error) {
      console.error("Error fetching purchase invoices:", error);
      setError("Failed to fetch purchase invoices. Please try again later.");
      toast.error("Failed to fetch purchase invoices. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllGRN();
  }, []);

  const filteredGRNs =
    viewMode === "orders"
      ? grns.filter(
          (grn) =>
            grn.grnNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
            grn.invoiceNumber
              .toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            grn.vendorName.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : grns;

  const paginatedGRNs = filteredGRNs.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const reportSummary = () => {
    let totalItems = 0;
    let totalAcceptedItems = 0;

    filteredGRNs.forEach((grn) => {
      if (grn.damageItems && Array.isArray(grn.damageItems)) {
        totalItems += grn.damageItems.reduce(
          (sum, item) => sum + (Number(item.orderQty) || 0),
          0
        );

        totalAcceptedItems += grn.damageItems.reduce(
          (sum, item) => sum + (Number(item.acceptedQty) || 0),
          0
        );
      }
    });

    return {
      totalOrders: filteredGRNs.length,
      totalItems,
      totalDamagedItems: filteredGRNs.reduce(
        (sum, grn) => sum + (grn.totals?.totalDamageQty || 0),
        0
      ),
      totalAcceptedItems,
      totalAmount: filteredGRNs.reduce(
        (sum, grn) => sum + (grn.totals?.totalInvoiceValue || 0),
        0
      ),
      totalDamageAmount: filteredGRNs.reduce(
        (sum, grn) => sum + (grn.totals?.totalDamageAmount || 0),
        0
      ),
      totalAcceptedAmount: filteredGRNs.reduce(
        (sum, grn) => sum + (grn.totals?.totalAcceptedAmount || 0),
        0
      ),
    };
  };

  const getItemSummary = () => {
    const itemSummary = {};

    // aggregate over full dataset (use `grns` so items view can be filtered separately)
    grns.forEach((grn) => {
      if (!Array.isArray(grn.damageItems)) return;

      grn.damageItems.forEach((item) => {
        const key = item.item_id || item.itemName || item.name;
        if (!key) return;

        if (!itemSummary[key]) {
          itemSummary[key] = {
            itemName: item.itemName || item.name || key,
            unitPrice: parseFloat(item.unitPrice) || 0,
            totalQty: 0,
            totalValue: 0,
            damagedQty: 0,
            damagedAmount: 0,
            vendors: new Set(),
            lastPurchaseDate: null,
          };
        }

        const qty = Number(item.orderQty) || 0;
        const dQty = Number(item.damageQty) || 0;
        const dAmount = Number(item.damageAmount) || 0;
        const unit =
          parseFloat(item.unitPrice) || itemSummary[key].unitPrice || 0;
        const value = qty * unit;

        itemSummary[key].totalQty += qty;
        itemSummary[key].totalValue += value;
        itemSummary[key].damagedQty += dQty;
        itemSummary[key].damagedAmount += dAmount;

        if (grn.vendorName) itemSummary[key].vendors.add(grn.vendorName);

        if (grn.date) {
          const gd = new Date(grn.date);
          if (
            !itemSummary[key].lastPurchaseDate ||
            gd > new Date(itemSummary[key].lastPurchaseDate)
          ) {
            itemSummary[key].lastPurchaseDate = grn.date;
          }
        }
      });
    });

    return Object.values(itemSummary).map((i) => ({
      itemName: i.itemName,
      unitPrice: i.unitPrice,
      totalQty: i.totalQty,
      totalValue: i.totalValue,
      damagedQty: i.damagedQty,
      damagedAmount: i.damagedAmount,
      vendors: Array.from(i.vendors),
      lastPurchaseDate: i.lastPurchaseDate,
    }));
  };

  const itemsSummary = getItemSummary();

  const filteredItems =
    viewMode === "items" && searchQuery
      ? itemsSummary.filter(
          (it) =>
            it.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            it.vendors.some((v) =>
              v.toLowerCase().includes(searchQuery.toLowerCase())
            )
        )
      : itemsSummary;

  const paginatedItems = filteredItems.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const generatePDF = () => {
    setIsGeneratingPdf(true);

    try {
      const doc = new jsPDF("l", "mm", "a4");

      const summary = reportSummary();
      let y = 15;

      // Header Title
      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.text("GRN DAMAGE REPORT - SNIGDHA ENTERPRISE", 14, y);

      // Sub details
      y += 6;
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(`Generated On: ${new Date().toLocaleString()}`, 14, y);

      // Search filter (if present)
      if (searchQuery) {
        y += 5;
        doc.text(`Filtered Search: ${searchQuery}`, 14, y);
      }

      // Add space before summary block
      y += 10;

      // Summary Box Background
      doc.setFillColor(245, 245, 245);

      // SUMMARY HEADER
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("SUMMARY", 14, y + 6);

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");

      y += 12;
      // Row 1
      doc.text(`Total GRN Entries: ${summary.totalOrders}`, 14, y);
      doc.text(`Total Items: ${summary.totalItems}`, 80, y);
      doc.text(`Accepted Items: ${summary.totalAcceptedItems}`, 150, y);
      doc.text(`Damaged Items: ${summary.totalDamagedItems}`, 220, y);

      // Row 2
      y += 6;
      doc.text(`Invoice Value: Rs.${summary.totalAmount.toFixed(2)}`, 14, y);
      doc.text(
        `Damage Amount: Rs.${summary.totalDamageAmount.toFixed(2)}`,
        150,
        y
      );
      doc.text(
        `Accepted Value: Rs.${summary.totalAcceptedAmount.toFixed(2)}`,
        80,
        y
      );

      // Ensure spacing before table begins
      y += 15;

      // ================= TABLE SECTION ==================
      let tableHead;
      let tableRows;

      if (viewMode === "items") {
        tableHead = [
          [
            "Item Name",
            "Unit Price",
            "Total Qty",
            "Total Value",
            "Damaged Qty",
            "Damaged Amount",
            "Vendors",
            "Last Purchase",
          ],
        ];

        tableRows = filteredItems.map((it) => [
          it.itemName,
          `₹${(it.unitPrice || 0).toFixed(2)}`,
          it.totalQty || 0,
          `₹${(it.totalValue || 0).toFixed(2)}`,
          it.damagedQty || 0,
          `₹${(it.damagedAmount || 0).toFixed(2)}`,
          it.vendors && it.vendors.length ? it.vendors.join(", ") : "-",
          it.lastPurchaseDate
            ? new Date(it.lastPurchaseDate).toLocaleDateString()
            : "-",
        ]);
      } else {
        // For Orders export: include damaged items as nested rows per GRN.
        tableHead = [
          [
            "GRN Date",
            "GRN Number",
            "Invoice Number",
            "Vendor",
            "Item Name",
            "Item Qty",
            "Damaged Qty",
            "Damaged Amount",
          ],
        ];

        tableRows = [];
        filteredGRNs.forEach((grn) => {
          const items = Array.isArray(grn.damageItems) ? grn.damageItems : [];
          if (items.length === 0) {
            tableRows.push([
              grn.date || "-",
              grn.grnNumber || "-",
              grn.invoiceNumber || "-",
              grn.vendorName || "-",
              "-",
              0,
              0,
              `₹${(grn.totals?.totalDamageAmount || 0).toFixed(2)}`,
            ]);
          } else {
            items.forEach((it, idx) => {
              tableRows.push([
                idx === 0 ? grn.date || "-" : "",
                idx === 0 ? grn.grnNumber || "-" : "",
                idx === 0 ? grn.invoiceNumber || "-" : "",
                idx === 0 ? grn.vendorName || "-" : "",
                it.itemName || it.name || "-",
                Number(it.orderQty) || 0,
                Number(it.damageQty) || 0,
                (Number(it.damageAmount) || 0).toFixed(2),
              ]);
            });
          }
        });
      }

      doc.autoTable({
        startY: y,
        head: tableHead,
        body: tableRows,
        theme: "grid",
        styles: { fontSize: 9, cellPadding: 3 },
        headStyles: {
          fillColor: [230, 230, 230],
          textColor: 20,
          fontStyle: "bold",
          borderColor: [0, 0, 0],
        },
        columnStyles:
          viewMode === "items"
            ? {
                1: { halign: "right" },
                2: { halign: "right" },
                3: { halign: "right" },
                4: { halign: "right" },
                5: { halign: "right" },
              }
            : {
                5: { halign: "right" },
                6: { halign: "right" },
                7: { halign: "right" },
              },

        didDrawPage(data) {
          const pageCount = doc.internal.getNumberOfPages();
          doc.setFontSize(9);
          doc.text(
            `Page ${data.pageNumber} of ${pageCount}`,
            doc.internal.pageSize.width - 28,
            doc.internal.pageSize.height - 6
          );
        },
      });

      const finalY = doc.lastAutoTable.finalY + 8;

      // GRAND TOTAL BLOCK
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text(
        `Overall Damaged Amount : Rs.${summary.totalDamageAmount.toFixed(2)}`,
        14,
        finalY
      );

      doc.save("GRN_Report.pdf");
      toast.success("GRN PDF Exported Successfully");
    } catch (err) {
      toast.error("PDF Creation Failed");
      console.error("PDF ERROR:", err);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const generateExcel = () => {
    setIsGeneratingExcel(true);

    try {
      if (viewMode === "orders") {
        const header = [
          "GRN Date",
          "GRN Number",
          "Invoice Number",
          "Vendor",
          "Item Name",
          "HSN Code",
          "Unit",
          "Item Qty",
          "Unit Price",
          "Damage Qty",
          "Damage Amount",
          "Line Total",
        ];

        const rows = [header];
        const merges = [];
        const summaryIndexes = [];

        filteredGRNs.forEach((grn) => {
          const items = Array.isArray(grn.damageItems) ? grn.damageItems : [];
          const startRow = rows.length;

          if (items.length === 0) {
            rows.push([
              grn.date,
              grn.grnNumber,
              grn.invoiceNumber,
              grn.vendorName,
              "-",
              "-",
              "-",
              0,
              0,
              0,
              `₹${(grn.totals?.totalDamageAmount || 0).toFixed(2)}`,
              `₹${(grn.totals?.totalInvoiceValue || 0).toFixed(2)}`,
            ]);
          } else {
            items.forEach((it) =>
              rows.push([
                grn.date,
                grn.grnNumber,
                grn.invoiceNumber,
                grn.vendorName,
                it.itemName || it.name || "-",
                it.hsnCode || "-",
                it.uom || it.unit || "-",
                Number(it.orderQty) || 0,
                `₹${(Number(it.unitPrice) || 0).toFixed(2)}`,
                Number(it.damageQty) || 0,
                `₹${(Number(it.damageAmount) || 0).toFixed(2)}`,
                `₹${(
                  (Number(it.orderQty) || 0) * (Number(it.unitPrice) || 0)
                ).toFixed(2)}`,
              ])
            );

            const subtotalRow = rows.length;
            summaryIndexes.push(subtotalRow);

            rows.push([
              "",
              "",
              "",
              "",
              "GRN Subtotal",
              "",
              "",
              "",
              "",
              grn.totals?.totalDamageQty || 0,
              `₹${(grn.totals?.totalDamageAmount || 0).toFixed(2)}`,
              `₹${(grn.totals?.totalInvoiceValue || 0).toFixed(2)}`,
            ]);

            if (items.length > 1) {
              const endRow = subtotalRow - 1;
              [0, 1, 2, 3].forEach((c) =>
                merges.push({ s: { r: startRow, c }, e: { r: endRow, c } })
              );
            }
          }
        });

        const ws = XLSX.utils.aoa_to_sheet(rows);
        ws["!merges"] = merges;

        ws["!cols"] = [
          { wch: 14 },
          { wch: 25 },
          { wch: 25 },
          { wch: 20 },
          { wch: 30 },
          { wch: 12 },
          { wch: 10 },
          { wch: 10 },
          { wch: 12 },
          { wch: 12 },
          { wch: 14 },
          { wch: 14 },
        ];

        // Header styling
        for (let c = 0; c < header.length; c++) {
          const cell = ws[XLSX.utils.encode_cell({ r: 0, c })];
          cell.s = {
            fill: { fgColor: { rgb: "D9D9D9" } },
            font: { bold: true, color: { rgb: "000000" } },
            alignment: { horizontal: "center", vertical: "center" },
            border: {
              top: { style: "thin" },
              bottom: { style: "thin" },
              left: { style: "thin" },
              right: { style: "thin" },
            },
          };
        }

        // Vertically center merged cells
        merges.forEach((m) => {
          for (let r = m.s.r; r <= m.e.r; r++) {
            for (let c = m.s.c; c <= m.e.c; c++) {
              const cell = ws[XLSX.utils.encode_cell({ r, c })];
              cell.s = {
                alignment: { vertical: "center", horizontal: "left" },
                font: { size: 11 },
              };
            }
          }
        });

        // Highlight subtotal rows
        summaryIndexes.forEach((rowIdx) => {
          for (let col = 0; col < header.length; col++) {
            const cell = ws[XLSX.utils.encode_cell({ r: rowIdx, c: col })];
            cell.s = {
              fill: { fgColor: { rgb: "FFF9C4" } },
              font: { bold: true },
              alignment: { horizontal: "center", vertical: "center" },
              border: {
                top: { style: "thin" },
                bottom: { style: "thin" },
                left: { style: "thin" },
                right: { style: "thin" },
              },
            };
          }
        });

        // Currency columns right aligned
        const currencyCols = [8, 10, 11]; // Unit Price, Damage Amount, Total
        currencyCols.forEach((col) => {
          for (let r = 1; r < rows.length; r++) {
            const cell = ws[XLSX.utils.encode_cell({ r, c: col })];
            if (cell)
              cell.s = {
                alignment: { horizontal: "right", vertical: "center" },
                font: { size: 11 },
                border: {
                  top: { style: "thin" },
                  bottom: { style: "thin" },
                  left: { style: "thin" },
                  right: { style: "thin" },
                },
              };
          }
        });

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "GRN Orders");
        XLSX.writeFile(
          wb,
          `GRN_Orders_${new Date().toISOString().split("T")[0]}.xlsx`
        );
      }

      toast.success("Excel report generated successfully");
    } catch {
      toast.error("Excel generation failed");
    } finally {
      setIsGeneratingExcel(false);
    }
  };

  return (
    <div className=" p-4 shadow-md h-full rounded-sm">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h2 className=" text-2xl font-bold mb-4">Snigdha GRN Report</h2>

        <div className="flex flex-wrap gap-2">
          <Button
            variant={viewMode === "orders" ? "contained" : "outlined"}
            color="primary"
            onClick={() => setViewMode("orders")}
            startIcon={<CalendarIcon />}
            size="small"
          >
            Orders
          </Button>
          <Button
            variant={viewMode === "items" ? "contained" : "outlined"}
            color="primary"
            onClick={() => setViewMode("items")}
            startIcon={<InventoryIcon />}
            size="small"
          >
            Items
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg shadow-sm">
          <div className="text-blue-500 text-sm font-medium mb-1">
            Total Orders
          </div>
          <div className="text-2xl font-bold">
            {reportSummary().totalOrders}
          </div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg shadow-sm">
          <div className="text-green-500 text-sm font-medium mb-1">
            Total Items
          </div>
          <div className="text-2xl font-bold">{reportSummary().totalItems}</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg shadow-sm">
          <div className="text-green-500 text-sm font-medium mb-1">
            Total Damaged Items
          </div>
          <div className="text-2xl font-bold">
            {reportSummary().totalDamagedItems}
          </div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg shadow-sm">
          <div className="text-green-500 text-sm font-medium mb-1">
            Total Amount
          </div>
          <div className="text-2xl font-bold">
            ₹{reportSummary().totalAmount.toFixed(2)}
          </div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg shadow-sm">
          <div className="text-purple-500 text-sm font-medium mb-1">
            Total Damage Amount
          </div>
          <div className="text-2xl font-bold">
            ₹{reportSummary().totalDamageAmount}
          </div>
        </div>
      </div>

      <div className=" flex items-start gap-2">
        <TextField
          fullWidth
          variant="outlined"
          placeholder={`Search ${
            viewMode === "orders"
              ? "purchase orders"
              : viewMode === "items"
              ? "items"
              : "vendors"
          }...`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          size="small"
          sx={{
            mb: 2,
            width: 700,
            "& input": { fontSize: "15px" },
          }}
        />
        <Button
          variant="outlined"
          color="primary"
          onClick={generatePDF}
          startIcon={
            isGeneratingPdf ? <CircularProgress size={20} /> : <PdfIcon />
          }
          // disabled={isGeneratingPdf || filteredPurchaseOrders.length === 0}
        >
          Export PDF
        </Button>
        <Button
          variant="outlined"
          color="primary"
          onClick={generateExcel}
          startIcon={
            isGeneratingExcel ? <CircularProgress size={20} /> : <ExcelIcon />
          }
          // disabled={isGeneratingExcel || filteredPurchaseOrders.length === 0}
        >
          Export Excel
        </Button>
      </div>

      <div className="my-4">
        {viewMode === "orders" && (
          <TableContainer component={Paper} className="mb-4">
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell className="font-bold">GRN Date</TableCell>
                  <TableCell className="font-bold">GRN Number</TableCell>
                  <TableCell className="font-bold">Invoice Number</TableCell>
                  <TableCell className="font-bold">Vendor</TableCell>
                  <TableCell className="font-bold" align="right">
                    Damaged Qty
                  </TableCell>
                  <TableCell className="font-bold" align="right">
                    Damaged Amount
                  </TableCell>
                  <TableCell className="font-bold" align="center">
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      <div className=" flex justify-center items-center gap-1">
                        <CircularProgress size={18} /> Please wait...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      align="center"
                      className=" text-red-600"
                    >
                      {error}
                    </TableCell>
                  </TableRow>
                ) : paginatedGRNs.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      align="center"
                      className=" text-red-600"
                    >
                      No GRN found :(
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedGRNs.map((grn) => (
                    <TableRow
                      key={grn._id}
                      hover
                      sx={{ "&:hover": { backgroundColor: "#f8fafc" } }}
                    >
                      <TableCell>{grn.date}</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>
                        {grn.grnNumber}
                      </TableCell>
                      <TableCell>{grn.invoiceNumber}</TableCell>
                      <TableCell>{grn.vendorName}</TableCell>

                      <TableCell
                        align="right"
                        sx={{ fontWeight: 600, color: "red" }}
                      >
                        {grn.totals.totalDamageQty}
                      </TableCell>

                      <TableCell
                        align="right"
                        sx={{ fontWeight: 600, color: "red" }}
                      >
                        ₹{grn.totals.totalDamageAmount}
                      </TableCell>

                      <TableCell align="center">
                        <Button
                          size="small"
                          onClick={() => {
                            console.log("Selected GRN:", grn);
                            setSelectedGrn(grn);
                            setOpen(true);
                          }}
                          color="primary"
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
            <TablePagination
              component="div"
              count={filteredGRNs.length}
              page={page}
              onPageChange={(e, newPage) => setPage(newPage)}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={(e) => {
                setRowsPerPage(parseInt(e.target.value, 10));
                setPage(0);
              }}
              rowsPerPageOptions={[5, 10, 20, 50, 100]}
            />
          </TableContainer>
        )}

        {viewMode === "items" && (
          <TableContainer component={Paper} className="mb-4">
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell className="font-bold">Item Name</TableCell>
                  <TableCell className="font-bold" align="right">
                    Unit Price
                  </TableCell>
                  <TableCell className="font-bold" align="right">
                    Total Quantity
                  </TableCell>
                  <TableCell className="font-bold" align="right">
                    Total Value
                  </TableCell>
                  <TableCell className="font-bold" align="right">
                    Damaged Quantity
                  </TableCell>
                  <TableCell className="font-bold" align="right">
                    Damaged Amount
                  </TableCell>
                  <TableCell className="font-bold">Vendors</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      <div className=" flex justify-center items-center gap-1">
                        <CircularProgress size={18} /> Please wait...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      align="center"
                      className=" text-red-600"
                    >
                      {error}
                    </TableCell>
                  </TableRow>
                ) : filteredItems.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      align="center"
                      className=" text-red-600"
                    >
                      No items found :(
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedItems.map((r) => (
                    <TableRow key={r.itemName} hover>
                      <TableCell>{r.itemName}</TableCell>
                      <TableCell align="right">
                        ₹{(r.unitPrice || 0).toFixed(2)}
                      </TableCell>
                      <TableCell align="center">{r.totalQty}</TableCell>
                      <TableCell align="right">
                        ₹{(r.totalValue || 0).toFixed(2)}
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{ fontWeight: 600, color: "red" }}
                      >
                        {r.damagedQty}
                      </TableCell>
                      <TableCell
                        align="right"
                        color="red"
                        sx={{ fontWeight: 600, color: "red" }}
                      >
                        ₹{(r.damagedAmount || 0).toFixed(2)}
                      </TableCell>
                      <TableCell align="center">{r.vendors.length}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
            <TablePagination
              component="div"
              count={filteredItems.length}
              page={page}
              onPageChange={(e, newPage) => setPage(newPage)}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={(e) => {
                setRowsPerPage(parseInt(e.target.value, 10));
                setPage(0);
              }}
              rowsPerPageOptions={[5, 10, 20, 50, 100]}
            />
          </TableContainer>
        )}
      </div>

      {open && selectedGrn && (
        <GRNDetailsDialog
          open={open}
          handleClose={() => setOpen(false)}
          grn={selectedGrn}
        />
      )}
    </div>
  );
};

export default SnigdhaGrnReportPage;

export function GRNDetailsDialog({ open, handleClose, grn }) {
  if (!grn) return null;

  const totals = grn.totals || {};
  const items = grn.damageItems || [];

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
      <DialogTitle className="flex justify-between items-center font-semibold">
        GRN Damage Details
        <IconButton onClick={handleClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        {/* ===== Top Summary Grid ===== */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <Typography variant="subtitle2" color="textSecondary">
              GRN Number
            </Typography>
            <Typography variant="body1">{grn.grnNumber || "N/A"}</Typography>
          </div>

          <div>
            <Typography variant="subtitle2" color="textSecondary">
              Invoice Number
            </Typography>
            <Typography variant="body1">
              {grn.invoiceNumber || "N/A"}
            </Typography>
          </div>

          <div>
            <Typography variant="subtitle2" color="textSecondary">
              Date
            </Typography>
            <Typography variant="body1">{grn.date || "N/A"}</Typography>
          </div>

          <div>
            <Typography variant="subtitle2" color="textSecondary">
              Vendor
            </Typography>
            <Typography variant="body1">{grn.vendorName || "N/A"}</Typography>
          </div>

          <div>
            <Typography variant="subtitle2" color="textSecondary">
              Invoice Value
            </Typography>
            <Typography variant="body1">
              ₹{parseFloat(totals.totalInvoiceValue || 0).toFixed(2)}
            </Typography>
          </div>

          <div>
            <Typography variant="subtitle2" color="textSecondary">
              Accepted Amount
            </Typography>
            <Typography variant="body1">
              ₹{parseFloat(totals.totalAcceptedAmount || 0).toFixed(2)}
            </Typography>
          </div>

          <div>
            <Typography variant="subtitle2" color="textSecondary">
              Total Damage Quantity
            </Typography>
            <Typography variant="body1">
              {totals.totalDamageQty || 0}
            </Typography>
          </div>

          <div>
            <Typography variant="subtitle2" color="textSecondary">
              Total Damage Amount
            </Typography>
            <Typography variant="body1" className="font-semibold text-red-600">
              ₹{parseFloat(totals.totalDamageAmount || 0).toFixed(2)}
            </Typography>
          </div>
        </div>

        <Divider className="my-4" />

        {/* ============ ITEM TABLE ============ */}

        <Typography variant="h6" className="mb-3 font-semibold">
          Damaged Items
        </Typography>

        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell className="font-bold">Item Name</TableCell>
                <TableCell className="font-bold">Qty</TableCell>
                <TableCell className="font-bold">Unit Price</TableCell>
                <TableCell className="font-bold">Total Amount</TableCell>
                <TableCell className="font-bold">Damage Qty</TableCell>
                <TableCell className="font-bold">Damage Value</TableCell>
                <TableCell className="font-bold">Reason</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {items.length > 0 ? (
                items.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      {item.itemName} ({item.hsnCode})
                    </TableCell>
                    <TableCell>{item.orderQty || 0}</TableCell>

                    <TableCell>
                      ₹{parseFloat(item.unitPrice || 0).toFixed(2)}
                    </TableCell>

                    <TableCell>
                      ₹{parseFloat(item.totalAmount || 0).toFixed(2)}
                    </TableCell>

                    <TableCell>{item.damageQty || 0}</TableCell>

                    <TableCell className="text-red-600 font-semibold">
                      ₹{parseFloat(item.damageAmount || 0).toFixed(2)}
                    </TableCell>

                    <TableCell>{item.damageReason || "N/A"}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No damaged items found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
    </Dialog>
  );
}


