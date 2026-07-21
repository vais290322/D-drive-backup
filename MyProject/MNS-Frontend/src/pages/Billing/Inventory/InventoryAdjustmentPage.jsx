import React, { useState } from 'react'
import SupplierForm from '../PO/SupliarForm';

const InventoryAdjustmentPage = () => {
  const [formData, setFormData] = useState({
    item_name: "item2",
    item_id: "02",
    unit_prize: 10,
    total_prize: 100,
    quantity: 10,
    seller_details: {
      seller_name: "Tech Supplies Inc.",
      ph_no: "+1-555-987-6543",
      address: "123 Tech Street, Silicon Valley, CA",
      email: "sales@techsupplies.com",
    },
    buyer_details: {
      buyer_name: "John Doe",
      ph_no: "+1-555-123-4567",
      address: "789 Market Street, New York, NY",
      email: "johndoe@example.com",
    },
    imported: true,
    exported: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted", formData);
    // Send formData to backend
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md mt-10">
      <h2 className="text-2xl font-semibold mb-4">Item Details Form</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Item Name</label>
          <input type="text" name="item_name" value={formData.item_name} onChange={handleChange} className="w-full p-2 border rounded-md" />
        </div>

        <div>
          <label className="block font-medium">Item ID</label>
          <input type="text" name="item_id" value={formData.item_id} onChange={handleChange} className="w-full p-2 border rounded-md" />
        </div>

        <div>
          <label className="block font-medium">Unit Price</label>
          <input type="number" name="unit_prize" value={formData.unit_prize} onChange={handleChange} className="w-full p-2 border rounded-md" />
        </div>

        <div>
          <label className="block font-medium">Total Price</label>
          <input type="number" name="total_prize" value={formData.total_prize} onChange={handleChange} className="w-full p-2 border rounded-md" />
        </div>

        <div>
          <label className="block font-medium">Quantity</label>
          <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} className="w-full p-2 border rounded-md" />
        </div>

        <div>
          <h3 className="text-lg font-semibold">Seller Details</h3>
          <label className="block font-medium">Seller Name</label>
          <input type="text" name="seller_name" value={formData.seller_details.seller_name} onChange={handleChange} className="w-full p-2 border rounded-md" />

          <label className="block font-medium">Phone Number</label>
          <input type="text" name="seller_ph_no" value={formData.seller_details.ph_no} onChange={handleChange} className="w-full p-2 border rounded-md" />

          <label className="block font-medium">Address</label>
          <input type="text" name="seller_address" value={formData.seller_details.address} onChange={handleChange} className="w-full p-2 border rounded-md" />

          <label className="block font-medium">Email</label>
          <input type="email" name="seller_email" value={formData.seller_details.email} onChange={handleChange} className="w-full p-2 border rounded-md" />
        </div>

        <div>
          <label className="block font-medium">Imported</label>
          <input type="checkbox" name="imported" checked={formData.imported} onChange={handleChange} className="ml-2" />
        </div>

        <div>
          <label className="block font-medium">Exported</label>
          <input type="checkbox" name="exported" checked={formData.exported} onChange={handleChange} className="ml-2" />
        </div>

        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600">Submit</button>
      </form>

      <div>
        <SupplierForm/>
      </div>
    </div>
  );
}

export default InventoryAdjustmentPage