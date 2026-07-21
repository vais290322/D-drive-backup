import React, { useEffect } from 'react'
import {
    Page,
    Text,
    View,
    Document,
    StyleSheet,
    PDFViewer,
    PDFDownloadLink,
} from "@react-pdf/renderer";
import { DownloadIcon } from 'lucide-react';
import axios from 'axios';
import { backendDomainA, backendDomainS } from '../../../Common';

const styles = StyleSheet.create({
    page: {
        backgroundColor: "#fff",
        padding: 16,
        fontSize: 10,
        fontFamily: "Helvetica",
        border: "1pt solid #222",
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 2,
    },
    bold: { fontWeight: "bold" },
    table: { border: "1pt solid #222", marginTop: 8 },
    tableHeader: {
        flexDirection: "row",
        // backgroundColor: "#eee",
        borderBottom: "1pt solid #222",
    },
    tableCellHeader: {
        flex: 1,
        paddingTop: 4,
        paddingBottom: 4,
        fontWeight: "bold",
        borderRight: "1pt solid #222",
        textAlign: "center",
        wordWrap: "break-word",
        overflow: "hidden",
    },
    tableRow: { flexDirection: "row", borderBottom: "1pt solid #222" },
    tableCell: {
        flex: 1,
        padding: 4,
        borderRight: "1pt solid #222",
        textAlign: "center",
        wordWrap: "break-word",
        overflow: "hidden",
    },
    tableCellLast: { 
        flex: 1, 
        padding: 4, 
        textAlign: "center",
        wordWrap: "break-word",
        overflow: "hidden",
    },
    section: { marginVertical: 6 },
    small: { fontSize: 9, textAlign: "justify" },
    footer: { marginTop: 16, borderTop: "1pt solid #222", paddingTop: 8 },
    footerRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 8,
    },
    footerCol: { width: "32%" },
});



