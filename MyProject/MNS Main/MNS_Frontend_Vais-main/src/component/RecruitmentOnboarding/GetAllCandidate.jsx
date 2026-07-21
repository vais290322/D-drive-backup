import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  setCandidates,
  setError,
  setLoading,
} from "../../utils/recruitment/recruitmentSlice";
import axios from "axios";
import { useEffect, useState } from "react";
import UpdateCandidate from "./UpdateCandidate";
import { Button, Card, CardContent, TextField } from "@mui/material";

const getCandidateUri = import.meta.env.VITE_REACT_GET_ALL_CANDIDATE;

const GetAllCandidate = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { candidates, error, loading } = useSelector(
    (state) => state.recruitment || {}
  );
  const [editingCandidate, setEditingCandidate] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [filteredCandidates, setFilteredCandidates] = useState(() => []);
  const [currentPage, setCurrentPage] = useState(1);
  const [candidatesPerPage, setCandidatesPerPage] = useState(5);

  const fetchCandidates = async () => {
    dispatch(setLoading(true));
    try {
      const response = await axios.get(getCandidateUri);
      dispatch(setCandidates(response?.data || []));
      setFilteredCandidates(response?.data || []);
    } catch (error) {
      dispatch(setError(error.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, [dispatch]);

  useEffect(() => {
    setFilteredCandidates(
      (candidates?.data || []).filter((candidate) =>
        candidate.email.toLowerCase().includes(searchInput.toLowerCase())
      )
    );
  }, [searchInput, candidates]);

  const handleOnboardCandidate = () => {
    if (window.confirm("Are you sure you want to onboard this candidate?")) {
      alert("Candidate onboarded successfully");
      navigate("/add-employee");
    }
  };

  const handleEdit = (candidate) => {
    setEditingCandidate(candidate);
  };

  const handleUpdateSuccess = () => {
    fetchCandidates();
    setEditingCandidate(null);
  };

  const handleDelete = async (candidateId) => {
    if (window.confirm("Are you sure you want to delete this candidate?")) {
      try {
        await axios.delete(`${getCandidateUri}/${candidateId}`);
        alert("Candidate deleted successfully");
        fetchCandidates();
      } catch (error) {
        console.error("Error deleting candidate", error);
      }
    }
  };

  const indexOfLastCandidate = currentPage * candidatesPerPage;
  const indexOfFirstCandidate = indexOfLastCandidate - candidatesPerPage;
  const currentCandidates = filteredCandidates?.slice(
    indexOfFirstCandidate,
    indexOfLastCandidate
  );

  const totalPages = Math.ceil(
    (filteredCandidates?.length || 0) / candidatesPerPage
  );

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Recruitment Management</h1>
        <Link to="/add-candidate">
          <Button variant="contained" color="primary">
            Add Candidate
          </Button>
        </Link>
      </div>

      {error && <p className="text-red-500">{error}</p>}
      {loading && <p className="text-blue-500">Loading...</p>}

      {/* Candidates per page selector */}
      <div className="flex items-center mb-4">
        <label className="mr-2 font-semibold">Candidates per page:</label>
        <select
          value={candidatesPerPage}
          onChange={(e) => setCandidatesPerPage(Number(e.target.value))}
          className="border rounded p-2"
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={10}>20</option>
          <option value={10}>50</option>
        </select>
      </div>

      <TextField
        fullWidth
        label="Search by email"
        variant="outlined"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        className="mb-4"
      />

      <h2 className="text-xl font-semibold">Candidate List</h2>
      {currentCandidates.length === 0 && <p>No candidates found.</p>}

      <div className="grid gap-4">
        {currentCandidates?.map((candidate) => (
          <Card key={candidate.id} variant="outlined">
            <CardContent>
              <p>
                <strong>Email:</strong> {candidate.email}
              </p>
              <p>
                <strong>Phone:</strong> {candidate.phone}
              </p>
              <p>
                <strong>Description:</strong> {candidate.description}
              </p>
              <p>
                <strong>Expected Salary:</strong> {candidate.expectedSalary}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                {candidate.onboarded ? "Onboarded" : "Pending"}
              </p>
              <div className="flex gap-2 mt-2">
                <Button
                  variant="contained"
                  color="warning"
                  onClick={() => handleEdit(candidate)}
                >
                  Update
                </Button>
                <Button
                  variant="contained"
                  color="success"
                  onClick={() => handleOnboardCandidate()}
                >
                  Onboard
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => handleDelete(candidate.id)}
                >
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-center mt-6 space-x-4">
        <button
          variant="contained"
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className="bg-gradient-to-r from-pink-500 to-blue-500 cursor-pointer text-black px-4 py-2 rounded-lg hover:bg-gradient-to-r hover:from-green-500 transition duration-300 border-amber-300 hover:to-pink-500 disabled:opacity-50 " 
        >
          Previous
        </button>
        <span className="text-lg font-semibold">
          Page {currentPage} of {totalPages}
        </span>
        <button
          variant="contained"
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="bg-gradient-to-r from-pink-500 to-blue-500 cursor-pointer text-black px-4 py-2 rounded-lg hover:bg-gradient-to-r hover:from-green-500 transition duration-300 border-amber-300 hover:to-pink-500 disabled:opacity-50 " 
        >
          Next
        </button>
      </div>

      {editingCandidate && (
        <UpdateCandidate
          candidate={editingCandidate}
          onClose={() => setEditingCandidate(null)}
          onUpdateSuccess={handleUpdateSuccess}
        />
      )}
    </div>
  );
};

export default GetAllCandidate;
