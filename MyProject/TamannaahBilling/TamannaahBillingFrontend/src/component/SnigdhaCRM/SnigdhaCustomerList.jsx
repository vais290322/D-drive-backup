import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  IconButton,
  Chip,
  Tooltip,
  Box,
  Card,
  CardContent,
} from "@mui/material";
import { IoMdClose, IoMdSearch, IoMdRefresh } from "react-icons/io";
import { IoBusiness, IoFilter } from "react-icons/io5";
import { MdEmail, MdPhone, MdFeedback } from "react-icons/md";
import { FaHistory, FaQuestionCircle } from "react-icons/fa";
import { backendDomainR1 } from "../../Common/index";

const SnigdhaCustomerList = () => {
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [clientDetails, setClientDetails] = useState(null);
  const [modalType, setModalType] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [inquiryText, setInquiryText] = useState("");
  const [communicationSummary, setCommunicationSummary] = useState("");
  const [communicationType, setCommunicationType] = useState("");
  const [communicationAgentName, setCommunicationAgentName] = useState("");
  const [communicationStatus, setCommunicationStatus] = useState("");
  const [feedbackText, setFeedbackText] = useState("");
  const [rating, setRating] = useState(5);
  const [feedbackStatus, setFeedbackStatus] = useState("");
  const [resolvedBy, setResolvedBy] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);

  // conslo.log("all clients : ",clients);
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [segmentFilter, setSegmentFilter] = useState("all");
  
  // Get unique statuses and segments for filters
  const uniqueStatuses = [...new Set(clients?.map(client => client.status))].filter(Boolean);
  const uniqueSegments = [...new Set(clients?.map(client => client.segment))].filter(Boolean);

  const fetchClients = async () => {
    try {
      const response = await axios.get(
        `${backendDomainR1}/api/v1/mns/crm/s`
      );
      // console.log("all clients : ",response);
      setClients(response.data.data);
      setFilteredClients(response.data.data);
    } catch (error) {
      console.error("Error fetching clients:", error);
    }
  };
  
  useEffect(() => {
    fetchClients();
  }, []);
  
  // Apply filters whenever search term or filters change
  useEffect(() => {
    let result = clients;
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(client => 
        client.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.companyEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.contactPersonName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter(client => client.status === statusFilter);
    }
    
    // Apply segment filter
    if (segmentFilter !== "all") {
      result = result.filter(client => client.segment === segmentFilter);
    }
    
    setFilteredClients(result);
  }, [searchTerm, statusFilter, segmentFilter, clients]);

  const resetFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setSegmentFilter("all");
    setFilteredClients(clients);
  };

  const fetchClientDetails = async (clientId) => {
    try {
      const response = await axios.get(
        `${backendDomainR1}/api/v1/mns/crm/details/${clientId}/s`
      );
      setClientDetails(response.data);
    } catch (error) {
      console.error("Error fetching client details:", error);
    }
  };
  
  const openModal = (e, client, type) => {
    e.stopPropagation();
    setSelectedClient(client);
    setModalType(type);
    fetchClientDetails(client.id);
    setShowModal(true);
  };
  
  const isOpenModal = (item) => {
    setCurrentItem(item);
    setIsModalOpen(true);
  };
  
  const handleSubmit = async () => {
    if (!selectedClient) return;
    try {
      let url = "";
      let data = {};
      if (modalType === "inquiry") {
        url = `${backendDomainR1}/api/v1/mns/crm/inquiry/${selectedClient.id}/s`;
        data = { inquiryText };
      } else if (modalType === "communication") {
        url = `${backendDomainR1}/api/v1/mns/crm/communication/${selectedClient.id}/s`;
        data = {
          summary: communicationSummary,
          type: communicationType,
          agentName: communicationAgentName,
          status: communicationStatus,
        };
      } else if (modalType === "feedback") {
        url = `${backendDomainR1}/api/v1/mns/crm/feedback/${selectedClient.id}/s`;
        data = {
          feedbackText,
          rating,
          status: feedbackStatus,
          resolvedBy: resolvedBy,
        };
      }
      await axios.post(url, data);
      alert(
        `${
          modalType.charAt(0).toUpperCase() + modalType.slice(1)
        } submitted successfully!`
      );
      setShowModal(false);
      setInquiryText("");
      setCommunicationSummary("");
      setFeedbackText("");
      setRating(5);
      setCommunicationStatus("");
      setResolvedBy("");
      setFeedbackStatus("");
      fetchClients();
    } catch (error) {
      console.error(`Error submitting ${modalType}:`, error);
    }
  };
  
  // Get status color based on status value
  const getStatusColor = (status) => {
    switch(status?.toUpperCase()) {
      case 'ENGAGED':
        return '#4caf50';
      case 'INACTIVE':
        return '#f44336';
      case 'PROSPECT':
        return '#2196f3';
      case 'LEAD':
        return '#ff9800';
      default:
        return '#9e9e9e';
    }
  };
  
  // Get segment color based on segment value
  const getSegmentColor = (segment) => {
    switch(segment?.toUpperCase()) {
      case 'LEADS':
        return '#ff9800';
      case 'PROSPECTS':
        return '#2196f3';
      case 'CUSTOMERS':
        return '#4caf50';
      default:
        return '#9e9e9e';
    }
  };

  return (
    <div className="container mx-auto p-6">
      <Card elevation={3} sx={{ mb: 4, borderRadius: 2, overflow: 'hidden' }}>
        <Box sx={{ 
          p: 3, 
          background: 'linear-gradient(45deg, #1976d2 30%, #2196f3 90%)',
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IoBusiness size={32} /> Client Management 
          </Typography>
          <Box>
            <Button 
              variant="contained" 
              color="info" 
              onClick={() => setShowFilters(!showFilters)}
              startIcon={<IoFilter />}
              sx={{ mr: 1, bgcolor: 'rgba(255,255,255,0.2)' }}
            >
              Filters
            </Button>
            <Button 
              variant="contained" 
              color="info" 
              onClick={resetFilters}
              startIcon={<IoMdRefresh />}
              sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}
            >
              Reset
            </Button>
          </Box>
        </Box>
        
        {/* Search and Filters */}
        <CardContent>
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search by company name, email or contact person..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <IoMdSearch size={20} style={{ marginRight: '8px' }} />,
              }}
              sx={{ bgcolor: '#f5f5f5', borderRadius: 1 }}
            />
          </Box>
          
          {showFilters && (
            <Box sx={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: 2, 
              mb: 3, 
              p: 2, 
              bgcolor: '#f5f5f5', 
              borderRadius: 1,
              border: '1px solid #e0e0e0'
            }}>
              <FormControl sx={{ minWidth: 200 }}>
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  label="Status"
                >
                  <MenuItem value="all">All Statuses</MenuItem>
                  {uniqueStatuses?.map(status => (
                    <MenuItem key={status} value={status}>
                      {status}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <FormControl sx={{ minWidth: 200 }}>
                <InputLabel>Segment</InputLabel>
                <Select
                  value={segmentFilter}
                  onChange={(e) => setSegmentFilter(e.target.value)}
                  label="Segment"
                >
                  <MenuItem value="all">All Segments</MenuItem>
                  {uniqueSegments?.map(segment => (
                    <MenuItem key={segment} value={segment}>
                      {segment}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                  {filteredClients?.length} clients found
                </Typography>
              </Box>
            </Box>
          )}
          
          {/* Client Table */}
          <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 1 }}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                  <TableCell>
                    <strong>S. No</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Company Name</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Email</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Status</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Segment</strong>
                  </TableCell>
                  <TableCell align="center">
                    <strong>Actions</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredClients?.length > 0 ? (
                  filteredClients?.map((client, index) => (
                    <TableRow
                      key={client.id}
                      onClick={() => isOpenModal(client)}
                      className="cursor-pointer"
                      sx={{ 
                        '&:hover': { 
                          bgcolor: 'rgba(33, 150, 243, 0.08)',
                          transition: 'background-color 0.3s'
                        }
                      }}
                    >
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <IoBusiness color="#1976d2" />
                          <Typography fontWeight="medium">{client.companyName}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <MdEmail color="#757575" />
                          {client.companyEmail || "N/A"}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={client.status || "Unknown"} 
                          size="small"
                          sx={{ 
                            bgcolor: `${getStatusColor(client.status)}20`, 
                            color: getStatusColor(client.status),
                            fontWeight: 'medium'
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={client.segment || "Unknown"} 
                          size="small"
                          sx={{ 
                            bgcolor: `${getSegmentColor(client.segment)}20`, 
                            color: getSegmentColor(client.segment),
                            fontWeight: 'medium'
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                          <Tooltip title="Add Inquiry">
                            <IconButton
                              color="primary"
                              onClick={(e) => openModal(e, client, "inquiry")}
                              size="small"
                              sx={{ bgcolor: 'rgba(33, 150, 243, 0.1)' }}
                            >
                              <FaQuestionCircle />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Log Communication">
                            <IconButton
                              color="secondary"
                              onClick={(e) => openModal(e, client, "communication")}
                              size="small"
                              sx={{ bgcolor: 'rgba(156, 39, 176, 0.1)' }}
                            >
                              <FaHistory />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Submit Feedback">
                            <IconButton
                              color="success"
                              onClick={(e) => openModal(e, client, "feedback")}
                              size="small"
                              sx={{ bgcolor: 'rgba(76, 175, 80, 0.1)' }}
                            >
                              <MdFeedback />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                        <IoMdSearch size={40} color="#9e9e9e" />
                        <Typography variant="h6" color="text.secondary">
                          No clients found matching your criteria
                        </Typography>
                        <Button 
                          variant="outlined" 
                          color="primary" 
                          onClick={resetFilters}
                          startIcon={<IoMdRefresh />}
                        >
                          Reset Filters
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Customer Details Modal */}
      {isModalOpen && currentItem && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
          <div className="bg-white w-[60%] max-h-[85vh] overflow-hidden rounded-lg shadow-2xl p-6 relative">
            
            {/* Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute cursor-pointer top-3 right-3 text-gray-500 hover:text-gray-700 transition-all"
            >
              <IoMdClose size={24} />
            </button>

            {/* Modal Header */}
            <h2 className="text-3xl font-semibold text-gray-800 border-b pb-4 mb-4 flex items-center">
              <span className="text-blue-600 mr-2">
                <IoBusiness size={30} />
              </span>
              Customer Details
            </h2>

            {/* Scrollable Content */}
            <div className="max-h-[65vh] overflow-y-auto pr-3">
              {/* Customer Info */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Company Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <p><strong>📌 Name:</strong> {currentItem.companyName}</p>
                  <p><strong>🏢 Category:</strong> {currentItem.companyCategory}</p>
                  <p><strong>☎️ Landline:</strong> {currentItem.landlineNumber}</p>
                  <p><strong>🔖 Status:</strong> {currentItem.status}</p>
                  <p><strong>👤 Contact Person:</strong> {currentItem.contactPersonName}</p>
                  <p><strong>📧 Email:</strong> {currentItem.contactPersonEmail}</p>
                  <p><strong>📞 Alternate Number:</strong> {currentItem.companyAlternativeNumber}</p>
                  <p><strong>📍 Address:</strong> {currentItem.companyAddress?.join(', ')}</p>
                </div>
              </div>

              {/* Active Inquiries */}
              {currentItem.activeInquiries?.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">📂 Active Inquiries</h3>
                  <div className="border-l-4 border-blue-500 pl-4">
                    {currentItem.activeInquiries?.map((inquiry, index) => (
                      <div key={index} className="mb-3 p-3 bg-gray-100 rounded-lg shadow-sm">
                        <p><strong>📅 Date:</strong> {inquiry.createdDate}</p>
                        <p><strong>📌 Inquiry:</strong> {inquiry.inquiryText}</p>
                        <p><strong>🟢 Status:</strong> {inquiry.status}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Communication History */}
              {currentItem.communicationHistory?.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">📞 Communication History</h3>
                  <div className="border-l-4 border-green-500 pl-4">
                    {currentItem.communicationHistory?.map((comm, index) => (
                      <div key={index} className="mb-3 p-3 bg-gray-100 rounded-lg shadow-sm">
                        <p><strong>👤 Agent:</strong> {comm.agentName}</p>
                        <p><strong>✅ Status:</strong> {comm.status}</p>
                        <p><strong>📄 Summary:</strong> {comm.summary}</p>
                        <p><strong>⏳ Date:</strong> {comm.timestamp}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Feedback History */}
              {currentItem.feedbackHistory?.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">⭐ Feedback History</h3>
                  <div className="border-l-4 border-yellow-500 pl-4">
                    {currentItem?.feedbackHistory?.map((feedback, index) => (
                      <div key={index} className="mb-3 p-3 bg-gray-100 rounded-lg shadow-sm">
                        <p><strong>📝 Feedback:</strong> {feedback.feedbackText}</p>
                        <p><strong>🌟 Rating:</strong> {feedback.rating}</p>
                        <p><strong>👤 Resolved By:</strong> {feedback.resolvedBy}</p>
                        <p><strong>⏳ Date:</strong> {feedback.feedbackDate}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer with Close Button */}
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-5 rounded-lg shadow-md transition-all flex items-center"
              >
                <IoMdClose size={18} className="mr-2" />
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dynamic Modal */}
      <Dialog open={showModal} onClose={() => setShowModal(false)} maxWidth="md" PaperProps={{ sx: { borderRadius: 2 } }}>
        <DialogTitle sx={{ 
          background: modalType === "inquiry" 
            ? 'linear-gradient(45deg, #1976d2 30%, #2196f3 90%)' 
            : modalType === "communication" 
            ? 'linear-gradient(45deg, #9c27b0 30%, #ba68c8 90%)' 
            : 'linear-gradient(45deg, #4caf50 30%, #81c784 90%)',
          color: 'white',
          fontWeight: 'bold'
        }}>
          {modalType === "inquiry"
            ? `Add Inquiry for ${selectedClient?.companyName}`
            : modalType === "communication"
            ? `Log Communication for ${selectedClient?.companyName}`
            : `Submit Feedback for ${selectedClient?.companyName}`}
        </DialogTitle>
        <DialogContent sx={{ mt: 2, minWidth: '500px' }}>
          {modalType === "inquiry" && (
            <TextField
              fullWidth
              variant="outlined"
              label="Inquiry Details"
              value={inquiryText}
              onChange={(e) => setInquiryText(e.target.value)}
              sx={{ mt: 2 }}
              multiline
              rows={4}
            />
          )}
          {modalType === "communication" && (
            <>
              <TextField
                fullWidth
                variant="outlined"
                label="Communication Summary"
                value={communicationSummary}
                onChange={(e) => setCommunicationSummary(e.target.value)}
                sx={{ mt: 2 }}
                multiline
                rows={4}
              />
              <FormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel>Communication Type</InputLabel>
                <Select
                  value={communicationType}
                  onChange={(e) => setCommunicationType(e.target.value)}
                >
                  <MenuItem value="CHAT">Chat</MenuItem>
                  <MenuItem value="CALL">Call</MenuItem>
                  <MenuItem value="EMAIL">Email</MenuItem>
                  <MenuItem value="MEETING">Meeting</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth sx={{ mt: 2 }}>
                <TextField
                  label="Agent Name"
                  variant="outlined"
                  value={communicationAgentName}
                  onChange={(e) => setCommunicationAgentName(e.target.value)}
                />
              </FormControl>
              <FormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel>Status</InputLabel>
                <Select
                  value={communicationStatus}
                  onChange={(e) => setCommunicationStatus(e.target.value)}
                >
                  <MenuItem value="FOLLOWUP_NEEDED">Follow-Up Needed</MenuItem>
                  <MenuItem value="OPEN">Open</MenuItem>
                  <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
                  <MenuItem value="RESOLVED">Resolved</MenuItem>
                </Select>
              </FormControl>
            </>
          )}
          {modalType === "feedback" && (
            <>
              <TextField
                fullWidth
                variant="outlined"
                label="Feedback Text"
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                sx={{ mt: 2 }}
                multiline
                rows={4}
              />
              <FormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel>Rating</InputLabel>
                <Select
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                >
                  {[1, 2, 3, 4, 5].map((num) => (
                    <MenuItem key={num} value={num}>
                      {Array(num).fill('⭐').join('')}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel>Status</InputLabel>
                <Select
                  value={feedbackStatus}
                  onChange={(e) => setFeedbackStatus(e.target.value)}
                >
                  <MenuItem value="NEW">New</MenuItem>
                  <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
                  <MenuItem value="RESOLVED">Resolved</MenuItem>
                </Select>
              </FormControl>
              <TextField
                fullWidth
                variant="outlined"
                label="Resolved By"
                value={resolvedBy}
                onChange={(e) => setResolvedBy(e.target.value)}
                sx={{ mt: 2 }}
              />
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button 
            onClick={() => setShowModal(false)} 
            color="inherit"
            variant="outlined"
            startIcon={<IoMdClose />}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained" 
            color={
              modalType === "inquiry" 
                ? "primary" 
                : modalType === "communication" 
                ? "secondary" 
                : "success"
            }
            sx={{ px: 3 }}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default SnigdhaCustomerList;



