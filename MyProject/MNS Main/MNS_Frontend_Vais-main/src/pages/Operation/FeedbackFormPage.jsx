import React, { useState } from 'react'
import FeedbackFormComponent from '../../component/Operation/FeedbackFormComponent'
import { Box, Tabs, Tab, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import ViewFormComponent from '../../component/Operation/ViewFormComponent'

const FeedbackFormPage = () => {
  const [tabValue, setTabValue] = useState(0)

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }

  // Dummy data for View Site Report tab
  const dummyReports = [
    {
      id: 1,
      siteName: "Solar Panel Installation - Zone A",
      location: "Pune, Maharashtra",
      date: "2025-07-20",
      time: "10:30 AM",
      executive: [
        {
          executiveName: "Rahul Sharma",
          visited: "yes",
          remark: "Site operational, no issues reported"
        },
        {
          executiveName: "Anjali Mehta",
          visited: "no",
          remark: "Was unavailable due to travel"
        }
      ],
      observation: "Site was inspected. Equipment functioning normally. One executive absent."
    },
    {
      id: 2,
      siteName: "Office Complex Security - Building B",
      location: "Mumbai, Maharashtra",
      date: "2025-07-18",
      time: "09:15 AM",
      executive: [
        {
          executiveName: "Vikram Patel",
          visited: "yes",
          remark: "All security protocols verified"
        }
      ],
      observation: "Security systems functioning properly. Staff well-trained and alert."
    },
    {
      id: 3,
      siteName: "Residential Complex - Green Valley",
      location: "Bangalore, Karnataka",
      date: "2025-07-15",
      time: "02:00 PM",
      executive: [
        {
          executiveName: "Priya Singh",
          visited: "yes",
          remark: "Maintenance issues identified"
        },
        {
          executiveName: "Rajesh Kumar",
          visited: "yes",
          remark: "Security staff training completed"
        }
      ],
      observation: "Some maintenance issues in common areas. Security staff properly trained. Follow-up required in 2 weeks."
    }
  ]

  return (
    <Box sx={{ width: '100%', p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Site Visit Reports
      </Typography>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="site report tabs">
          <Tab label="Add Site Report" />
          <Tab label="View Site Reports" />
        </Tabs>
      </Box>
      
      {/* Tab Panel Content */}
      <Box sx={{ mt: 2 }}>
        {tabValue === 0 ? (
          // Add Site Report Tab Content
          <FeedbackFormComponent />
        ) : (
          // View Site Reports Tab Content
          <ViewFormComponent/>
        )}
      </Box>
    </Box>
  )
}

export default FeedbackFormPage