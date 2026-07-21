import React from 'react';
import { motion as Motion } from 'framer-motion';
import { Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useOrders } from '@/shared/hooks/queries/useOrders';
import useDataStore from '@/store/useDataStore';

const OrdersList = () => {
    const navigate = useNavigate();
    const currentUser = useDataStore((state) => state.currentUser);
    
    // Fetch orders using React Query
    const { data: ordersData, isLoading } = useOrders();

    // Filter orders by current user
    const allOrders = ordersData?.data || [];
    const orders = allOrders.filter(order => 
        order.customerId === currentUser?.id || 
        order.customerName === currentUser?.name ||
        order.user?.id === currentUser?.id ||
        order.email === currentUser?.email
    ).sort((a, b) => b.id - a.id);

    if (isLoading) {
        return (
            <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="h-32 bg-gray-100 rounded-xl animate-pulse" />
                ))}
            </div>
        );
    }

    return (
        <Motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm p-4 md:p-8"
            style={{ 
                height: 'calc(100vh - 150px)', 
                overflowY: 'auto', 
                padding: window.innerWidth >= 640 ? '10px' : '5px', 
                scrollbarWidth: 'none', 
                msOverflowStyle: 'none', 
                marginTop: window.innerWidth >= 640 ? '30px' : '0',
                marginBottom: '0px'
            }}
        >
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl md:text-2xl font-bold" style={{ fontFamily: 'Gyrotrope', color: '#1F2937' }}>
                    Order History
                </h2>
                
            </div>
            <div className="space-y-4">
                {orders.map((order) => (
                    <Motion.div
                        style={{ marginBottom: '10px' }}
                        key={order.id}
                        whileHover={{ scale: 1.01, boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                        className="border border-gray-200 rounded-xl p-5 transition-all cursor-pointer bg-linear-to-r from-white to-gray-50"
                        onClick={() => navigate(`/orders/${order.id}`)}
                    >
                        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2" style={{ padding: '5px' }}>
                            <div className="flex-1">
                                <div className="flex items-center gap-1 mb-2">
                                    <Package className="w-5 h-5 text-teal-600" />
                                    <p className="font-bold text-sm md:text-lg" style={{ fontFamily: 'Gyrotrope' }}>
                                        Order #{order.id}
                                    </p>
                                    <span
                                     className={`px-3 py-1 rounded-full text-[8px] sm:text-xs font-semibold ${order.statusColor === 'green' || order.status === 'Delivered'
                                            ? 'bg-green-100 text-green-700'
                                            : order.status === 'Return Requested'
                                            ? 'bg-orange-100 text-orange-700'
                                            : 'bg-blue-100 text-blue-700'
                                        }`
                                        }>
                                        <span style={{ padding:'2px 5px'}}>
                                            {order.status}
                                        </span>
                                    </span>
                                </div>
                                <div className="flex flex-wrap gap-4 text-gray-600 ml-8" style={{ fontSize: window.innerWidth >= 640 ? '14px' : '11px' }}>
                                    <span className="flex items-center gap-1">
                                        📅 {order.date || order.expectedDelivery}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        📦 {Array.isArray(order.items) ? order.items.length : (order.items || 1)} items
                                    </span>
                                    <span className="flex items-center gap-1 font-semibold text-gray-800">
                                        💰 ₹{(order.total || order.paymentBreakdown?.total || order.price || 0).toFixed(2)}
                                    </span>
                                </div>
                            </div>
                            <div className="ml-8 md:ml-0">
                                
                                <button 
                                    style={{ padding: '2px 5px' }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        navigate(`/orders/${order.id}`);
                                    }}
                                    className="px-4 py-2 font-medium text-[10px] sm:text-xs text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition-colors shadow-md"
                                >
                                    View Details
                                </button>
                            </div>
                        </div>
                    </Motion.div>
                ))}
            </div>
        </Motion.div>
    );
};

export default OrdersList;
