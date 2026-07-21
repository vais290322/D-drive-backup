/**
 * Loan Agreement Component
 * Professional loan agreement document generator
 */

import { Building2 } from "lucide-react";
import type { Loan, Customer, Product, BusinessSettings } from "@/types/types";

interface LoanAgreementProps {
  loan: Loan;
  customer: Customer;
  product?: Product | null;
  settings?: BusinessSettings | null;
}

export function LoanAgreement({ loan, customer, product, settings }: LoanAgreementProps) {
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

  const agreementDate = new Date().toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="bg-white text-black" style={{
      width: "210mm",
      minHeight: "297mm",
      margin: "0 auto",
      padding: "20mm",
      fontFamily: "Arial, sans-serif",
      fontSize: "11pt",
      lineHeight: "1.6",
      boxSizing: "border-box"
    }}>
      {/* Header */}
      <div style={{
        borderBottom: "3px solid #1e40af",
        paddingBottom: "15px",
        marginBottom: "25px",
        textAlign: "center"
      }}>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "15px", marginBottom: "10px" }}>
          <div style={{
            height: "80px",
            width: "auto",
            minWidth: "80px",
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
                background: "linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>
                <Building2 style={{ height: "32px", width: "32px", color: "white" }} />
              </div>
            )}
          </div>
        </div>
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
      </div>

      {/* Agreement Title */}
      <div style={{ textAlign: "center", marginBottom: "30px" }}>
        <h2 style={{
          fontSize: "22px",
          fontWeight: "bold",
          color: "#1e293b",
          margin: "0 0 10px 0",
          textTransform: "uppercase",
          letterSpacing: "1px"
        }}>LOAN AGREEMENT</h2>
        <p style={{ fontSize: "12px", color: "#64748b", margin: 0 }}>
          Agreement Date: {agreementDate}
        </p>
        <p style={{ fontSize: "12px", color: "#64748b", margin: "5px 0 0 0" }}>
          Loan ID: {loan.loan_id}
        </p>
      </div>

      {/* Agreement Body */}
      <div style={{ marginBottom: "25px", textAlign: "justify" }}>
        <p style={{ marginBottom: "15px" }}>
          This Loan Agreement ("Agreement") is entered into on <strong>{agreementDate}</strong> between:
        </p>

        {/* Lender Details */}
        <div style={{ marginBottom: "20px", paddingLeft: "20px" }}>
          <p style={{ fontWeight: "bold", marginBottom: "10px" }}>LENDER:</p>
          <p style={{ marginLeft: "20px", marginBottom: "5px" }}>
            <strong>{settings?.company_name || 'Mit Electro World'}</strong><br />
            {settings?.tagline || 'Loan Management System'}<br />
            {settings?.address_line1 && <>{settings.address_line1}, <br /></>}
            {settings?.city && <>{settings.city}</>}
            {(settings?.address_line1 || settings?.city) ? <br /> : null}
            (Hereinafter referred to as "the Lender")
          </p>
        </div>

        {/* Borrower Details */}
        <div style={{ marginBottom: "20px", paddingLeft: "20px" }}>
          <p style={{ fontWeight: "bold", marginBottom: "10px" }}>BORROWER:</p>
          <div style={{ display: "flex", gap: "20px", alignItems: "flex-start" }}>
            {/* Customer Photo */}
            {customer?.photo_url && (
              <div style={{
                flexShrink: 0,
                width: "80px",
                height: "80px",
                border: "2px solid #cbd5e1",
                borderRadius: "8px",
                overflow: "hidden",
                background: "#f1f5f9"
              }}>
                <img
                  src={customer.photo_url}
                  alt={customer.full_name || 'Customer'}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover"
                  }}
                />
              </div>
            )}

            {/* Customer Details */}
            <p style={{ marginLeft: "20px", marginBottom: "5px", flex: 1 }}>
              <strong>{customer?.full_name || 'Unknown Customer'}</strong><br />
              Customer ID: {customer?.customer_code || 'N/A'}<br />
              Mobile: {customer?.mobile_primary || 'N/A'}<br />
              {customer?.email && `Email: ${customer.email}`}<br />
              {customer?.current_address && `Address: ${customer.current_address}`}<br />
              (Hereinafter referred to as "the Borrower")
            </p>
          </div>
        </div>

        {/* Loan Details */}
        <div style={{
          background: "#f8fafc",
          border: "2px solid #cbd5e1",
          borderRadius: "8px",
          padding: "20px",
          marginBottom: "25px"
        }}>
          <h3 style={{
            fontSize: "14px",
            fontWeight: "bold",
            color: "#1e293b",
            margin: "0 0 15px 0",
            textTransform: "uppercase"
          }}>LOAN DETAILS</h3>

          <table style={{ width: "100%", fontSize: "12px", borderCollapse: "collapse" }}>
            <tbody>
              <tr>
                <td style={{ padding: "8px 0", fontWeight: "600", color: "#475569", width: "40%" }}>Loan Amount (Principal):</td>
                <td style={{ padding: "8px 0", color: "#1e293b", fontWeight: "bold" }}>{formatCurrency(loan.principal_amount)}</td>
              </tr>
              <tr>
                <td style={{ padding: "8px 0", fontWeight: "600", color: "#475569" }}>Processing Fee:</td>
                <td style={{ padding: "8px 0", color: "#1e293b" }}>{formatCurrency(loan.processing_fee)}</td>
              </tr>
              <tr>
                <td style={{ padding: "8px 0", fontWeight: "600", color: "#475569" }}>Insurance Fee:</td>
                <td style={{ padding: "8px 0", color: "#1e293b" }}>{formatCurrency(loan.insurance_fee)}</td>
              </tr>
              <tr>
                <td style={{ padding: "8px 0", fontWeight: "600", color: "#475569" }}>Interest Rate:</td>
                <td style={{ padding: "8px 0", color: "#1e293b" }}>{loan.interest_rate}% per annum</td>
              </tr>
              <tr>
                <td style={{ padding: "8px 0", fontWeight: "600", color: "#475569" }}>Interest Type:</td>
                <td style={{ padding: "8px 0", color: "#1e293b", textTransform: "capitalize" }}>{loan.interest_type}</td>
              </tr>
              <tr>
                <td style={{ padding: "8px 0", fontWeight: "600", color: "#475569" }}>Total Interest:</td>
                <td style={{ padding: "8px 0", color: "#1e293b" }}>{formatCurrency(loan.total_interest)}</td>
              </tr>
              <tr>
                <td style={{ padding: "8px 0", fontWeight: "600", color: "#475569" }}>Loan Tenure:</td>
                <td style={{ padding: "8px 0", color: "#1e293b" }}>{loan.tenure_months} months</td>
              </tr>
              <tr>
                <td style={{ padding: "8px 0", fontWeight: "600", color: "#475569" }}>EMI Amount:</td>
                <td style={{ padding: "8px 0", color: "#1e293b", fontWeight: "bold" }}>{formatCurrency(loan.installment_amount)}</td>
              </tr>
              <tr>
                <td style={{ padding: "8px 0", fontWeight: "600", color: "#475569" }}>Loan Type:</td>
                <td style={{ padding: "8px 0", color: "#1e293b", textTransform: "uppercase" }}>{loan.loan_type}</td>
              </tr>
              <tr style={{ borderTop: "2px solid #cbd5e1" }}>
                <td style={{ padding: "12px 0 8px 0", fontWeight: "bold", color: "#1e293b", fontSize: "14px" }}>Total Payable Amount:</td>
                <td style={{ padding: "12px 0 8px 0", color: "#2563eb", fontWeight: "bold", fontSize: "14px" }}>{formatCurrency(loan.total_payable)}</td>
              </tr>
              <tr>
                <td style={{ padding: "8px 0", fontWeight: "600", color: "#475569" }}>Loan Start Date:</td>
                <td style={{ padding: "8px 0", color: "#1e293b" }}>{formatDate(loan.start_date)}</td>
              </tr>
              <tr>
                <td style={{ padding: "8px 0", fontWeight: "600", color: "#475569" }}>First EMI Date:</td>
                <td style={{ padding: "8px 0", color: "#1e293b" }}>{formatDate(loan.first_emi_date)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Product Details (if applicable) */}
        {product && (
          <div style={{
            background: "#eff6ff",
            border: "2px solid #3b82f6",
            borderRadius: "8px",
            padding: "20px",
            marginBottom: "25px"
          }}>
            <h3 style={{
              fontSize: "14px",
              fontWeight: "bold",
              color: "#1e293b",
              margin: "0 0 15px 0",
              textTransform: "uppercase"
            }}>PRODUCT/ASSET DETAILS</h3>

            <table style={{ width: "100%", fontSize: "12px", borderCollapse: "collapse" }}>
              <tbody>
                <tr>
                  <td style={{ padding: "8px 0", fontWeight: "600", color: "#475569", width: "40%" }}>Product Category:</td>
                  <td style={{ padding: "8px 0", color: "#1e293b" }}>{product.category}</td>
                </tr>
                <tr>
                  <td style={{ padding: "8px 0", fontWeight: "600", color: "#475569" }}>Brand:</td>
                  <td style={{ padding: "8px 0", color: "#1e293b" }}>{product.brand}</td>
                </tr>
                <tr>
                  <td style={{ padding: "8px 0", fontWeight: "600", color: "#475569" }}>Model:</td>
                  <td style={{ padding: "8px 0", color: "#1e293b" }}>{product.model}</td>
                </tr>
                {product.serial_number && (
                  <tr>
                    <td style={{ padding: "8px 0", fontWeight: "600", color: "#475569" }}>Serial Number:</td>
                    <td style={{ padding: "8px 0", color: "#1e293b" }}>{product.serial_number}</td>
                  </tr>
                )}
                {product.imei_1 && (
                  <tr>
                    <td style={{ padding: "8px 0", fontWeight: "600", color: "#475569" }}>IMEI:</td>
                    <td style={{ padding: "8px 0", color: "#1e293b" }}>{product.imei_1}</td>
                  </tr>
                )}
                <tr>
                  <td style={{ padding: "8px 0", fontWeight: "600", color: "#475569" }}>Purchase Price:</td>
                  <td style={{ padding: "8px 0", color: "#1e293b" }}>{formatCurrency(product.purchase_price || 0)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* Terms and Conditions */}
        <div style={{ marginBottom: "25px" }}>
          <h3 style={{
            fontSize: "14px",
            fontWeight: "bold",
            color: "#1e293b",
            margin: "0 0 15px 0",
            textTransform: "uppercase"
          }}>TERMS AND CONDITIONS</h3>

          <ol style={{ paddingLeft: "20px", margin: 0 }}>
            <li style={{ marginBottom: "12px" }}>
              <strong>Loan Disbursement:</strong> The Lender agrees to disburse the loan amount of {formatCurrency(loan.principal_amount)} to the Borrower on {formatDate(loan.start_date)}.
            </li>
            <li style={{ marginBottom: "12px" }}>
              <strong>Repayment:</strong> The Borrower agrees to repay the loan in {loan.tenure_months} monthly installments of {formatCurrency(loan.installment_amount)} each, starting from {formatDate(loan.first_emi_date)}.
            </li>
            <li style={{ marginBottom: "12px" }}>
              <strong>Interest Calculation:</strong> Interest will be calculated using the {loan.interest_type} balance method at {loan.interest_rate}% per annum. For reducing balance loans, interest is calculated daily based on the outstanding principal amount.
            </li>
            <li style={{ marginBottom: "12px" }}>
              <strong>Early Payment:</strong> The Borrower may make early payments without penalty. Early payments will reduce the interest charged based on the number of days the principal is outstanding.
            </li>
            <li style={{ marginBottom: "12px" }}>
              <strong>Late Payment:</strong> Late payments will accrue additional interest based on the number of days delayed. Penalties may be applied at the Lender's discretion for specific violations (e.g., cheque bounce, ECS return).
            </li>
            <li style={{ marginBottom: "12px" }}>
              <strong>Payment Mode:</strong> Payments can be made via cash, UPI, or bank transfer as per the Lender's instructions.
            </li>
            <li style={{ marginBottom: "12px" }}>
              <strong>Default:</strong> Failure to make payments for more than 90 days will be considered a default, and the Lender may take appropriate legal action.
            </li>
            <li style={{ marginBottom: "12px" }}>
              <strong>Collateral:</strong> {product ? `The loan is secured against the ${product.category} (${product.brand} ${product.model}) with serial/IMEI number ${product.serial_number || product.imei_1 || 'as mentioned above'}.` : 'This is an unsecured loan.'}
            </li>
            <li style={{ marginBottom: "12px" }}>
              <strong>Prepayment:</strong> The Borrower may prepay the entire outstanding amount at any time without prepayment charges.
            </li>
            <li style={{ marginBottom: "12px" }}>
              <strong>Governing Law:</strong> This agreement shall be governed by the laws of India and subject to the jurisdiction of local courts.
            </li>
          </ol>
        </div>

        {/* Declaration */}
        <div style={{
          background: "#fef2f2",
          border: "2px solid #ef4444",
          borderRadius: "8px",
          padding: "15px",
          marginBottom: "25px"
        }}>
          <p style={{ margin: 0, fontSize: "12px", fontWeight: "600" }}>
            <strong>DECLARATION:</strong> I, {customer.full_name}, hereby declare that I have read and understood all the terms and conditions mentioned in this agreement. I agree to abide by all the terms and conditions and repay the loan as per the agreed schedule.
          </p>
        </div>
      </div>

      {/* Signatures */}
      <div style={{ marginTop: "50px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px" }}>
          <div>
            <p style={{ fontSize: "12px", fontWeight: "600", marginBottom: "50px" }}>BORROWER'S SIGNATURE</p>
            <div style={{ borderTop: "1px solid #94a3b8", paddingTop: "5px" }}>
              <p style={{ fontSize: "11px", margin: "5px 0 0 0" }}>Name: {customer.full_name}</p>
              <p style={{ fontSize: "11px", margin: "5px 0 0 0" }}>Date: _________________</p>
            </div>
          </div>
          <div>
            <p style={{ fontSize: "12px", fontWeight: "600", marginBottom: "50px" }}>LENDER'S SIGNATURE</p>
            <div style={{ borderTop: "1px solid #94a3b8", paddingTop: "5px" }}>
              <p style={{ fontSize: "11px", margin: "5px 0 0 0" }}>Authorized Signatory</p>
              <p style={{ fontSize: "11px", margin: "5px 0 0 0" }}>Date: _________________</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        borderTop: "3px solid #1e40af",
        paddingTop: "15px",
        marginTop: "40px",
        textAlign: "center"
      }}>
        <p style={{ fontSize: "10px", color: "#94a3b8", margin: 0 }}>
          This is a legally binding agreement. Please read carefully before signing.
        </p>
        <p style={{ fontSize: "10px", color: "#94a3b8", margin: "5px 0 0 0" }}>
          Designed & Developed by Vais Engineering Pvt Ltd
        </p>
      </div>
    </div>
  );
}

