import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Tab,
  Tabs,
  AppBar,
  Box,
  Typography,
  DialogContentText
} from '@mui/material';
import { useSelector } from 'react-redux';
import { ProjectAllocationService } from '../services/api/projectAllocationService';

const ManageProjects = () => {
  const authToken = useSelector((state) => state.auth.authToken);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [openAllocatedEmployeesDialog, setOpenAllocatedEmployeesDialog] = useState(false);
const [allocatedEmployees, setAllocatedEmployees] = useState([]);

const handleCloseAllocatedEmployeesDialog = () => {
  setOpenAllocatedEmployeesDialog(false);
};

const handleViewAllocatedEmployees = (allocatedUsers) => {
  setAllocatedEmployees(allocatedUsers);
  setOpenAllocatedEmployeesDialog(true);
};


  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await ProjectAllocationService.getProjects(authToken);
      setProjects(response.projects);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const handleEditProject = (project) => {
    setSelectedProject(project);
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setSelectedProject(null);
    setOpenEditDialog(false);
  };

  const handleSaveProject = async () => {
    try {
      // Perform update API call
      await ProjectAllocationService.updateProject(selectedProject);
      fetchProjects();
      handleCloseEditDialog();
    } catch (error) {
      console.error('Error updating project:', error);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <div style={{ backgroundColor: 'white', borderRadius: '4px' }}>
      <AppBar position="static" style={{ backgroundColor: 'transparent', color: 'black' }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Manage Projects" />
          <Tab label="Create Project" />
        </Tabs>
      </AppBar>
      <TabPanel value={tabValue} index={0}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell style={{ textAlign: 'center', fontWeight: 'bold' }}>Title</TableCell>
                <TableCell style={{ textAlign: 'center', fontWeight: 'bold' }}>Details</TableCell>
                <TableCell style={{ textAlign: 'center', fontWeight: 'bold' }}>Allocated Employees</TableCell>
                <TableCell style={{ textAlign: 'center', fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {projects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell style={{ textAlign: 'center' }}>{project.title}</TableCell>
                  <TableCell style={{ textAlign: 'center' }}>{project.details}</TableCell>
                  <TableCell style={{ textAlign: 'center' }}>
                    <Button onClick={() => handleViewAllocatedEmployees(project.allocatedUsers)}>
                      View Allocated Employees
                    </Button>
                  </TableCell>
                  <TableCell style={{ textAlign: 'center' }}>
                    <Button onClick={() => handleEditProject(project)}>Edit</Button>
                    <Button>Delete</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
  {/* Create Project Form */}
  <div style={{ maxWidth: '400px', margin: '0 auto' }}>
    <TextField label="Project Title" fullWidth style={{ marginBottom: '10px' }} />
    <TextField label="Project Details" fullWidth multiline style={{ marginBottom: '10px' }} />
    <Button>Create Project</Button>
  </div>
</TabPanel>


<Dialog open={openEditDialog} onClose={handleCloseEditDialog}>
  <DialogTitle>Edit Project</DialogTitle>
  <DialogContent>
    {selectedProject && (
      <div style={{ maxWidth: '400px', margin: '0 auto' }}>
        <TextField
          label="Title"
          value={selectedProject.title}
          onChange={(e) =>
            setSelectedProject({ ...selectedProject, title: e.target.value })
          }
          fullWidth
          style={{ marginBottom: '10px' }}
        />
        <TextField
          label="Details"
          value={selectedProject.details}
          onChange={(e) =>
            setSelectedProject({ ...selectedProject, details: e.target.value })
          }
          fullWidth
          multiline
          style={{ marginBottom: '10px' }}
        />
      </div>
    )}
  </DialogContent>
  <DialogActions>
    <Button onClick={handleCloseEditDialog}>Cancel</Button>
    <Button onClick={handleSaveProject}>Save</Button>
  </DialogActions>
</Dialog>
{/* Dialog to view allocated employees */}
<Dialog
  open={openAllocatedEmployeesDialog}
  onClose={handleCloseAllocatedEmployeesDialog}
>
  <DialogTitle>Allocated Employees</DialogTitle>
  <DialogContent>
    {allocatedEmployees.map((employee) => (
      <DialogContentText key={employee.id}>
        {employee.name} - {employee.email}
      </DialogContentText>
    ))}
  </DialogContent>
  <DialogActions>
    <Button onClick={handleCloseAllocatedEmployeesDialog}>Close</Button>
  </DialogActions>
</Dialog>


    </div>
  );
};

const TabPanel = ({ children, value, index }) => (
  <div role="tabpanel" hidden={value !== index}>
    {value === index && <Box p={3}>{children}</Box>}
  </div>
);

export default ManageProjects;
