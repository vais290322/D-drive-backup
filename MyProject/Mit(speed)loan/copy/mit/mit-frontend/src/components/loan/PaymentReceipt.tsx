import { Building2 } from "lucide-react";
import type { EmiPayment, Loan, Customer, BusinessSettings } from "@/types/types";

interface PaymentReceiptProps {
  payment: EmiPayment;
  loan: Loan;
  customer: Customer;
  settings?: BusinessSettings | null;
}

export function PaymentReceipt({ payment, loan, customer, settings: propSettings }: PaymentReceiptProps) {
  // Use prop settings if provided, otherwise null (or could fetch as fallback, but lifting state is better)
  // construct effective settings
  const settings = propSettings || null;


  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div
      className="bg-white text-black"
      style={{
        width: "210mm",
        minHeight: "297mm",
        padding: "20mm",
        margin: "0 auto",
        fontFamily: "Arial, sans-serif",
        fontSize: "12pt",
        lineHeight: "1.6",
        boxSizing: "border-box"
      }}
    >
      {/* Header */}
      <div style={{
        borderBottom: "3px solid #1e40af",
        paddingBottom: "15px",
        marginBottom: "30px"
      }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <tbody>
            <tr>
              <td style={{ width: "60%", verticalAlign: "top" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                  <div style={{
                    width: "80px",
                    height: "80px",
                    marginRight: "15px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}>
                    {settings?.logo_url ? (
                      <img src={settings.logo_url} alt="Logo" style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
                    ) : (
                      <div style={{
                        width: "60px",
                        height: "60px",
                        borderRadius: "50%",
                        background: "#1e40af",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}>
                        <Building2 style={{ width: "32px", height: "32px", color: "white" }} />
                      </div>
                    )}
                  </div>
                  <div>
                    <h1 style={{
                      fontSize: "24pt",
                      fontWeight: "bold",
                      margin: "0 0 5px 0",
                      color: "#1e293b"
                    }}>
                      {settings?.company_name || 'Mit Electro World'}
                    </h1>
                    <p style={{
                      fontSize: "11pt",
                      margin: 0,
                      color: "#64748b"
                    }}>
                      {settings?.tagline || 'Loan Management System'}
                    </p>
                    <p style={{
                      fontSize: "9pt",
                      margin: 0,
                      color: "#64748b"
                    }}>
                      {settings?.address_line1} {settings?.address_line2} {settings?.city}
                    </p>
                  </div>
                </div>
              </td>
              <td style={{ width: "40%", textAlign: "right", verticalAlign: "top" }}>
                <h2 style={{
                  fontSize: "20pt",
                  fontWeight: "bold",
                  margin: "0 0 8px 0",
                  color: "#1e40af"
                }}>
                  PAYMENT RECEIPT
                </h2>
                <p style={{
                  fontSize: "10pt",
                  margin: "0 0 4px 0",
                  color: "#64748b"
                }}>
                  Receipt No: <strong>{(payment.id?.slice(0, 8) || '').toUpperCase()}</strong>
                </p>
                <p style={{
                  fontSize: "10pt",
                  margin: 0,
                  color: "#64748b"
                }}>
                  Date: <strong>{formatDate(payment.payment_date)}</strong>
                </p>
                <p style={{
                  fontSize: "10pt",
                  margin: 0,
                  color: "#64748b"
                }}>
                  Time: <strong>{formatTime(payment.payment_date)}</strong>
                </p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Customer and Loan Details */}
      <table style={{
        width: "100%",
        marginBottom: "25px",
        borderCollapse: "collapse"
      }}>
        <tbody>
          <tr>
            <td style={{
              width: "50%",
              padding: "15px",
              background: "#f8fafc",
              border: "1px solid #e2e8f0",
              verticalAlign: "top"
            }}>
              <h3 style={{
                fontSize: "11pt",
                fontWeight: "bold",
                margin: "0 0 12px 0",
                color: "#475569",
                textTransform: "uppercase",
                letterSpacing: "0.5px"
              }}>
                Customer Details
              </h3>
              <table style={{ width: "100%", fontSize: "10pt" }}>
                <tbody>
                  <tr>
                    <td style={{ padding: "4px 0", color: "#64748b", width: "35%" }}>Name:</td>
                    <td style={{ padding: "4px 0", fontWeight: "600", color: "#1e293b" }}>{customer.full_name}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: "4px 0", color: "#64748b" }}>Customer ID:</td>
                    <td style={{ padding: "4px 0", fontWeight: "600", color: "#1e293b" }}>{customer.customer_code}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: "4px 0", color: "#64748b" }}>Mobile:</td>
                    <td style={{ padding: "4px 0", fontWeight: "600", color: "#1e293b" }}>{customer.mobile_primary}</td>
                  </tr>
                  {customer.email && (
                    <tr>
                      <td style={{ padding: "4px 0", color: "#64748b" }}>Email:</td>
                      <td style={{ padding: "4px 0", fontWeight: "600", color: "#1e293b" }}>{customer.email}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </td>
            <td style={{
              width: "50%",
              padding: "15px",
              background: "#f8fafc",
              border: "1px solid #e2e8f0",
              borderLeft: "none",
              verticalAlign: "top"
            }}>
              <h3 style={{
                fontSize: "11pt",
                fontWeight: "bold",
                margin: "0 0 12px 0",
                color: "#475569",
                textTransform: "uppercase",
                letterSpacing: "0.5px"
              }}>
                Loan Details
              </h3>
              <table style={{ width: "100%", fontSize: "10pt" }}>
                <tbody>
                  <tr>
                    <td style={{ padding: "4px 0", color: "#64748b", width: "40%" }}>Loan ID:</td>
                    <td style={{ padding: "4px 0", fontWeight: "600", color: "#1e293b" }}>{loan.loan_id}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: "4px 0", color: "#64748b" }}>Loan Type:</td>
                    <td style={{ padding: "4px 0", fontWeight: "600", color: "#1e293b", textTransform: "uppercase" }}>{loan.loan_type}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: "4px 0", color: "#64748b" }}>Principal:</td>
                    <td style={{ padding: "4px 0", fontWeight: "600", color: "#1e293b" }}>{formatCurrency(loan.principal_amount)}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: "4px 0", color: "#64748b" }}>EMI Amount:</td>
                    <td style={{ padding: "4px 0", fontWeight: "600", color: "#1e293b" }}>{formatCurrency(loan.installment_amount)}</td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>

      {/* Payment Information */}
      <div style={{
        background: "#f1f5f9",
        border: "2px solid #cbd5e1",
        borderRadius: "8px",
        padding: "20px",
        marginBottom: "25px"
      }}>
        <h3 style={{
          fontSize: "11pt",
          fontWeight: "bold",
          margin: "0 0 15px 0",
          color: "#475569",
          textTransform: "uppercase",
          letterSpacing: "0.5px"
        }}>
          Payment Information
        </h3>
        <table style={{ width: "100%", fontSize: "10pt" }}>
          <tbody>
            <tr>
              <td style={{ padding: "8px 0", width: "50%" }}>
                <div>
                  <p style={{ margin: "0 0 4px 0", color: "#64748b", fontSize: "9pt" }}>Payment Date</p>
                  <p style={{ margin: 0, fontWeight: "600", color: "#1e293b", fontSize: "11pt" }}>{formatDate(payment.payment_date)}</p>
                </div>
              </td>
              <td style={{ padding: "8px 0", width: "50%" }}>
                <div>
                  <p style={{ margin: "0 0 4px 0", color: "#64748b", fontSize: "9pt" }}>Payment Mode</p>
                  <p style={{ margin: 0, fontWeight: "600", color: "#1e293b", fontSize: "11pt", textTransform: "uppercase" }}>{payment.payment_mode}</p>
                </div>
              </td>
            </tr>
            {(payment.transaction_reference || payment.collected_by) && (
              <tr>
                {payment.transaction_reference && (
                  <td style={{ padding: "8px 0" }}>
                    <div>
                      <p style={{ margin: "0 0 4px 0", color: "#64748b", fontSize: "9pt" }}>Transaction Reference</p>
                      <p style={{ margin: 0, fontWeight: "600", color: "#1e293b", fontSize: "11pt" }}>{payment.transaction_reference}</p>
                    </div>
                  </td>
                )}
                {payment.collected_by && (
                  <td style={{ padding: "8px 0" }}>
                    <div>
                      <p style={{ margin: "0 0 4px 0", color: "#64748b", fontSize: "9pt" }}>Collected By</p>
                      <p style={{ margin: 0, fontWeight: "600", color: "#1e293b", fontSize: "11pt" }}>
                        {typeof payment.collected_by === 'object' && payment.collected_by !== null
                          ? (payment.collected_by as any).full_name || (payment.collected_by as any)._id
                          : payment.collected_by}
                      </p>
                    </div>
                  </td>
                )}
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Amount Paid - Highlighted */}
      <div style={{
        background: "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)",
        border: "3px solid #1e40af",
        borderRadius: "10px",
        padding: "25px",
        marginBottom: "25px",
        textAlign: "center"
      }}>
        <p style={{
          margin: "0 0 8px 0",
          fontSize: "11pt",
          color: "#475569",
          textTransform: "uppercase",
          letterSpacing: "1px",
          fontWeight: "600"
        }}>
          Amount Paid
        </p>
        <p style={{
          margin: "0 0 15px 0",
          fontSize: "36pt",
          fontWeight: "bold",
          color: "#1e40af",
          lineHeight: "1"
        }}>
          {formatCurrency(payment.amount_paid)}
        </p>
        <div style={{
          borderTop: "2px solid #93c5fd",
          paddingTop: "12px",
          marginTop: "12px"
        }}>
          <p style={{
            margin: "0 0 4px 0",
            fontSize: "9pt",
            color: "#64748b"
          }}>
            Amount in Words
          </p>
          <p style={{
            margin: 0,
            fontSize: "12pt",
            fontWeight: "600",
            color: "#1e293b",
            fontStyle: "italic"
          }}>
            {numberToWords(payment.amount_paid)} Rupees Only
          </p>
        </div>
      </div>

      {/* Remarks */}
      {payment.remarks && (
        <div style={{ marginBottom: "30px" }}>
          <h3 style={{
            fontSize: "11pt",
            fontWeight: "bold",
            margin: "0 0 10px 0",
            color: "#475569",
            textTransform: "uppercase",
            letterSpacing: "0.5px"
          }}>
            Remarks
          </h3>
          <div style={{
            background: "#fef3c7",
            border: "1px solid #fbbf24",
            borderRadius: "6px",
            padding: "12px",
            fontSize: "10pt",
            color: "#78350f"
          }}>
            {payment.remarks}
          </div>
        </div>
      )}

      {/* Footer */}
      <div style={{
        borderTop: "2px solid #1e40af",
        paddingTop: "20px",
        marginTop: "40px"
      }}>
        <table style={{ width: "100%", marginBottom: "20px" }}>
          <tbody>
            <tr>
              <td style={{ width: "50%", verticalAlign: "bottom" }}>
                <p style={{
                  margin: "0 0 4px 0",
                  fontSize: "9pt",
                  color: "#64748b"
                }}>
                  This is a computer-generated receipt.
                </p>
                <p style={{
                  margin: 0,
                  fontSize: "9pt",
                  color: "#64748b"
                }}>
                  No signature required.
                </p>
              </td>
              <td style={{ width: "50%", textAlign: "right", verticalAlign: "bottom" }}>
                <p style={{
                  margin: "0 0 8px 0",
                  fontSize: "9pt",
                  color: "#64748b"
                }}>
                  Authorized Signature
                </p>
                <div style={{
                  borderTop: "1px solid #94a3b8",
                  width: "200px",
                  marginLeft: "auto"
                }}></div>
              </td>
            </tr>
          </tbody>
        </table>

        <div style={{
          textAlign: "center",
          paddingTop: "15px",
          borderTop: "1px solid #e2e8f0"
        }}>
          <p style={{
            margin: "0 0 4px 0",
            fontSize: "9pt",
            color: "#64748b"
          }}>
            Designed & Developed by <strong>{settings?.company_name || 'Vais Engineering Pvt Ltd'}</strong>
          </p>
          <p style={{
            margin: 0,
            fontSize: "9pt",
            color: "#64748b"
          }}>
            For any queries, please contact: {settings?.email || 'support@mitelectroworld.com'}
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * Convert number to words (Indian numbering system)
 */
function numberToWords(num: number): string {
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];

  if (num === 0) return 'Zero';

  const crores = Math.floor(num / 10000000);
  const lakhs = Math.floor((num % 10000000) / 100000);
  const thousands = Math.floor((num % 100000) / 1000);
  const hundreds = Math.floor((num % 1000) / 100);
  const remainder = Math.floor(num % 100);

  let words = '';

  if (crores > 0) {
    words += convertTwoDigit(crores) + ' Crore ';
  }
  if (lakhs > 0) {
    words += convertTwoDigit(lakhs) + ' Lakh ';
  }
  if (thousands > 0) {
    words += convertTwoDigit(thousands) + ' Thousand ';
  }
  if (hundreds > 0) {
    words += ones[hundreds] + ' Hundred ';
  }
  if (remainder > 0) {
    if (remainder < 10) {
      words += ones[remainder];
    } else if (remainder < 20) {
      words += teens[remainder - 10];
    } else {
      words += tens[Math.floor(remainder / 10)] + ' ' + ones[remainder % 10];
    }
  }

  return words.trim();

  function convertTwoDigit(n: number): string {
    if (n < 10) return ones[n];
    if (n < 20) return teens[n - 10];
    return tens[Math.floor(n / 10)] + ' ' + ones[n % 10];
  }
}
