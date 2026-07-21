import React from 'react';
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';
import { DownloadIcon } from 'lucide-react';

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff'
  },
  header: {
    marginBottom: 30,
    borderBottom: '2px solid #2563eb',
    paddingBottom: 15
  },
  title: {
    fontSize: 28,
    marginBottom: 15,
    color: '#1e40af',
    textTransform: 'uppercase',
    fontWeight: 'bold'
  },
  section: {
    marginBottom: 25,
    padding: 15,
    backgroundColor: '#f8fafc',
    borderRadius: 5
  },
  sectionTitle: {
    fontSize: 16,
    color: '#1e40af',
    marginBottom: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase'
  },
  table: {
    width: '100%',
    marginTop: 15,
    borderRadius: 5,
    border: '1px solid #e2e8f0'
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '1px solid #e2e8f0',
    minHeight: 35,
    alignItems: 'center'
  },
  tableHeader: {
    backgroundColor: '#2563eb',
    fontWeight: 'bold',
    color: '#ffffff'
  },
  tableCell: {
    padding: 8,
    flex: 1,
    textAlign: 'center',
    fontSize: 12
  },
  totalSection: {
    marginTop: 30,
    paddingTop: 15,
    borderTop: '2px solid #2563eb',
    alignItems: 'flex-end'
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 5
  },
  totalLabel: {
    width: 100,
    textAlign: 'right',
    marginRight: 10,
    color: '#64748b'
  },
  totalValue: {
    width: 100,
    textAlign: 'right',
    fontWeight: 'bold'
  },
  grandTotal: {
    fontSize: 16,
    color: '#1e40af',
    fontWeight: 'bold',
    marginTop: 10,
    paddingTop: 10,
    borderTop: '1px solid #e2e8f0'
  },
  infoText: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 5
  }
});

const PurchasePdf = ({ invoiceData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>Purchase Order for Snigdha</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={styles.infoText}>Invoice Number: {invoiceData?.invoiceNumber || 'N/A'}</Text>
          <Text style={styles.infoText}>Date: {new Date(invoiceData?.date).toLocaleDateString() || 'N/A'}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Vendor Details</Text>
        <Text style={styles.infoText}>Name: {invoiceData?.receiverDetails?.name || 'N/A'}</Text>
        <Text style={styles.infoText}>Phone: {invoiceData?.receiverDetails?.phoneNumber || 'N/A'}</Text>
        <Text style={styles.infoText}>Address: {invoiceData?.receiverDetails?.address || 'N/A'}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Items</Text>
        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={[styles.tableCell, { color: '#ffffff' }]}>Item</Text>
            <Text style={[styles.tableCell, { color: '#ffffff' }]}>HSN Code</Text>
            <Text style={[styles.tableCell, { color: '#ffffff' }]}>Quantity</Text>
            <Text style={[styles.tableCell, { color: '#ffffff' }]}>Tax Rate</Text>
            <Text style={[styles.tableCell, { color: '#ffffff' }]}>Tax Amount</Text>
            <Text style={[styles.tableCell, { color: '#ffffff' }]}>Discount Rate</Text>
            <Text style={[styles.tableCell, { color: '#ffffff' }]}>Discount Amount</Text>
            <Text style={[styles.tableCell, { color: '#ffffff' }]}>Price</Text>
            <Text style={[styles.tableCell, { color: '#ffffff' }]}>Total</Text>
          </View>
          {invoiceData?.items?.map((item, index) => (
            <View key={index} style={[styles.tableRow, { backgroundColor: index % 2 === 0 ? '#f8fafc' : '#ffffff' }]}>
              <Text style={styles.tableCell}>{item.itemName}</Text>
              <Text style={styles.tableCell}>{item.hsnCode}</Text>
              <Text style={styles.tableCell}>{item.quantity}</Text>
              <Text style={styles.tableCell}>{item?.taxRate} </Text>
              <Text style={styles.tableCell}>{item?.taxAmount} </Text>
              <Text style={styles.tableCell}>{item?.discountRate} </Text>
              <Text style={styles.tableCell}>{item?.discountAmount} </Text>
              <Text style={styles.tableCell}>{item.unitPrice?.toFixed(2)}</Text>
              <Text style={styles.tableCell}>{item.grossAmount?.toFixed(2)}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.totalSection}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Subtotal:</Text>
          <Text style={styles.totalValue}>{(invoiceData?.taxableAmount || 0).toFixed(2)}</Text>
        </View>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Tax:</Text>
          <Text style={styles.totalValue}>{(invoiceData?.taxAmount || 0).toFixed(2)}</Text>
        </View>
        <View style={[styles.totalRow, styles.grandTotal]}>
          <Text style={[styles.totalLabel, { color: '#1e40af' }]}>Grand Total:</Text>
          <Text style={styles.totalValue}>{(invoiceData?.grandTotal || 0).toFixed(2)}</Text>
        </View>
      </View>
    </Page>
  </Document>
);

export default PurchasePdf;

export const PDFDownloadButton = ({ invoice }) => (
  <PDFDownloadLink 
    document={<PurchasePdf invoiceData={invoice} />} 
    fileName={`invoice-${invoice?.invoiceNumber || 'po'}.pdf`}
  >
    {({ blob, url, loading, error }) =>
      loading ? 'Generating PDF...' : <DownloadIcon fontSize="small" />
    }
  </PDFDownloadLink>
);