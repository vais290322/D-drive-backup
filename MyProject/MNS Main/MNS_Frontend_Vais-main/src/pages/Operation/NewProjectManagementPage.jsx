import React, { useState } from 'react'
import NewProjectFormComponent from '../../component/Operation/NewProjectFormComponent'
import ViewProjectComponent from '../../component/Operation/ViewProjectComponent'
import { Box, Tabs, Tab, Typography } from '@mui/material'

const NewProjectManagementPage = () => {
  const [tabValue, setTabValue] = useState(0)

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }

  return (
    <Box sx={{ width: '100%', p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Project Management
      </Typography>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="project management tabs">
          <Tab label="Add Project" />
          <Tab label="View Projects" />
        </Tabs>
      </Box>
      
      {/* Tab Panel Content */}
      <Box sx={{ mt: 2 }}>
        {tabValue === 0 ? (
          // Add Project Tab Content
          <NewProjectFormComponent />
        ) : (
          // View Projects Tab Content
          <ViewProjectComponent />
        )}
      </Box>
    </Box>
  )
}

export default NewProjectManagementPage