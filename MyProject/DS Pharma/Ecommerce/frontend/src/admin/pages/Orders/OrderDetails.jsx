import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, MapPin, CreditCard, Truck } from 'lucide-react';
import toastUtil from '@/shared/utils/toast';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/admin/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/admin/components/ui/Card';
import { Avatar } from '@/admin/components/ui/Avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/admin/components/ui/Table';
import { orderService } from '@/services/admin/api/orderService';
import ConfirmationModal from '@/admin/components/ui/ConfirmationModal';
import Loading from '@/shared/components/common/Loading';

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState(null);

  const statusOptions = ['PLACED', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'RETURN_REQUESTED', 'RETURN_APPROVED', 'RETURN_COMPLETED'];

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await orderService.getOrder(id);
        setOrder(data);
      } catch (error) {
        console.error(error);
        toastUtil.error('Order not found');
        navigate('/admin/orders');
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrder();
  }, [id, navigate]);

  const confirmStatusUpdate = async () => {
    if (!pendingStatus) return;
    
    setIsUpdating(true);
    try {
      await orderService.updateOrderStatus(id, pendingStatus);
      setOrder(prev => ({ ...prev, status: pendingStatus }));
      
      // Invalidate orders list
      await queryClient.invalidateQueries({ queryKey: ['orders'] });
      
      toastUtil.success(`Order updated to ${pendingStatus}`);
      setPendingStatus(null); 
    } catch (error) {
      console.error(error);
      toastUtil.error('Failed to update status');
    } finally {
      setIsUpdating(false);
      setIsModalOpen(false);
    }
  };

  if (isLoading) {
    return (
       <div className="flex h-[50vh] items-center justify-center">
         <Loading size="large" text="Loading order details..." />
       </div>
    );
  }
  if (!order) return null;

  return (
    <div className="space-y-6 min-h-screen animate-in fade-in slide-in-from-bottom-6 duration-700" style={{ padding: '10px 1rem', background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 50%, #f0fdfa 100%)' }}>
      <Button variant="ghost" className="pl-0 text-gray-500 hover:text-gray-900" onClick={() => navigate('/admin/orders')} style={{ marginBottom: '10px' }}>
         <ArrowLeft className="mr-2 h-4 w-4" />
         <span style={{ marginTop: '5px', paddingLeft: '5px' }}>Back to Orders</span>
      </Button>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
           <h1 className="text-2xl font-bold tracking-tight text-gray-900">Order #{order.id}</h1>
            <p className="text-gray-500 text-sm mt-1">{order.date} • {order.totalItems || 0} Items</p>
        </div>
        
        <div className="flex items-center gap-1 bg-transparent p-2 rounded-lg shadow-sm" style={{ padding: '5px 10px' }}>
           <span className="text-sm font-semibold text-gray-700 pl-2">Status:</span>
           <select 
             className="bg-transparent text-gray-700 text-sm rounded-md focus:ring-emerald-500 focus:border-emerald-500 block p-2 outline-none"
             value={pendingStatus || order.status}
             onChange={(e) => setPendingStatus(e.target.value)}
             disabled={isUpdating}
             style={{ padding: '5px' }}
           >
             {statusOptions.map(option => (
               <option key={option} value={option}>{option}</option>
             ))}
           </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
           <Card>
              <CardHeader>
                  <CardTitle>Order Items</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                        <TableRow style={{ background: 'linear-gradient(to right, #f0fdf4, #f0fdfa)' }}>
                            <TableHead className="pl-6 font-semibold text-gray-700" style={{ padding: '12px 16px', paddingLeft: '24px' }}>Product</TableHead>
                            <TableHead className="font-semibold text-gray-700" style={{ padding: '12px 16px' }}>Price</TableHead>
                            <TableHead className="font-semibold text-gray-700" style={{ padding: '12px 16px' }}>Quantity</TableHead>
                            <TableHead className="text-right pr-6 font-semibold text-gray-700" style={{ padding: '12px 16px', paddingRight: '24px' }}>Total</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                         {order.products.map((item, idx) => (
                           <TableRow 
                             key={idx}
                             className="hover:bg-emerald-50/50 transition-all duration-200 border-b border-gray-100"
                           >
                             <TableCell className="pl-6 font-medium text-gray-900" style={{ padding: '10px', paddingLeft: '16px' }}>{item.name}</TableCell>
                             <TableCell style={{ padding: '10px' }}>₹{item.price}</TableCell>
                             <TableCell style={{ padding: '10px' }}>{item.qty}</TableCell>
                             <TableCell className="text-right pr-6 font-medium text-gray-900" style={{ padding: '10px', paddingRight: '16px' }}>₹{item.price * item.qty}</TableCell>
                           </TableRow>
                         ))}
                         <TableRow className="bg-gray-50/50">
                           <TableCell colSpan={3} className="pl-6 text-right font-medium text-gray-500">Subtotal</TableCell>
                           <TableCell className="text-right pr-6 font-medium text-gray-900">₹{order.total}</TableCell>
                         </TableRow>
                         <TableRow className="bg-gray-100/50">
                             <TableCell colSpan={3} className="pl-6 text-right font-bold text-lg text-gray-900">Grand Total</TableCell>
                             <TableCell className="text-right pr-6 font-bold text-lg text-emerald-600">₹{order.total}</TableCell>
                         </TableRow>
                    </TableBody>
                  </Table>
              </CardContent>
           </Card>
        </div>

        <div className="space-y-6">
           <Card className="p-4">
              <CardHeader>
                  <CardTitle>Customer Details</CardTitle>
              </CardHeader>
              <CardContent>
                 <div className="flex items-start gap-4">
                    <Avatar className="bg-blue-100 text-blue-600" fallback={<User className="h-4 w-4" />} />
                    <div>
                        <h4 className="font-semibold text-gray-900">{order.customer || 'Guest User'}</h4>
                        <p className="text-sm text-gray-500">{order.email}</p>
                        <p className="text-sm text-gray-500">{order.phone || '+91 9999999999'}</p>
                    </div>
                 </div>
              </CardContent>
           </Card>

           <Card className="p-4">
               <CardHeader>
                   <CardTitle>Delivery Address</CardTitle>
               </CardHeader>
               <CardContent>
                   <div className="flex items-start gap-4">
                     <MapPin className="mt-1 h-5 w-5 text-gray-400 shrink-0" />
                     <p className="text-sm text-gray-600 leading-relaxed">{order.shippingAddress}</p>
                   </div>
               </CardContent>
           </Card>
        </div>
      </div>
      
      {pendingStatus && pendingStatus !== order.status && (
          <div className="fixed bottom-0 right-0 left-0 lg:left-53 bg-white border-t border-gray-200 p-4 shadow-lg z-40">
              <div className="flex justify-end items-center max-w-7xl mx-auto px-4 gap-4">
                  <Button variant="ghost" onClick={() => setPendingStatus(null)}>Cancel</Button>
                  <Button onClick={() => setIsModalOpen(true)} className="bg-emerald-600 hover:bg-emerald-700 text-white">Update Status</Button>
              </div>
          </div>
      )}

      <ConfirmationModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmStatusUpdate}
        title="Update Order Status"
        message={`Are you sure you want to change the order status to "${pendingStatus}"?`}
        confirmText="Update Status"
        isLoading={isUpdating}
      />
    </div>
  );
};

export default OrderDetails;