// EditPlanModal.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Dialog } from '@headlessui/react';
import { getAuthHeaders, PlanUrl } from '../config/config';
import toast from 'react-hot-toast';

const EditPlanModal = ({ open, onClose, planId, onUpdate }) => {
  const [form, setForm] = useState({
    planName: '',
    yearlyFee: '',
    description: '',
    features: [],
  });

  const [featureInput, setFeatureInput] = useState('');

  useEffect(() => {
    if (planId && open) {
      axios
        .get(
          `${PlanUrl.getPlans}/${planId}`,  { headers: getAuthHeaders() } 
        )
        .then((res) => {
          const data = res.data.data;
          setForm({
            planName: data.plan.planName,
            yearlyFee: data.plan.yearlyFee,
            description: data.plan.description,
            features: data.plan.features || [],
          });
        })
        .catch((err) => console.error('Fetch plan error:', err));
    }
  }, [planId, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleAddFeature = () => {
    if (featureInput.trim()) {
      setForm({ ...form, features: [...form.features, featureInput.trim()] });
      setFeatureInput('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        // `http://192.168.0.156:8080/api/v1/plans/${planId}`
        `${PlanUrl.updatePlan}/${planId}`,  { headers: getAuthHeaders() } ,
        form
      );
      onUpdate();
      onClose();
      toast.success('Plan updated successfully!');
    } catch (err) {
      console.error('Update plan error:', err);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center min-h-screen px-4">
        <Dialog.Panel className="w-full max-w-2xl p-6 bg-white rounded-lg shadow-xl">
          <Dialog.Title className="text-xl font-bold mb-4">Edit Plan</Dialog.Title>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                name="planName"
                value={form.planName}
                onChange={handleChange}
                className="border p-2 rounded w-full"
                placeholder="Plan Name"
              />
              <input
                name="yearlyFee"
                type="number"
                value={form.yearlyFee}
                onChange={handleChange}
                className="border p-2 rounded w-full"
                placeholder="Yearly Fee"
              />
            </div>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              placeholder="Description"
            />
            {/* <div>
              <div className="flex gap-2 mb-2">
                <input
                  value={featureInput}
                  onChange={(e) => setFeatureInput(e.target.value)}
                  className="border p-2 rounded w-full"
                  placeholder="Add feature"
                />
                <button
                  type="button"
                  onClick={handleAddFeature}
                  className="px-3 py-2 bg-blue-600 text-white rounded"
                >
                  +
                </button>
              </div>
              <ul className="list-disc list-inside text-sm text-gray-600">
                {form.features.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
            </div> */}
            <div className="flex justify-end gap-2">
              <button type="button" onClick={onClose} className="px-4 py-2 border rounded">
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">
                Save Changes
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default EditPlanModal;
