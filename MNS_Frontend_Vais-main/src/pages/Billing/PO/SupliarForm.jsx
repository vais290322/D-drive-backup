import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
const createPoUrl = import.meta.env.VITE_CREATE_PO
const getAllInvetoryUrl = import.meta.env.VITE_GET_ALL_INVENNTORY
export default function SupplierForm() {
    const [allInventory, setAllinventory] = useState([])
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async(data) => {
    console.log(data);
    // toast.success("Form submitted successfully!");
    const formData = {
        ...data,
        totalAmount: Number(data.totalAmount),
        quentity: Number(data.quentity),
    }
    try {
        const sendFormData = await fetch(createPoUrl,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        const res = await sendFormData.json();
        if (res.message!= "Purchase order raised successfully ") {
            toast.error(res.error)
            throw new Error(`HTTP error! status: ${res.error}`);
        }
        
        toast.success(res.message);
        console.log("res",res);
    } catch (error) {
        toast.error("Server error")
        console.error("Error:", error)
    }



    reset();
  };

  const getAllInvetory = async() => {
    try {
        const sendInventoryData = await fetch(getAllInvetoryUrl)
        const res = await sendInventoryData.json();
        if (res.message != "All item fetch successfully") {
            toast.error(res.message)
            throw new Error(`HTTP error! status: ${res.error}`);
        }
        console.log("Inventory", res.data)
        setAllinventory(res.data || [])
    } catch (error) {
        toast.error("Server Error")
        console.error("Error:", error)
    }
  }

  useEffect(()=> {
    getAllInvetory()
  }, [])



  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-lg rounded-xl">
    <h2 className="text-2xl font-semibold mb-4 text-center">Supplier Form</h2>
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <InputField label="Full Name" name="fullName" register={register} errors={errors} />
      <InputField label="Email" name="email" type="email" register={register} errors={errors} />
      <InputField label="Phone Number" name="phoneNumber" type="tel" register={register} errors={errors} />
      <InputField label="Address" name="address" register={register} errors={errors} />
      <InputField label="Supplier Name" name="supplierName" register={register} errors={errors} />
      <InputField label="Supplier Address" name="supplierAddress" register={register} errors={errors} />
      
      <div>
        <label className="block text-sm font-medium text-gray-700">Items</label>
        <select {...register("items", { required: "Item is required" })} className="mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
          <option value="">Select an item</option>
          {allInventory.map((item) => (
            <option key={item.id} value={item.itemName}>{item.itemName}</option>
          ))}
        </select>
        {errors.items && <p className="text-red-500 text-sm">{errors.items?.message}</p>}
      </div>

      <InputField label="Total Amount" name="totalAmount" type="number" register={register} errors={errors} />
      <InputField label="Quantity" name="quantity" type="number" register={register} errors={errors} />
      <InputField label="Suppliers" name="suppliers" register={register} errors={errors} />

      <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
        Submit
      </button>
    </form>
  </div>
  );
}

const InputField = ({ label, name, type = "text", register, errors }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <input
        type={type}
        {...register(name, { required: `${label} is required` })}
        className="mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
      />
      {errors[name] && <p className="text-red-500 text-sm">{errors[name]?.message}</p>}
    </div>
  );
  