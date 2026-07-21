import { useState } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import toast from "react-hot-toast";
import { backendDomainN, backendDomainR1 } from "../../common/index";

const API_URL = `${backendDomainR1}/api/v1/mns/operation/create`;
const EMPLOYEE_SEARCH_API =
  `${backendDomainN}/api/employees/search?email=`;

const CreateProject = () => {
  const [project, setProject] = useState(null);
  const [formData, setFormData] = useState({
    projectName: "",
    startDate: "",
    deadlineDate: "",
    currentStatus: "started",
  });
  const [openPopup, setOpenPopup] = useState(false);
  const [recordData, setRecordData] = useState({
    email: "",
    employeeCost: "",
    materialCost: "",
  });
  const [employeeDetails, setEmployeeDetails] = useState(null);
  const [filteredEmails, setFilteredEmails] = useState([]);
  const [debounceTimeout, setDebounceTimeout] = useState(null);
  const [projectRecords, setProjectRecords] = useState([]);
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleRecordChange = (e) => {
    setRecordData({ ...recordData, [e.target.name]: e.target.value });
  };
  
  const fetchSearchResults = async (email) => {
    try {
      const response = await axios.get(`${EMPLOYEE_SEARCH_API}${email}`);
  
      if (response?.data) {
        setFilteredEmails(response.data || []);
      } else {
        setFilteredEmails([]);
      }
    } catch (error) {
      // console.error("Error fetching employee data:", error);
      setFilteredEmails([]);
    }
  };
  
  const handleEmailChange = (e) => {
    const email = e.target.value;
    setRecordData({ ...recordData, email });
  
    if (email.length > 0) {
      if (debounceTimeout) {
        clearTimeout(debounceTimeout);
      }
      const timeout = setTimeout(() => {
        fetchSearchResults(email);
      }, 300);
      setDebounceTimeout(timeout);
    } else {
      setFilteredEmails([]);
    }
  };
  
  const handleSelectEmail = (selectedEmployee) => {
    setEmployeeDetails(selectedEmployee);
    setRecordData((prev) => ({
      ...prev,
      email: selectedEmployee.email, 
    }));
    setFilteredEmails([]);
  };
  
  const createProject = async () => {
    try {
      if (!formData.projectName || !formData.startDate || !formData.deadlineDate) {
        toast.error("Please fill all required fields");
        return;
      }
  
      const response = await axios.post(API_URL, formData);
      if (response?.data?.data) {
        setProject(response.data.data);
        toast.success("Project created successfully!");
        setFormData({
          projectName: "",
          startDate: "",
          deadlineDate: "",
          currentStatus: "started",
        });
        // Fetch project records after creation
        fetchProjectRecords(response.data.data.id);
      } else {
        throw new Error("Invalid response from API");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create project!");
    }
  };
  
  const fetchProjectRecords = async (projectId) => {
    try {
      const response = await axios.get(`${backendDomainR1}/api/v1/mns/operation/records/${projectId}`);
      if (response?.data?.data) {
        setProjectRecords(response.data.data);
      }
    } catch (error) {
      toast.error("Failed to fetch project records");
    }
  };
  
  const addProjectRecord = async () => {
    if (!project?.id) {
      toast.error("Project ID is missing. Create a project first.");
      return;
    }
  
    if (!recordData.email || !recordData.employeeCost || !recordData.materialCost) {
      toast.error("Please fill all record fields");
      return;
    }
  
    try {
      const ADD_RECORD_API = `${backendDomainR1}/api/v1/mns/operation/add-record/${project.id}`;
      const response = await axios.post(ADD_RECORD_API, recordData);
      toast.success("Project record added successfully!");
      setOpenPopup(false);
      setRecordData({
        email: "",
        employeeCost: "",
        materialCost: "",
      });
      // Refresh project records
      fetchProjectRecords(project.id);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add project record!");
    }
  };
  
  return (
    <Box sx={{ maxWidth: 1200, margin: "auto", mt: 4, p: 2 }}>
      <Grid container spacing={3}>
        {/* Project Creation Form */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 2, mb: 3, height: '100%' }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Create New Project
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    label="Project Name"
                    name="projectName"
                    fullWidth
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Start Date"
                    type="date"
                    name="startDate"
                    fullWidth
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                    required
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Deadline Date"
                    type="date"
                    name="deadlineDate"
                    fullWidth
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={createProject}
                  >
                    Create Project
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
  
        {/* Project Details */}
        <Grid item xs={12} md={6}>
          {project && (
            <Card sx={{ p: 2, height: '100%' }}>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Project Details
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="h6">{project.projectName}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography>
                      <strong>Start Date:</strong> {new Date(project.startDate).toLocaleDateString()}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography>
                      <strong>Deadline:</strong> {new Date(project.deadlineDate).toLocaleDateString()}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography>
                      <strong>Status:</strong>{" "}
                      <span className={`px-2 py-1 rounded-full text-sm ${
                        project.currentStatus === "started" ? "bg-green-100 text-green-800" :
                        project.currentStatus === "completed" ? "bg-blue-100 text-blue-800" :
                        "bg-yellow-100 text-yellow-800"
                      }`}>
                        {project.currentStatus}
                      </span>
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography>
                      <strong>Budget:</strong> ${project.projectBudget || 0}
                    </Typography>
                  </Grid>
                </Grid>
  
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ mt: 2 }}
                  onClick={() => setOpenPopup(true)}
                >
                  Add Project Record
                </Button>
              </CardContent>
            </Card>
          )}
        </Grid>
  
        {/* Project Records Table */}
        {projectRecords.length > 0 && (
          <Grid item xs={12}>
            <TableContainer component={Paper} sx={{ mt: 3 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Employee Email</TableCell>
                    <TableCell align="right">Employee Cost ($)</TableCell>
                    <TableCell align="right">Material Cost ($)</TableCell>
                    <TableCell align="right">Total Cost ($)</TableCell>
                    <TableCell>Date Added</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {projectRecords.map((record, index) => (
                    <TableRow key={index}>
                      <TableCell>{record.email}</TableCell>
                      <TableCell align="right">{record.employeeCost}</TableCell>
                      <TableCell align="right">{record.materialCost}</TableCell>
                      <TableCell align="right">
                        {Number(record.employeeCost) + Number(record.materialCost)}
                      </TableCell>
                      <TableCell>
                        {new Date(record.createdAt).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        )}
      </Grid>
  
      <Dialog
        open={openPopup}
        onClose={() => setOpenPopup(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Add Project Record</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Employee Email"
                name="email"
                fullWidth
                value={recordData.email} // Ensures field updates with selection
                onChange={handleEmailChange}
              />
              {filteredEmails.length > 0 && (
                <div style={{ background: "#f9f9f9", padding: "8px" }}>
                  {filteredEmails.map((entry) => (
                    <div
                      key={entry.id}
                      style={{
                        padding: "8px",
                        borderBottom: "1px solid #ddd",
                        cursor: "pointer",
                      }}
                      onClick={() => handleSelectEmail(entry)}
                    >
                      {entry.email}
                    </div>
                  ))}
                </div>
              )}
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Employee Cost"
                name="employeeCost"
                type="number"
                fullWidth
                onChange={handleRecordChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Material Cost"
                name="materialCost"
                type="number"
                fullWidth
                onChange={handleRecordChange}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={addProjectRecord} color="primary">
            Add Record
          </Button>
          <Button onClick={() => setOpenPopup(false)} color="secondary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CreateProject;


