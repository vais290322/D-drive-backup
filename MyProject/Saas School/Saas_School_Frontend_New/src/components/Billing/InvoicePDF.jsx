import React, { useMemo } from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Font,
  Image,
} from "@react-pdf/renderer";
import { ToWords } from "to-words";

// Register fonts
Font.register({
  family: "Roboto",
  fonts: [
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf",
      fontWeight: 300,
    },
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf",
      fontWeight: 400,
    },
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf",
      fontWeight: 500,
    },
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf",
      fontWeight: 700,
    },
  ],
});

const styles = StyleSheet.create({
  watermark: {
  position: "absolute",
  top: "45%",
  left: "20%",
  transform: "rotate(-30deg)",
  fontSize: 72,
  fontWeight: "bold",
color: "rgba(0, 150, 0, 0.18)", // light transparent
  zIndex: -1,
},
  page: {
    paddingTop: 30,
    paddingBottom: 40, // consistent padding
    paddingHorizontal: 30,
    fontFamily: "Roboto",
    fontSize: 9,
    flexDirection: "column",
    position: "relative", // for page border
  },
  // 1. Outer Page Outline - applied to every page manually
  pageBorder: {
    position: "absolute",
    top: 15,
    left: 15,
    right: 15,
    bottom: 15,
    borderWidth: 1,
    borderColor: "#000",
    zIndex: -1,
  },

  // Header Row (Visuals same as before)
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 5,
    paddingBottom: 5,
  },
  headerLeft: { width: "35%", alignItems: "flex-start" },
  headerCenter: {
    width: "30%",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 5,
  },
  headerRight: { width: "35%", alignItems: "flex-end" },

  // Typography
  companyTitle: {
    fontSize: 10,
    fontWeight: "bold",
    marginBottom: 4,
    textTransform: "uppercase",
  },
  addressText: { fontSize: 8, lineHeight: 1.4 },
  logoImage: { width: "100%", height: 60, objectFit: "contain" },

  // Content Blocks
  sectionHeader: {
    backgroundColor: "#f0f0f0",
    textAlign: "center",
    paddingVertical: 4,
    marginBottom: 5,
    marginTop: 5,
    fontWeight: "bold",
    fontSize: 9,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#000",
  },

  detailsContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    paddingBottom: 10,
  },
  leftColumn: { width: "55%", paddingRight: 10 },
  rightColumn: {
    width: "45%",
    paddingLeft: 10,
    borderLeftWidth: 1,
    borderLeftColor: "#000",
  },
  rowItem: { flexDirection: "row", marginBottom: 3 },
  label: { width: 80, fontWeight: "bold" },
  value: { flex: 1 },

  // 3. TABLE STYLES - CONTROLLED PAGINATION
  tableContainer: {
    marginTop: 10,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1, // Outer frame - closes table visually on each page
    borderColor: "#000",
  },

  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#333",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    height: 32, // Slightly taller for better readability
    alignItems: "start",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd", // Lighter separator for cleaner look
    minHeight: 26, // Flexible height to accommodate text wrapping
    alignItems: "stretch",
  },

  rowEven: { backgroundColor: "#ffffff" },
  rowOdd: { backgroundColor: "#f9f9f9" },

  // CELL CONTAINERS - Define widths and vertical borders
  cell1: {
    width: "5%",
    borderRightWidth: 1,
    borderColor: "#ddd",
    justifyContent: "center",
    paddingHorizontal: 2,
  },
  cell2: {
    width: "25%",
    borderRightWidth: 1,
    borderColor: "#ddd",
    justifyContent: "center",
    paddingHorizontal: 4,
  }, // Wider for names
  cell3: {
    width: "12%",
    borderRightWidth: 1,
    borderColor: "#ddd",
    justifyContent: "center",
    paddingHorizontal: 2,
  },

  cell6: {
    width: "12%",
    borderRightWidth: 1,
    borderColor: "#ddd",
    justifyContent: "center",
    paddingHorizontal: 2,
  },
  cell7: {
    width: "8%",
    borderRightWidth: 1,
    borderColor: "#ddd",
    justifyContent: "center",
    paddingHorizontal: 2,
  },
  cell8: {
    width: "20%",
    borderRightWidth: 1,
    borderColor: "#ddd",
    justifyContent: "center",
    paddingHorizontal: 3,
  },
  cell9: { width: "20%", justifyContent: "center", paddingHorizontal: 3 }, // No right border on last column

  // CELL TEXT STYLES - Control typography and spacing
  cellText: { fontSize: 8, paddingVertical: 4, textAlign: "center" },
  cellTextLeft: {
    fontSize: 8,
    paddingVertical: 4,
    textAlign: "left",
    lineHeight: 1.3,
  }, // Allow wrapping
  cellTextRight: { fontSize: 8, paddingVertical: 4, textAlign: "right" },
  headerText: {
    fontSize: 8,
    paddingVertical: 5,
    textAlign: "center",
    color: "#fff",
    fontWeight: "bold",
  },

  // Totals Section - Only appears on last page
  totalsSection: {
    width: "45%",
    paddingLeft: 10,
  },
  amountInWords: {
    padding: 0,
    marginTop: 5,
    fontWeight: "bold",
    textTransform: "uppercase",
    alignSelf: "flex-start",
  },

  bottomContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 8,
  },
  bankDetails: { width: "55%", paddingRight: 10 },
  summaryDetails: { width: "45%", paddingLeft: 10 },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 3,
  },

  signatureLine: {
    marginTop: 40,
    width: 150,
    alignSelf: "flex-end",
    textAlign: "center",
    paddingTop: 2,
    borderTopWidth: 1,
    borderColor: "#000",
  },

  // Footer text absolute
  footerText: {
    position: "absolute",
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: "center",
  },
  bottomText: {
    textAlign: "center",
    marginTop: 5,
    fontSize: 8,
    fontWeight: "bold",
  },
});

