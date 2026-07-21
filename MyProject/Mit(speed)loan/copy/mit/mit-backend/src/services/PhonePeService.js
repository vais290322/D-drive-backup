/**
 * PhonePe Payment Gateway Service - Production Ready
 * Handles:
 * - OAuth token generation (with caching)
 * - Static QR Code creation for EMI collections
 * - Payment status verification
 * - Webhook signature validation (for security)
 * - Error handling and comprehensive logging
 */

/**
 * PhonePe Payment Gateway Service - Production Ready
 * Handles:
 * - OAuth token generation (with caching)
 * - Static QR Code creation for EMI collections
 * - Payment status verification
 * - Webhook signature validation (for security)
 * - Error handling and comprehensive logging
 */

const axios = require('axios');
const crypto = require('crypto');

const Loan = require("../models/Loan");
const EmiSchedule = require("../models/EmiSchedule");

class PhonePeService {
  constructor() {
    this.merchantId = process.env.PHONEPE_MERCHANT_ID;
    this.clientId = process.env.PHONEPE_CLIENT_ID;
    this.clientSecret = process.env.PHONEPE_CLIENT_SECRET;
    this.saltKey = process.env.PHONEPE_SALT_KEY;
    this.saltIndex = process.env.PHONEPE_SALT_INDEX || '1';

    // Use sandbox or production
    this.isSandbox = process.env.PHONEPE_ENV === 'sandbox';
    this.baseUrl = this.isSandbox
      ? 'https://api-preprod.phonepe.com'
      : 'https://api.phonepe.com';

    this.accessToken = null;
    this.tokenExpiry = null;
  }

  /**
   * ✅ GET ACCESS TOKEN (OAuth) - WITH CACHING
   * Token is cached and automatically refreshed when expired
   * Required for all PhonePe API calls
   */
  async getAccessToken(forceRefresh = false) {
    try {
      // Return cached token if still valid
      if (this.accessToken && this.tokenExpiry && Date.now() < this.tokenExpiry && !forceRefresh) {
        console.log('✅ Using cached PhonePe OAuth token');
        return this.accessToken;
      }

      const url = `${this.baseUrl}/apis/identity-manager/v1/oauth/token`;

      // ✅ IMPORTANT: PhonePe OAuth requires form-urlencoded, NOT JSON
      const params = new URLSearchParams({
        client_id: this.clientId,
        client_secret: this.clientSecret,
        client_version: '1',
        grant_type: 'client_credentials'
      });

      console.log('🔐 Requesting PhonePe OAuth token from:', url);

      const response = await axios.post(url, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json'
        },
        timeout: 10000
      });

      this.accessToken = response.data.access_token;
      // Token expires in expires_in seconds, refresh at 80% of that time
      const expiresIn = response.data.expires_in || 1800; // Default 30 mins
      this.tokenExpiry = Date.now() + (expiresIn * 0.8 * 1000);