const CreditDebitNote = ({data, bankDetails}) => {

    const formatDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    };

    // Helper function to format currency
    const formatCurrency = (amount) => {
        return parseFloat(amount || 0).toFixed(2);
    };

    // Prepare table data from products
    const tableData = data?.products?.map((product, index) => [
        (index + 1).toString(),
        product.itemName || product.description || "",
        product.hsnCode || "",
        product.newQuantity?.toString() || "0",
        product.uom || "Nos",
        formatCurrency(product.newSellingPrice),
        formatCurrency(product.grossAmount),
        product.cgst ? `${product.cgst}%` : "0%",
        formatCurrency(product.cgst ? (product.grossAmount * product.cgst) / 100 : 0),
        product.sgst ? `${product.sgst}%` : "0%",
        formatCurrency(product.sgst ? (product.grossAmount * product.sgst) / 100 : 0),
        formatCurrency(product.totalAmount || product.editedAmount),
    ]) || [];

    return (
         <Document>
        <Page size="A4" style={styles.page}>
            {/* Full-page border */}
            <View
                style={{
                    position: "absolute",
                    top: 8,
                    left: 8,
                    right: 8,
                    bottom: 8,
                    border: "1pt solid #222",
                    borderRadius: 2,
                    zIndex: 0,
                }}
            />
            {/* All content should be wrapped in a View with position: 'relative' and zIndex: 1 */}
            <View style={{ position: "relative", zIndex: 1 }}>
                {/* Credit Note Title */}
                  <Text
                    style={{
                        fontSize: 14,
                        fontWeight: "bold",
                        marginBottom: 8,
                        borderBottom: "1pt solid #222",
                    }}
                >
                    {data?.noteType === 'credit' ? 'Credit Note' : 'Debit Note'}
                </Text>
                {/* Top Section */}
                <View style={styles.row}>
                   <View style={{ width: "60%" }}>
                        <Text style={styles.bold}>SNIGDHA ENTERPRISE</Text>
                        <Text style={styles.small}>AB-79, SALT LAKE CITY, SECTOR-I</Text>
                        <Text style={styles.small}>KOLKATA - 700064</Text>
                        <Text style={styles.small}>GSTIN: 19BTFPR0457K2Z7</Text>
                        <Text style={styles.small}>Phone: +91 9073656557</Text>
                        <Text style={styles.small}>Email: snigdhaenterprise2015@gmail.com</Text>
                    </View>
                </View>
                {/* To Section */}
                <View
                    style={[
                        styles.section,
                        {
                            flexDirection: "row",
                            border: "1pt solid #222",
                        },
                    ]}
                >
                    {/* Left: To */}
                    <View
                        style={{
                            width: "60%",
                            borderRight: "1pt solid #222",
                            paddingBottom: 2,
                            paddingTop: 4,
                            paddingLeft: 4,
                        }}
                    >
                         <Text
                            style={{ fontWeight: "bold", fontSize: 11, marginBottom: 2 }}
                        >
                            To:
                        </Text>
                        <Text
                            style={{ fontWeight: "bold", fontSize: 10, marginBottom: 2 }}
                        >
                            {data?.invoiceDetails?.receiverDetails?.name || ""}
                        </Text>
                        <Text style={{ ...styles.small, lineHeight: 1.2, paddingBottom: 8 }}>
                            {data?.invoiceDetails?.receiverDetails?.address || ""}
                            {data?.invoiceDetails?.receiverDetails?.deliveryAddress && 
                             `, ${data.invoiceDetails.receiverDetails.deliveryAddress}`}
                        </Text>
                        <Text style={{ ...styles.small, lineHeight: 1.2, paddingBottom: 8 }}>
                            GSTIN: {data?.invoiceDetails?.receiverDetails?.gstin || "N/A"}
                        </Text>
                        <Text style={{ ...styles.small, lineHeight: 1.2, paddingBottom: 8 }}>
                            State: {data?.invoiceDetails?.receiverDetails?.state || "N/A"}
                            {data?.invoiceDetails?.receiverDetails?.phoneNumber && 
                             `, Phone: ${data.invoiceDetails.receiverDetails.phoneNumber}`}
                        </Text>
                    </View>
                    {/* Right: Credit Note Info */}
                    <View
                        style={{
                            width: "40%",
                            paddingRight: 8,
                            paddingBottom: 2,
                            paddingTop: 4,
                            paddingLeft: 4,
                        }}
                    >
                        <View style={{ flexDirection: "row" }}>
                             <View style={{ width: "60%" }}>
                                <Text style={{ ...styles.small, lineHeight: 1.2, paddingBottom: 4 }}>
                                    {data?.noteType === 'credit' ? 'Credit Note Date:' : 'Debit Note Date:'}
                                </Text>
                                <Text style={{ ...styles.small, lineHeight: 1.2, paddingBottom: 4 }}>
                                    {data?.noteType === 'credit' ? 'Credit Note Number:' : 'Debit Note Number:'}
                                </Text>
                                <Text style={{ ...styles.small, lineHeight: 1.2, paddingBottom: 4 }}>Invoice Reference:</Text>
                                <Text style={{ ...styles.small, lineHeight: 1.2, paddingBottom: 4 }}>Reference Date:</Text>
                            </View>
                            <View style={{ width: "40%" }}>
                                <Text style={{ ...styles.small, lineHeight: 1.2, paddingBottom: 4 }}>
                                    {formatDate(data?.date)}
                                </Text>
                                <Text style={{ ...styles.small, lineHeight: 1.2, paddingBottom: 4 }}>
                                    {data?.referenceNumber || ""}
                                </Text>
                                <Text style={{ ...styles.small, lineHeight: 1.2, paddingBottom: 4 }}>
                                    {data?.invoiceNumber || ""}
                                </Text>
                                <Text style={{ ...styles.small, lineHeight: 1.2, paddingBottom: 4 }}>
                                    {formatDate(data?.invoiceDetails?.date)}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
                {/* Additional Info */}
                <View
                    style={{ border: "1pt solid #222", marginVertical: 6, padding: 4 }}
                >
                    <Text style={styles.small}>Additional Information</Text>
                    <Text style={styles.small}>
                        {data?.description || `This is a ${data?.noteType || 'credit'} note made against Invoice No: ${data?.invoiceNumber || ''}`}
                    </Text>
                    {data?.reason && (
                        <Text style={styles.small}>
                            Reason: {data.reason}
                        </Text>
                    )}
                </View>
                {/* Table */}
                <View style={styles.table}>
                    {/* First header row */}
                    <View style={styles.tableHeader}>
                        <Text style={styles.tableCellHeader}>Sl. No</Text>
                        <Text style={[styles.tableCellHeader, { flex: 2 }]}>
                            Description
                        </Text>
                        <Text style={styles.tableCellHeader}>HSN CODE</Text>
                        <Text style={styles.tableCellHeader}>Qty</Text>
                        <Text style={styles.tableCellHeader}>Unit</Text>
                        <Text style={styles.tableCellHeader}>Unit Price</Text>
                        <Text style={styles.tableCellHeader}>Amount</Text>
                        {/* CGST header (spans 2 columns) */}
                        <View
                            style={{
                                flex: 2,
                                flexDirection: "row",

                            }}
                        >
                            <Text
                                style={[
                                    styles.tableCellHeader,
                                    { flex: 1, },
                                ]}
                            >
                                CGST
                            </Text>

                        </View>
                        {/* SGST header (spans 2 columns) */}
                        <View
                            style={{
                                flex: 2,
                                flexDirection: "row",

                            }}
                        >
                            <Text
                                style={[
                                    styles.tableCellHeader,
                                    { flex: 1, },
                                ]}
                            >
                                SGST
                            </Text>

                        </View>
                        <Text style={styles.tableCellHeader}>Total Amount</Text>
                    </View>
                    {/* Second header row for sub-columns */}
                    <View style={styles.tableHeader}>
                        <Text style={styles.tableCellHeader}></Text>
                        <Text style={[styles.tableCellHeader, { flex: 2 }]}></Text>
                        <Text style={styles.tableCellHeader}></Text>
                        <Text style={styles.tableCellHeader}></Text>
                        <Text style={styles.tableCellHeader}></Text>
                        <Text style={styles.tableCellHeader}></Text>
                        <Text style={styles.tableCellHeader}></Text>
                        {/* CGST sub-columns */}
                        <Text style={styles.tableCellHeader}>Rate</Text>
                        <Text
                            style={[
                                styles.tableCellHeader,
                                { borderRight: "1pt solid #222" },
                            ]}
                        >
                            Amt.
                        </Text>
                        {/* SGST sub-columns */}
                        <Text style={styles.tableCellHeader}>Rate</Text>
                        <Text
                            style={[
                                styles.tableCellHeader,
                                { borderRight: "1pt solid #222" },
                            ]}
                        >
                            Amt.
                        </Text>
                        <Text style={styles.tableCellHeader}></Text>
                    </View>
                    {/* Table body */}
                    {tableData.map((row, idx) => (
                        <View style={styles.tableRow} key={idx}>
                            <Text style={styles.tableCell}>{row[0]}</Text>
                            <Text style={[styles.tableCell, { 
                                flex: 2, 
                                padding: 8,
                                wordWrap: "break-word",
                                overflow: "hidden"
                            }]}>{row[1]}</Text>
                            <Text style={[styles.tableCell, {
                                wordWrap: "break-word",
                                overflow: "hidden",
                                fontSize: 8
                            }]}>{row[2]}</Text>
                            <Text style={styles.tableCell}>{row[3]}</Text>
                            <Text style={styles.tableCell}>{row[4]}</Text>
                            <Text style={styles.tableCell}>{row[5]}</Text>
                            <Text style={styles.tableCell}>{row[6]}</Text>
                            <Text style={styles.tableCell}>{row[7]}</Text>
                            <Text style={styles.tableCell}>{row[8]}</Text>
                            <Text style={styles.tableCell}>{row[9]}</Text>
                            <Text style={styles.tableCell}>{row[10]}</Text>
                            <Text style={styles.tableCellLast}>{row[11]}</Text>
                        </View>
                    ))}
                </View>
                {/* Totals */}
               <View style={{ flexDirection: "row", marginTop: 8 }}>
                    <View style={{ width: "60%" }}>
                        <Text style={styles.small}>
                            Payment should be made as per the agreed terms
                        </Text>
                        <Text style={styles.small}>
                            {data?.noteType === 'credit' ? 'This credit note reduces your outstanding balance.' : 
                             'This debit note increases your outstanding balance.'}
                        </Text>
                    </View>
                    <View style={{ width: "38%" }}>
                        <View style={styles.row}>
                            <Text style={styles.bold}>Sub Total</Text>
                            <Text>{formatCurrency(data?.totalGrossAmount || 0)}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.bold}>Add: CGST</Text>
                            <Text>{formatCurrency(data?.products?.reduce((sum, p) => sum + ((p.grossAmount * (p.cgst || 0)) / 100), 0) || 0)}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.bold}>Add: SGST</Text>
                            <Text>{formatCurrency(data?.products?.reduce((sum, p) => sum + ((p.grossAmount * (p.sgst || 0)) / 100), 0) || 0)}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.bold}>Grand Total</Text>
                            <Text>{formatCurrency(data?.amount || 0)}</Text>
                        </View>
                    </View>
                </View>
                {/* Footer */}
                  <View style={styles.footer}>
                    <View style={styles.footerRow}>
                        <View style={styles.footerCol}>
                            <Text style={{ ...styles.bold, paddingBottom: 4 }}>Registered Address:</Text>
                            <Text style={{ ...styles.small, lineHeight: 1.2, paddingBottom: 4 }}>SNIGDHA ENTERPRISE</Text>
                            <Text style={{ ...styles.small, lineHeight: 1.2, paddingBottom: 4 }}>AB-79, SALT LAKE CITY, SECTOR-I</Text>
                            <Text style={{ ...styles.small, lineHeight: 1.2, paddingBottom: 4 }}>KOLKATA - 700064</Text>
                        </View>
                        <View style={styles.footerCol}>
                            <Text style={{ ...styles.bold, paddingBottom: 4 }}>Contact Information</Text>
                            <Text style={{ ...styles.small, lineHeight: 1.2, paddingBottom: 4 }}>Phone: +91 9073656557</Text>
                            <Text style={{ ...styles.small, lineHeight: 1.2, paddingBottom: 4 }}>
                                Email: snigdhaenterprise2015@gmail.com
                            </Text>
                            <Text style={{ ...styles.small, lineHeight: 1.2, paddingBottom: 4 }}>
                                GSTIN: 19BTFPR0457K2Z7
                            </Text>
                        </View>
                        <View style={styles.footerCol}>
                            <Text style={{ ...styles.bold, paddingBottom: 4 }}>Payment Details:</Text>
                            <Text style={{ ...styles.small, lineHeight: 1.2, paddingBottom: 4 }}>
                               Bank:  {bankDetails?.bankName || 'State Bank of India'}
                            </Text>
                            <Text style={{ ...styles.small, lineHeight: 1.2, paddingBottom: 4 }}>
                                Sort Code : {bankDetails?.ifscCode || 'SBIN0001234'}
                            </Text>
                            <Text style={{ ...styles.small, lineHeight: 1.2, paddingBottom: 4 }}>
                                Account NO : {bankDetails?.accountNumber || '1234567890'}
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
        </Page>
    </Document>
    )
}

const SnigdhaCreditDebitNotePdf = ({ pdfData }) => {

    const [bankDetails, setBankDetails] = React.useState(null);

    useEffect(()=>{
        const fetchBankDetails = async () => {
            try {
                const response = await axios.get(`${backendDomainS}/api/v1/bank/all`);
                
                setBankDetails(response?.data.data[0] || null);
            } catch (error) {
                console.error('Error fetching bank details:', error);
            }
        };
        fetchBankDetails();
    },[])

    // console.log("pdf data : ", pdfData)

    return (
        <PDFDownloadLink
            document={<CreditDebitNote  data={pdfData} bankDetails={bankDetails} />}
            fileName={`${pdfData?.noteType || 'credit'}-note-${pdfData?.referenceNumber || 'note'}.pdf`}
        >
            {({ loading }) => (loading ? 'Loading document...' : <DownloadIcon fontSize="small" />)}
        </PDFDownloadLink>
    )
}

export default SnigdhaCreditDebitNotePdf;