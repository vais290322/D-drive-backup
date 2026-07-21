import React, { useState, useEffect } from 'react';
import { 
  Button, Dialog, DialogTitle, DialogContent, DialogActions, 
  TextField, Paper, Typography, IconButton, 
  Table, TableBody, TableCell, TableContainer, TableHead, 
  TableRow, TablePagination, Box, CircularProgress, Alert
} from '@mui/material';
import { Add, Edit, Delete, Search } from '@mui/icons-material';
import axios from 'axios';
import toast from 'react-hot-toast';
import { backendDomainN } from '../../common/index';
import { Link } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const RecruitmentTrainingPage = () => {
  // State for candidates data
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  // State for dialog
  const [openDialog, setOpenDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCandidate, setCurrentCandidate] = useState(null);
  
  // State for pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // State for search
  const [searchTerm, setSearchTerm] = useState('');
  
  // Form state
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    description: '',
    expectedSalary: ''
  });

  // Fetch candidates on component mount
  useEffect(() => {
    fetchCandidates();
  }, []);

  // Function to fetch candidates
  const fetchCandidates = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${backendDomainN}/onboarding`);
      if (response) {
        setCandidates(response.data.data);
      } else {
        setError('Failed to fetch candidates');
        toast.error('Failed to fetch candidates');
      }
    } catch (error) {
      console.error('Error fetching candidates:', error);
      setError('Error fetching candidates. Please try again.');
      toast.error('Error fetching candidates');
    } finally {
      setLoading(false);
    }
  };

  // Handle dialog open for adding new candidate
  const handleAddClick = () => {
    setIsEditing(false);
    setCurrentCandidate(null);
    setFormData({
      email: '',
      phone: '',
      description: '',
      expectedSalary: ''
    });
    setOpenDialog(true);
  };

  // Handle dialog open for editing candidate
  const handleEditClick = (candidate) => {
    setIsEditing(true);
    setCurrentCandidate(candidate);
    setFormData({
      email: candidate.email || '',
      phone: candidate.phone || '',
      description: candidate.description || '',
      expectedSalary: candidate.expectedSalary || ''
    });
    setOpenDialog(true);
  };

  // Handle dialog close
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle form submission
  const handleSubmit = async () => {
    try {
      if (isEditing && currentCandidate) {
        // Update existing candidate
        const response = await axios.put(
          `${backendDomainN}/onboarding/${currentCandidate.id}`,
          formData
        );
        if (response) {
          toast.success('Candidate updated successfully');
          fetchCandidates();
        } else {
          toast.error('Failed to update candidate');
        }
      } else {
        // Add new candidate
        const response = await axios.post(
          `${backendDomainN}/onboarding`,
          formData
        );
        if (response) {
          toast.success('Candidate added successfully');
          fetchCandidates();
        } else {
          toast.error('Failed to add candidate');
        }
      }
      handleCloseDialog();
    } catch (error) {
      console.error('Error submitting candidate:', error);
      toast.error('Error submitting candidate data');
    }
  };

  // Handle delete candidate
  const handleDeleteClick = async (id) => {
    if (window.confirm('Are you sure you want to delete this candidate?')) {
      try {
        const response = await axios.delete(`${backendDomainN}/onboarding/${id}`);
        if (response) {
          toast.success('Candidate deleted successfully');
          fetchCandidates();
        } else {
          toast.error('Failed to delete candidate');
        }
      } catch (error) {
        // console.error('Error deleting candidate:', error);
        toast.error('Error deleting candidate');
      }
    }
  };

  // Handle pagination change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Filter candidates based on search term
  const filteredCandidates = candidates.filter(candidate => 
    candidate.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidate.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );


  const onRedirect = async ()=>{
    navigate("/add-employee")
  }

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      {/* Page Header */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <Typography variant="h4" component="h1" gutterBottom>
            Recruitment Management
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            Manage candidate recruitment process
          </Typography>
        </div>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<Add />}
          onClick={handleAddClick}
        >
          Add Candidate
        </Button>
      </div>

      {/* Search Bar */}
      <Paper className="p-4 mb-6" elevation={1}>
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search candidates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <Search color="action" sx={{ mr: 1 }} />,
            }}
            size="small"
          />
        </div>
      </Paper>

      {/* Candidates Table */}
      <Paper elevation={1}>
        {error && (
          <Alert severity="error" className="mb-4">{error}</Alert>
        )}
        
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Email</strong></TableCell>
                <TableCell><strong>Phone</strong></TableCell>
                <TableCell><strong>Description</strong></TableCell>
                <TableCell><strong>Expected Salary</strong></TableCell>
                <TableCell align="right"><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" className="py-8">
                    <CircularProgress />
                    <Typography variant="body2" className="mt-2">
                      Loading candidates...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : filteredCandidates.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" className="py-8">
                    <Typography variant="body1">
                      No candidates found
                    </Typography>
                    <Button 
                      variant="text" 
                      color="primary" 
                      onClick={handleAddClick}
                      className="mt-2"
                    >
                      Add your first candidate
                    </Button>
                  </TableCell>
                </TableRow>
              ) : (
                filteredCandidates
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((candidate) => (
                    <TableRow key={candidate._id} hover>
                      <TableCell>{candidate.email}</TableCell>
                      <TableCell>{candidate.phone}</TableCell>
                      <TableCell>{candidate.description}</TableCell>
                      <TableCell>₹{candidate.expectedSalary?.toLocaleString()}</TableCell>
                      <TableCell align="right">
                      <IconButton 
                          color="primary" 
                          onClick={() => onRedirect() }
                          size="small"
                        >
                          Onboard
                        </IconButton>

                        <IconButton 
                          color="primary" 
                          onClick={() => handleEditClick(candidate)}
                          size="small"
                        >
                          <Edit />
                        </IconButton>

                        <IconButton 
                          color="error" 
                          onClick={() => handleDeleteClick(candidate.id)}
                          size="small"
                        >
                          <Delete />
                        </IconButton>

                      </TableCell>
                    </TableRow>
                  ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredCandidates.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {/* Add/Edit Candidate Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {isEditing ? 'Edit Candidate' : 'Add New Candidate'}
        </DialogTitle>
        <DialogContent dividers>
          <Box component="form" noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleInputChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="phone"
              label="Phone Number"
              id="phone"
              value={formData.phone}
              onChange={handleInputChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="description"
              label="Job Description"
              id="description"
              value={formData.description}
              onChange={handleInputChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="expectedSalary"
              label="Expected Salary"
              id="expectedSalary"
              type="number"
              value={formData.expectedSalary}
              onChange={handleInputChange}
              InputProps={{
                startAdornment: <span style={{ marginRight: 8 }}>₹</span>,
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary" variant="contained">
            {isEditing ? 'Update' : 'Add'} Candidate
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default RecruitmentTrainingPage;