// PAGINATION CONSTANTS
const ITEMS_PER_PAGE_FIRST = 15; // Page 1 with header details
const ITEMS_PER_PAGE_REST = 18; // Subsequent pages

// Generate dummy data
const securitySubCategories = [
  "Security Guard",
  "Head Guard",
  "Supervisor",
  "Gunman",
  "Escort Guard",
];
const DUMMY_ITEMS = Array.from({ length: 40 }, (_, i) => {
  // 60 for 3 full pages approx
  const isOdd = i % 2 !== 0;
  const category = isOdd ? "Security Services" : "Facility Management";
  const sub = securitySubCategories[i % 5];
  const qty = (i % 5) + 1;
  const price = 10000 + i * 150;
  return {
    sl: i + 1,
    name: `${sub} - Zone ${String.fromCharCode(65 + (i % 5))} Shift`,
    code: isOdd ? "998525" : "998553",
    category: category,
    subCategory: sub,
    unit: "Nos",
    qty: qty,
    price: price.toFixed(2),
    total: (price * qty).toFixed(2),
  };
});

const InvoicePDF = ({ data, schoolDetails }) => {
  // Map API data
  // console.log("InvoicePDF schoolDetails:", schoolDetails);
  const invoiceData = data || { items: [] };
  const allItems =
    Array.isArray(invoiceData.items) && invoiceData.items.length > 0
      ? invoiceData.items
      : DUMMY_ITEMS;

  // Pagination Logic
  const pages = useMemo(() => {
    const pagesArr = [];
    let currentIndex = 0;
    // Page 1
    const firstPageItems = allItems.slice(0, ITEMS_PER_PAGE_FIRST);
    pagesArr.push(firstPageItems);
    currentIndex += ITEMS_PER_PAGE_FIRST;
    // Subsequent Pages
    while (currentIndex < allItems.length) {
      const chunk = allItems.slice(
        currentIndex,
        currentIndex + ITEMS_PER_PAGE_REST
      );
      pagesArr.push(chunk);
      currentIndex += ITEMS_PER_PAGE_REST;
    }
    return pagesArr;
  }, [allItems]);

  // Helpers
  const txt = (val) => (val !== undefined && val !== null ? String(val) : "");
  const fmt = (num) =>
    num !== undefined && num !== null ? Number(num).toFixed(2) : "0.00";

  // Totals
  const totalAmount =
    invoiceData.totalAmount ||
    allItems.reduce((sum, item) => sum + parseFloat(item.totalPrice || 0), 0);
  let amountInWords = "ZERO RUPEES ONLY";
  try {
    const toWords = new ToWords({
      localeCode: "en-IN",
      converterOptions: { currency: true },
    });
    amountInWords = toWords
      .convert(totalAmount, { currency: true })
      .toUpperCase();
  } catch {
    amountInWords = `RUPEES ${Number(totalAmount).toFixed(2)} ONLY`;
  }

  // Reusable Header Component
  const ValidHeader = () => (
    <View style={styles.headerRow}>
      <View style={styles.headerLeft}>
        <Text style={styles.companyTitle}>
          {txt(schoolDetails?.schoolName)}
        </Text>
        <Text style={styles.addressText}>
          Address: {txt(schoolDetails?.schoolAddress)}
        </Text>
        <Text style={styles.addressText}>
          Code: {txt(schoolDetails?.schoolCode)}
        </Text>
      </View>
      <View style={styles.headerCenter}>
        <Image style={styles.logoImage} src={txt(schoolDetails?.schoolLogo)} />
      </View>
      <View style={styles.headerRight}>
        <Text style={styles.addressText}>
          Email:{txt(schoolDetails?.schoolEmail)}
        </Text>
        <Text style={styles.addressText}>
          Phone: {txt(schoolDetails?.schoolPhone)}
        </Text>
      </View>
    </View>
  );

  return (
    <Document>
      {pages.map((pageItems, pageIndex) => {
        const isFirstPage = pageIndex === 0;
        const isLastPage = pageIndex === pages.length - 1;
        const pageNum = pageIndex + 1;
        const totalPages = pages.length;

        return (
          <Page key={pageIndex} size="A4" style={styles.page}>
            {/* Page Border */}
            <View style={styles.pageBorder} />

            {/* PAID Watermark */}
            <Text style={styles.watermark}>PAID</Text>

            {/* Always Show Header */}
            <ValidHeader />

            {/* Only First Page Elements */}
            {isFirstPage && (
              <>
                <Text style={styles.sectionHeader}>SALE INVOICE</Text>
                <View style={styles.detailsContainer}>
                  <View style={styles.leftColumn}>
                    <View style={styles.rowItem}>
                      <Text style={styles.label}>Student Name:</Text>
                      <Text style={styles.value}>
                        {txt(invoiceData.studentName)}
                      </Text>
                    </View>
                    <View style={styles.rowItem}>
                      <Text style={styles.label}>Roll No:</Text>
                      <Text style={styles.value}>
                        {txt(invoiceData.rollNumber)}
                      </Text>{" "}
                      <Text style={styles.label}>Class:</Text>
                      <Text style={styles.value}>
                        {txt(invoiceData.className)}
                      </Text>
                    </View>
                    <View style={styles.rowItem}>
                      <Text style={styles.label}>Section:</Text>
                      <Text style={styles.value}>
                        {txt(invoiceData.section)}
                      </Text>
                    </View>
                      <View style={styles.rowItem}>
                      <Text style={styles.label}>Phone:</Text>
                      <Text style={styles.value}>
                        {txt(invoiceData.studentPhone)}
                      </Text>
                    </View>
                       <View style={styles.rowItem}>
                      <Text style={styles.label}>Admission No:</Text>
                      <Text style={styles.value}>
                        {txt(invoiceData.admissionNumber)}
                      </Text>
                    </View>
                    <View style={styles.rowItem}>
                      <Text style={styles.label}>Address:</Text>
                      <Text style={styles.value}>
                        {txt(invoiceData.studentAddress)}

                      </Text>
                    </View>
                 
                  </View>
                  <View style={styles.rightColumn}>
                    <Text style={{ fontWeight: "bold", marginBottom: 5 }}>
                      INVOICE INFORMATION
                    </Text>
                    <View style={styles.rowItem}>
                      <Text style={styles.label}>Invoice Number:</Text>
                      <Text style={styles.value}>
                        {txt(invoiceData.invoiceNumber)}
                      </Text>
                    </View>
                    <View style={styles.rowItem}>
                      <Text style={styles.label}>Invoice Date:</Text>
                      <Text style={styles.value}>
                        {invoiceData.date
                          ? new Date(invoiceData.date).toLocaleDateString()
                          : ""}
                      </Text>
                    </View>
                         <View style={styles.rowItem}>
                      <Text style={styles.label}>Payment Mode:</Text>
                      <Text style={styles.value}>
                        {invoiceData.paymentMethod}
                      </Text>
                    </View>
                  </View>
                </View>
              </>
            )}
            {!isFirstPage && (
              <View style={{ height: 10 }} /> /* Spacer for non-first pages */
            )}

            {/* Table Block */}
            <View style={styles.tableContainer}>
              {/* Table Header repeated on every page */}
              <View style={styles.tableHeader}>
                <View style={styles.cell1}>
                  <Text style={styles.headerText}>SL</Text>
                </View>
                <View style={styles.cell2}>
                  <Text style={styles.headerText}>Item Name</Text>
                </View>
                <View style={styles.cell3}>
                  <Text style={styles.headerText}>Code</Text>
                </View>

                <View style={styles.cell6}>
                  <Text style={styles.headerText}>Unit</Text>
                </View>
                <View style={styles.cell7}>
                  <Text style={styles.headerText}>Qty</Text>
                </View>
                <View style={styles.cell8}>
                  <Text style={styles.headerText}>Sell Price</Text>
                </View>
                <View style={styles.cell9}>
                  <Text style={styles.headerText}>Total</Text>
                </View>
              </View>

              {/* Rows */}
              {pageItems.map((item, idx) => {
                const globalIdx = isFirstPage
                  ? idx
                  : ITEMS_PER_PAGE_FIRST +
                    (pageIndex - 1) * ITEMS_PER_PAGE_REST +
                    idx;
                return (
                  <View
                    key={item._id || globalIdx}
                    style={[
                      styles.tableRow,
                      globalIdx % 2 === 0 ? styles.rowEven : styles.rowOdd,
                    ]}
                  >
                    <View style={styles.cell1}>
                      <Text style={styles.cellText}>{globalIdx + 1}</Text>
                    </View>

                    <View style={styles.cell2}>
                      <Text style={styles.cellText}>{txt(item.name)}</Text>
                    </View>

                    <View style={styles.cell3}>
                      <Text style={styles.cellText}>{txt(item.code)}</Text>
                    </View>

                    <View style={styles.cell6}>
                      <Text style={styles.cellText}>{txt(item.unit)}</Text>
                    </View>

                    <View style={styles.cell7}>
                      <Text style={styles.cellText}>{txt(item.quantity)}</Text>
                    </View>

                    <View style={styles.cell8}>
                      <Text style={styles.cellText}>{fmt(item.sellPrice)}</Text>
                    </View>

                    <View style={styles.cell9}>
                      <Text style={styles.cellText}>
                        {fmt(item.totalPrice)}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>

            {isLastPage && (
              <View>
                <View style={styles.bottomContainer}>
                  <View style={styles.totalsSection}>
                    <View style={styles.summaryRow}>
                      <Text style={styles.label}>Gross:</Text>
                      <Text>{fmt(invoiceData.grossAmount)}</Text>
                    </View>

                    <View style={styles.summaryRow}>
                      <Text style={styles.label}>Discount:</Text>
                      <Text>-{fmt(invoiceData.discount)}</Text>
                    </View>

                    <View style={styles.summaryRow}>
                      <Text style={styles.label}>Net:</Text>
                      <Text>{fmt(invoiceData.netAmount)}</Text>
                    </View>

                    <View style={styles.summaryRow}>
                      <Text style={styles.label}>Round Off:</Text>
                      <Text>{fmt(invoiceData.roundOff)}</Text>
                    </View>

                    <View
                      style={{
                        borderTopWidth: 1,
                        borderColor: "#000",
                        marginVertical: 4,
                      }}
                    />

                    <View style={styles.summaryRow}>
                      <Text style={{ fontWeight: "bold" }}>Total:</Text>
                      <Text style={{ fontWeight: "bold" }}>
                        {fmt(invoiceData.totalAmount)}
                      </Text>
                    </View>
                    <Text style={styles.amountInWords}>
                      In words: {txt(amountInWords)}
                    </Text>
                    <Text style={styles.signatureLine}>
                      Authorized Signature
                    </Text>
                  </View>
                </View>
              </View>
            )}
            

            <View style={styles.footerText}>
              {isLastPage && (
                <Text style={styles.bottomText}>
                  This is Computer Generated Invoice No Signature Required
                </Text>
              )}
              <Text style={{ fontSize: 8, marginTop: 2 }}>
                Page {pageNum} of {totalPages}
              </Text>
            </View>
          </Page>
        );
      })}
    </Document>
  );
};

export default InvoicePDF;
