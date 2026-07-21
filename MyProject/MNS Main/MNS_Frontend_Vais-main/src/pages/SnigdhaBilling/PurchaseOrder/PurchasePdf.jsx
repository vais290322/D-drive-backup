import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFDownloadLink,
} from "@react-pdf/renderer";
import { DownloadIcon } from "lucide-react";
import { ToWords } from "to-words";

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#fff",
    padding: 16,
    fontSize: 10,
    fontFamily: "Helvetica",
  },
  headerWrapper: {
    borderBottom: "1pt solid #222",
    paddingBottom: 8,
    marginBottom: 8,
  },
  headerTitle: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
    borderBottom: "1pt solid #222",
    marginBottom: 4,
    paddingBottom: 4,
  },
  headerText: { textAlign: "center", fontSize: 10, fontWeight: "bold" },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 2,
  },
  table: { border: "1pt solid #222", marginTop: 8 },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#eee",
    borderBottom: "1pt solid #222",
  },
  tableCellHeader: {
    flex: 1,
    padding: 4,
    fontWeight: "bold",
    borderRight: "1pt solid #222",
    textAlign: "center",
    minHeight: 25,
    justifyContent: "center",
    alignItems: "center",
    fontSize: 9,
    wordWrap: "break-word",
  },
  tableRow: { flexDirection: "row" },
  tableCell: {
    flex: 1,
    padding: 4,
    borderRight: "1pt solid #222",
    textAlign: "center",
    minHeight: 30,
    justifyContent: "center",
    alignItems: "center",
    fontSize: 9,
    wordWrap: "break-word",
    overflow: "hidden",
  },
  tableCellLast: { 
    flex: 1, 
    padding: 4, 
    textAlign: "center",
    minHeight: 30,
    justifyContent: "center",
    alignItems: "center",
    fontSize: 9,
    wordWrap: "break-word",
    overflow: "hidden",
  },
  small: { fontSize: 10 },
  center: { textAlign: "center" },
  bold: { fontWeight: "bold" },
});

const towords = new ToWords({
  localeCode: "en-IN",
  converterOptions: {
    currency: true,
    ignoreDecimal: false,
    ignoreZeroCurrency: false,
  },
});

// 🔹 Header Component (reused per page)
const InvoiceHeader = () => (
  <>
    <View style={styles.headerWrapper} fixed >
      <Text style={styles.headerTitle}>SNIGDHA ENTERPRISE</Text>
      <Text style={styles.headerText}>
        AB-79, SALT LAKE CITY, SECTOR-I, KOLKATA - 700064
      </Text>
      <Text style={{ textAlign: "center", fontSize: 10 }}>
        <Text style={{ fontWeight: "bold" }}>
          An ISO 9001-2015 Certified Company
        </Text>
      </Text>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 6,
        }}
      >
        <Text style={{ fontWeight: "bold", fontSize: 9 }}>
          GSTIN: GSTIN-19BTFPR0457K2ZT
        </Text>
        <Text style={{ fontWeight: "bold", fontSize: 9 }}>
          Email: snigdhaenterprise2015@gmail.com
        </Text>
      </View>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text style={{ fontWeight: "bold", fontSize: 9 }}>
          STATE: West Bengal (19)
        </Text>
        <Text style={{ fontWeight: "bold", fontSize: 9 }}>
          Phone: 9073656557
        </Text>
      </View>
    </View>
    <View
      style={{
        backgroundColor: "#eee",
        padding: 4,
        marginBottom: 8,
      }}
    >
      <Text
        style={{
          textAlign: "center",
          fontWeight: "bold",
          fontSize: 12,
        }}
      >
        PURCHASE INVOICE
      </Text>
    </View>
  </>
);

// 🔹 Items per page
const ITEMS_PER_PAGE = 25;

