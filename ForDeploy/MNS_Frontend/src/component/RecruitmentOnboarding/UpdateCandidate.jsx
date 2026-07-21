import axios from "axios";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";

const getCandidateUri=import.meta.env.VITE_REACT_GET_ALL_CANDIDATE

const UpdateCandidate = ({candidate,onClose,onUpdateSuccess}) => {
    const [updatedCandidate,setUpdatedCandidate]=useState(candidate);

    useEffect(()=>{
        setUpdatedCandidate(candidate);
    },[candidate]);

    const handleChange=(e)=>{
    const {name,value}=e.target;
    setUpdatedCandidate((prevState)=>({
        ...prevState,
        [name]:value
    }))
    }
    const handleSubmit=async(e)=>{
        e.preventDefault();
        try {
            await axios.put(`${getCandidateUri}/${candidate.id}`,updatedCandidate);
            onUpdateSuccess();
            onClose()
        } catch (error) {
            console.error("Error updating candidate", error); 
        }
    }


  return (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-700 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-xl w-96">
        <h2 className="text-xl font-semibold mb-4">Update Candidate</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={updatedCandidate.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Phone</label>
            <input
              type="text"
              name="phone"
              value={updatedCandidate.phone}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Description</label>
            <textarea
              name="description"
              value={updatedCandidate.description}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Expected Salary</label>
            <input
              type="number"
              name="expectedSalary"
              value={updatedCandidate.expectedSalary}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          <div className="flex justify-between mt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
    
  )
}

UpdateCandidate.propTypes = {
    candidate: PropTypes.shape({
      id: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      phone: PropTypes.string.isRequired,
      description: PropTypes.string,
      expectedSalary: PropTypes.number,
    }).isRequired,
    onClose: PropTypes.func.isRequired,
    onUpdateSuccess: PropTypes.func.isRequired,
  };

export default UpdateCandidate



