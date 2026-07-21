import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { paymentApi } from '@/db/api';

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const [verifying, setVerifying] = useState(true);
  const [verified, setVerified] = useState(false);
  const [paymentData, setPaymentData] = useState<any>(null);
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (sessionId) {
      verifyPayment();
    }
  }, [sessionId]);

  const verifyPayment = async () => {
    try {
      const result = await paymentApi.verifyPayment(sessionId!);
      setVerified(result.verified);
      setPaymentData(result);
    } catch (error) {
      console.error('Payment verification failed:', error);
      setVerified(false);
    } finally {
      setVerifying(false);
    }
  };

  if (verifying) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="py-12 text-center">
            <Loader2 className="h-12 w-12 mx-auto mb-4 animate-spin text-primary" />
            <p className="text-lg">Verifying your payment...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          {verified ? (
            <>
              <CheckCircle className="h-16 w-16 mx-auto mb-4 text-primary" />
              <CardTitle className="text-3xl">Payment Successful!</CardTitle>
              <CardDescription>Your booking has been confirmed</CardDescription>
            </>
          ) : (
            <>
              <XCircle className="h-16 w-16 mx-auto mb-4 text-destructive" />
              <CardTitle className="text-3xl">Payment Failed</CardTitle>
              <CardDescription>There was an issue with your payment</CardDescription>
            </>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          {verified && paymentData && (
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount:</span>
                <span className="font-medium">₹{(paymentData.amount / 100).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Payment ID:</span>
                <span className="font-mono text-xs">{paymentData.sessionId?.slice(0, 20)}...</span>
              </div>
              {paymentData.customerEmail && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email:</span>
                  <span>{paymentData.customerEmail}</span>
                </div>
              )}
            </div>
          )}
          <div className="flex flex-col gap-2 pt-4">
            <Button asChild>
              <Link to="/customer-portal">View My Bookings</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/">Return to Home</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
