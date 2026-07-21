import React from 'react';
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Font
} from '@react-pdf/renderer';

// Register a font that supports ₹
Font.register({
  family: 'Noto Sans',
  src: 'https://fonts.gstatic.com/s/notosans/v27/o-0IIpQlx3QUlC5A4PNb4j5Ba_2c7A.woff2'
});

// Styles
const styles = StyleSheet.create({
  page: {
    fontFamily: 'Noto Sans',
    fontSize: 10,
    padding: 30,
    lineHeight: 1.4
  },
  header: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold'
  },
  section: {
    marginBottom: 10
  },
  table: {
    display: 'table',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0
  },
  tableRow: {
    flexDirection: 'row'
  },
  tableColHeader: {
    width: '20%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    backgroundColor: '#f2f2f2',
    fontWeight: 'bold',
    padding: 4
  },
  tableCol: {
    width: '20%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 4
  },
  tableCell: {
    fontSize: 10
  },
  totalRow: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'flex-end'
  },
  totalText: {
    fontSize: 12,
    fontWeight: 'bold'
  }
});

// INR Formatter
const formatINR = (amount) =>
  `₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;

// PDF Document Component
const InvoicePDF = ({ invoiceData }) => {
  const { customerName, invoiceNumber, date, items, gstRate } = invoiceData;

  const subtotal = items.reduce((acc, item) => acc + item.qty * item.price, 0);
  const gstAmount = subtotal * (gstRate / 100);
  const total = subtotal + gstAmount;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Invoice Header */}
        <Text style={styles.header}>Payment Invoice</Text>

        {/* Customer Info */}
        <View style={styles.section}>
          <Text>Invoice No: {invoiceNumber}</Text>
          <Text>Date: {date}</Text>
          <Text>Bill To: {customerName}</Text>
        </View>

        {/* Items Table */}
        <View style={styles.table}>
          {/* Table Header */}
          <View style={styles.tableRow}>
            <Text style={styles.tableColHeader}>Item</Text>
            <Text style={styles.tableColHeader}>Description</Text>
            <Text style={styles.tableColHeader}>Qty</Text>
            <Text style={styles.tableColHeader}>Price</Text>
            <Text style={styles.tableColHeader}>Total</Text>
          </View>

          {/* Table Rows */}
          {items.map((item, index) => (
            <View style={styles.tableRow} key={index}>
              <Text style={styles.tableCol}>{item.name}</Text>
              <Text style={styles.tableCol}>{item.desc}</Text>
              <Text style={styles.tableCol}>{item.qty}</Text>
              <Text style={styles.tableCol}>{formatINR(item.price)}</Text>
              <Text style={styles.tableCol}>{formatINR(item.qty * item.price)}</Text>
            </View>
          ))}
        </View>

        {/* Totals */}
        <View style={styles.totalRow}>
          <Text style={styles.totalText}>Subtotal: {formatINR(subtotal)}</Text>
        </View>
        <View style={styles.totalRow}>
          <Text style={styles.totalText}>GST ({gstRate}%): {formatINR(gstAmount)}</Text>
        </View>
        <View style={styles.totalRow}>
          <Text style={styles.totalText}>Total: {formatINR(total)}</Text>
        </View>
      </Page>
    </Document>
  );
};

export default InvoicePDF;
