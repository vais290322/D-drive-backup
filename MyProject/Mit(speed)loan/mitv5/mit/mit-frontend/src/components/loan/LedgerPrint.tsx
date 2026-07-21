/**
 * Ledger Print Component
 * Printable loan ledger statement with professional formatting
 */

import { useState, useEffect } from "react";
import { Building2 } from "lucide-react";
import type { Loan, Customer, BusinessSettings } from "@/types/types";
import type { LedgerEntry, LoanSummary } from "@/utils/loanCalculations";
import { getBusinessSettings } from "@/db/settingsApi";

interface LedgerPrintProps {
  loan: Loan;
  customer: Customer;
  ledger: LedgerEntry[];
  summary: LoanSummary;
}

export function LedgerPrint({ loan, customer, ledger, summary }: LedgerPrintProps) {
  const [settings, setSettings] = useState<BusinessSettings | null>(null);

  useEffect(() => {
    getBusinessSettings().then(setSettings).catch(console.error);
  }, []);

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
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="bg-white text-black" style={{
      width: "210mm",
      minHeight: "297mm",
      margin: "0 auto",
      padding: "20mm",
      fontFamily: "Arial, sans-serif",
      fontSize: "11pt",
      lineHeight: "1.4",
      boxSizing: "border-box"
    }}>
      {/* Header */}
      <div style={{
        borderBottom: "3px solid #1e40af",
        paddingBottom: "15px",
        marginBottom: "25px"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            <div style={{
              height: "80px",
              width: "auto",
              minWidth: "80px",
              marginRight: "15px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              {settings?.logo_url ? (
                <img src={settings.logo_url} alt="Logo" style={{ height: "100%", width: "auto", objectFit: "contain" }} />
              ) : (
                <div style={{
                  height: "60px",
                  width: "60px",
                  borderRadius: "50%",
                  background: "#1e40af",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                  <Building2 style={{ height: "32px", width: "32px", color: "white" }} />
                </div>
              )}
            </div>
            <div>
              <h1 style={{
                fontSize: "28px",
                fontWeight: "bold",
                color: "#1e293b",
                margin: "0 0 5px 0"
              }}>{settings?.company_name || 'Mit Electro World'}</h1>
              <p style={{
                fontSize: "13px",
                color: "#64748b",
                margin: 0
              }}>{settings?.tagline || 'Loan Management System'}</p>
              <p style={{
                fontSize: "11px",
                color: "#64748b",
                margin: "2px 0 0 0"
              }}>{settings?.address_line1} {settings?.address_line2} {settings?.city}</p>
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <h2 style={{
              fontSize: "20px",
              fontWeight: "bold",
              color: "#1e293b",
              margin: "0 0 5px 0",
              letterSpacing: "0.5px"
            }}>LOAN LEDGER STATEMENT</h2>
            <p style={{
              fontSize: "12px",
              color: "#64748b",
              margin: 0
            }}>Generated on: {formatDate(new Date().toISOString())}</p>
          </div>
        </div>
      </div>

      {/* Customer and Loan Details */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "20px",
        marginBottom: "25px"
      }}>
        <div>
          <h3 style={{
            fontSize: "13px",
            fontWeight: "bold",
            color: "#1e293b",
            background: "#f1f5f9",
            padding: "10px",
            margin: "0 0 10px 0",
            borderLeft: "4px solid #3b82f6"
          }}>CUSTOMER DETAILS</h3>
          <div style={{ padding: "0 10px" }}>
            <table style={{ width: "100%", fontSize: "12px", borderCollapse: "collapse" }}>
              <tbody>
                <tr>
                  <td style={{ padding: "5px 0", fontWeight: "600", color: "#475569", width: "40%" }}>Name:</td>
                  <td style={{ padding: "5px 0", color: "#1e293b" }}>{customer?.full_name || 'N/A'}</td>
                </tr>
                <tr>
                  <td style={{ padding: "5px 0", fontWeight: "600", color: "#475569" }}>Customer ID:</td>
                  <td style={{ padding: "5px 0", color: "#1e293b" }}>{customer?.customer_code || 'N/A'}</td>
                </tr>
                <tr>
                  <td style={{ padding: "5px 0", fontWeight: "600", color: "#475569" }}>Mobile:</td>
                  <td style={{ padding: "5px 0", color: "#1e293b" }}>{customer?.mobile_primary || 'N/A'}</td>
                </tr>
                {customer?.email && (
                  <tr>
                    <td style={{ padding: "5px 0", fontWeight: "600", color: "#475569" }}>Email:</td>
                    <td style={{ padding: "5px 0", color: "#1e293b" }}>{customer.email}</td>
                  </tr>
                )}
                {customer?.current_address && (
                  <tr>
                    <td style={{ padding: "5px 0", fontWeight: "600", color: "#475569", verticalAlign: "top" }}>Address:</td>
                    <td style={{ padding: "5px 0", color: "#1e293b" }}>{customer.current_address}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div>
          <h3 style={{
            fontSize: "13px",
            fontWeight: "bold",
            color: "#1e293b",
            background: "#f1f5f9",
            padding: "10px",
            margin: "0 0 10px 0",
            borderLeft: "4px solid #3b82f6"
          }}>LOAN DETAILS</h3>
          <div style={{ padding: "0 10px" }}>
            <table style={{ width: "100%", fontSize: "12px", borderCollapse: "collapse" }}>
              <tbody>
                <tr>
                  <td style={{ padding: "5px 0", fontWeight: "600", color: "#475569", width: "45%" }}>Loan ID:</td>
                  <td style={{ padding: "5px 0", color: "#1e293b" }}>{loan.loan_id}</td>
                </tr>
                <tr>
                  <td style={{ padding: "5px 0", fontWeight: "600", color: "#475569" }}>Loan Type:</td>
                  <td style={{ padding: "5px 0", color: "#1e293b", textTransform: "uppercase" }}>{loan.loan_type}</td>
                </tr>
                <tr>
                  <td style={{ padding: "5px 0", fontWeight: "600", color: "#475569" }}>Interest Type:</td>
                  <td style={{ padding: "5px 0", color: "#1e293b", textTransform: "uppercase" }}>{loan.interest_type}</td>
                </tr>
                <tr>
                  <td style={{ padding: "5px 0", fontWeight: "600", color: "#475569" }}>Interest Rate:</td>
                  <td style={{ padding: "5px 0", color: "#1e293b" }}>{loan.interest_rate}% p.a.</td>
                </tr>
                <tr>
                  <td style={{ padding: "5px 0", fontWeight: "600", color: "#475569" }}>Tenure:</td>
                  <td style={{ padding: "5px 0", color: "#1e293b" }}>{loan.tenure_months} months</td>
                </tr>
                <tr>
                  <td style={{ padding: "5px 0", fontWeight: "600", color: "#475569" }}>Start Date:</td>
                  <td style={{ padding: "5px 0", color: "#1e293b" }}>{formatDate(loan.start_date)}</td>
                </tr>
                <tr>
                  <td style={{ padding: "5px 0", fontWeight: "600", color: "#475569" }}>EMI Amount:</td>
                  <td style={{ padding: "5px 0", color: "#1e293b", fontWeight: "bold" }}>{formatCurrency(loan.installment_amount)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Loan Summary */}
      <div style={{
        background: "#eff6ff",
        border: "2px solid #3b82f6",
        borderRadius: "8px",
        padding: "15px",
        marginBottom: "20px"
      }}>
        <h3 style={{
          fontSize: "13px",
          fontWeight: "bold",
          color: "#1e293b",
          margin: "0 0 12px 0"
        }}>LOAN SUMMARY</h3>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "15px",
          fontSize: "12px"
        }}>
          <div>
            <p style={{ color: "#64748b", margin: "0 0 5px 0" }}>Principal Amount</p>
            <p style={{ fontWeight: "bold", color: "#1e293b", fontSize: "14px", margin: 0 }}>{formatCurrency(loan.principal_amount)}</p>
          </div>
          <div>
            <p style={{ color: "#64748b", margin: "0 0 5px 0" }}>Total Interest</p>
            <p style={{ fontWeight: "bold", color: "#1e293b", fontSize: "14px", margin: 0 }}>{formatCurrency(loan.total_interest)}</p>
          </div>
          <div>
            <p style={{ color: "#64748b", margin: "0 0 5px 0" }}>Processing + Insurance</p>
            <p style={{ fontWeight: "bold", color: "#1e293b", fontSize: "14px", margin: 0 }}>{formatCurrency(loan.processing_fee + loan.insurance_fee)}</p>
          </div>
          <div>
            <p style={{ color: "#64748b", margin: "0 0 5px 0" }}>Total Payable</p>
            <p style={{ fontWeight: "bold", color: "#2563eb", fontSize: "14px", margin: 0 }}>{formatCurrency(summary.totalPayable)}</p>
          </div>
        </div>
      </div>

      {/* Payment Summary */}
      <div style={{
        background: "#f0fdf4",
        border: "2px solid #22c55e",
        borderRadius: "8px",
        padding: "15px",
        marginBottom: "20px"
      }}>
        <h3 style={{
          fontSize: "13px",
          fontWeight: "bold",
          color: "#1e293b",
          margin: "0 0 12px 0"
        }}>PAYMENT SUMMARY</h3>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "15px",
          fontSize: "12px"
        }}>
          <div>
            <p style={{ color: "#64748b", margin: "0 0 5px 0" }}>Total Paid</p>
            <p style={{ fontWeight: "bold", color: "#16a34a", fontSize: "14px", margin: 0 }}>{formatCurrency(summary.totalPaid)}</p>
          </div>
          <div>
            <p style={{ color: "#64748b", margin: "0 0 5px 0" }}>Principal Paid</p>
            <p style={{ fontWeight: "bold", color: "#1e293b", fontSize: "14px", margin: 0 }}>{formatCurrency(summary.principalPaid)}</p>
          </div>
          <div>
            <p style={{ color: "#64748b", margin: "0 0 5px 0" }}>Interest Paid</p>
            <p style={{ fontWeight: "bold", color: "#1e293b", fontSize: "14px", margin: 0 }}>{formatCurrency(summary.interestPaid)}</p>
          </div>
          <div>
            <p style={{ color: "#64748b", margin: "0 0 5px 0" }}>Penalties Paid</p>
            <p style={{ fontWeight: "bold", color: "#1e293b", fontSize: "14px", margin: 0 }}>{formatCurrency(summary.penaltiesPaid)}</p>
          </div>
        </div>
      </div>

      {/* Outstanding Summary */}
      <div style={{
        background: "#fef2f2",
        border: "2px solid #ef4444",
        borderRadius: "8px",
        padding: "15px",
        marginBottom: "25px"
      }}>
        <h3 style={{
          fontSize: "13px",
          fontWeight: "bold",
          color: "#1e293b",
          margin: "0 0 12px 0"
        }}>OUTSTANDING SUMMARY</h3>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "15px",
          fontSize: "12px"
        }}>
          <div>
            <p style={{ color: "#64748b", margin: "0 0 5px 0" }}>Total Outstanding</p>
            <p style={{ fontWeight: "bold", color: "#dc2626", fontSize: "14px", margin: 0 }}>{formatCurrency(summary.totalOutstanding)}</p>
          </div>
          <div>
            <p style={{ color: "#64748b", margin: "0 0 5px 0" }}>Principal Outstanding</p>
            <p style={{ fontWeight: "bold", color: "#1e293b", fontSize: "14px", margin: 0 }}>{formatCurrency(summary.outstandingPrincipal)}</p>
          </div>
          <div>
            <p style={{ color: "#64748b", margin: "0 0 5px 0" }}>Interest Outstanding</p>
            <p style={{ fontWeight: "bold", color: "#1e293b", fontSize: "14px", margin: 0 }}>{formatCurrency(summary.outstandingInterest)}</p>
          </div>
          <div>
            <p style={{ color: "#64748b", margin: "0 0 5px 0" }}>Fees Outstanding</p>
            <p style={{ fontWeight: "bold", color: "#1e293b", fontSize: "14px", margin: 0 }}>{formatCurrency(summary.outstandingFees)}</p>
          </div>
          <div>
            <p style={{ color: "#64748b", margin: "0 0 5px 0" }}>Penalties Outstanding</p>
            <p style={{ fontWeight: "bold", color: "#1e293b", fontSize: "14px", margin: 0 }}>{formatCurrency(summary.outstandingPenalties)}</p>
          </div>
        </div>
      </div>

      {/* Ledger Table */}
      <div style={{ marginBottom: "25px" }}>
        <h3 style={{
          fontSize: "13px",
          fontWeight: "bold",
          color: "#1e293b",
          background: "#f1f5f9",
          padding: "10px",
          margin: "0 0 10px 0",
          borderLeft: "4px solid #3b82f6"
        }}>TRANSACTION HISTORY</h3>
        <div style={{ overflowX: "auto" }}>
          <table style={{
            width: "100%",
            fontSize: "10px",
            borderCollapse: "collapse",
            border: "1px solid #cbd5e1"
          }}>
            <thead>
              <tr style={{ background: "#1e293b", color: "white" }}>
                <th style={{ padding: "10px 8px", textAlign: "left", borderRight: "1px solid #475569" }}>Date</th>
                <th style={{ padding: "10px 8px", textAlign: "left", borderRight: "1px solid #475569" }}>Description</th>
                <th style={{ padding: "10px 8px", textAlign: "right", borderRight: "1px solid #475569" }}>Debit</th>
                <th style={{ padding: "10px 8px", textAlign: "right", borderRight: "1px solid #475569" }}>Credit</th>
                <th style={{ padding: "10px 8px", textAlign: "right", borderRight: "1px solid #475569" }}>Principal</th>
                <th style={{ padding: "10px 8px", textAlign: "right", borderRight: "1px solid #475569" }}>Interest</th>
                <th style={{ padding: "10px 8px", textAlign: "right", borderRight: "1px solid #475569" }}>Penalty</th>
                <th style={{ padding: "10px 8px", textAlign: "right" }}>Balance</th>
              </tr>
            </thead>
            <tbody>
              {ledger.map((entry, index) => (
                <tr key={index} style={{
                  background: index % 2 === 0 ? "white" : "#f8fafc",
                  borderBottom: "1px solid #e2e8f0"
                }}>
                  <td style={{ padding: "8px", borderRight: "1px solid #e2e8f0" }}>{formatDate(entry.date)}</td>
                  <td style={{ padding: "8px", borderRight: "1px solid #e2e8f0" }}>{entry.description}</td>
                  <td style={{ padding: "8px", textAlign: "right", borderRight: "1px solid #e2e8f0" }}>
                    {entry.debit > 0 ? formatCurrency(entry.debit) : '-'}
                  </td>
                  <td style={{ padding: "8px", textAlign: "right", color: "#16a34a", fontWeight: "600", borderRight: "1px solid #e2e8f0" }}>
                    {entry.credit > 0 ? formatCurrency(entry.credit) : '-'}
                  </td>
                  <td style={{ padding: "8px", textAlign: "right", borderRight: "1px solid #e2e8f0" }}>
                    {entry.principal > 0 ? formatCurrency(entry.principal) : '-'}
                  </td>
                  <td style={{ padding: "8px", textAlign: "right", borderRight: "1px solid #e2e8f0" }}>
                    {entry.interest > 0 ? formatCurrency(entry.interest) : '-'}
                  </td>
                  <td style={{ padding: "8px", textAlign: "right", borderRight: "1px solid #e2e8f0" }}>
                    {entry.penalty > 0 ? formatCurrency(entry.penalty) : '-'}
                  </td>
                  <td style={{ padding: "8px", textAlign: "right", fontWeight: "600" }}>
                    {formatCurrency(entry.balance)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr style={{ background: "#1e293b", color: "white", fontWeight: "bold" }}>
                <td colSpan={2} style={{ padding: "10px 8px", borderRight: "1px solid #475569" }}>TOTAL</td>
                <td style={{ padding: "10px 8px", textAlign: "right", borderRight: "1px solid #475569" }}>
                  {formatCurrency(ledger.reduce((sum, e) => sum + e.debit, 0))}
                </td>
                <td style={{ padding: "10px 8px", textAlign: "right", borderRight: "1px solid #475569" }}>
                  {formatCurrency(ledger.reduce((sum, e) => sum + e.credit, 0))}
                </td>
                <td style={{ padding: "10px 8px", textAlign: "right", borderRight: "1px solid #475569" }}>
                  {formatCurrency(summary.principalPaid)}
                </td>
                <td style={{ padding: "10px 8px", textAlign: "right", borderRight: "1px solid #475569" }}>
                  {formatCurrency(summary.interestPaid)}
                </td>
                <td style={{ padding: "10px 8px", textAlign: "right", borderRight: "1px solid #475569" }}>
                  {formatCurrency(summary.penaltiesPaid)}
                </td>
                <td style={{ padding: "10px 8px", textAlign: "right" }}>
                  {formatCurrency(summary.totalOutstanding)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        borderTop: "3px solid #1e40af",
        paddingTop: "15px",
        marginTop: "30px"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div style={{ fontSize: "10px", color: "#64748b" }}>
            <p style={{ margin: "0 0 3px 0" }}>This is a computer-generated statement.</p>
            <p style={{ margin: 0 }}>For any discrepancies, please contact us immediately.</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ fontSize: "10px", color: "#64748b", margin: "0 0 30px 0" }}>Authorized Signature</p>
            <div style={{ borderTop: "1px solid #94a3b8", width: "200px" }}></div>
          </div>
        </div>
        <div style={{ textAlign: "center", marginTop: "20px", fontSize: "10px", color: "#94a3b8" }}>
          <p style={{ margin: 0 }}>Designed & Developed by <strong>{settings?.company_name || 'Vais Engineering Pvt Ltd'}</strong></p>
          <p style={{ margin: 0 }}>{settings?.website || 'www.mitelectroworld.com'}</p>
        </div>
      </div>
    </div>
  );
}

