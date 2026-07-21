import { QRCodeCanvas } from 'qrcode.react';
const QrCodeComponent = ({data}:any) => {

  console.log("from qr code ", data);

  const Url = data.url;
  
  const downloadQRCode = () => {
    const canvas = document.querySelector('canvas');
    const image = canvas?.toDataURL('image/png', 1.0); // Increased quality parameter to 1.0
    const link = document.createElement('a');
    link.href = image;
    link.download = `qr-code-${data.customer}.png`; // Better filename with invoice number
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    // <div className="flex flex-col items-center justify-center p-8  rounded-lg shadow-md">
      <div className="p-4 flex flex-col items-center" >
        <div className="bg-white p-3 rounded-lg shadow-md">
          <QRCodeCanvas
            value={Url}
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
       <button
        onClick={downloadQRCode}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
      >
        Download QR Code
      </button>

     </div>
  );
};
export default QrCodeComponent;
