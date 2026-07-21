import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, MapPin, Calendar, CreditCard } from 'lucide-react';
import toastUtil from '@/shared/utils/toast';
import { Button } from '@/admin/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/admin/components/ui/Card';
import { Avatar } from '@/admin/components/ui/Avatar';
import { Badge } from '@/admin/components/ui/Badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/admin/components/ui/Table';
import { customerService } from '@/services/admin/api/customerService';
import Loading from '@/shared/components/common/Loading';

const CustomerDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const data = await customerService.getCustomer(id);
        setCustomer(data);
      } catch (error) {
        console.error(error);
        toastUtil.error('Customer not found');
        navigate('/admin/customers');
      } finally {
        setIsLoading(false);
      }
    };
    fetchCustomer();
  }, [id, navigate]);

  if (isLoading) {
    return (
       <div className="flex h-[50vh] items-center justify-center">
         <Loading size="large" text="Loading customer details..." />
       </div>
    );
  }
  if (!customer) return null;

  return (
    <div className="space-y-6 min-h-screen p-4" style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 50%, #f0fdfa 100%)' }}>
       <Button variant="ghost" className="text-gray-500 hover:text-gray-900" onClick={() => navigate('/admin/customers')}>
         <ArrowLeft className="mr-2 h-4 w-4" /> Back to Customers
      </Button>

      {/* Header Profile */}
      <Card className="p-6 bg-white/80 backdrop-blur-sm border-emerald-100">
          <CardContent className="p-0 flex flex-col md:flex-row items-center md:items-start gap-6">
            <Avatar 
              className="h-24 w-24 bg-emerald-100 text-emerald-800 text-2xl font-bold" 
              src={customer.profileImage}
              fallback={customer.name.substring(0, 2).toUpperCase()} 
            />
            
            <div className="flex-1 text-center md:text-left space-y-2">
                <h1 className="text-2xl font-bold text-gray-900">{customer.name}</h1>
                <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1"><Mail className="h-4 w-4" /> {customer.email}</span>
                    <span className="flex items-center gap-1"><Phone className="h-4 w-4" /> {customer.phone}</span>
                    <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> Joined {customer.joined}</span>
                </div>
                <div className="pt-2">
                    <Badge variant={customer.status === 'Active' ? 'success' : 'secondary'}>{customer.status}</Badge>
                </div>
            </div>
            
            <div className="flex gap-8 md:border-l border-gray-100 md:pl-8 pt-4 md:pt-0">
                <div className="text-center">
                    <p className="text-sm text-gray-500 mb-1">Total Orders</p>
                    <p className="text-xl font-bold text-gray-900">{customer.orders}</p>
                </div>
                <div className="text-center">
                    <p className="text-sm text-gray-500 mb-1">Total Spent</p>
                    <p className="text-xl font-bold text-emerald-600">₹{customer.totalSpent}</p>
                </div>
            </div>
          </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
           <Card>
              <CardHeader>
                  <CardTitle>Order History</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                        <TableRow style={{ background: 'linear-gradient(to right, #f0fdf4, #f0fdfa)' }}>
                            <TableHead className="pl-6 font-semibold text-gray-700">Order ID</TableHead>
                            <TableHead className="font-semibold text-gray-700">Date</TableHead>
                            <TableHead className="font-semibold text-gray-700">Total</TableHead>
                            <TableHead className="font-semibold text-gray-700">Status</TableHead>
                            <TableHead className="text-right pr-6 font-semibold text-gray-700">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {customer.recentOrders?.map((order) => (
                            <TableRow key={order.id} className="hover:bg-emerald-50/50">
                                <TableCell className="pl-6 font-medium">{order.id}</TableCell>
                                <TableCell className="text-gray-500">{order.date}</TableCell>
                                <TableCell className="font-bold text-gray-900">₹{order.total}</TableCell>
                                <TableCell>
                                    <Badge variant={order.status === 'Delivered' ? 'success' : 'secondary'}>{order.status}</Badge>
                                </TableCell>
                                <TableCell className="text-right pr-6">
                                    <Button variant="link" size="sm" onClick={() => navigate(`/admin/orders/${order.id.replace('#', '')}`)}>View</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                  </Table>
              </CardContent>
           </Card>
        </div>

        <div className="space-y-6">
           <Card className="p-6">
              <CardHeader className="p-0 mb-4">
                  <CardTitle className="text-lg">Default Address</CardTitle>
              </CardHeader>
              <CardContent className="p-0 flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-gray-400 shrink-0" />
                  <p className="text-sm text-gray-600 leading-relaxed">{customer.address}</p>
              </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetails;
