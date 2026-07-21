import React, { useMemo } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Card, Button } from "@/shared/components/ui";
import {
  OrderProductCard,
  DeliveryAddressCard,
  PaymentBreakdownCard,
  OrderContactSection
} from "@/user/components/order";
import { AppliedCouponCard } from "@/user/components/payment";
import SuggestedItemsSection from "@/user/components/sections/SuggestedItemsSection";
import ConfirmationModal from "@/shared/components/common/ConfirmationModal";
import { useOrderDetails } from "@/shared/hooks/queries/useOrders";
import { AlertCircle, RefreshCw, Printer, Share2 } from 'lucide-react';
import BackButton from '@/shared/components/BackButton';

import { useProducts } from '@/shared/hooks/queries/useProducts';
import { useCancelOrder } from '@/shared/hooks/mutations/useCancelOrder';
import { useReturnOrder } from '@/shared/hooks/mutations/useReturnOrder';
import { useToastStore } from '@/store/useToastStore';
import { canCancelOrder, canReturnOrder } from '@/shared/utils/orderHelpers';
import useDataStore from '@/store/useDataStore';

const OrderDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  
  // Fetch order details using React Query
  const { data: orderResponse, isLoading, isError } = useOrderDetails(id);
  
  // Hooks must be called before any conditional returns
  const { mutate: cancelOrder, isPending: isCancelling } = useCancelOrder();
  const { mutate: returnOrder, isPending: isReturning } = useReturnOrder();
  const { error: toastError, success: toastSuccess } = useToastStore();

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!useDataStore.getState().isAuthenticated) {
      navigate(`/login?redirect=${encodeURIComponent(window.location.pathname)}`, { replace: true });
    }
  }, [navigate]);

  // Modal State
  const [modalConfig, setModalConfig] = React.useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
    confirmText: "",
    confirmVariant: "primary",
    icon: AlertCircle
  });
  
  // Use fetched data first, fall back to navigation state (instant load)
  const order = orderResponse?.data || location.state?.order;
  
  // Suggestions
  const { data: suggestionsData } = useProducts({ limit: 5 });
  const suggestedItems = suggestionsData?.data || [];

  // Normalize customer address (handle both customerAddress and deliveryAddress)
  const customerAddress = useMemo(() => order?.customerAddress || order?.deliveryAddress || {
    name: order?.customerName || 'N/A',
    phone: order?.phone || 'N/A',
    address: order?.address || 'N/A'
  }, [order?.customerAddress, order?.deliveryAddress, order?.customerName, order?.phone, order?.address]);

  // Use helpers for status logic
  const showCancel = canCancelOrder(order);
  const showReturn = canReturnOrder(order);

  // Local state for address (in case it changes)
  const [currentAddress, setCurrentAddress] = React.useState(customerAddress);

  // Sync if prop changes
  React.useEffect(() => {
    if (customerAddress) setCurrentAddress(customerAddress);
  }, [customerAddress]); // Sync with full address object

  // Only show loading if we have NO data to show
  if (isLoading && !order) return (
    <div className="flex justify-center items-center min-h-screen pt-20">
      <div className="w-12 h-12 border-4 border-teal-500 rounded-full border-t-transparent animate-spin"></div>
    </div>
  );
  
  // Show error only if we really couldn't find the order after trying
  if (!order && (!isLoading || isError)) return (
    <div className="flex justify-center items-center min-h-screen pt-20">
      <h2 className="text-xl font-semibold text-gray-700 font-gyrotrope">Order not found</h2>
    </div>
  );

  // Normalize payment breakdown (handle both totals and paymentBreakdown)
  const paymentBreakdown = order.paymentBreakdown || order.totals || {
    totalCartValue: 0,
    discount: 0,
    coupon: 0,
    gst: 0,
    deliveryCharges: 0,
    total: 0
  };

  const handleCancelOrder = () => {
      // If order can be returned
      if (showReturn) {
        setModalConfig({
          isOpen: true,
          title: "Request a return?",
          message: "Initiate a return for this order. Our team will review your request within 24-48 hours.",
          confirmText: "Request Return",
          confirmVariant: "primary",
          icon: RefreshCw,
          onConfirm: () => {
            returnOrder(order.id, {
              onSuccess: () => {
                setModalConfig(prev => ({ ...prev, isOpen: false }));
              }
            });
          }
        });
        return;
      }

      // If order can be cancelled
      if (showCancel) {
        setModalConfig({
          isOpen: true,
          title: "Cancel this order?",
          message: "This action cannot be undone. Are you sure you want to cancel your order and get a refund?",
          confirmText: "Cancel Order",
          confirmVariant: "danger",
          icon: AlertCircle,
          onConfirm: () => {
            cancelOrder(order.id, {
              onSuccess: () => {
                 setModalConfig(prev => ({ ...prev, isOpen: false }));
                 navigate('/orders', { state: { activeSection: 'orders' } });
              }
            });
          }
        });
        return;
      }

      toastError("This action is not allowed for the current order status.");
  };

  const handleShareDetails = async () => {
    const shareData = {
      title: `Order #${order.id} Details`,
      text: `Order Summary:\nOrder ID: #${order.id}\nStatus: ${order.status}\nTotal Items: ${order.items}\nTotal Amount: ₹${paymentBreakdown.total}\nDate: ${order.date}`,
      url: window.location.href
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.text);
        toastSuccess("Order details copied to clipboard!");
      }
    } catch (err) {
      console.error("Error sharing:", err);
    }
  };

  const handleDownloadReceipt = () => {
    // Basic printable layout
    const printWindow = window.open('', '_blank');
    
    // Calculate line totals for products
    const productsHtml = order.products?.map(p => {
      const lineTotal = (p.price * (p.quantity || 1)).toLocaleString('en-IN');
      return `
        <tr>
          <td style="padding: 12px 8px; border-bottom: 1px solid #f1f5f9;">
            <div style="font-weight: 600; color: #1e293b;">${p.name}</div>
            <div style="font-size: 0.8em; color: #64748b;">Unit Price: ₹${p.price.toLocaleString('en-IN')}</div>
          </td>
          <td style="padding: 12px 8px; border-bottom: 1px solid #f1f5f9; text-align: center; color: #1e293b;">${p.quantity}</td>
          <td style="padding: 12px 8px; border-bottom: 1px solid #f1f5f9; text-align: right; font-weight: 600; color: #1e293b;">₹${lineTotal}</td>
        </tr>
      `;
    }).join('') || '<tr><td colspan="3" style="padding: 20px; text-align: center; color: #64748b;">No products found</td></tr>';

    const content = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice - #${order.id}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
            * { box-sizing: border-box; }
            body { font-family: 'Inter', sans-serif; padding: 50px; color: #1e293b; background: white; margin: 0; line-height: 1.5; }
            .receipt-container { max-width: 800px; margin: 0 auto; }
            .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 50px; border-bottom: 2px solid #f1f5f9; padding-bottom: 30px; }
            .brand { color: #059669; font-size: 28px; font-weight: 800; letter-spacing: -0.025em; }
            .invoice-label { font-size: 32px; font-weight: 700; color: #0f172a; margin-bottom: 5px; }
            .order-meta { color: #64748b; font-size: 14px; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 40px; }
            .section-title { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #94a3b8; margin-bottom: 12px; border-bottom: 1px solid #f1f5f9; padding-bottom: 4px; }
            .address-box { font-size: 14px; color: #334155; }
            .address-name { font-weight: 700; color: #0f172a; margin-bottom: 4px; display: block; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th { text-align: left; background: #f8fafc; padding: 12px 8px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b; border-top: 1px solid #e2e8f0; border-bottom: 1px solid #e2e8f0; }
            .summary { margin-top: 40px; display: flex; justify-content: flex-end; }
            .summary-box { width: 320px; background: #f8fafc; padding: 24px; rounded: 12px; border: 1px solid #e2e8f0; }
            .summary-row { display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 14px; }
            .summary-total { margin-top: 15px; padding-top: 15px; border-top: 2px solid #e2e8f0; font-weight: 800; font-size: 18px; color: #059669; }
            .footer { margin-top: 60px; text-align: center; color: #94a3b8; font-size: 13px; border-top: 1px solid #f1f5f9; padding-top: 30px; }
            .badge { display: inline-block; padding: 4px 12px; background: #ecfdf5; color: #059669; border-radius: 99px; font-size: 12px; font-weight: 600; margin-top: 8px; }
            @media print {
              body { padding: 0; }
              .receipt-container { max-width: 100%; }
            }
          </style>
        </head>
        <body>
          <div class="receipt-container">
            <div class="header">
              <div>
                <div class="brand">DS PHARMA</div>
                <div class="badge">${order.status.toUpperCase()}</div>
              </div>
              <div style="text-align: right">
                <div class="invoice-label">INVOICE</div>
                <div class="order-meta">#${order.id}</div>
                <div class="order-meta">${order.date}</div>
              </div>
            </div>
            
            <div class="grid">
              <div>
                <div class="section-title">Shipping To</div>
                <div class="address-box">
                  <span class="address-name">${currentAddress.name}</span>
                  ${currentAddress.address}<br>
                  Phone: ${currentAddress.phone}
                </div>
              </div>
              <div style="text-align: right">
                <div class="section-title">Payment Details</div>
                <div class="address-box">
                  <span class="address-name">Method</span>
                  Prepaid / Digital Payment<br>
                  Status: <span style="color: #059669">Successful</span>
                </div>
              </div>
            </div>

            <div class="section-title">Order Items</div>
            <table>
              <thead>
                <tr>
                  <th>Item Description</th>
                  <th style="text-align: center">Qty</th>
                  <th style="text-align: right">Amount</th>
                </tr>
              </thead>
              <tbody>
                ${productsHtml}
              </tbody>
            </table>

            <div class="summary">
              <div class="summary-box">
                <div class="summary-row"><span>Subtotal</span> <span>₹${paymentBreakdown.totalCartValue.toLocaleString('en-IN')}</span></div>
                <div class="summary-row" style="color: #059669"><span>Discount</span> <span>-₹${paymentBreakdown.discount.toLocaleString('en-IN')}</span></div>
                <div class="summary-row" style="color: #059669"><span>Coupon</span> <span>-₹${paymentBreakdown.coupon.toLocaleString('en-IN')}</span></div>
                <div class="summary-row"><span>Shipping</span> <span>₹${paymentBreakdown.deliveryCharges.toLocaleString('en-IN')}</span></div>
                <div class="summary-row summary-total"><span>Total Amount</span> <span>₹${paymentBreakdown.total.toLocaleString('en-IN')}</span></div>
              </div>
            </div>

            <div class="footer">
              <p style="font-weight: 600; color: #475569; margin-bottom: 5px;">Thank you for choosing DS Pharma!</p>
              <p>For support, contact care@dspharma.com</p>
              <p style="font-size: 11px; margin-top: 15px;">THIS IS A COMPUTER GENERATED INVOICE. NO SIGNATURE REQUIRED.</p>
            </div>
          </div>
          
          <script>
            window.onload = () => {
              window.print();
              setTimeout(() => window.close(), 500);
            };
          </script>
        </body>
      </html>
    `;
    
    printWindow.document.write(content);
    printWindow.document.close();
  };

  const handleChangeAddress = (newAddress) => {
      setCurrentAddress(newAddress);
      // In a real app, we would make an API call here to update the order's address
      console.log("Address updated to:", newAddress);
  };

  return (
    <div style={{ paddingTop: '20px' }}>
      <style>{` 
         @media (min-width: 768px) { 
           .order-details-container { 
             padding-top: 80px !important; 
           } 
         }
         @media (max-width: 639px) {
           .order-details-container {
             padding-left: 5px !important;
             padding-right: 5px !important;
           }
         }
         @media (min-width: 640px) and (max-width: 1290px) {
           .order-details-container {
             padding-left: 5px !important;
             padding-right: 5px !important;
           }
         }
       `}</style>
      <div className="order-details-container w-full pt-4 pb-16 lg:pt-32 lg:pb-16">
        <div
          className="w-full px-4 mx-auto"
          style={{ maxWidth: "1280px", margin: "10px auto" }}
        >
          <div style={{ marginBottom: '1.5rem' }}><BackButton fallbackRoute="/orders" label="Back to Orders" className="mb-4" /></div>
            {/* Header */}
            <div className="mb-6" sty>
              
              <h1
                className="mb-6 text-2xl font-bold text-gray-900"
                style={{
                  fontFamily: "Gyrotrope",
                  fontSize: "22px",
                  fontWeight: 600,
                  color: "#000000",
                  marginBottom: "10px"
                }}
              >
                Order Details
              </h1>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 gap-6" style={{ gridTemplateColumns: 'repeat(1, minmax(0, 1fr))' }}
              data-lg-grid="true">
              <style>{`
              @media (min-width: 1024px) {
                [data-lg-grid="true"] {
                  grid-template-columns: 70% 30% !important;
                }
              }
            `}</style>
              {/* Left Section */}
              <div>
                <OrderProductCard order={order} onCancel={handleCancelOrder} />
                
                {/* Contact Section */}
                <Card className="mt-6 w-full" style={{ marginTop: '10px' }}>
                  <div className="flex flex-col gap-3 p-3 sm:gap-4 sm:p-4 sm:flex-row sm:items-center sm:justify-between" style={{ padding: '3px 8px' }}>
                    <p
                      className="font-medium text-gray-600 text-[10px] sm:text-base"
                      style={{ fontFamily: "Gyrotrope" }}
                    >
                      Contact Customer Care
                    </p>
                    <div className="flex gap-2 sm:gap-3">
                      <Button
                        variant="success"
                        size="sm"
                        onClick={handleShareDetails}
                        className="text-[10px] sm:text-sm h-6 sm:h-8 flex items-center gap-1.5"
                        style={{ padding: '0 12px' }}
                      >
                        <Share2 size={14} className="sm:w-4 sm:h-4" />
                        <span style={{ paddingTop: '3px' }}>Share Order Details</span>
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={handleDownloadReceipt}
                        className="text-[10px] sm:text-sm h-6 sm:h-8 flex items-center gap-1.5"
                        style={{ padding: '0 12px' }}
                      >
                        <Printer size={14} className="sm:w-4 sm:h-4" />
                        <span style={{ paddingTop: '3px' }}>Download Receipt</span>
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Right Section */}
              <div className="py-2">
                <div className="flex flex-col space-y-4 lg:space-y-0 lg:gap-4">
                  <DeliveryAddressCard
                    address={currentAddress}
                    onChangeAddress={handleChangeAddress}
                  />
                  <AppliedCouponCard coupon={order.appliedCoupon} />
                  <PaymentBreakdownCard breakdown={paymentBreakdown} />
                </div>
              </div>
            </div>

            {/* Suggested Items Section */}
            <SuggestedItemsSection
              title="Suggested Items"
              items={suggestedItems}
              titleStyle={{
                marginBottom: '10px',
                marginTop: '40px'
              }}
              containerStyle={{ marginBottom: '20px' }}
            />

            {/* Confirmation Modal */}
            <ConfirmationModal 
              isOpen={modalConfig.isOpen}
              onClose={() => setModalConfig(prev => ({ ...prev, isOpen: false }))}
              onConfirm={modalConfig.onConfirm}
              title={modalConfig.title}
              message={modalConfig.message}
              confirmText={modalConfig.confirmText}
              confirmVariant={modalConfig.confirmVariant}
              icon={modalConfig.icon}
              isLoading={isCancelling || isReturning}
            />
          </div>
        </div>
      </div>
  );
};

export default OrderDetails;
