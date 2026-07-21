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
} from "@mui/material";
import { IoMdClose } from "react-icons/io";
import { IoBusiness } from "react-icons/io5";
import { backendDomainR1 } from "../../common/index";
const ClientList = () => {
  const [clients, setClients] = useState([]);
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
  //   const [openModal, setOpenModl]=useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  // console.log("Current", currentItem);
  const fetchClients = async () => {
    try {
      const response = await axios.get(
        `${backendDomainR1}/api/v1/mns/crm`
      );
      setClients(response.data.data);
    } catch (error) {
      console.error("Error fetching clients:", error);
    }
  };
  useEffect(() => {
    fetchClients();
  }, []);
  const fetchClientDetails = async (clientId) => {
    try {
      const response = await axios.get(
        `${backendDomainR1}/api/v1/mns/crm/details/${clientId}`
      );
      setClientDetails(response.data);
      console.log(response.data);
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
        url = `${backendDomainR1}/api/v1/mns/crm/inquiry/${selectedClient.id}`;
        data = { inquiryText };
      } else if (modalType === "communication") {
        url = `${backendDomainR1}/api/v1/mns/crm/communication/${selectedClient.id}`;
        data = {
          summary: communicationSummary,
          type: communicationType,
          agentName: communicationAgentName,
          status: communicationStatus,
        };
      } else if (modalType === "feedback") {
        url = `${backendDomainR1}/api/v1/mns/crm/feedback/${selectedClient.id}`;
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
  return (
    <div className="container mx-auto p-6">
      <Typography variant="h4" gutterBottom>
      🏢   Client List
      </Typography>
      {/* Client Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>S. No</strong>
              </TableCell>
              <TableCell>
                <strong>Company Name</strong>
              </TableCell>
              <TableCell>
                <strong>Email</strong>
              </TableCell>
              <TableCell className="text-right" >
                <strong>Actions</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {clients?.map((client, index) => (
              <TableRow
                key={client.id}
                onClick={() => isOpenModal(client)}
                className="cursor-pointer"
              >
                <TableCell>{index + 1}</TableCell>
                <TableCell>{client.companyName}</TableCell>
                <TableCell>{client.companyEmail || "N/A"}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={(e) => openModal(e, client, "inquiry")}
                  >
                    Add Inquiry
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    sx={{ ml: 1 }}
                    onClick={(e) => openModal(e, client, "communication")}
                  >
                    Log Communication
                  </Button>
                  <Button
                    variant="contained"
                    color="success"
                    sx={{ ml: 1 }}
                    onClick={(e) => openModal(e, client, "feedback")}
                  >
                    Submit Feedback
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

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
              {currentItem.activeInquiries.map((inquiry, index) => (
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
              {currentItem.communicationHistory.map((comm, index) => (
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
              {currentItem.feedbackHistory.map((feedback, index) => (
                <div key={index} className="mb-3 p-3 bg-gray-100 rounded-lg shadow-sm">
                  <p><strong>📝 Feedback:</strong> {feedback.feedbackText}</p>
                  <p><strong>🌟 Rating:</strong> {feedback.rating}</p>
                  {/* <p><strong> By:</strong> {feedback.feedbackBy}</p> */}
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
      <Dialog open={showModal} onClose={() => setShowModal(false)}>
        <DialogTitle>
          {modalType === "inquiry"
            ? `Add Inquiry for ${selectedClient?.companyName}`
            : modalType === "communication"
            ? `Log Communication for ${selectedClient?.companyName}`
            : `Submit Feedback for ${selectedClient?.companyName}`}
        </DialogTitle>
        <DialogContent>
          {modalType === "inquiry" && (
            <TextField
              fullWidth
              variant="outlined"
              label="Inquiry Details"
              value={inquiryText}
              onChange={(e) => setInquiryText(e.target.value)}
              sx={{ mt: 2 }}
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
              />
              <FormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel>Rating</InputLabel>
                <Select
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                >
                  {[1, 2, 3, 4, 5].map((num) => (
                    <MenuItem key={num} value={num}>
                      {num}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {/* Fixing Status dropdown */}
              <FormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel>Status</InputLabel>
                <Select
                  value={feedbackStatus} // Make sure this is feedbackStatus, as it's for feedback status
                  onChange={(e) => setFeedbackStatus(e.target.value)} // Set the correct state
                >
                  <MenuItem value="NEW">New</MenuItem>
                  <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
                  <MenuItem value="RESOLVED">Resolved</MenuItem>
                </Select>
              </FormControl>
              {/* Fixing Resolved By dropdown */}
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
        <DialogActions>
          <Button onClick={() => setShowModal(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
export default ClientList;
