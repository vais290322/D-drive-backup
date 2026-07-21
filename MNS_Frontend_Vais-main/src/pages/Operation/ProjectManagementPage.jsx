import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Grid,
  CircularProgress,
  Chip,
  TablePagination,
  Avatar,
  Divider,
} from '@mui/material';
import { 
  Add, Edit, Delete, AddCircleOutline, Refresh, Visibility,
  InfoOutlined, CalendarToday, Event, AttachMoney, AccountBalanceWallet,
  Group, Schedule, Work 
} from '@mui/icons-material';
import toast from 'react-hot-toast';
import { backendDomainR1 } from '../../common/index';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { IndianRupee } from 'lucide-react';

const ProjectManagementPage = () => {
  const [projects, setProjects] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openAddRecordDialog, setOpenAddRecordDialog] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  
  // View details dialog states
  const [openViewDetailsDialog, setOpenViewDetailsDialog] = useState(false);
  const [projectDetails, setProjectDetails] = useState(null);
  
  // Pagination states
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  const [formData, setFormData] = useState({
    projectName: '',
    startDate: '',
    deadlineDate: '',
    currentStatus: 'started',
  });
  const [recordData, setRecordData] = useState({
    email: '',
    employeeCost: '',
    materialCost: '',
  });
  const [recordsList, setRecordsList] = useState([]);
  
  // Fetch projects on component mount
  useEffect(() => {
    fetchProjects();
  }, []);
  
  const fetchProjects = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${backendDomainR1}/api/v1/mns/operation`);
      if (response) {
        setProjects(response?.data?.data || []);
      }
    } catch (error) {
      toast.error('Failed to fetch projects');
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch project details for view dialog
  const fetchProjectDetails = async (projectId) => {
    try {
      setLoading(true);
      const response = await axios.get(`${backendDomainR1}/api/v1/mns/operation/${projectId}`);
      if (response && response.data && response.data.data) {
        setProjectDetails(response.data.data);
        setOpenViewDetailsDialog(true);
      }
    } catch (error) {
      toast.error('Failed to fetch project details');
      // console.error('Error fetching project details:', error);
    } finally {
      setLoading(false);
    }
  };

  const openViewDetailsModal = (project) => {
    fetchProjectDetails(project.id);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRecordInputChange = (e) => {
    const { name, value } = e.target;
    setRecordData({ ...recordData, [name]: value });
  };

  const addRecordToList = () => {
    if (!recordData.email || !recordData.employeeCost || !recordData.materialCost) {
      toast.error('Please fill all record fields');
      return;
    }
    setRecordsList([...recordsList, { ...recordData }]);
    setRecordData({
      email: '',
      employeeCost: '',
      materialCost: '',
    });
  };

  const removeRecordFromList = (index) => {
    const updatedRecords = [...recordsList];
    updatedRecords.splice(index, 1);
    setRecordsList(updatedRecords);
  };

  const handleAddProject = async () => {
    try {
      if (!formData.projectName || !formData.startDate || !formData.deadlineDate) {
        toast.error('Please fill all required fields');
        return;
      }
      const response = await axios.post(
        `${backendDomainR1}/api/v1/mns/operation/create`,
        formData
      );
      if (response) {
        toast.success('Project created successfully');
        setOpenAddDialog(false);
        fetchProjects();
        setFormData({
          projectName: '',
          startDate: '',
          deadlineDate: '',
          currentStatus: 'started',
        });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create project');
    }
  };

  const handleEditProject = async () => {
    try {
      if (!selectedProject || !formData.projectName) {
        toast.error('Invalid project data');
        return;
      }
      const response = await axios.put(
        `${backendDomainR1}/api/v1/mns/operation/update/${selectedProject.id}`,
        formData
      );
      if (response) {
        toast.success('Project updated successfully');
        setOpenEditDialog(false);
        fetchProjects();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update project');
    }
  };

  const handleDeleteProject = async () => {
    try {
      if (!selectedProject) return;
      const response = await axios.delete(
        `${backendDomainR1}/api/v1/mns/operation/delete/${selectedProject.id}`
      );
      if (response) {
        toast.success('Project deleted successfully');
        setConfirmDelete(false);
        fetchProjects();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete project');
    }
  };

  const handleAddRecord = async () => {
    try {
      if (!selectedProject) {
        toast.error('No project selected');
        return;
      }
      if (recordsList.length === 0 && 
          (!recordData.email || !recordData.employeeCost || !recordData.materialCost)) {
        toast.error('Please add at least one record');
        return;
      }
      // If form data exists but isn’t in the list yet, add it.
      let recordsToSend = [...recordsList];
      if (recordData.email && recordData.employeeCost && recordData.materialCost) {
        recordsToSend.push({ ...recordData });
      }
      const dataToSend = { recordDetails: recordsToSend };
      const response = await axios.post(
        `${backendDomainR1}/api/v1/mns/operation/add-record/${selectedProject.id}`,
        dataToSend
      );
      if (response) {
        toast.success('Records added successfully');
        setOpenAddRecordDialog(false);
        fetchProjects();
        setRecordData({
          email: '',
          employeeCost: '',
          materialCost: '',
        });
        setRecordsList([]);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add records');
    }
  };

  const openEditModal = (project) => {
    setSelectedProject(project);
    setFormData({
      projectName: project.projectName,
      startDate: project.startDate.split('T')[0],
      deadlineDate: project.deadlineDate.split('T')[0],
      currentStatus: project.currentStatus,
    });
    setOpenEditDialog(true);
  };

  const openDeleteConfirm = (project) => {
    setSelectedProject(project);
    setConfirmDelete(true);
  };

  const openAddRecordModal = (project) => {
    setSelectedProject(project);
    setRecordData({
      email: '',
      employeeCost: '',
      materialCost: '',
    });
    setRecordsList([]);
    setOpenAddRecordDialog(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'started':
        return { bg: '#e3f2fd', color: '#1976d2' };
      case 'in-progress':
        return { bg: '#fff8e1', color: '#f57c00' };
      case 'completed':
        return { bg: '#e8f5e9', color: '#388e3c' };
      case 'on-hold':
        return { bg: '#ffebee', color: '#d32f2f' };
      default:
        return { bg: '#f5f5f5', color: '#616161' };
    }
  };

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Get current page data
  const getCurrentPageData = () => {
    return projects.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  };

  // Export all projects to CSV
  const exportToCSV = () => {
    const headers = ["Project Name", "Start Date", "Deadline Date", "Status", "Budget"];
    const rows = projects.map(project => [
      project.projectName,
      new Date(project.startDate).toLocaleDateString(),
      new Date(project.deadlineDate).toLocaleDateString(),
      project.currentStatus,
      project.projectBudget || 0,
    ]);
    let csvContent = headers.join(",") + "\n";
    rows.forEach(row => {
      csvContent += row.join(",") + "\n";
    });
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "projects.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export all projects to PDF using jsPDF and autoTable
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Project Details", 14, 20);
    const tableColumn = ["Project Name", "Start Date", "Deadline Date", "Status", "Budget"];
    const tableRows = [];
    projects.forEach(project => {
      const projectData = [
        project.projectName,
        new Date(project.startDate).toLocaleDateString(),
        new Date(project.deadlineDate).toLocaleDateString(),
        project.currentStatus,
        project.projectBudget || 0,
      ];
      tableRows.push(projectData);
    });
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 30,
    });
    doc.save("projects.pdf");
  };

  // Download the current project details as a PDF
  const downloadProjectDetailsPDF = () => {
    if (!projectDetails) return;
    const doc = new jsPDF();
    doc.text("Project Details", 14, 20);
    const details = [
      ["Project Name", projectDetails.projectName],
      ["Status", projectDetails.currentStatus],
      ["Start Date", new Date(projectDetails.startDate).toLocaleDateString()],
      ["Deadline Date", new Date(projectDetails.deadlineDate).toLocaleDateString()],
      ["Total Staff Cost", "₹" + (projectDetails.totalStaffCost || 0)],
      ["Total Material Cost", "₹" + (projectDetails.totalMaterialCost || 0)],
      ["Project Budget", "₹" + (projectDetails.projectBudget || 0)],
      ["Number of Employees", projectDetails.employeeCount || 0],
      ["Total Work Days", projectDetails.totalWorkDays || 0],
    ];
    doc.autoTable({
      head: [["Field", "Value"]],
      body: details,
      startY: 30,
    });
    if (projectDetails.recordDetails && projectDetails.recordDetails.length > 0) {
      const recordTableBody = projectDetails.recordDetails.map((record) => {
        const employeeDetails = record.details?.data?.[0];
        return [
          employeeDetails ? employeeDetails.employeeName || "Unknown" : "Unknown",
          record.email,
          new Date(record.date).toLocaleDateString(),
          "₹" + record.employeeCost,
          "₹" + record.materialCost,
        ];
      });
      doc.autoTable({
        head: [["Employee", "Email", "Date", "Employee Cost", "Material Cost"]],
        body: recordTableBody,
        startY: doc.lastAutoTable.finalY + 10,
      });
    }
    doc.save(`${projectDetails.projectName.replace(/\s+/g, "_")}_details.pdf`);
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header with Export and Add Project Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          Project Management
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="outlined" color="primary" onClick={exportToCSV}>
            Export CSV
          </Button>
          <Button variant="outlined" color="secondary" onClick={exportToPDF}>
            Export PDF
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Add />}
            onClick={() => setOpenAddDialog(true)}
          >
            Add Project
          </Button>
        </Box>
      </Box>

      {/* Projects Table */}
      <TableContainer component={Paper} sx={{ mb: 1 }}>
        <Table>
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Project Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Start Date</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Deadline</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Budget</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }} align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <CircularProgress size={24} sx={{ mr: 2 }} />
                  Loading projects...
                </TableCell>
              </TableRow>
            ) : projects.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">No projects found</TableCell>
              </TableRow>
            ) : (
              getCurrentPageData().map((project) => {
                const statusStyle = getStatusColor(project.currentStatus);
                return (
                  <TableRow key={project.id} hover>
                    <TableCell>{project.projectName}</TableCell>
                    <TableCell>{new Date(project.startDate).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(project.deadlineDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Chip
                        label={project.currentStatus}
                        sx={{
                          backgroundColor: statusStyle.bg,
                          color: statusStyle.color,
                        }}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>₹{project.projectBudget || 0}</TableCell>
                    <TableCell align="center">
                      <IconButton
                        color="info"
                        onClick={() => openViewDetailsModal(project)}
                        title="View Details"
                        size="small"
                      >
                        <Visibility />
                      </IconButton>
                      <IconButton
                        color="primary"
                        onClick={() => openAddRecordModal(project)}
                        title="Add Record"
                        size="small"
                      >
                        <AddCircleOutline />
                      </IconButton>
                      <IconButton
                        color="secondary"
                        onClick={() => openEditModal(project)}
                        title="Edit Project"
                        size="small"
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => openDeleteConfirm(project)}
                        title="Delete Project"
                        size="small"
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        component="div"
        count={projects.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25, 50]}
      />

      {/* View Project Details Dialog with modern, inline design and scrollable table */}
      <Dialog 
        open={openViewDetailsDialog} 
        onClose={() => setOpenViewDetailsDialog(false)} 
        maxWidth="lg" 
        fullWidth
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <InfoOutlined sx={{ mr: 1 }} />
            Project Details
          </Box>
        </DialogTitle>
        <DialogContent sx={{ backgroundColor: '#f9f9f9', p: 3 }}>
          {projectDetails ? (
            <>
              {/* Inline details row */}
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 4,
                  mb: 2,
                }}
              >
                <Box sx={{ flex: 1, minWidth: '180px' }}>
                  <Typography variant="subtitle2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                    <Work fontSize="small" sx={{ mr: 0.5, verticalAlign: 'middle' }} />
                    Project Name
                  </Typography>
                  <Typography variant="body1">{projectDetails.projectName}</Typography>
                </Box>
                <Box sx={{ flex: 1, minWidth: '180px' }}>
                  <Typography variant="subtitle2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                    <InfoOutlined fontSize="small" sx={{ mr: 0.5, verticalAlign: 'middle' }} />
                    Status
                  </Typography>
                  <Chip
                    label={projectDetails.currentStatus}
                    sx={{
                      backgroundColor: getStatusColor(projectDetails.currentStatus).bg,
                      color: getStatusColor(projectDetails.currentStatus).color,
                      fontWeight: 'bold',
                      textTransform: 'capitalize',
                    }}
                  />
                </Box>
                <Box sx={{ flex: 1, minWidth: '180px' }}>
                  <Typography variant="subtitle2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                    <CalendarToday fontSize="small" sx={{ mr: 0.5, verticalAlign: 'middle' }} />
                    Start Date
                  </Typography>
                  <Typography variant="body1">
                    {new Date(projectDetails.startDate).toLocaleDateString()}
                  </Typography>
                </Box>
                <Box sx={{ flex: 1, minWidth: '180px' }}>
                  <Typography variant="subtitle2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                    <Event fontSize="small" sx={{ mr: 0.5, verticalAlign: 'middle' }} />
                    Deadline Date
                  </Typography>
                  <Typography variant="body1">
                    {new Date(projectDetails.deadlineDate).toLocaleDateString()}
                  </Typography>
                </Box>
              </Box>

              {/* Cost and employee info */}
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 4,
                  mb: 2,
                }}
              >
                <Box sx={{ flex: 1, minWidth: '180px' }}>
                  <Typography variant="subtitle2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                   <span className='flex gap-2'> <IndianRupee className='w-4 h-4 ' />
                   Total Staff Cost</span>
                  </Typography>
                  <Typography variant="body1">₹{projectDetails.totalStaffCost || 0}</Typography>
                </Box>
                <Box sx={{ flex: 1, minWidth: '180px' }}>
                  <Typography variant="subtitle2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                    {/* <AttachMoney fontSize="small" sx={{ mr: 0.5, verticalAlign: 'middle' }} /> */}
                    <span className='flex gap-2'> <IndianRupee className='w-4 h-4 ' />
                    Total Material Cost</span>
                  </Typography>
                  <Typography variant="body1">₹{projectDetails.totalMaterialCost || 0}</Typography>
                </Box>
                <Box sx={{ flex: 1, minWidth: '180px' }}>
                  <Typography variant="subtitle2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                    <AccountBalanceWallet fontSize="small" sx={{ mr: 0.5, verticalAlign: 'middle' }} />
                    Project Budget
                  </Typography>
                  <Typography variant="body1" color="primary" fontWeight="bold">
                  ₹{projectDetails.projectBudget || 0}
                  </Typography>
                </Box>
                <Box sx={{ flex: 1, minWidth: '180px' }}>
                  <Typography variant="subtitle2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                    <Group fontSize="small" sx={{ mr: 0.5, verticalAlign: 'middle' }} />
                    Number of Employees
                  </Typography>
                  <Typography variant="body1">{projectDetails.employeeCount || 0}</Typography>
                </Box>
                <Box sx={{ flex: 1, minWidth: '180px' }}>
                  <Typography variant="subtitle2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                    <Schedule fontSize="small" sx={{ mr: 0.5, verticalAlign: 'middle' }} />
                    Total Work Days
                  </Typography>
                  <Typography variant="body1">{projectDetails.totalWorkDays || 0}</Typography>
                </Box>
              </Box>

              <Divider sx={{ my: 3 }} />
              
              <Typography variant="h6" gutterBottom>
                Record Details ({projectDetails.recordDetails?.length || 0})
              </Typography>
              
              {projectDetails.recordDetails && projectDetails.recordDetails.length > 0 ? (
                <TableContainer
                  component={Paper}
                  variant="outlined"
                  sx={{ mt: 2, maxHeight: 300, overflow: 'auto' }}
                >
                  <Table size="small" stickyHeader>
                    <TableHead>
                      <TableRow>
                        <TableCell>Employee</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Employee Cost</TableCell>
                        <TableCell>Material Cost</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {projectDetails.recordDetails.map((record, index) => {
                        const employeeDetails = record.details?.data?.[0];
                        return (
                          <TableRow key={index}>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                {employeeDetails?.employeeImage ? (
                                  <Avatar 
                                    src={employeeDetails.employeeImage} 
                                    alt={employeeDetails.employeeName}
                                    sx={{ width: 30, height: 30, mr: 1 }}
                                  />
                                ) : (
                                  <Avatar 
                                    sx={{ width: 30, height: 30, mr: 1, bgcolor: 'primary.main' }}
                                  >
                                    {employeeDetails?.employeeName?.charAt(0) || 'U'}
                                  </Avatar>
                                )}
                                <Typography variant="body2">
                                  {employeeDetails?.employeeName || 'Unknown'}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell>{record.email}</TableCell>
                            <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                            <TableCell>₹{record.employeeCost}</TableCell>
                            <TableCell>₹{record.materialCost}</TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                  No records found for this project.
                </Typography>
              )}
            </>
          ) : (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={downloadProjectDetailsPDF} variant="contained" color="secondary">
            Download Details
          </Button>
          <Button onClick={() => setOpenViewDetailsDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Add Project Dialog */}
      <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)}>
        <DialogTitle>Add New Project</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Project Name"
                name="projectName"
                value={formData.projectName}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Start Date"
                name="startDate"
                type="date"
                value={formData.startDate}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Deadline Date"
                name="deadlineDate"
                type="date"
                value={formData.deadlineDate}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  name="currentStatus"
                  value={formData.currentStatus}
                  onChange={handleInputChange}
                  label="Status"
                >
                  <MenuItem value="started">Started</MenuItem>
                  <MenuItem value="in-progress">In Progress</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                  <MenuItem value="on-hold">On Hold</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddDialog(false)}>Cancel</Button>
          <Button onClick={handleAddProject} variant="contained" color="primary">
            Add Project
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Project Dialog */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>Edit Project</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Project Name"
                name="projectName"
                value={formData.projectName}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Start Date"
                name="startDate"
                type="date"
                value={formData.startDate}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Deadline Date"
                name="deadlineDate"
                type="date"
                value={formData.deadlineDate}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  name="currentStatus"
                  value={formData.currentStatus}
                  onChange={handleInputChange}
                  label="Status"
                >
                  <MenuItem value="started">Started</MenuItem>
                  <MenuItem value="in-progress">In Progress</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                  <MenuItem value="on-hold">On Hold</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>Cancel</Button>
          <Button onClick={handleEditProject} variant="contained" color="primary">
            Update Project
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Record Dialog */}
      <Dialog open={openAddRecordDialog} onClose={() => setOpenAddRecordDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Add Record to {selectedProject?.projectName}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Employee Email"
                name="email"
                value={recordData.email}
                onChange={handleRecordInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Employee Cost"
                name="employeeCost"
                type="number"
                value={recordData.employeeCost}
                onChange={handleRecordInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Material Cost"
                name="materialCost"
                type="number"
                value={recordData.materialCost}
                onChange={handleRecordInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={addRecordToList}
                sx={{ height: '56px' }}
              >
                Add
              </Button>
            </Grid>

            {recordsList.length > 0 && (
              <Grid item xs={12} sx={{ mt: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Records to Add ({recordsList.length})
                </Typography>
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Email</TableCell>
                        <TableCell>Employee Cost</TableCell>
                        <TableCell>Material Cost</TableCell>
                        <TableCell align="center">Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {recordsList.map((record, index) => (
                        <TableRow key={index}>
                          <TableCell>{record.email}</TableCell>
                          <TableCell>₹{record.employeeCost}</TableCell>
                          <TableCell>₹{record.materialCost}</TableCell>
                          <TableCell align="center">
                            <IconButton 
                              size="small" 
                              color="error" 
                              onClick={() => removeRecordFromList(index)}
                            >
                              <Delete fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddRecordDialog(false)}>Cancel</Button>
          <Button onClick={handleAddRecord} variant="contained" color="primary">
            {recordsList.length > 0 ? `Add ${recordsList.length + (recordData.email ? 1 : 0)} Records` : 'Add Record'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={confirmDelete} onClose={() => setConfirmDelete(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete project "{selectedProject?.projectName}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDelete(false)}>Cancel</Button>
          <Button onClick={handleDeleteProject} variant="contained" color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProjectManagementPage;
