import React from 'react';
import { motion as Motion } from 'framer-motion';
import { Package, ArrowRight, Truck, CheckCircle, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useOrders } from '@/shared/hooks/queries/useOrders';
import useDataStore from '@/store/useDataStore';
import useIsMobile from '@/shared/hooks/useIsMobile';


const OrdersPreview = () => {
    const navigate = useNavigate();
    const currentUser = useDataStore((state) => state.currentUser);
    const { data: ordersData, isLoading } = useOrders();
    const isMobile = useIsMobile(768);


    const allOrders = ordersData?.data || [];
    
    // Sort by ID (assuming ID is sequential) or DATE if available to show latest
    // Filter for current user
    const userOrders = allOrders
        .filter(order => 
            order.customerId === currentUser?.id || 
            order.user?.id === currentUser?.id ||
            order.email === currentUser?.email
        )
        .sort((a, b) => b.id - a.id); // Show latest first (descending ID)

    // Show only first 3 orders
    const recentOrders = userOrders.slice(0, 3);

    const getStatusIcon = (status) => {
        switch(status) {
            case 'Delivered': return <CheckCircle className="w-4 h-4 text-emerald-500" />;
            case 'Processing': return <Clock className="w-4 h-4 text-blue-500" />;
            default: return <Truck className="w-4 h-4 text-orange-500" />;
        }
    };

    if (isLoading) {
        return (
            <div 
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6"
                style={{ marginTop: isMobile ? '0' : '10px', padding: isMobile ? '12px' : '24px', marginBottom: isMobile ? '15px' : '30px'}}
            >

                 <div className="h-6 w-32 bg-gray-100 rounded mb-6 animate-pulse" />
                 <div className="space-y-4">
                     {[1,2,3].map(i => (
                         <div key={i} className="h-20 bg-gray-50 rounded-xl animate-pulse" />
                     ))}
                 </div>
            </div>
        );
    }

    return (
        <Motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
            style={{ marginTop: isMobile ? '0' : '10px', padding: isMobile ? '5px' : '10px', marginBottom: isMobile ? '15px' : '30px'}}
        >

            

            <div className={isMobile ? 'p-4' : 'p-6'}>

                {recentOrders.length === 0 ? (
                    <div className="text-center gap-2 flex flex-col items-center justify-center py-8">
                        <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">No orders placed yet</p>
                        <button 
                            style={{ padding: '2px 10px'}}
                            onClick={() => navigate('/')}
                            className="mt-4 px-6 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
                        >
                            Start Shopping
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {recentOrders.map((order) => (
                            <div 
                                style={{padding: isMobile ? '5px' : '10px', margin: isMobile ? '5px 0px' : ' 10px 0px'}}
                                key={order.id}
                                onClick={() => navigate(`/orders/${order.id}`)}
                                className={`group flex items-center justify-between ${isMobile ? 'p-3' : 'p-4'} rounded-xl border border-gray-100 hover:border-emerald-200 hover:shadow-md transition-all cursor-pointer bg-white`}
                            >
                                <div className="flex items-center gap-3 sm:gap-4">
                                    <div className={`${isMobile ? 'p-2' : 'p-3'} bg-emerald-50 rounded-lg group-hover:bg-emerald-100 transition-colors`}>
                                        <Package className={`${isMobile ? 'w-5 h-5' : 'w-6 h-6'} text-emerald-600`} />
                                    </div>
                                    <div>
                                        <p className={`${isMobile ? 'text-[8px]' : 'text-base sm:text-lg'} font-bold text-gray-900 flex items-center gap-2`}>
                                            Order #{order.id}
                                            <span className={`${isMobile ? 'text-[8px]' : 'text-xs'} font-normal text-gray-500`}>
                                                • {order.date || order.createdAt?.split('T')[0]}
                                            </span>
                                        </p>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <div className={`flex items-center gap-1 ${isMobile ? 'text-[10px]' : 'text-xs'} font-medium ${isMobile ? 'px-1.5' : 'px-2'} py-0.5 rounded-full bg-gray-100 text-gray-700`}>
                                                {getStatusIcon(order.status)}
                                                <span style={{marginTop: isMobile ? '1px' : '3px'}}>
                                                    {order.status}
                                                </span>
                                            </div>
                                            <span className={`${isMobile ? 'text-[10px]' : 'text-sm'} text-gray-500`} style={{marginTop: isMobile ? '2px' : '5px'}}>
                                                {Array.isArray(order.items) ? order.items.length : (order.items || 1)} items
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className={`${isMobile ? 'text-xs' : 'text-base sm:text-lg'} font-bold text-gray-900`}>
                                        ₹{(order.total || order.paymentBreakdown?.total || order.totalAmount || order.price || 0).toFixed(2)}
                                    </p>
                                    <span className={`${isMobile ? 'text-[10px]' : 'text-xs'} font-semibold text-emerald-600 group-hover:underline`}>View Details</span>
                                </div>
                            </div>

                        ))}
                    </div>
                )}
            </div>
        </Motion.div>
    );
};

export default OrdersPreview;
