import { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  CircularProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import { backendDomainR1 } from "../../common/index";
import toast from "react-hot-toast";

const API_URL = `${backendDomainR1}/api/v1/mns/operation`;

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editProjectData, setEditProjectData] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await axios.get(API_URL);
      setProjects(response?.data?.data || []);
    } catch (error) {
      // console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (project) => {
    setEditProjectData(project);
    setOpenEditDialog(true);
  };

  const handleUpdateProject = async () => {
    if (!editProjectData) return;
    try {
      await axios.put(
        `${API_URL}/update/${editProjectData?.id}`,
        editProjectData
      );
      // alert("Project updated successfully!");
      toast.success("Project updated successfully!");
      setOpenEditDialog(false);
      fetchProjects();
    } catch (error) {
      // console.error("Error updating project:", error);
      // alert("Failed to update project!");
      toast.error(error.response?.data?.message || "Failed to update project!");
    }
  };

  const handleDelete = async (projectId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this project?"
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(`${API_URL}/delete/${projectId}`);
      // alert("Project deleted successfully!");
      toast.success("Project deleted successfully!");
      fetchProjects();
    } catch (error) {
      // console.error("Error deleting project:", error);
      // alert("Failed to delete project!");
      toast.error(error.response?.data?.message || "Failed to delete project!");
    }
  };

  if (loading)
    return (
      <Box textAlign="center" mt={4}>
        <CircularProgress />
      </Box>
    );

  return (
    <Box sx={{ maxWidth: 900, margin: "auto", mt: 4, p: 2 }}>
      <Typography variant="h4" gutterBottom align="center">
        Project List
      </Typography>

      {projects?.length === 0 ? (
        <Typography variant="body1" align="center">
          No projects found.
        </Typography>
      ) : (
        projects.map((project, index) => (
          <Card key={project.id} sx={{ mb: 3, boxShadow: 3, p: 2 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Project {index + 1}: {project.projectName}
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography>
                    <strong>Start Date:</strong> {project.startDate || "N/A"}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography>
                    <strong>Deadline:</strong> {project.deadlineDate || "N/A"}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography>
                    <strong>Employees:</strong> {project.numberOfEmp || 0}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography>
                    <strong>Total Work Days:</strong> {project.totalWorkDays || 0}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography>
                    <strong>Staff Cost:</strong> ${(project.totalStaffCost || 0).toFixed(2)}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography>
                    <strong>Material Cost:</strong> ${(project.totalMaterialCost || 0).toFixed(2)}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography>
                    <strong>Total Budget:</strong> ${(project.projectBudget || 0).toFixed(2)}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography>
                    <strong>Status:</strong> {project.currentStatus || "N/A"}
                  </Typography>
                </Grid>
              </Grid>

              <Button onClick={() => handleEdit(project)} variant="contained" color="primary" sx={{ mt: 2, mr: 1 }}>
                Edit
              </Button>
              <Button onClick={() => handleDelete(project.id)} variant="contained" color="secondary" sx={{ mt: 2 }}>
                Delete
              </Button>
            </CardContent>
          </Card>
        ))
      )}

      {/* Edit Project Dialog */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>Edit Project</DialogTitle>
        <DialogContent>
          <TextField
            label="Project Name"
            fullWidth
            value={editProjectData?.projectName || ""}
            onChange={(e) =>
              setEditProjectData({ ...editProjectData, projectName: e.target.value })
            }
            sx={{ mb: 2 }}
          />
          <TextField
            label="Start Date"
            type="date"
            fullWidth
            value={editProjectData?.startDate || ""}
            onChange={(e) =>
              setEditProjectData({ ...editProjectData, startDate: e.target.value })
            }
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Deadline Date"
            type="date"
            fullWidth
            value={editProjectData?.deadlineDate || ""}
            onChange={(e) =>
              setEditProjectData({ ...editProjectData, deadlineDate: e.target.value })
            }
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleUpdateProject} color="primary">
            Update
          </Button>
          <Button onClick={() => setOpenEditDialog(false)} color="secondary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProjectList;



