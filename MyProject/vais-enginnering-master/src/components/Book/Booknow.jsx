import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../../firebase";

export default function BookingForm() {
  const [otherServiceVisible, setOtherServiceVisible] = useState(false);
  const [applyDiscount, setApplyDiscount] = useState(false);
  const [rates, setRates] = useState({
    software: 0,
    website: 0,
    marketing: 0,
    addons: 0,
  });
  const [budget, setBudget] = useState("10k-50k");
  const [paymentMethod, setPaymentMethod] = useState("bank");
  const [paymentTerms, setPaymentTerms] = useState("full-advance");
  const [serviceType, setServiceType] = useState("software");
  const [clientDetails, setClientDetails] = useState({
    clientName: "",
    companyName: "",
    email: "",
    contactNumber: "",
    executiveName: "",
  });

  const handleClientDetailsChange = (e) => {
    setClientDetails({ ...clientDetails, [e.target.name]: e.target.value });
  };

  const calculateRates = () => {
    const totalBaseRate = Object.values(rates).reduce((a, b) => a + b, 0);
    const gstRate = totalBaseRate * 0.18;
    const totalWithGst = totalBaseRate + gstRate;
    return { totalBaseRate, gstRate, totalWithGst };
  };

  const handleRateChange = (e) => {
    setRates({ ...rates, [e.target.name]: parseFloat(e.target.value) || 0 });
  };

  const handleDiscountChange = () => {
    setApplyDiscount(!applyDiscount);
  };

  const { totalBaseRate, gstRate, totalWithGst } = calculateRates();
  const discountAmount = applyDiscount ? totalBaseRate * 0.2 : 0;
  const finalTotal = (totalBaseRate - discountAmount) * 1.18;

  const handleSubmit = async () => {
    try {
      const docRef = await addDoc(collection(db, "bookings"), {
        ...clientDetails,
        serviceName: serviceType,
        budget: budget,
        paymentMethod: paymentMethod,
        paymentOption: paymentTerms,
        totalServiceBaseRate: totalBaseRate,
        gst: gstRate,
        finalTotal: finalTotal,
        timestamp: new Date(),
      });
      console.log("Document written with ID: ", docRef.id);
      alert("Booking details submitted successfully!");
    } catch (e) {
      // Log detailed error information
      console.error("Error adding document:", e);
      console.error("Error Code:", e.code);
      console.error("Error Message:", e.message);
      alert(
        "Error submitting booking details. Please try again. \n" +
          "Error Code: " +
          e.code +
          "\nMessage: " +
          e.message
      );
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold text-center text-gray-800">
        Vais Engineering Service Booking Form
      </h1>
      <form className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {/* Client Information */}
        <div className="col-span-2 bg-gray-100 p-4 rounded-lg">
          <h2 className="text-xl font-semibold text-blue-600">Client Information</h2>
          <input
            type="text"
            name="clientName"
            placeholder="Client Name"
            className="w-full p-2 border rounded mt-2"
            onChange={handleClientDetailsChange}
          />
          <input
            type="text"
            name="companyName"
            placeholder="Company Name"
            className="w-full p-2 border rounded mt-2"
            onChange={handleClientDetailsChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            className="w-full p-2 border rounded mt-2"
            onChange={handleClientDetailsChange}
          />
          <input
            type="tel"
            name="contactNumber"
            placeholder="Contact Number"
            className="w-full p-2 border rounded mt-2"
            onChange={handleClientDetailsChange}
          />
          <input
            type="text"
            name="executiveName"
            placeholder="Executive Name"
            className="w-full p-2 border rounded mt-2"
            onChange={handleClientDetailsChange}
          />
        </div>
        {/* Service Type */}
        <div className="col-span-2 bg-gray-100 p-4 rounded-lg">
          <h2 className="text-xl font-semibold text-blue-600">Service Type</h2>
          <select
            className="w-full p-2 border rounded mt-2"
            value={serviceType}
            onChange={(e) => setServiceType(e.target.value)}
          >
            <option value="software">Software Development</option>
            <option value="website">Website Development</option>
            <option value="marketing">Digital Marketing</option>
            <option value="consulting">Consulting</option>
            <option value="other">Other</option>
          </select>
        </div>
        {/* Budget & Payment Terms */}
        <div className="col-span-2 bg-gray-100 p-4 rounded-lg">
          <h2 className="text-xl font-semibold text-blue-600">Budget & Payment Terms</h2>
          <select
            className="w-full p-2 border rounded mt-2"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
          >
            <option value="10k-50k">₹10,000 – ₹50,000</option>
            <option value="50k-1l">₹50,000 – ₹1,00,000</option>
            <option value="1l-5l">₹1,00,000 – ₹5,00,000</option>
            <option value="5l-above">₹5,00,000 and above</option>
          </select>
          <select
            className="w-full p-2 border rounded mt-2"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <option value="bank">Bank Transfer</option>
            <option value="card">Credit/Debit Card</option>
            <option value="upi">UPI</option>
            <option value="cash">Cash</option>
          </select>
          <select
            className="w-full p-2 border rounded mt-2"
            value={paymentTerms}
            onChange={(e) => setPaymentTerms(e.target.value)}
          >
            <option value="full-advance">Full Payment in Advance</option>
            <option value="50-50">50% Advance, 50% on Completion</option>
            <option value="milestones">Payment in Milestones</option>
          </select>
        </div>
        {/* Proceed Button */}
        <div className="col-span-2 text-center">
          <button
            type="button"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            onClick={handleSubmit}
          >
            Proceed to Payment
          </button>
        </div>
      </form>
    </div>
  );
}
