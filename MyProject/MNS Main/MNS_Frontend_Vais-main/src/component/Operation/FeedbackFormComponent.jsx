import {
  Box,
  Button,
  CircularProgress,
  Grid,
  Paper,
  Radio,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { backendDomainR1 } from "../../Common/index";

const FeedbackFormComponent = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    siteName: "",
    locationAddress: "",
    date: new Date().toISOString().split("T")[0],
    time: new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    executiveName: "",
    checklistItems: [
      {
        id: 1,
        description: "Are the Security Guards/H/Keepers well groomed",
        status: "",
        remarks: "",
      },
      {
        id: 2,
        description:
          "Attendance Register Make sure the required strength is complete.",
        status: "",
        remarks: "",
      },
      { id: 3, description: "Check all Registers.", status: "", remarks: "" },
      {
        id: 4,
        description: "Are they maintaining handing over & taking properly.",
        status: "",
        remarks: "",
      },
      {
        id: 5,
        description:
          "Are all Security guards and House Keepers alert on their duty",
        status: "",
        remarks: "",
      },
      {
        id: 6,
        description:
          "Are you ensure all posted Security Guards & House Keeping have the ESIC Card & Valid ID Card",
        status: "",
        remarks: "",
      },
      {
        id: 7,
        description:
          "Verify that all posted security guards and housekeepers are not under the influence of alcohol.",
        status: "",
        remarks: "",
      },
      {
        id: 8,
        description: "Posted all staff behaviour polite and good.",
        status: "",
        remarks: "",
      },
      {
        id: 9,
        description:
          "Maintaining the checklist of House Keeping & regular activities.",
        status: "",
        remarks: "",
      },
      {
        id: 10,
        description: "Daily briefing or maintaining Duty Roster.",
        status: "",
        remarks: "",
      },
      { id: 11, description: "Patrolling Register.", status: "", remarks: "" },
      {
        id: 12,
        description:
          "Check when the periodic training was conducted by the office.",
        status: "",
        remarks: "",
      },
      {
        id: 13,
        description: "Night patrolling was conducted.",
        status: "",
        remarks: "",
      },
      {
        id: 14,
        description: "Are emergency contact numbers posted on the wall?",
        status: "",
        remarks: "",
      },
      {
        id: 15,
        description: "Met the client and take his feedback",
        status: "",
        remarks: "",
      },
      { id: 16, description: "Invoice status.", status: "", remarks: "" },
      {
        id: 17,
        description:
          "Are there trained security personnel accessible to workers in a timely manner?",
        status: "",
        remarks: "",
      },
      {
        id: 18,
        description: "Is the parking lot attended or otherwise secure?",
        status: "",
        remarks: "",
      },
      {
        id: 19,
        description:
          "Are workers trained in the emergency response plan (for example, escape routes, notifying the proper authorities?",
        status: "",
        remarks: "",
      },
      {
        id: 20,
        description:
          "Are Security Guard and Housekeeping Staff are trained in how to handle difficult customers?",
        status: "",
        remarks: "",
      },
      {
        id: 21,
        description:
          "Are Security Guard and Housekeeping Staff are trained in personal safety and self-defense?",
        status: "",
        remarks: "",
      },
      {
        id: 22,
        description: "Are there enough exits and adequate routes of escape?",
        status: "",
        remarks: "",
      },
      {
        id: 23,
        description:
          "Can exit doors be opened only from the inside to prevent unauthorized entry?",
        status: "",
        remarks: "",
      },
      {
        id: 24,
        description:
          "Is a Secure place available for workers to store their personal belongings?",
        status: "",
        remarks: "",
      },
      {
        id: 25,
        description: "Panic buttons (portable or fixed)?",
        status: "",
        remarks: "",
      },
      { id: 26, description: "Alarm systems?", status: "", remarks: "" },
      {
        id: 27,
        description: "Internal phone system to activate emergency assistance?",
        status: "",
        remarks: "",
      },
      {
        id: 28,
        description:
          "Are authorized visitors to the building required to wear ID badges?",
        status: "",
        remarks: "",
      },
      {
        id: 29,
        description:
          "Ensure that all required housekeeping materials are available or not ?",
        status: "",
        remarks: "",
      },
      {
        id: 30,
        description:
          "Kindly verify that all areas served by housekeeping staff are maintained in a clean condition .",
        status: "",
        remarks: "",
      },
      {
        id: 31,
        description: "Verify that the SOPs at all sites are being followed.",
        status: "",
        remarks: "",
      },
      {
        id: 32,
        description:
          "Is there enough lighting to see clearly in inside and outside the Premises where workers must go?",
        status: "",
        remarks: "",
      },
    ],
    observations: "",
    complaints: "",
    convenience: "",
  });
  const [sites, setSites] = useState([]);
  const [filteredSites, setFilteredSites] = useState([]);

  console.log("all from data : ", formData);

  const fetchSites = async () => {
    // setLoading(true);
    try {
      const response = await axios.get(`${backendDomainR1}/api/v1/payroll/fetch/wage-Details`);
      // console.log("response : ",response);
      if (response.data.success) {
        setSites(response?.data?.data || []);
      }
    } catch (error) {
      // toast.error('Failed to fetch projects');
      // console.error('Error fetching projects:', error);
    } finally {
      // setLoading(false);
    }
  };

  useEffect(() => {
    fetchSites();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleChecklistChange = (id, field, value) => {
    setFormData({
      ...formData,
      checklistItems: formData.checklistItems.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (
      !formData.siteName ||
      !formData.locationAddress ||
      !formData.executiveName
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Check if all checklist items have a status
    const incompleteItems = formData.checklistItems.filter(
      (item) => !item.status
    );
    if (incompleteItems.length > 0) {
      toast.error(
        `Please complete all checklist items (${incompleteItems.length} remaining)`
      );
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${backendDomainR1}/api/v1/site-visits`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data && response.data.success) {
        toast.success("Site visit report submitted successfully!");
        // Reset form or redirect
        resetForm();
      } else {
        throw new Error(response.data?.message || "Failed to submit report");
      }
    } catch (error) {
      console.error("Error submitting site visit report:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to submit report. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      ...formData,
      siteName: "",
      locationAddress: "",
      executiveName: "",
      checklistItems: formData.checklistItems.map((item) => ({
        ...item,
        status: "",
        remarks: "",
      })),
      observations: "",
      complaints: "",
      convenience: "",
    });
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3, p: 2 }}>
      <Typography variant="h4" gutterBottom align="center">
        Site Visit Report
      </Typography>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6} className="relative">
          <TextField
            fullWidth
            label="Site Name"
            name="siteName"
            value={formData.siteName}
            onChange={(e) => {
              handleInputChange(e);
              const searchTerm = e.target.value.toLowerCase();

              setFilteredSites(
                sites.filter((site) =>
                  site.siteName.toLowerCase().includes(searchTerm)
                )
              );
            }}
            required
            margin="normal"
          />
          {filteredSites.length > 0 && (
            <div
              style={{
                position: "absolute",
                background: "white",
                border: "1px solid #ccc",
                zIndex: 1000,
                maxHeight: "150px",
                overflowY: "auto",
                width: "100%",
              }}
            >
              {filteredSites.map((site) => (
                <div
                  key={site.id}
                  style={{ padding: "8px", cursor: "pointer" }}
                  onClick={() => {
                    setFormData({
                      ...formData,
                      siteName: site.siteName,
                      locationAddress: site.locationAddress,
                      executiveName: site.vendorName,
                    });
                    setFilteredSites([]);
                  }}
                >
                  {site.siteName}
                </div>
              ))}
            </div>
          )}
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Location Address"
            name="locationAddress"
            value={formData.locationAddress}
            onChange={handleInputChange}
            required
            margin="normal"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Executive Name"
            name="executiveName"
            value={formData.executiveName}
            onChange={handleInputChange}
            required
            margin="normal"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Date"
            type="date"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Time"
            type="time"
            name="time"
            value={formData.time}
            onChange={handleInputChange}
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
      </Grid>

      <TableContainer component={Paper} sx={{ mb: 3 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell width="5%">Sl. No.</TableCell>
              <TableCell width="50%">Description</TableCell>
              <TableCell width="5%" align="center">
                Yes
              </TableCell>
              <TableCell width="5%" align="center">
                No
              </TableCell>
              <TableCell width="5%" align="center">
                N/A
              </TableCell>
              <TableCell width="15%">Remarks</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {formData.checklistItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.id}</TableCell>
                <TableCell>{item.description}</TableCell>
                <TableCell align="center">
                  <Radio
                    checked={item.status === "Yes"}
                    onChange={() =>
                      handleChecklistChange(item.id, "status", "Yes")
                    }
                    value="Yes"
                    name={`status-${item.id}`}
                  />
                </TableCell>
                <TableCell align="center">
                  <Radio
                    checked={item.status === "No"}
                    onChange={() =>
                      handleChecklistChange(item.id, "status", "No")
                    }
                    value="No"
                    name={`status-${item.id}`}
                  />
                </TableCell>
                <TableCell align="center">
                  <Radio
                    checked={item.status === "Not Applicable"}
                    onChange={() =>
                      handleChecklistChange(item.id, "status", "Not Applicable")
                    }
                    value="Not Applicable"
                    name={`status-${item.id}`}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    fullWidth
                    size="small"
                    value={item.remarks}
                    onChange={(e) =>
                      handleChecklistChange(item.id, "remarks", e.target.value)
                    }
                    variant="outlined"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Convenience Fee"
          name="convenience"
          value={formData.convenience}
          onChange={handleInputChange}
          required
          margin="normal"
          type="number"
          InputProps={{ inputProps: { min: 0 } }}
        />
      </Grid>

      <TextField
        fullWidth
        label="Observations"
        name="observations"
        value={formData.observations}
        onChange={handleInputChange}
        multiline
        rows={4}
        margin="normal"
        placeholder="Have You noticed any observations"
      />

      <TextField
        fullWidth
        label="Complaints"
        placeholder="Have You any complaints"
        name="complaints"
        value={formData.complaints}
        onChange={handleInputChange}
        multiline
        rows={4}
        margin="normal"
      />

      <Box sx={{ mt: 3, display: "flex", justifyContent: "center" }}>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          size="large"
          disabled={loading}
          sx={{ minWidth: 150 }}
        >
          {loading ? <CircularProgress size={24} /> : "Submit Report"}
        </Button>
      </Box>
    </Box>
  );
};

export default FeedbackFormComponent;