      console.log('✅ PhonePe OAuth token generated successfully');
      return this.accessToken;

    } catch (error) {
      console.error('❌ PhonePe OAuth Error:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      throw new Error(`PhonePe OAuth failed: ${error.response?.data?.message || error.message}`);
    }
  }

  /**
   * ✅ CREATE STATIC QR CODE FOR EMI COLLECTION
   * - Generates unique static QR for a specific loan
   * - Customer can scan with ANY UPI app
   * - Fixed EMI amount is embedded
   * - QR works multiple times until loan is completed
   * - merchantTransactionId = loanId (for linking payments to loans)
   *
   * @param {String} loanId - MongoDB loan _id
   * @param {String} loanCode - Human-readable loan identifier
   * @param {Number} emiAmount - Fixed EMI amount in rupees
   * @returns {Object} QR code details
   */
  async createStaticQR(loanId, loanCode, emiAmount) {
    try {
      const accessToken = await this.getAccessToken();

      // CRITICAL: merchantTransactionId MUST be unique per loan
      // This links the payment back to the loan
      const merchantTransactionId = loanId.toString();

      const url = `${this.baseUrl}/apis/hermes/qr/create`;

      const payload = {
        merchantId: this.merchantId,
        merchantTransactionId: merchantTransactionId,
        merchantUserId: `loan_${loanCode}`,
        amount: Math.round(emiAmount * 100), // Convert to paise (1 rupee = 100 paise)
        description: `EMI Payment - Loan ${loanCode}`,
        shortUrl: true,
        enableOtherPaymentMethods: true // Allow PhonePe, Google Pay, Paytm, etc.
      };

      console.log(`📱 Creating Static QR for Loan: ${loanCode}`, {
        merchantTransactionId,
        amount: emiAmount
      });

      const response = await axios.post(url, payload, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'X-VERIFY': this._generateChecksum(JSON.stringify(payload), merchantTransactionId)
        },
        timeout: 10000
      });

      if (!response.data.success) {
        throw new Error(response.data.message || 'QR creation failed');
      }

      console.log(`✅ Static QR created for Loan: ${loanCode}`, {
        qrId: response.data.data.qrId
      });

      return {
        qrId: response.data.data.qrId,
        qrString: response.data.data.qrString, // Raw UPI string for custom QR generation
        url: response.data.data.url,
        merchantTransactionId: merchantTransactionId,
        imageUrl: response.data.data.imageUrl || null
      };

    } catch (error) {
      console.error(`❌ PhonePe QR Creation Error for Loan: ${loanCode}`, {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      throw new Error(`Failed to create QR: ${error.message}`);
    }
  }

  /**
   * ✅ CHECK PAYMENT STATUS
   * Verifies if payment was successful
   * Call this after webhook is received to confirm payment
   *
   * @param {String} merchantTransactionId - Transaction ID (usually loan ID)
   * @returns {Object} Payment status details
   */
  async checkPaymentStatus(merchantTransactionId) {
    try {
      const accessToken = await this.getAccessToken();

      const url = `${this.baseUrl}/apis/hermes/status/${this.merchantId}/${merchantTransactionId}`;

      console.log(`🔍 Checking payment status for: ${merchantTransactionId}`);

      const response = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'X-VERIFY': this._generateChecksumForStatus(merchantTransactionId)
        },
        timeout: 10000
      });

      const paymentStatus = response.data.data?.status || 'UNKNOWN';
      console.log(`✅ Payment status: ${paymentStatus}`, {
        transactionId: merchantTransactionId,
        utr: response.data.data?.utr
      });

      return {
        status: paymentStatus, // SUCCESS, PENDING, FAILED
        transactionId: response.data.data?.transactionId,
        amount: response.data.data?.amount ? response.data.data.amount / 100 : null, // Convert paise to rupees
        timestamp: response.data.data?.timestamp,
        responseCode: response.data.data?.responseCode,
        phonepeTransactionId: response.data.data?.transactionId,
        utr: response.data.data?.utr, // Unique Transaction Reference
        merchantTransactionId: merchantTransactionId
      };

    } catch (error) {
      // 404 means transaction not found (payment hasn't been made yet)
      if (error.response?.status === 404) {
        console.log(`⚠️ Payment not found for: ${merchantTransactionId}`);
        return {
          status: 'NOT_FOUND',
          transactionId: merchantTransactionId
        };
      }

      console.error(`❌ PhonePe Status Check Error:`, {
        transactionId: merchantTransactionId,
        status: error.response?.status,
        message: error.message
      });

      throw new Error(`Failed to check status: ${error.message}`);
    }
  }

  /**
   * ✅ VERIFY WEBHOOK SIGNATURE
   * CRITICAL FOR SECURITY - Ensures webhook is genuinely from PhonePe
   * PhonePe signs all webhooks with a checksum
   *
   * @param {Object} webhookPayload - Complete webhook body
   * @param {String} xVerifyHeader - X-VERIFY header value from PhonePe
   * @returns {Boolean} True if signature is valid
   */
  verifyWebhookSignature(webhookPayload, xVerifyHeader) {
    try {
      const payload = typeof webhookPayload === 'string'
        ? webhookPayload
        : JSON.stringify(webhookPayload);

      // Calculate checksum: SHA256(payload + saltKey) + ### + saltIndex
      const checksum = this._generateChecksum(payload, null);

      const isValid = checksum === xVerifyHeader;

      console.log(`🔐 Webhook signature verification: ${isValid ? '✅ VALID' : '❌ INVALID'}`);

      return isValid;

    } catch (error) {
      console.error('❌ Webhook signature verification error:', error.message);
      return false;
    }
  }

  /**
   * ✅ PARSE WEBHOOK DATA
   * Extracts relevant payment information from PhonePe webhook
   *
   * @param {Object} webhookData - Data field from webhook
   * @returns {Object} Parsed payment details
   */
  parseWebhookData(webhookData) {
    try {
      return {
        merchantTransactionId: webhookData?.merchantTransactionId,
        transactionId: webhookData?.transactionId,
        amount: webhookData?.amount ? webhookData.amount / 100 : 0, // Convert paise to rupees
        status: webhookData?.status, // SUCCESS, PENDING, FAILED
        responseCode: webhookData?.responseCode,
        responseMessage: webhookData?.responseMessage,
        timestamp: webhookData?.timestamp,
        utr: webhookData?.utr, // Unique Transaction Reference
        methodType: webhookData?.methodType // UPI, Card, etc.
      };
    } catch (error) {
      console.error('❌ Error parsing webhook data:', error.message);
      throw error;
    }
  }

  /**
   * ✅ GENERATE CHECKSUM (INTERNAL)
   * Used for signing API requests and validating webhooks
   * Formula: SHA256(payload + saltKey [+ merchantTransactionId]) + ### + saltIndex
   */
  _generateChecksum(payload, merchantTransactionId = null) {
    try {
      let data;
      if (merchantTransactionId) {
        data = payload + this.saltKey + merchantTransactionId;
      } else {
        data = payload + this.saltKey;
      }

      const checksum = crypto
        .createHash('sha256')
        .update(data)
        .digest('hex') + '###' + this.saltIndex;

      return checksum;

    } catch (error) {
      console.error('❌ Checksum generation error:', error.message);
      throw error;
    }
  }

  /**
   * ✅ GENERATE CHECKSUM FOR STATUS CHECK (INTERNAL)
   */
  _generateChecksumForStatus(merchantTransactionId) {
    try {
      const path = `/apis/hermes/status/${this.merchantId}/${merchantTransactionId}`;
      const data = path + this.saltKey;

      const checksum = crypto
        .createHash('sha256')
        .update(data)
        .digest('hex') + '###' + this.saltIndex;

      return checksum;

    } catch (error) {
      console.error('❌ Status checksum generation error:', error.message);
      throw error;
    }
  }

  /**
   * ✅ VALIDATE CONFIGURATION
   * Check if all required environment variables are set
   */
  validateConfig() {
    const required = [
      'PHONEPE_MERCHANT_ID',
      'PHONEPE_CLIENT_ID',
      'PHONEPE_CLIENT_SECRET',
      'PHONEPE_SALT_KEY'
    ];

    const missing = required.filter(key => !process.env[key]);

    if (missing.length > 0) {
      console.error('❌ Missing PhonePe configuration:', missing);
      throw new Error(`Missing PhonePe configuration: ${missing.join(', ')}`);
    }

    console.log('✅ PhonePe configuration validated');
    return true;
  }

  /**
   * ✅ INITIATE DYNAMIC QR (ALIAS - FOR FRONTEND COMPATIBILITY)
   * Frontend calls this method to display/regenerate QR
   * Wrapper around createStaticQR for backward compatibility
   *
   * @param {String} loanId - MongoDB loan ID
   * @returns {Object} QR code data
   */
  async initiateDynamicQR(loanId) {
    try {
      const loan = await Loan.findById(loanId).populate('customer_id');
      if (!loan) {
        throw new Error('Loan not found');
      }

      // Check if QR already exists
      if (loan.phonepe_qr_data && loan.phonepe_qr_data.qrId) {
        console.log(`✅ Returning existing PhonePe QR for loan: ${loan.loan_code}`);
        return {
          success: true,
          data: loan.phonepe_qr_data,
          message: 'QR code already exists'
        };
      }

      // Generate new QR
      console.log(`📱 Generating new PhonePe QR for loan: ${loan.loan_code}`);

      const qrData = await this.createStaticQR(
        loanId.toString(),
        loan.loan_code,
        loan.installment_amount
      );

      loan.phonepe_qr_data = qrData;
      await loan.save();

      return {
        success: true,
        data: qrData,
        message: 'QR code generated successfully'
      };

    } catch (error) {
      console.error(`❌ Error initiating QR for loan ${loanId}:`, error.message);

      // Fallback to mock for development
      if (process.env.PHONEPE_ENV === 'development' || process.env.NODE_ENV === 'development') {
        const loan = await Loan.findById(loanId);
        if (loan) {
          const mockQR = await this.generateMockQR(loanId, loan.loan_code, loan.installment_amount);
          loan.phonepe_qr_data = mockQR;
          await loan.save();

          return {
            success: true,
            data: mockQR,
            message: 'QR code generated (mock mode - development only)'
          };
        }
      }

      throw error;
    }
  }

  /**
   * ✅ FOR DEBUGGING ONLY
   * Generate mock QR response for testing
   * Uses qrcode library to generate proper QR image
   */
  async generateMockQR(loanId, loanCode, emiAmount) {
    const QRCode = require('qrcode');

    try {
      const qrString = `upi://pay?pa=merchant@upi&pn=Mit%20Electro&am=${emiAmount}&tn=Loan%20${loanCode}`;

      // Generate QR code as base64 data URL
      const imageUrl = await QRCode.toDataURL(qrString, {
        errorCorrectionLevel: 'H',
        type: 'image/png',
        width: 300,
        margin: 1,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });

      return {
        qrId: `mock_qr_${loanId}`,
        qrString: qrString,
        url: `https://qr.phonepe.com/${loanId}`,
        merchantTransactionId: loanId.toString(),
        imageUrl: imageUrl  // ✅ Base64 PNG - works reliably
      };
    } catch (error) {
      console.error('❌ Error generating mock QR:', error.message);
      // Fallback to simple placeholder
      return {
        qrId: `mock_qr_${loanId}`,
        qrString: `upi://pay?pa=merchant@upi&pn=Mit%20Electro&am=${emiAmount}&tn=Loan%20${loanCode}`,
        url: `https://qr.phonepe.com/${loanId}`,
        merchantTransactionId: loanId.toString(),
        imageUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0id2hpdGUiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1zaXplPSIyNCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkpTIFF1aWNrIFFSIChEZXYgTW9kZSk8L3RleHQ+PC9zdmc+'
      };
    }
  }
}

// Export singleton instance
module.exports = new PhonePeService();