import { QRCodeCanvas } from 'qrcode.react';
const QrCodeComponent = ({data}) => {

  // console.log("from qr code ", data);

  const amount = `${data.grandTotal}`;
  const upiId = '8436832600@ptyes';
  const merchantName = 'Invoice Payment';
  const message = `for this invoice ${data.invoiceNumber}`;
  const paymentUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(merchantName)}&am=${amount}&cu=INR&tn=${encodeURIComponent(message)}`;
  
  const downloadQRCode = () => {
    const canvas = document.querySelector('canvas');
    const image = canvas.toDataURL('image/png', 1.0); // Increased quality parameter to 1.0
    const link = document.createElement('a');
    link.href = image;
    link.download = `invoice-${data.invoiceNumber}-qr-code.png`; // Better filename with invoice number
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    // <div className="flex flex-col items-center justify-center p-8  rounded-lg shadow-md">
      <div className="p-4 flex flex-col items-center" >
        <div className="bg-white p-3 rounded-lg shadow-md">
          <QRCodeCanvas
            value={paymentUrl}
            size={200} // Increased size for better scanning
            level="H" // High error correction level
            bgColor="#FFFFFF" // White background for better contrast
            fgColor="#000000" // Black foreground for better contrast
            includeMargin={true} // Added margin for better scanning
            imageSettings={{
              src: "/logo.png", // Optional: Add your logo in the center
              x: undefined,
              y: undefined,
              height: 30,
              width: 30,
              excavate: true,
            }}
          />
        </div>
      {/* </div> */}
      {/* <div className="mt-4 text-xl font-semibold">₹10.00</div> */}
      {/* <button
        onClick={downloadQRCode}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
      >
        Download QR Code
      </button>
      <p className="mt-4 text-gray-600">Scan with any UPI payment app</p>
      <p className="mt-2 text-sm text-gray-500">UPI ID: {upiId}</p>
      <p className="mt-1 text-sm text-gray-500">Amount: ₹{amount}</p>
      <p className="mt-2 text-sm text-gray-500">Purpose: {message}</p> */}
     </div>
  );
};
export default QrCodeComponent;

