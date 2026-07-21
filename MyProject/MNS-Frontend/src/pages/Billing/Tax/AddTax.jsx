import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import TaxTable from './TaxTable';
// const createTaxUrl = import.meta.env.VITE_CREATE_TAX
// const allTaxUrl = import.meta.env.VITE_GET_ALL_TAX
import urls from "../../../common/url"


const { createTaxUrl,allTaxUrl} = urls;


const AddTax = () => {

    const [taxName, setTaxName] = useState("");
    const [taxPercentage, setTaxPercentage] = useState("");
    const [allTaxData, setAllTaxData] = useState([]);
    const [filter, setFilter] = useState(false);
    const [responce, setResponce] = useState({});

    const getAllTaxData = async() => {
        try {
            const taxData = await fetch(allTaxUrl, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            const jsonData = await taxData.json();
            if(jsonData.message != "All tax retrieved successfully"){
                toast.error("Error fetching tax data");
                return
            }
            // toast.success("Successfully fetched Tax Data")
            setAllTaxData(jsonData.data || [])
        } catch (error) {
            toast.error("Server Error")
            console.error(error)
        }
    }
  
    const handleSubmit = async(e) => {
      e.preventDefault();
      if (!taxName || isNaN(taxPercentage) || taxPercentage < 0) {
        toast.error("Please enter valid tax information.");
        return;
      }
      if(filter){
        toast.error("Tax Name Already Exists")
        return;
      }
      const taxData = {
        taxName: taxName,
        taxPercentage: Number(taxPercentage).toFixed(1),
      }
      await sendTaxData(taxData)
      
    };
    const sendTaxData = async (data) => {
        try{
            const response = await fetch(createTaxUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            const res = await response.json();
            if (res.message != "Tax created successfully") {
                toast.error(res.error)
                throw new Error(`HTTP error! status: ${res.error}`);
            }
            toast.success("Tax info saved successfully.");
            console.log("Success", res);
            setResponce(res)
            
            setTaxName("");
            setTaxPercentage("")
        }catch(err){
            console.error("Error:", err);
            alert("Failed to save tax info. Please try again.");
        }
    }
    const filterTaxName = async (name) => {
        setTaxName(name);
        const filtername = allTaxData.filter((tax) => tax.taxName === (name));
        
        if (filtername.length > 0) {
            setFilter(true);
        } else {
            setFilter(false);
        }
    };
    useEffect(() => {
        getAllTaxData()
    }, [])
  return (
    <>
    <div className="p-6 max-w-md mx-auto bg-white shadow-lg rounded-xl border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Create Tax Info</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700">Tax Name</label>
          <input
            type="text"
            value={taxName}
            onChange={(e) => filterTaxName(e.target.value)}
            placeholder="Enter tax name"
            required
            className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
          {filter && <p className="text-sm text-red-500 mt-1">Name already exists</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Tax Percentage</label>
          <input
            type="number"
            value={taxPercentage}
            onChange={(e) => setTaxPercentage(e.target.value)}
            placeholder="Enter tax percentage"
            required
            className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-3 rounded-lg text-lg font-medium hover:bg-blue-600 transition"
        >
          Save Tax Info
        </button>
      </form>
    </div>
  
    <TaxTable responce={responce} />
  </>

  )
}

export default AddTax