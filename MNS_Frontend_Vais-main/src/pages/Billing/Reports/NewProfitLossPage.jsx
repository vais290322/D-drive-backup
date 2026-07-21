import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, DatePicker, Select, Input, Row, Col, Button, Typography, Card } from "antd";
import { DownloadOutlined, FilePdfOutlined, FileExcelOutlined, ReloadOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { Pagination } from "antd";
import { backendDomainA } from "../../../common/index";
const { RangePicker } = DatePicker;
const { Option } = Select;
const { Title } = Typography;

const getDefaultRange = () => {
  // Default: March 1st of current year to Feb 28/29 of next year
  const now = dayjs();
  const start = dayjs(`${now.year()}-03-01`);
  const end = start.add(1, "year").subtract(1, "day");
  return [start, end];
};

const paymentTypeToCreditDebit = (type) => {
  // deposit and transferCredit are Credit, others are Debit
  if (type === "deposit" || type === "transferCredit") return "Credit";
  return "Debit";
};

const pageSizeOptions = ["10", "20", "50", "100"];

const NewProfitLossPage = () => {
  const [dateRange, setDateRange] = useState(getDefaultRange());
  const [transactions, setTransactions] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [bankOptions, setBankOptions] = useState([]);
  const [bank, setBank] = useState("all");
  const [type, setType] = useState("all");
  const [paymentMethod, setPaymentMethod] = useState("all");
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const startDate = dateRange[0].format("YYYY-MM-DD");
      const endDate = dateRange[1].format("YYYY-MM-DD");
      const url = `${backendDomainA}/api/v1/reports/all-bank-transactions?startDate="${startDate}"&endDate="${endDate}"`;
      const { data } = await axios.get(url);
      setTransactions(data.data.transactions);
      setBankOptions(data.data.banks || []);
      setLoading(false);
    };
    fetchData();
  }, [dateRange]);

  // Filtering
  useEffect(() => {
    let data = [...transactions];
    if (bank !== "all") {
      data = data.filter(
        (t) =>
          (t.bankId && (t.bankId._id === bank || t.bankId.bankId === bank)) ||
          (t.transferFromBankId && t.transferFromBankId._id === bank) ||
          (t.transferToBankId && t.transferToBankId._id === bank)
      );
    }
    if (type !== "all") {
      data = data.filter((t) => t.transactionType === type);
    }
    if (paymentMethod !== "all") {
      data = data.filter((t) => (t.paymentMethod || "").toLowerCase() === paymentMethod.toLowerCase());
    }
    if (search) {
      data = data.filter(
        (t) =>
          (t.invoiceNumber && t.invoiceNumber.toLowerCase().includes(search.toLowerCase())) ||
          (t.description && t.description.toLowerCase().includes(search.toLowerCase())) ||
          (t.personName && t.personName.toLowerCase().includes(search.toLowerCase()))
      );
    }
    setFiltered(data);
    setCurrentPage(1); // Reset to first page on filter change
  }, [transactions, bank, type, paymentMethod, search]);

  // Table columns
  const columns = [
    {
      title: "Sl. No.",
      key: "slno",
      render: (_, __, idx) => (currentPage - 1) * pageSize + idx + 1,
      width: 70,
      align: "center",
      fixed: "left",
    },
    { title: "Date", dataIndex: "date", key: "date", render: (d) => dayjs(d).format("DD-MM-YYYY"), width: 110 },
    // { title: "Bank", dataIndex: "bankId", key: "bank", render: (b, r) => b?.bankName || r.transferFromBankId?.bankName || r.transferToBankId?.bankName || "-", width: 120 },
    // { title: "Account No.", dataIndex: "bankId", key: "account", render: (b, r) => b?.accountNumber || r.transferFromBankId?.accountNumber || r.transferToBankId?.accountNumber || "-", width: 140 },
    { title: "Invoice No.", dataIndex: "invoiceNumber", key: "invoiceNumber", width: 140 },
    { title: "Voucher No.", dataIndex: "voucherNumber", key: "voucherNumber", width: 120 },
    { title: "Type", dataIndex: "transactionType", key: "type", width: 120 },
    { title: "Payment Method", dataIndex: "paymentMethod", key: "paymentMethod", render: (v) => v || "-", width: 120 },
    { title: "Particulars", dataIndex: "description", key: "description", width: 200 },
    { title: "Income", key: "credit", render: (_, r) => paymentTypeToCreditDebit(r.transactionType) === "Credit" ? r.amount : "", align: "right", width: 100 },
    { title: "Expense", key: "debit", render: (_, r) => paymentTypeToCreditDebit(r.transactionType) === "Debit" ? r.amount : "", align: "right", width: 100 },
    { title: "Person", dataIndex: "personName", key: "person", width: 150 },
    
  ];

  // Pagination
  const paginatedData = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Summary
  const totalCredit = filtered.filter((t) => paymentTypeToCreditDebit(t.transactionType) === "Credit").reduce((a, b) => a + (b.amount || 0), 0);
  const totalDebit = filtered.filter((t) => paymentTypeToCreditDebit(t.transactionType) === "Debit").reduce((a, b) => a + (b.amount || 0), 0);

  // Export to Excel
  const handleExcelExport = () => {
    const wsData = [
      [
        "Sl. No.",
        "Date",
        "Invoice No.",
        "Voucher No.",
        "Type",
        "Payment Method",
        "Particulars",
        "Income",
        "Expense",
        "Person"
      ],
      ...filtered.map((t, idx) => [
        idx + 1,
        dayjs(t.date).format("DD-MM-YYYY"),
        t.invoiceNumber || "",
        t.voucherNumber || "",
        t.transactionType,
        t.paymentMethod || "-",
        t.description,
        paymentTypeToCreditDebit(t.transactionType) === "Credit" ? t.amount : "",
        paymentTypeToCreditDebit(t.transactionType) === "Debit" ? t.amount : "",
        t.personName || "",
      ]),
      // Add summary row
      [
        "", "", "", "", "", "", "Total",
        filtered
          .filter((t) => paymentTypeToCreditDebit(t.transactionType) === "Credit")
          .reduce((a, b) => a + (b.amount || 0), 0),
        filtered
          .filter((t) => paymentTypeToCreditDebit(t.transactionType) === "Debit")
          .reduce((a, b) => a + (b.amount || 0), 0),
        ""
      ]
    ];
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    ws["!rows"] = [{ hpt: 24 }];
    ws["!cols"] = [8, 12, 18, 18, 12, 16, 30, 12, 12, 18].map(wch => ({ wch }));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "ProfitLoss");
    XLSX.writeFile(wb, "ProfitLossReport.xlsx");
  };

  // Export to PDF
  const handlePdfExport = () => {
    const doc = new jsPDF({ orientation: "landscape" });
    doc.text("Profit & Loss Report", 14, 14);

    const body = filtered.map((t, idx) => [
      idx + 1,
      dayjs(t.date).format("DD-MM-YYYY"),
      t.invoiceNumber || "",
      t.voucherNumber || "",
      t.transactionType,
      t.paymentMethod || "-",
      t.description,
      paymentTypeToCreditDebit(t.transactionType) === "Credit" ? t.amount : "",
      paymentTypeToCreditDebit(t.transactionType) === "Debit" ? t.amount : "",
      t.personName || "",
    ]);

    // Add summary row
    body.push([
      "", "", "", "", "", "", "Total",
      filtered
        .filter((t) => paymentTypeToCreditDebit(t.transactionType) === "Credit")
        .reduce((a, b) => a + (b.amount || 0), 0),
      filtered
        .filter((t) => paymentTypeToCreditDebit(t.transactionType) === "Debit")
        .reduce((a, b) => a + (b.amount || 0), 0),
      ""
    ]);

    doc.autoTable({
      head: [[
        "Sl. No.",
        "Date",
        "Invoice No.",
        "Voucher No.",
        "Type",
        "Payment Method",
        "Particulars",
        "Income",
        "Expense",
        "Person"
      ]],
      body,
      startY: 22,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [41, 128, 185] },
      margin: { left: 10, right: 10 },
    });
    doc.save("ProfitLossReport.pdf");
  };

  return (
    <div style={{ padding: 24, maxWidth: 1400, margin: "auto" }}>
      <Card style={{ marginBottom: 16, boxShadow: "0 2px 8px #f0f1f2" }}>
        <Row gutter={[16, 8]} align="middle" wrap>
          <Col>
            <Title level={4} style={{ margin: 0 }}>Profit & Loss Report</Title>
          </Col>
          <Col>
            <RangePicker
              value={dateRange}
              onChange={(v) => setDateRange(v)}
              allowClear={false}
              format="DD-MM-YYYY"
              style={{ minWidth: 220 }}
            />
          </Col>
          {/* Bank filter removed */}
          <Col>
            <Select value={type} onChange={setType} style={{ minWidth: 140 }}>
              <Option value="all">All Types</Option>
              <Option value="deposit">Deposit</Option>
              <Option value="withdrawal">Withdrawal</Option>
              <Option value="expense">Expense</Option>
              <Option value="purchase">Purchase</Option>
              <Option value="transferDebit">Transfer Debit</Option>
              <Option value="transferCredit">Transfer Credit</Option>
            </Select>
          </Col>
          <Col>
            <Select value={paymentMethod} onChange={setPaymentMethod} style={{ minWidth: 140 }}>
              <Option value="all">All Payment Methods</Option>
              <Option value="Cash">Cash</Option>
              <Option value="Card">Card</Option>
              <Option value="UPI">UPI</Option>
              <Option value="NetBanking">NetBanking</Option>
              <Option value="Cheque">Cheque</Option>
              <Option value="BankTransfer">BankTransfer</Option>
              <Option value="Bank">Bank</Option>
            </Select>
          </Col>
          <Col flex="auto">
            <Input.Search
              placeholder="Search by description, invoice, person"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ minWidth: 220 }}
              allowClear
            />
          </Col>
          <Col>
            <Button icon={<ReloadOutlined />} onClick={() => {
              setBank("all");
              setType("all");
              setPaymentMethod("all");
              setSearch("");
              setDateRange(getDefaultRange());
            }}>
              Reset
            </Button>
          </Col>
          <Col>
            <Button icon={<FileExcelOutlined />} onClick={handleExcelExport} style={{ background: "#27ae60", color: "#fff", border: "none" }}>
              Excel
            </Button>
          </Col>
          <Col>
            <Button icon={<FilePdfOutlined />} onClick={handlePdfExport} style={{ background: "#e74c3c", color: "#fff", border: "none" }}>
              PDF
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Pagination and Show Entries */}
      <Row justify="space-between" align="middle" style={{ marginBottom: 8 }}>
        <Col>
          Show{" "}
          <Select
            value={String(pageSize)}
            onChange={v => { setPageSize(Number(v)); setCurrentPage(1); }}
            style={{ width: 70 }}
          >
            {pageSizeOptions.map(opt => <Option key={opt} value={opt}>{opt}</Option>)}
          </Select>
          {" "}entries
        </Col>
        <Col>
          <span>
            Showing {filtered.length === 0 ? 0 : (pageSize * (currentPage - 1) + 1)} to {Math.min(filtered.length, pageSize * currentPage)} of {filtered.length} entries
          </span>
        </Col>
      </Row>

      <div style={{ overflowX: "auto", background: "#fff", borderRadius: 8, boxShadow: "0 1px 4px #f0f1f2" }}>
        <Table
          columns={columns}
          dataSource={paginatedData.map((t, i) => ({ ...t, key: t._id || i }))}
          loading={loading}
          pagination={false}
          bordered
          summary={() => (
            <Table.Summary.Row>
              <Table.Summary.Cell colSpan={7}><b>Total</b></Table.Summary.Cell>
              <Table.Summary.Cell><b>{totalCredit.toFixed(2)}</b></Table.Summary.Cell>
              <Table.Summary.Cell><b>{totalDebit.toFixed(2)}</b></Table.Summary.Cell>
              <Table.Summary.Cell colSpan={3}></Table.Summary.Cell>
            </Table.Summary.Row>
          )}
          scroll={{ x: 1200 }}
          rowClassName={(_, index) => (index % 2 === 0 ? "even-row" : "odd-row")}
        />
      </div>

      {/* Custom Pagination */}
      <Row justify="end" style={{ marginTop: 12 }}>
        <Col>
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={filtered.length}
            onChange={setCurrentPage}
            showSizeChanger={false}
            showQuickJumper
            style={{ marginRight: 8 }}
          />
        </Col>
      </Row>
    </div>
  );
};


export default NewProfitLossPage;
