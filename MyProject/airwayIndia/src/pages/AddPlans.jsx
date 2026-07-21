import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlus } from 'react-icons/fi';
import axios from 'axios';
import { PlanUrl, getAuthHeaders } from '../config/config';
import toast from 'react-hot-toast';

const AddPlans = () => {
  const navigate = useNavigate();

  const [planName, setPlanName] = useState('');
  const [yearlyFee, setYearlyFee] = useState('');
  const [description, setDescription] = useState('');
  const [featureInput, setFeatureInput] = useState('');
  const [features, setFeatures] = useState([]);

  const handleAddFeature = () => {
    if (featureInput.trim() !== '') {
      setFeatures([...features, featureInput]);
      setFeatureInput('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      planName,
      yearlyFee: parseFloat(yearlyFee),
      description,
      features,
    };

    try {
      const response = await axios.post(`${PlanUrl.postPlan}`, payload, { headers: getAuthHeaders() });
      toast.success('Plan added successfully!');
      navigate('/plans');
    } catch (error) {
      console.error('Failed to add plan:', error);
      toast.error(error.response?.data?.message ||'Failed to add plan');
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {/* <button
        onClick={() => navigate('/plans')}
        className="text-sm text-white bg-[#b91c1c] px-2 py-1 rounded-md hover:underline mb-4 inline-block"
      >
        ← Back to Plans
      </button> */}

      <div className="bg-white rounded-2xl p-8 shadow-lg">
        <h2 className="text-3xl font-bold text-gray-800 mb-1 mt-5">Add New Plan</h2>
        <p className="text-sm text-gray-500 mb-6">Create a new fee structure plan</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Plan Info */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Plan Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={planName}
                onChange={(e) => setPlanName(e.target.value)}
                required
                placeholder="Gold, Silver, Platinum..."
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Yearly Fee (₹) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={yearlyFee}
                onChange={(e) => setYearlyFee(e.target.value)}
                required
                placeholder="e.g., 100000"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the plan's benefits"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
            ></textarea>
          </div>

          {/* Features */}
                {/* <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Features</label>
            <div className="flex gap-3 mb-3">
              <input
                type="text"
                value={featureInput}
                onChange={(e) => setFeatureInput(e.target.value)}
                placeholder="Enter a feature"
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
              />
              <button
                type="button"
                onClick={handleAddFeature}
                className="bg-gray-100 text-gray-700 hover:bg-gray-200 px-4 py-2 rounded-lg border flex items-center gap-1"
              >
                <FiPlus />
                Add
              </button>
            </div>
            {features.length > 0 && (
              <ul className="list-disc list-inside text-sm text-green-600 space-y-1">
                {features.map((f, idx) => (
                  <li key={idx}>{f}</li>
                ))}
              </ul>
            )}
          </div> */}

          {/* Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 text-sm rounded-md font-semibold hover:bg-green-700 "
            >
              Add Plan
            </button>
            <button
              type="button"
              onClick={() => navigate('/plans')}
              className="bg-gradient-to-r bg-red-500 text-white px-6 py-2 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all"
            >
              Back to Plans
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPlans;
