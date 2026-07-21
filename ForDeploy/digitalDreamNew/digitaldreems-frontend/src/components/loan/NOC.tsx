/**
 * NOC (No Objection Certificate) Component
 * Generated when loan is fully paid
 */

import { Building2, CheckCircle } from "lucide-react";
import type { Loan, Customer, Product } from "@/types/types";

interface NOCProps {
  loan: Loan;
  customer: Customer;
  product?: Product | null;
  completionDate?: string;
}

export function NOC({ loan, customer, product, completionDate }: NOCProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const nocDate = new Date().toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Use provided completionDate, or loan's closed_date, or current date
  const actualCompletionDate = completionDate || loan.closed_date || new Date().toISOString();

  return (
    <div className="bg-white text-black" style={{ 
      width: "210mm",
      minHeight: "297mm",
      margin: "0 auto",
      padding: "20mm",
      fontFamily: "Arial, sans-serif",
      fontSize: "12pt",
      lineHeight: "1.6",
      boxSizing: "border-box"
    }}>
      {/* Header */}
      <div style={{ 
        borderBottom: "3px solid #22c55e", 
        paddingBottom: "15px", 
        marginBottom: "25px",
        textAlign: "center"
      }}>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "15px", marginBottom: "10px" }}>
          <div style={{ 
            height: "70px", 
            width: "70px", 
            borderRadius: "50%", 
            background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <CheckCircle style={{ height: "40px", width: "40px", color: "white" }} />
          </div>
        </div>
        <h1 style={{ 
          fontSize: "28px", 
          fontWeight: "bold", 
          color: "#1e293b",
          margin: "0 0 5px 0"
        }}>Digital Dreams</h1>
        <p style={{ 
          fontSize: "13px", 
          color: "#64748b",
          margin: 0
        }}>Loan Management System</p>
      </div>

      {/* NOC Title */}
      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <h2 style={{ 
          fontSize: "24px", 
          fontWeight: "bold", 
          color: "#16a34a",
          margin: "0 0 10px 0",
          textTransform: "uppercase",
          letterSpacing: "2px"
        }}>NO OBJECTION CERTIFICATE</h2>
        <p style={{ fontSize: "12px", color: "#64748b", margin: 0 }}>
          Certificate Date: {nocDate}
        </p>
        <p style={{ fontSize: "12px", color: "#64748b", margin: "5px 0 0 0" }}>
          Certificate No: NOC-{loan.loan_id}
        </p>
      </div>

      {/* Success Badge */}
      <div style={{ 
        background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)", 
        border: "3px solid #22c55e", 
        borderRadius: "12px", 
        padding: "25px", 
        marginBottom: "30px",
        textAlign: "center"
      }}>
        <div style={{ 
          display: "inline-block",
          background: "#22c55e",
          color: "white",
          padding: "10px 30px",
          borderRadius: "50px",
          fontSize: "16px",
          fontWeight: "bold",
          marginBottom: "15px"
        }}>
          ✓ LOAN FULLY PAID
        </div>
        <p style={{ fontSize: "14px", color: "#166534", margin: 0, fontWeight: "600" }}>
          All dues have been cleared successfully
        </p>
      </div>

      {/* NOC Content */}
      <div style={{ marginBottom: "30px", textAlign: "justify", fontSize: "13px" }}>
        <p style={{ marginBottom: "20px", lineHeight: "1.8" }}>
          This is to certify that <strong>{customer.full_name}</strong> (Customer ID: <strong>{customer.customer_code}</strong>) 
          has successfully repaid the loan amount in full along with all applicable interest and charges.
        </p>

        {/* Loan Details Box */}
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
                <td style={{ padding: "8px 0", fontWeight: "600", color: "#475569", width: "40%" }}>Loan ID:</td>
                <td style={{ padding: "8px 0", color: "#1e293b" }}>{loan.loan_id}</td>
              </tr>
              <tr>
                <td style={{ padding: "8px 0", fontWeight: "600", color: "#475569" }}>Loan Start Date:</td>
                <td style={{ padding: "8px 0", color: "#1e293b" }}>{formatDate(loan.start_date)}</td>
              </tr>
              <tr>
                <td style={{ padding: "8px 0", fontWeight: "600", color: "#475569" }}>Loan Completion Date:</td>
                <td style={{ padding: "8px 0", color: "#1e293b" }}>{formatDate(actualCompletionDate)}</td>
              </tr>
              <tr>
                <td style={{ padding: "8px 0", fontWeight: "600", color: "#475569" }}>Loan Type:</td>
                <td style={{ padding: "8px 0", color: "#1e293b", textTransform: "uppercase" }}>{loan.loan_type}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Customer Details Box */}
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
          }}>CUSTOMER DETAILS</h3>
          
          <table style={{ width: "100%", fontSize: "12px", borderCollapse: "collapse" }}>
            <tbody>
              <tr>
                <td style={{ padding: "8px 0", fontWeight: "600", color: "#475569", width: "40%" }}>Name:</td>
                <td style={{ padding: "8px 0", color: "#1e293b" }}>{customer.full_name}</td>
              </tr>
              <tr>
                <td style={{ padding: "8px 0", fontWeight: "600", color: "#475569" }}>Customer ID:</td>
                <td style={{ padding: "8px 0", color: "#1e293b" }}>{customer.customer_code}</td>
              </tr>
              <tr>
                <td style={{ padding: "8px 0", fontWeight: "600", color: "#475569" }}>Mobile:</td>
                <td style={{ padding: "8px 0", color: "#1e293b" }}>{customer.mobile_primary}</td>
              </tr>
              {customer.email && (
                <tr>
                  <td style={{ padding: "8px 0", fontWeight: "600", color: "#475569" }}>Email:</td>
                  <td style={{ padding: "8px 0", color: "#1e293b" }}>{customer.email}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Product Details (if applicable) */}
        {product && (
          <div style={{ 
            background: "#fef3c7", 
            border: "2px solid #f59e0b", 
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
            }}>PRODUCT/ASSET RELEASED</h3>
            
            <table style={{ width: "100%", fontSize: "12px", borderCollapse: "collapse" }}>
              <tbody>
                <tr>
                  <td style={{ padding: "8px 0", fontWeight: "600", color: "#475569", width: "40%" }}>Product:</td>
                  <td style={{ padding: "8px 0", color: "#1e293b" }}>{product.category}</td>
                </tr>
                <tr>
                  <td style={{ padding: "8px 0", fontWeight: "600", color: "#475569" }}>Brand & Model:</td>
                  <td style={{ padding: "8px 0", color: "#1e293b" }}>{product.brand} {product.model}</td>
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
              </tbody>
            </table>
          </div>
        )}

        {/* NOC Statement */}
        <div style={{ 
          background: "#f0fdf4", 
          border: "3px solid #22c55e", 
          borderRadius: "8px", 
          padding: "20px", 
          marginBottom: "25px",
          textAlign: "center"
        }}>
          <p style={{ fontSize: "14px", fontWeight: "bold", color: "#166534", margin: "0 0 15px 0", lineHeight: "1.8" }}>
            We hereby confirm that all dues related to the above-mentioned loan have been cleared in full. 
            We have no objection to the customer and hold no further claims against them regarding this loan.
          </p>
          <p style={{ fontSize: "13px", color: "#166534", margin: 0, lineHeight: "1.8" }}>
            {product ? `The ${product.category} (${product.brand} ${product.model}) with serial/IMEI number ${product.serial_number || product.imei_1 || 'as mentioned above'} is hereby released from our custody and is now the sole property of the customer.` : 'The customer is free from all obligations related to this loan.'}
          </p>
        </div>

        <p style={{ marginBottom: "15px", lineHeight: "1.8" }}>
          This certificate is issued at the request of the customer and can be used for any legal or official purposes.
        </p>

        <p style={{ marginBottom: "0", lineHeight: "1.8" }}>
          We wish {customer.full_name} all the best for their future endeavors.
        </p>
      </div>

      {/* Signature */}
      <div style={{ marginTop: "60px" }}>
        <div style={{ textAlign: "right" }}>
          <p style={{ fontSize: "12px", fontWeight: "600", marginBottom: "60px" }}>FOR Digital Dreams</p>
          <div style={{ borderTop: "2px solid #1e293b", width: "250px", marginLeft: "auto", paddingTop: "10px" }}>
            <p style={{ fontSize: "12px", margin: "5px 0", fontWeight: "bold" }}>Authorized Signatory</p>
            <p style={{ fontSize: "11px", margin: "5px 0", color: "#64748b" }}>Date: {nocDate}</p>
            <p style={{ fontSize: "11px", margin: "5px 0", color: "#64748b" }}>Place: _______________</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ 
        borderTop: "3px solid #22c55e", 
        paddingTop: "15px", 
        marginTop: "50px",
        textAlign: "center"
      }}>
        <p style={{ fontSize: "10px", color: "#16a34a", margin: "0 0 5px 0", fontWeight: "600" }}>
          ✓ This is a computer-generated certificate and is valid without signature.
        </p>
        <p style={{ fontSize: "10px", color: "#94a3b8", margin: 0 }}>
          Designed & Developed by Vais Engineering Pvt Ltd
        </p>
      </div>
    </div>
  );
}

