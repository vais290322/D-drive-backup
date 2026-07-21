import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addCandidate,
  clearError,
  setError,
  setLoading,
} from "../../utils/recruitment/recruitmentSlice";
import axios from "axios";
import toast from "react-hot-toast";
import { FiLoader } from "react-icons/fi";

const addCandidateUri = import.meta.env.VITE_REACT_ADD_CANDIDATE;

const createCandidate = async (candidate, dispatch) => {
//   dispatch(setLoading(true));
  try {
    const response = await axios.post(addCandidateUri, candidate);
    dispatch(addCandidate(response?.data));
    toast.success("Candidate added successfully");
    dispatch(clearError());
  } catch (error) {
    dispatch(setError("Failed to add candidate", error)); 
    toast.error("Failed to add candidate");
  }
   finally {
      dispatch(setLoading(false));
  }
};
export const AddCandidate = () => {
  const dispatch = useDispatch();
  const { error, loading } = useSelector((state) => state.recruitment || {});

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [description, setDescription] = useState("");
  const [expectedSalary, setExpectedSalary] = useState("");

  const handleAddCandidate = async (e) => {
    e.preventDefault()
    if (!email || !phone || !description || !expectedSalary) {
      dispatch(setError("All fields are required"));
      return;
    }

    const newCandidate = {
      email,
      phone,
      description,
      expectedSalary,
      onboarded: false,
    };

    await createCandidate(newCandidate, dispatch);
    setEmail("");
    setPhone("");
    setDescription("");
    setExpectedSalary("");
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-4 text-center">Create Candidate</h1>
      {error && <p className="text-red-500 text-center">{error}</p>}
      <form onSubmit={handleAddCandidate} className="space-y-6">
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <input
            type="number"
            placeholder="Expected Salary"
            value={expectedSalary}
            onChange={(e) => setExpectedSalary(e.target.value)}
            className="w-full p-2 border rounded"
          />

          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700"
            
          >
          
              Add Candidate
          </button>
        </div>
      </form>
    </div>
  );
};
