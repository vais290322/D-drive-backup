import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { bookingsAPI } from '@/lib/api';
import { PayPalPayment } from '@/utils/paypalPayment';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export default function Booking() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const { type, flightId, hotelId, packageId, price, flight, package: pkg } = location.state || {}; // Destructure state

  // Redirect if critical booking data is missing (e.g. page refresh)
  useEffect(() => {
    if ((type === 'flight' && !flightId && !flight?.id) ||
      (type === 'package' && !packageId && !pkg?.id) ||
      (type === 'hotel' && !hotelId) ||
      (!type && !hotelId)) {

      toast({
        title: 'Booking Session Expired',
        description: 'Please select your booking details again.',
        variant: 'destructive',
      });
      navigate('/');
    }
  }, [type, flightId, hotelId, packageId, flight, pkg, navigate, toast]);

  const [formData, setFormData] = useState({
    travelers_count: 1,
    check_in_date: '',
    check_out_date: '',
    special_requests: '',
    guest_name: user?.full_name || '',
    guest_email: user?.email || '',
    guest_phone: user?.phone || '',
  });

  // Update guest details if user loads late
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        guest_name: prev.guest_name || user.full_name || '',
        guest_email: prev.guest_email || user.email || '',
        guest_phone: prev.guest_phone || user.phone || '',
      }));
    }
  }, [user]);

  const [paymentMethod, setPaymentMethod] = useState('card');
  const [createdBookingId, setCreatedBookingId] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      navigate('/login', { state: { from: location } });
      return;
    }

    setLoading(true);
    try {
      // Create booking first
      const bookingData = {
        booking_type: type || 'hotel',
        hotel_id: hotelId, // undefined if not hotel
        check_in_date: formData.check_in_date,
        check_out_date: formData.check_out_date,
        guests: formData.travelers_count,
        room_type: 'Standard', // Default or from state

        // Guest Details (Backend Requirement)
        guest_name: formData.guest_name,
        guest_email: formData.guest_email,
        guest_phone: formData.guest_phone,

        special_requests: formData.special_requests,
        total_amount: price * formData.travelers_count, // Required for non-hotel bookings

        // Full Data Snapshots
        flight_data: type === 'flight' ? (flight || { flightId, price }) : null,
        package_data: type === 'package' ? (pkg || { packageId, price }) : null,
      };

      const response = await bookingsAPI.createBooking(bookingData);
      const booking = response.booking;

      if (paymentMethod === 'paypal') {
        setCreatedBookingId(booking._id);
        toast({
          title: 'Booking Created',
          description: 'Please complete payment with PayPal',
        });
      } else {
        // Handle other payment methods (e.g. razorpay currently not fully set up in this flow)
        toast({
          title: 'Booking Created',
          description: 'Redirecting to payment...',
        });
        // Navigate to payment or show razorpay
        // For now, if card is selected, we might want to show message or redirect
        navigate(`/payment/${booking._id}`);
      }

    } catch (error) {
      console.error("Booking Creation Failed:", error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to create booking',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePayPalSuccess = (details) => {
    toast({
      title: 'Payment Successful',
      description: 'Your booking is confirmed!',
    });
    navigate('/customer-portal');
  };

  const handlePayPalError = (error) => {
    toast({
      title: 'Payment Failed',
      description: 'Please try again.',
      variant: 'destructive'
    });
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Complete Your Booking</CardTitle>
            <CardDescription>Enter your travel details</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="travelers">Number of Travelers</Label>
                <Input
                  id="travelers"
                  type="number"
                  min="1"
                  value={formData.travelers_count}
                  onChange={(e) => setFormData({ ...formData, travelers_count: parseInt(e.target.value) })}
                  required
                />
              </div>

              {(type === 'hotel' || type === 'package') && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="checkin">Check-in Date</Label>
                    <Input
                      id="checkin"
                      type="date"
                      value={formData.check_in_date}
                      onChange={(e) => setFormData({ ...formData, check_in_date: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="checkout">Check-out Date</Label>
                    <Input
                      id="checkout"
                      type="date"
                      value={formData.check_out_date}
                      onChange={(e) => setFormData({ ...formData, check_out_date: e.target.value })}
                      required
                    />
                  </div>
                </>
              )}

              {/* Guest Details Section */}
              <div className="space-y-4 pt-4 border-t">
                <h3 className="text-lg font-semibold">Guest Details</h3>
                <div className="space-y-2">
                  <Label htmlFor="guestName">Full Name</Label>
                  <Input
                    id="guestName"
                    value={formData.guest_name}
                    onChange={(e) => setFormData({ ...formData, guest_name: e.target.value })}
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="guestEmail">Email</Label>
                    <Input
                      id="guestEmail"
                      type="email"
                      value={formData.guest_email}
                      onChange={(e) => setFormData({ ...formData, guest_email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="guestPhone">Phone Number</Label>
                    <Input
                      id="guestPhone"
                      type="tel"
                      value={formData.guest_phone}
                      onChange={(e) => setFormData({ ...formData, guest_phone: e.target.value })}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-4 border-t">
                <Label htmlFor="requests">Special Requests (Optional)</Label>
                <Textarea
                  id="requests"
                  placeholder="Any special requirements..."
                  value={formData.special_requests}
                  onChange={(e) => setFormData({ ...formData, special_requests: e.target.value })}
                />
              </div>

              <div className="space-y-4 pt-4 border-t">
                <Label>Payment Method</Label>
                <RadioGroup value={paymentMethod} onValueChange={(val) => setPaymentMethod(val)} className="flex flex-col space-y-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card">Credit/Debit Card</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="paypal" id="paypal" />
                    <Label htmlFor="paypal">PayPal</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="pt-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-medium">Total Amount:</span>
                  <span className="text-2xl font-bold text-primary">
                    ₹{(() => {
                      if (type === 'hotel' || !type) {
                        const start = new Date(formData.check_in_date);
                        const end = new Date(formData.check_out_date);
                        const nights = (start && end && !isNaN(start.getTime()) && !isNaN(end.getTime()))
                          ? Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
                          : 0;
                        return Math.max(0, (price || 0) * (nights > 0 ? nights : 0)).toLocaleString('en-IN');
                      } else {
                        return ((price || 0) * formData.travelers_count).toLocaleString('en-IN');
                      }
                    })()}
                  </span>
                </div>

                {createdBookingId && paymentMethod === 'paypal' ? (
                  <PayPalPayment
                    bookingDetails={{
                      bookingId: createdBookingId,
                      amount: (() => {
                        if (type === 'hotel' || !type) {
                          const start = new Date(formData.check_in_date);
                          const end = new Date(formData.check_out_date);
                          const nights = (start && end && !isNaN(start.getTime()) && !isNaN(end.getTime()))
                            ? Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
                            : 0;
                          return Math.max(0, (price || 0) * (nights > 0 ? nights : 0));
                        } else {
                          return (price || 0) * formData.travelers_count;
                        }
                      })(),
                      // fill other details if needed for display, but bookingId is main
                      hotelName: "Hotel", // Placeholder
                      roomType: "Standard",
                      checkIn: formData.check_in_date,
                      checkOut: formData.check_out_date,
                      nights: 1, // Calculate logic if needed
                      guestName: user?.full_name || '',
                      guestEmail: user?.email || '',
                      guestPhone: user?.phone || ''
                    }}
                    onSuccess={handlePayPalSuccess}
                    onError={handlePayPalError}
                  />
                ) : (
                  <Button type="submit" className="w-full" size="lg" disabled={loading}>
                    {loading ? 'Processing...' : (paymentMethod === 'paypal' ? 'Book & Pay with PayPal' : 'Proceed to Payment')}
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