const InvoiceDocument = ({ invoiceData }) => {
  // Keep 25 items per page for all pages
  const ITEMS_PER_PAGE = 25;
  
  // Split items into page chunks
  const chunks = [];
  if (invoiceData?.items?.length) {
    for (let i = 0; i < invoiceData.items.length; i += ITEMS_PER_PAGE) {
      chunks.push(invoiceData.items.slice(i, i + ITEMS_PER_PAGE));
    }
  } else {
    // If no items, still create at least one page
    chunks.push([]);
  }

  // Calculate if we need an extra page for totals and footer
  const lastChunk = chunks[chunks.length - 1];
  const needsExtraPage = lastChunk && lastChunk.length === ITEMS_PER_PAGE;
  
  // If the last page is full, add an empty chunk for totals page
  if (needsExtraPage) {
    chunks.push([]);
  }

  return (
    <Document>
      {chunks.map((chunk, pageIndex) => (
        <Page key={pageIndex} size="A4" style={styles.page}>
          {/* Header on every page - ALWAYS render this first */}
          <InvoiceHeader />

          {/* Vendor details only on first page */}
          {pageIndex === 0 && (
            <>
              <View style={styles.row}>
                {/* Bill To */}
                <View style={{ width: "48%" }}>
                  <Text
                    style={{
                      fontWeight: "bold",
                      fontSize: 11,
                      marginBottom: 4,
                      marginTop: 8,
                      borderBottom: "1pt solid #222",
                      paddingBottom: 2,
                    }}
                  >
                    Vendor Details
                  </Text>
                  <View style={{ flexDirection: "row", marginBottom: 2 }}>
                    <Text style={{ fontWeight: "bold", fontSize: 9 }}>Name: </Text>
                    <Text style={{ fontSize: 9 }}>{invoiceData?.receiverDetails?.name || ""}</Text>
                  </View>
                  <View style={{ flexDirection: "row" }}>
                    <Text style={{ fontWeight: "bold", marginBottom: 2, fontSize: 9 }}>
                      Address:{" "}
                    </Text>
                    <Text style={{ width: "170px", marginBottom: 2, fontSize: 9 }}>
                      {invoiceData?.receiverDetails?.address || ""}
                    </Text>
                  </View>
                  <View style={{ flexDirection: "row", marginBottom: 2 }}>
                    <Text style={{ fontWeight: "bold", fontSize: 9 }}>State: </Text>
                    <Text style={{ fontSize: 9 }}>{invoiceData?.receiverDetails?.state || ""}</Text>
                  </View>
                  <View style={{ flexDirection: "row", marginBottom: 2 }}>
                    <Text style={{ fontWeight: "bold", fontSize: 9 }}>GSTIN: </Text>
                    <Text style={{ fontSize: 9 }}>{invoiceData?.receiverDetails?.gstin || ""}</Text>
                  </View>
                  <View style={{ flexDirection: "row", marginBottom: 2 }}>
                    <Text style={{ fontWeight: "bold", fontSize: 9 }}>Code: </Text>
                    <Text style={{ fontSize: 9 }}>{invoiceData?.vendorCode || ""}</Text>
                  </View>
                </View>
              </View>

              {/* Invoice details */}
              <View style={{ marginTop: 8 }}>
                <View style={{ flexDirection: "row", marginBottom: 2 }}>
                  <View style={{ width: "50%" }}>
                    <Text style={{ fontWeight: "bold", fontSize: 9 }}>
                      Invoice No: {invoiceData?.invoiceNumber || ""}
                    </Text>
                    <Text style={{ fontWeight: "bold", fontSize: 9 }}>
                      Payment Type: {invoiceData?.paymentType || ""}
                    </Text>
                  </View>
                  <View style={{ width: "50%" }}>
                    <Text style={{ fontWeight: "bold", fontSize: 9 }}>
                      Invoice Date:{" "}
                      {invoiceData?.date
                        ? new Date(invoiceData.date).toLocaleDateString("en-GB")
                        : ""}
                    </Text>
                    <Text style={{ fontWeight: "bold", fontSize: 9 }}>
                      GSTIN: {invoiceData?.receiverDetails?.gstin || ""}
                    </Text>
                  </View>
                </View>
              </View>
            </>
          )}

          {/* Page continuation note for subsequent pages */}
          {pageIndex > 0 && (
            <View style={{ marginBottom: 8, marginTop: 8 }}>
              <Text style={{ textAlign: "center", fontWeight: "bold", fontSize: 10 }}>
                Purchase Invoice - Continued (Page {pageIndex + 1})
              </Text>
              <Text style={{ textAlign: "center", fontSize: 9 }}>
                Invoice No: {invoiceData?.invoiceNumber || ""} | Date: {invoiceData?.date
                  ? new Date(invoiceData.date).toLocaleDateString("en-GB")
                  : ""}
              </Text>
            </View>
          )}

          {/* Table - Show only if there are items on this page */}
          {chunk.length > 0 && (
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={styles.tableCellHeader}>S.N</Text>
                <Text style={[styles.tableCellHeader, { flex: 2 }]}>Name</Text>
                <Text style={styles.tableCellHeader}>HSN</Text>
                <Text style={styles.tableCellHeader}>Qty</Text>
                <Text style={styles.tableCellHeader}>Unit</Text>
                <Text style={styles.tableCellHeader}>Rate</Text>
                <Text style={styles.tableCellHeader}>Amount</Text>
                <Text style={styles.tableCellHeader}>Discount</Text>
                <Text style={styles.tableCellHeader}>Gross</Text>
                <Text style={styles.tableCellHeader}>Tax %</Text>
                <Text style={styles.tableCellHeader}>Tax Amt</Text>
                <Text style={styles.tableCellHeader}>Net Amount</Text>
              </View>

              {chunk.map((item, index) => {
                // Calculate the correct serial number across pages
                const serialNumber = pageIndex * ITEMS_PER_PAGE + index + 1;
                
                return (
                  <View style={styles.tableRow} key={item.item_id || index}>
                    <View style={styles.tableCell}>
                      <Text style={{ fontSize: 9 }}>{serialNumber}</Text>
                    </View>
                    <View style={[styles.tableCell, { flex: 2 }]}>
                      <Text style={{ fontSize: 8, textAlign: "left", padding: 2 }}>
                        {item.itemName || ""}
                      </Text>
                    </View>
                    <View style={styles.tableCell}>
                      <Text style={{ fontSize: 8 }}>{item.hsnCode || ""}</Text>
                    </View>
                    <View style={styles.tableCell}>
                      <Text style={{ fontSize: 9 }}>{item.quantity || ""}</Text>
                    </View>
                    <View style={styles.tableCell}>
                      <Text style={{ fontSize: 9 }}>{item.uom || ""}</Text>
                    </View>
                    <View style={styles.tableCell}>
                      <Text style={{ fontSize: 9 }}>{item.unitPrice || ""}</Text>
                    </View>
                    <View style={styles.tableCell}>
                      <Text style={{ fontSize: 9, textAlign:"left" }}>{(item.quantity * item.unitPrice).toFixed(2) || ""}</Text>
                    </View>
                    <View style={styles.tableCell}>
                      <Text style={{ fontSize: 9 }}>
                        {(item.discountAmount || 0).toFixed(2)} - {item.discountRate || "0"}%
                      </Text>
                    </View>
                    <View style={styles.tableCell}>
                      <Text style={{ fontSize: 9 }}>
                        {(item.netAmount || 0).toFixed(2)}
                      </Text>
                    </View>
                    <View style={styles.tableCell}>
                      <Text style={{ fontSize: 9 }}>{item.taxRate || ""}</Text>
                    </View>
                    <View style={styles.tableCell}>
                      <Text style={{ fontSize: 9 }}>
                        {(item.taxAmount || 0).toFixed(2)}
                      </Text>
                    </View>
                    <View style={styles.tableCellLast}>
                      <Text style={{ fontSize: 9 }}>
                        {(item.grossAmount || 0).toFixed(2)}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          )}

          {/* Totals only on last page */}
          {pageIndex === chunks.length - 1 && (
            <>
              <View style={{ flexDirection: "row", marginTop: chunk.length > 0 ? 8 : 20 }}>
                <View style={{ width: "55%" }}>
                  <Text style={{ fontWeight: "bold" }}>
                    Amount in Words:{" "}
                    {towords
                      .convert(Number((invoiceData?.grandTotal || 0).toFixed(2)))
                      .toUpperCase()}
                  </Text>
                </View>
                <View style={{ width: "45%", alignItems: "flex-end" }}>
                  <Text style={{ fontWeight: "bold" }}>
                    Taxable Amount: {(invoiceData?.taxableAmount || 0).toFixed(2)}
                  </Text>
                  <Text style={{ fontWeight: "bold" }}>
                    Tax Amount: {(invoiceData?.taxAmount || 0).toFixed(2)}
                  </Text>
                  <Text style={{ fontWeight: "bold", fontSize: 12 }}>
                    Grand Total: {(invoiceData?.grandTotal || 0).toFixed(2)}
                  </Text>
                </View>
              </View>

              {/* Footer note - Always on last page */}
              <Text style={[styles.center, styles.small, { marginTop: 16 }]}>
                This is Computer Generated – No Signature Required {"\n"}Thank
                You!
              </Text>
            </>
          )}
        </Page>
      ))}
    </Document>
  );
};

// 🔹 Download Button
export const PDFDownloadButton = ({ invoice }) => (
  
  <PDFDownloadLink
    document={<InvoiceDocument invoiceData={invoice} />}
    fileName={`invoice-${invoice?.invoiceNumber || "po"}.pdf`}
  >
    {({ loading }) =>
      loading ? "Generating PDF..." : <DownloadIcon fontSize="small" />
    }
  </PDFDownloadLink>
);