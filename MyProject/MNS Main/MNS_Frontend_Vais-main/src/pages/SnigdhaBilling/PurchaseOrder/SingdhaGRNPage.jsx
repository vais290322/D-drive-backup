import {
  Button,
  CircularProgress,
  TablePagination,
  TextField,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiSearch } from "react-icons/fi";
import { MdModeEditOutline } from "react-icons/md";
import { RiCloseLine, RiDeleteBinLine } from "react-icons/ri";
import { backendDomainS } from "../../../Common/index";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from "@mui/material";

const SingdhaGRNPage = () => {
  const [purchaseInvoices, setPurchaseInvoices] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [grns, setGrns] = useState([]);
  const [grnLoading, setGrnLoading] = useState(false);
  const [grnError, setGrnError] = useState(null);
  const [query, setQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [items, setItems] = useState([
    {
      item_id: "",
      itemName: "",
      hsnCode: "",
      uom: "",
      group: "",
      unitPrice: 0,
      orderQty: 0,
      damageQty: 0,
      acceptedQty: 0,
      totalAmount: 0,
      damageAmount: 0,
      acceptedAmount: 0,
      damageReason: "",
    },
  ]);
  const [totals, setTotals] = useState({
    totalInvoiceValue: 0,
    totalDamageQty: 0,
    totalDamageAmount: 0,
    totalAcceptedAmount: 0,
  });
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [openInvoicePicker, setOpenInvoicePicker] = useState(false);
  const [invoiceSearch, setInvoiceSearch] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [mode, setMode] = useState(null);
  const isView = mode === "view";
  const isEdit = mode === "edit";
  const isAdd = mode === "add";

  const fetchPurchaseInvoices = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${backendDomainS}/api/v1/po/all`);
      // console.log("Response :: ", response.data);
      setPurchaseInvoices(response.data.purchaseOrders);
      setError(null);
    } catch (error) {
      console.error("Error fetching purchase invoices:", error);
      setError("Failed to fetch purchase invoices. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAllGRN = async () => {
    setGrnLoading(true);
    setGrnError(null);
    try {
      const response = await axios.get(`${backendDomainS}/api/v1/grn/`);
      console.log("Response :: ", response.data);
      setGrns(response.data.data);
      setGrnError(null);
    } catch (error) {
      console.error("Error fetching purchase invoices:", error);
      setGrnError("Failed to fetch purchase invoices. Please try again later.");
      toast.error("Failed to fetch purchase invoices. Please try again later.");
    } finally {
      setGrnLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchaseInvoices();
    fetchAllGRN();
  }, []);

  const grnInvoiceNumbers = new Set(grns.map((grn) => grn.invoiceNumber));

  const filteredGRNs = grns.filter(
    (grn) =>
      grn.grnNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      grn.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      grn.vendorName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginatedGRNs = filteredGRNs.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleInvoiceSelect = (invoice, actionMode = "add") => {
    console.log("Selected Invoice:", invoice)

    setQuery("");

    setMode(actionMode);

    if (actionMode === "view" || actionMode === "edit") {
      const raw = (invoice.damageItems || []).map((item) => ({
        _id: item._id || item.item_id || item.id,
        item_id: item.item_id || item._id || item.id,
        itemName: item.itemName || item.name || item.itemName || "",
        hsnCode: item.hsnCode || item.hsn || "",
        uom: item.uom || item.unit || "",
        group: item.group || "",
        unitPrice: item.unitPrice || item.rate || item.price || 0,
        orderQty: item.quantity || item.orderQty || item.qty || 0,
        damageQty: item.damageQty || item.damage_qty || item.damagedQty || 0,
        acceptedQty: item.acceptedQty || item.accepted_qty,
        totalAmount: item.totalAmount || item.amount || 0,
        damageAmount: item.damageAmount || item.damage_amount,
        acceptedAmount: item.acceptedAmount || item.accepted_amount,
        damageReason: item.damageReason || item.reason || "",
        discountRate: item.discountRate || item.discount || 0,
        taxRate: item.taxRate || item.tax || 0,
      }));


      console.log("raw :: ", raw)

      const currItems = raw.map((it) => {
        const unitPrice = it.unitPrice || 0;
        const damageQty = it.damageQty || 0;
        const orderQty = it.orderQty || 0;
        const acceptedQty = it.acceptedQty ?? Math.max(orderQty - damageQty, 0);
        const damageAmount = it.damageAmount ?? damageQty * unitPrice;
        const acceptedAmount = it.acceptedAmount ?? acceptedQty * unitPrice;
        const discountAmount = it.discountAmount ?? acceptedQty * (it.discountRate || 0);
        const taxAmount = it.taxAmount ?? acceptedQty * (it.taxRate || 0);

        console.log("it :: ", it)

        return {
          ...it,
          damageQty,
          acceptedQty,
          damageAmount,
          acceptedAmount,
          discountAmount,
          taxAmount,
        };
      });

      // const existingIds = new Set(currItems.map((i) => i.item_id));

      const matchedInvoice = purchaseInvoices.find(
        (p) => p.invoiceNumber === invoice.invoiceNumber
      );

      console.log(matchedInvoice);

      const newPurchaseRaw = (matchedInvoice?.items ?? []).map((item) => ({
        _id: item._id || item.item_id || item.id,
        item_id: item.item_id || item._id || item.id,
        itemName: item.itemName || item.name || "",
        hsnCode: item.hsnCode || item.hsn || "",
        uom: item.uom || item.unit || "",
        group: item.group || "",
        unitPrice: item.unitPrice || item.rate || item.price || 0,
        orderQty: item.quantity || item.orderQty || item.qty || 0,
        damageQty:
          invoice.damageItems.filter((i) => i.item_id === item.item_id)[0]
            ?.damageQty ||
          item.damageQty ||
          item.damage_qty ||
          item.damagedQty ||
          0,
        acceptedQty: item.acceptedQty || item.accepted_qty,
        totalAmount: item.totalAmount || item.amount || 0,
        damageAmount:
          invoice.damageItems.filter((i) => i.item_id === item.item_id)[0]
            ?.damageAmount ||
          item.damageAmount ||
          item.damage_amount,
        acceptedAmount: item.acceptedAmount || item.accepted_amount,
        damageReason: item.damageReason || item.reason || "",
        discountRate: item.discountRate || item.discount || 0,
        taxRate: item.taxRate || item.tax || 0,
      }));

      // const onlyNewItems = newPurchaseRaw.filter(
      //   (item) => !existingIds.has(item.item_id)
      // );

      console.log("newPurchaseRaw :: ", newPurchaseRaw);

      // const finalItems = [...currItems, ...newPurchaseRaw];
      const finalItems = newPurchaseRaw;

      console.log("finalItems :: ", finalItems);

      const invoiceValue =
        matchedInvoice.totalPayableAmount ??
        invoice.totals?.totalInvoiceValue ??
        0;
      const totalDamageQty =
        matchedInvoice.totalDamageQty ??
        invoice.totals?.totalDamageQty ??
        currItems.reduce((s, i) => s + (i.damageQty || 0), 0);
      const totalDamageAmount =
        matchedInvoice.totalDamageAmount ??
        invoice.totals?.totalDamageAmount ??
        currItems.reduce((s, i) => s + (i.damageAmount || 0), 0);
      const totalAcceptedAmount =
        invoice.totals?.totalAcceptedAmount ??
        invoiceValue - totalDamageAmount;

        console.log({ invoiceValue, totalDamageQty, totalDamageAmount, totalAcceptedAmount });

      setTotals({
        totalInvoiceValue: invoiceValue,
        totalDamageQty,
        totalDamageAmount,
        totalAcceptedAmount,
      });

      console.log("invoice :: ", invoice);

      setSelectedInvoice(invoice);
      setItems(finalItems);
    } else {
      const raw = (invoice.items || []).map((item) => ({
        _id: item._id || item.item_id || item.id,
        item_id: item.item_id || item._id || item.id,
        itemName: item.itemName || item.name || "",
        hsnCode: item.hsnCode || item.hsn || "",
        uom: item.uom || item.unit || "",
        group: item.group || "",
        unitPrice: item.unitPrice || item.rate || item.price || 0,
        orderQty: item.quantity || item.orderQty || item.qty || 0,
        damageQty: item.damageQty || item.damage_qty || 0,
        acceptedQty: item.acceptedQty || item.accepted_qty,
        totalAmount: item.totalAmount || item.amount || 0,
        damageAmount: item.damageAmount || item.damage_amount,
        acceptedAmount: item.acceptedAmount || item.accepted_amount,
        damageReason: item.damageReason || "",
        discountRate: item.discountRate || 0,
        taxRate: item.taxRate || 0,
      }));

      const currItems = raw.map((it) => {
        const unitPrice = it.unitPrice || 0;
        const damageQty = it.damageQty || 0;
        const orderQty = it.orderQty || 0;
        const acceptedQty = it.acceptedQty ?? Math.max(orderQty - damageQty, 0);
        const damageAmount = it.damageAmount ?? damageQty * unitPrice;
        const acceptedAmount = it.acceptedAmount ?? acceptedQty * unitPrice;

        return {
          ...it,
          damageQty,
          acceptedQty,
          damageAmount,
          acceptedAmount,
        };
      });

      const invoiceValue =
        invoice.totalPayableAmount ?? invoice.totals?.totalInvoiceValue ?? 0;
      const totalDamageQty =
        invoice.totalDamageQty ??
        invoice.totals?.totalDamageQty ??
        currItems.reduce((s, i) => s + (i.damageQty || 0), 0);
      const totalDamageAmount =
        invoice.totalDamageAmount ??
        invoice.totals?.totalDamageAmount ??
        currItems.reduce((s, i) => s + (i.damageAmount || 0), 0);
      const totalAcceptedAmount =
        invoice.totals?.totalAcceptedAmount ?? invoiceValue - totalDamageAmount;

      setTotals({
        totalInvoiceValue: Number(invoiceValue).toFixed(2),
        totalDamageQty,
        totalDamageAmount: Number(totalDamageAmount).toFixed(2),
        totalAcceptedAmount: Number(totalAcceptedAmount).toFixed(2),
      });

      setSelectedInvoice(invoice);
      setItems(currItems);
    }
    setShowSuggestions(false);
    setOpenModal(true);
  };

  const handleViewGRN = (grn) => {
    handleInvoiceSelect(grn, "view");
  };

  const handleSaveGRN = async () => {
    console.log(mode);

    setSaving(true);
    setSaveError(null);

    const damageItems = items
      .filter((it) => it.damageQty > 0)
      .map((it) => ({
        item_id: it.item_id || it._id || "",
        itemName: it.itemName || "",
        hsnCode: it.hsnCode || "",
        uom: it.uom || "",
        group: it.group || "",
        unitPrice: String(it.unitPrice ?? ""),
        orderQty: Number(it.orderQty ?? 0),
        damageQty: Number(it.damageQty ?? 0),
        acceptedQty: Number(
          it.acceptedQty ??
            Math.max((it.orderQty || 0) - (it.damageQty || 0), 0)
        ),
        totalAmount: Number(
          it.totalAmount ?? Number(it.orderQty || 0) * Number(it.unitPrice || 0)
        ),
        damageAmount: Number(
          it.damageAmount ??
            Number(it.damageQty || 0) * Number(it.unitPrice || 0)
        ),
        acceptedAmount: Number(
          it.acceptedAmount ??
            Number(it.acceptedQty ?? 0) * Number(it.unitPrice || 0)
        ),
        damageReason: it.damageReason || "",
        discountRate: it.discountRate || 0,
        taxRate: it.taxRate || 0,
      }));

    const payload = {
      grnNumber: selectedInvoice?.grnNumber || "",
      invoiceNumber: selectedInvoice?.invoiceNumber || "",
      date: selectedInvoice?.date || new Date().toISOString(),
      vendorName:
        selectedInvoice?.receiverDetails?.name ||
        selectedInvoice?.vendorName ||
        selectedInvoice?.receiverName ||
        selectedInvoice?.supplierName ||
        "",
      damageItems: damageItems,
      totals: {
        totalInvoiceValue: Number(totals.totalInvoiceValue ?? 0),
        totalDamageQty: Number(totals.totalDamageQty ?? 0),
        totalDamageAmount: Number(totals.totalDamageAmount ?? 0),
        totalAcceptedAmount: Number(totals.totalAcceptedAmount ?? 0),
      },
    };

    console.log("Payload :: ", payload);

    try {
      const response =
        mode === "add"
          ? await axios.post(`${backendDomainS}/api/v1/grn`, payload)
          : await axios.put(
              `${backendDomainS}/api/v1/grn/${selectedInvoice?._id}`,
              payload
            );
      console.log("Response :: ", response.data);

      if (response.data && response.data.success) {
        setOpenModal(false);
        setSaveError(null);
        toast.success(response.data.message || "GRN saved successfully");
      }
    } catch (error) {
      console.error("Error saving GRN:", error);
      setSaveError("Failed to save GRN. Please try again later.");
      toast.error("Failed to save GRN. Please try again later.");
    } finally {
      setSaving(false);
      setMode(null);
      fetchAllGRN();
    }
  };

  const handleDeleteGRN = async (grn) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this GRN?"
    );
    if (!confirmDelete) return;

    const id = grn?._id || selectedInvoice?._id;
    if (!id) return;

    try {
      const response = await axios.delete(`${backendDomainS}/api/v1/grn/${id}`);
      console.log("Response :: ", response.data);
      if (response.data && response.data.success) {
        setOpenModal(false);
        toast.success(response.data.message || "GRN deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting GRN:", error);
    } finally {
      fetchAllGRN();
    }
  };

  return (
    <div className=" p-4 shadow-md h-full rounded-sm">
      <h2 className=" text-2xl font-bold mb-4">Snigdha Damage Management</h2>

      <>
        <div className=" flex items-start gap-2">
          <TextField
            label="Search Invoice / GRN"
            variant="outlined"
            size="small"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by invoice no. or GRN no."
            autoComplete="off"
            sx={{
              mb: 2,
              width: 700,
              "& input": { fontSize: "15px" },
            }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              setInvoiceSearch("");
              setOpenInvoicePicker(true);
            }}
          >
            Add Damage Record
          </Button>
        </div>

        <div className="overflow-x-auto">
          <div className="overflow-x-auto rounded-sm shadow-md border border-gray-200">
            <TableContainer
              component={Paper}
              sx={{ borderRadius: 1, overflow: "hidden" }}
            >
              <Table size="small">
                <TableHead sx={{ backgroundColor: "#e2e8f0" }}>
                  <TableRow>
                    <TableCell>GRN Date</TableCell>
                    <TableCell>GRN Number</TableCell>
                    <TableCell>Invoice Number</TableCell>
                    <TableCell>Vendor</TableCell>
                    <TableCell align="right">Damaged Qty</TableCell>
                    <TableCell align="right">Damaged Amount</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {grnLoading ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        <div className=" flex justify-center items-center gap-1">
                          <CircularProgress size={18} /> Please wait...
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : grnError ? (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        align="center"
                        className=" text-red-600"
                      >
                        {grnError}
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
                          <IconButton
                            color="primary"
                            onClick={() => handleViewGRN(grn)}
                          >
                            <FiSearch size={18} />
                          </IconButton>

                          <IconButton
                            color="success"
                            onClick={() => handleInvoiceSelect(grn, "edit")}
                          >
                            <MdModeEditOutline size={18} />
                          </IconButton>

                          <IconButton
                            color="error"
                            onClick={() => handleDeleteGRN(grn)}
                          >
                            <RiDeleteBinLine size={18} />
                          </IconButton>
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
          </div>
        </div>
      </>

      {openModal && selectedInvoice && isView && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-[100]">
          <div className="bg-white w-4xl max-h-[90vh] p-5 rounded-lg shadow-lg animate-scaleIn overflow-y-scroll">
            <div className="flex justify-between text-2xl font-semibold mb-3 border-b pb-2">
              <h2>GRN - View</h2>
              <button className=" cursor-pointer p-1 rounded-full text-red-500 hover:bg-red-100">
                <RiCloseLine
                  size={24}
                  onClick={() => {
                    setSelectedInvoice(null);
                    setOpenModal(false);
                    setItems([]);
                    setTotals({
                      totalInvoiceValue: 0,
                      totalDamageQty: 0,
                      totalDamageAmount: 0,
                      totalAcceptedAmount: 0,
                    });
                    setMode(null);
                  }}
                />
              </button>
            </div>

            <div className=" grid md:grid-cols-2 grid-cols-1 gap-4 mb-3 border-b pb-2">
              <div>
                <span className="font-medium">Invoice Number:</span>{" "}
                <span>{selectedInvoice?.invoiceNumber}</span>
              </div>

              <div>
                <span className="font-medium">GRN Number:</span>{" "}
                <span>{selectedInvoice?.grnNumber || "—"}</span>
              </div>

              <div>
                <span className="font-medium">Total Items:</span>{" "}
                <span>
                  {items?.length ||
                    selectedInvoice?.totals?.totalDamageQty ||
                    "—"}
                </span>
              </div>

              <div>
                <span className="font-medium">Invoice Value:</span>{" "}
                <span>
                  {totals.totalInvoiceValue ||
                    selectedInvoice?.totalPayableAmount ||
                    "—"}
                </span>
              </div>
            </div>

            <div>
              {items.length === 0 && (
                <span className="text-gray-500">
                  No items found for this invoice
                </span>
              )}

              {items.map((item) => (
                <div key={item._id || item.item_id} className="border-b py-3">
                  <p className="font-semibold">{item.itemName || "—"}</p>
                  <div className="grid grid-cols-4 gap-4 text-sm mt-2">
                    <div>Quantity: {item.orderQty ?? "—"}</div>
                    <div>Unit Price: {item.unitPrice ?? "—"}</div>
                    <div>Damaged Qty: {item.damageQty ?? 0}</div>
                    <div>Damage Amount: {item.damageAmount ?? 0}</div>
                  </div>
                  <div className="mt-2">Reason: {item.damageReason || "—"}</div>
                </div>
              ))}

              <div className=" grid md:grid-cols-4 grid-cols-2 gap-4 mt-4">
                <p>
                  <span className="font-semibold">Invoice Value:</span>{" "}
                  {totals.totalInvoiceValue}
                </p>
                <p>
                  <span className="font-semibold">Damage Quantity:</span>{" "}
                  {totals.totalDamageQty}
                </p>
                <p>
                  <span className="font-semibold">Damaged Amount:</span>{" "}
                  {Number(totals.totalDamageAmount).toFixed(2)}
                </p>
                <p>
                  <span className="font-semibold">Accepted Amount:</span>{" "}
                  {Number(totals.totalAcceptedAmount || 0).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {openModal && selectedInvoice && (isEdit || isAdd) && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-[100]">
          <div className="bg-white w-4xl max-h-[90vh] p-5 rounded-lg shadow-lg animate-scaleIn overflow-y-scroll">
            <div className="flex justify-between text-2xl font-semibold mb-3 border-b pb-2">
              <h2>{isEdit ? "GRN - Edit" : "GRN - Add"}</h2>
              <button className=" cursor-pointer p-1 rounded-full text-red-500 hover:bg-red-100">
                <RiCloseLine
                  size={24}
                  onClick={() => {
                    setSelectedInvoice(null);
                    setOpenModal(false);
                    setItems([]);
                    setTotals({
                      totalInvoiceValue: 0,
                      totalDamageQty: 0,
                      totalDamageAmount: 0,
                      totalAcceptedAmount: 0,
                    });
                    setMode(null);
                  }}
                />
              </button>
            </div>

            <div className=" grid md:grid-cols-2 grid-cols-1 gap-4 mb-3 border-b pb-2">
              <div>
                <span className="font-medium">Invoice Number:</span>{" "}
                <span>{selectedInvoice?.invoiceNumber}</span>
              </div>

              <div>
                <span className="font-medium">GRN Number:</span>{" "}
                <span>{selectedInvoice?.grnNumber || "—"}</span>
              </div>

              <div>
                <span className="font-medium">Total Items:</span>{" "}
                <span>{items?.length || "—"}</span>
              </div>

              <div>
                <span className="font-medium">Invoice Value:</span>{" "}
                <span>
                  {totals.totalInvoiceValue ||
                    selectedInvoice?.totalPayableAmount ||
                    "—"}
                </span>
              </div>
            </div>

            <div>
              {items.length === 0 && (
                <span className="text-gray-500">
                  No items found for this invoice
                </span>
              )}

              {items.map((item, index) => (
                <div
                  key={item._id || item.item_id || index}
                  className="border-b py-3 flex flex-col md:flex-row justify-between gap-4"
                >
                  <div className="grid grid-cols-2 gap-y-1 text-sm w-full md:w-1/2">
                    <p className="col-span-2 text-base font-semibold text-gray-800">
                      {item.itemName || "—"}
                    </p>
                    <p>
                      <span className="font-medium">Quantity:</span>{" "}
                      {item.orderQty ?? "—"}
                    </p>
                    <p>
                      <span className="font-medium">Unit Price:</span>{" "}
                      {item.unitPrice ?? "—"}
                    </p>
                  </div>

                  <div className="flex flex-col w-full md:w-1/2 gap-3">
                    <div className="flex flex-wrap items-center justify-between gap-6">
                      <div className="flex items-center gap-2">
                        <label className="text-sm font-medium">
                          Damaged Qty:
                        </label>
                        <input
                          type="number"
                          max={item.orderQty}
                          className="border rounded px-2 py-0 w-20"
                          value={item.damageQty ?? ""}
                          onChange={(e) => {
                            const value = Number(e.target.value);
                            const updated = [...items];

                            console.log("Item :: ", item)

                            updated[index].damageQty = value;

                            const netAmount = value * (updated[index].unitPrice || 0);

                            const discountAmount = netAmount * updated[index].discountRate / 100;

                            const taxableAmount = netAmount - discountAmount;

                            const taxAmount = taxableAmount * updated[index].taxRate / 100;

                            const damagedAmount = taxableAmount + taxAmount;

                            
                            console.log({netAmount, discountAmount, taxableAmount, taxAmount, damagedAmount})
                            
                            updated[index].damageAmount = damagedAmount;
                            updated[index].acceptedQty =
                              (updated[index].orderQty || 0) - value;
                            updated[index].acceptedAmount =
                              ((updated[index].orderQty || 0) - value) *
                              (updated[index].unitPrice || 0);

                            setItems(updated);

                            // recalc totals
                            let totalDamageQty = 0;
                            let totalDamageAmount = 0;
                            updated.forEach((it) => {
                              totalDamageQty += it.damageQty || 0;
                              totalDamageAmount += it.damageAmount || 0;
                            });
                            const baseInvoiceValue =
                              totals.totalInvoiceValue ||
                              selectedInvoice?.totalPayableAmount ||
                              selectedInvoice?.totals?.totalInvoiceValue ||
                              0;
                            const totalAcceptedAmount =
                              baseInvoiceValue - totalDamageAmount;
                            setTotals((prev) => ({
                              ...prev,
                              totalInvoiceValue: baseInvoiceValue,
                              totalDamageQty,
                              totalDamageAmount,
                              totalAcceptedAmount,
                            }));
                          }}
                        />
                      </div>

                      <p className="text-sm">
                        <span className="font-medium">Damage Amount:</span>{" "}
                        {Number(item?.damageAmount)?.toFixed(2) ?? 0}
                      </p>
                    </div>

                    <textarea
                      placeholder="Enter damage reason..."
                      className="border rounded px-2 py-1 w-full text-sm"
                      rows={2}
                      value={item.damageReason ?? ""}
                      onChange={(e) => {
                        const updated = [...items];
                        updated[index].damageReason = e.target.value;
                        setItems(updated);
                      }}
                    />
                  </div>
                </div>
              ))}

              <div className=" grid md:grid-cols-4 grid-cols-2 gap-4 mt-4">
                <p>
                  <span className="font-semibold">Invoice Value:</span>{" "}
                  {totals.totalInvoiceValue}
                </p>
                <p>
                  <span className="font-semibold">Damage Quantity:</span>{" "}
                  {totals.totalDamageQty}
                </p>
                <p>
                  <span className="font-semibold">Damaged Amount:</span>{" "}
                  {Number(totals.totalDamageAmount || 0).toFixed(2)}
                </p>
                <p>
                  <span className="font-semibold">Accepted Amount:</span>{" "}
                  {Number(totals.totalAcceptedAmount || 0).toFixed(2)}
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-5">
              <button
                className="px-4 py-1 rounded bg-green-600 text-white hover:bg-green-700 cursor-pointer"
                onClick={handleSaveGRN}
                disabled={saving}
              >
                {saving ? <CircularProgress size={20} /> : "Save GRN"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Invoice picker modal (choose invoice to Add GRN) */}
      {openInvoicePicker && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-[100]">
          <div className="bg-white w-3xl max-h-[80vh] p-5 rounded-lg shadow-lg overflow-y-auto">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold">
                Select Invoice to Create GRN
              </h3>
              <button
                className="cursor-pointer p-1 rounded-full text-red-500 hover:bg-red-100"
                onClick={() => setOpenInvoicePicker(false)}
              >
                <RiCloseLine size={20} />
              </button>
            </div>

            <div className="mb-3">
              <input
                type="text"
                placeholder="Search invoice number or GRN number"
                className="border px-2 py-1 rounded w-full"
                value={invoiceSearch}
                onChange={(e) => setInvoiceSearch(e.target.value)}
                autoFocus
              />
            </div>

            <div>
              {invoiceSearch.trim() === "" ? (
                <div className="text-sm text-gray-500">
                  Start typing to search invoices
                </div>
              ) : (
                <ul>
                  {purchaseInvoices
                    .filter((inv) => !grnInvoiceNumbers.has(inv.invoiceNumber))
                    .filter((inv) => {
                      const q = invoiceSearch.trim().toLowerCase();
                      return (
                        (inv.invoiceNumber || "").toLowerCase().includes(q) ||
                        (inv.grnNumber || "").toLowerCase().includes(q)
                      );
                    })
                    .map((inv) => (
                      <li
                        key={inv._id}
                        className="border-b p-2 cursor-pointer hover:bg-gray-100"
                        onClick={() => {
                          setOpenInvoicePicker(false);
                          handleInvoiceSelect(inv, "add");
                        }}
                      >
                        <div className="flex justify-between">
                          <div>
                            <div className="font-medium">
                              {inv.invoiceNumber}
                            </div>
                            <div className="text-sm text-gray-500">
                              {inv.receiverDetails?.name ||
                                inv.vendorName ||
                                "—"}
                            </div>
                          </div>
                          <div className="text-sm text-gray-600">
                            {inv.grnNumber || "—"}
                          </div>
                        </div>
                      </li>
                    ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SingdhaGRNPage;
