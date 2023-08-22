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
  DialogContentText,
  Tooltip,
  Pagination,
  Grid
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
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalElements, setTotalElements] = useState(null);
  const [newProjectTitle, setNewProjectTitle] = useState('');
  const [newProjectDetails, setNewProjectDetails] = useState('');

  const handleCreateProject = async () => {
    try {
      // Prepare the new project data
      const newProjectData = {
        title: newProjectTitle,
        details: newProjectDetails,
        // Add any other necessary fields here
      };

      // Call the API to create the project
      await ProjectAllocationService.createProject(newProjectData, authToken);

      // Fetch updated project list
      fetchProjects();

      // Clear the new project data fields
      setNewProjectTitle('');
      setNewProjectDetails('');

      // Close the create project dialog or take any necessary action
      // ... (you can implement this based on your UI/UX design)
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  const handleCloseAllocatedEmployeesDialog = () => {
    setOpenAllocatedEmployeesDialog(false);
  };

  const handleViewAllocatedEmployees = (allocatedUsers) => {
    setAllocatedEmployees(allocatedUsers);
    setOpenAllocatedEmployeesDialog(true);
  };

  const fetchProjects = async () => {
    try {
      const response = await ProjectAllocationService.getProjects(rowsPerPage, page, authToken);
      console.log(response);
      setProjects(response.projects);
      setTotalElements(response.totalElements);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };


    useEffect(() => {
      fetchProjects();
    }, []);

    useEffect(() => {
      fetchProjects();
    }, [page]);

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
      <Grid container spacing={0} style={{ width: '100%', margin: '0 auto', backgroundColor: 'white', borderRadius: '4px', textAlign: 'center', display: 'flex', flexDirection: 'column', height: '100vh'}}>
          <AppBar position="static" style={{ backgroundColor: 'transparent', color: 'black' }}>
            <Tabs value={tabValue} onChange={handleTabChange} style={{width: '100%', margin: '0 auto'}}>
              <Tab label="Manage Projects" />
              <Tab label="Create Project" />
            </Tabs>
          </AppBar>
          <TabPanel value={tabValue} index={0} style={{width: '100%', margin: '0 auto'}}>
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
                  {projects.length > 0 ? projects.map((project) => (
                    <TableRow key={project.id}>
                      <TableCell style={{ textAlign: 'center' }}>{project.title}</TableCell>
                      <TableCell style={{ textAlign: 'center' }}>{project.details}</TableCell>
                      <TableCell style={{ textAlign: 'center' }}>
                        <Button onClick={() => handleViewAllocatedEmployees(project.allocatedUsers)}>
                          View Allocated Employees
                        </Button>
                      </TableCell>
                      <TableCell style={{ textAlign: 'center' }}>
                        <div style={{ margin: '8px' }}>
                          <Tooltip title="Edit the project details">
                            <Button variant="outlined" color="primary" onClick={() => handleEditProject(project)}>Edit</Button>
                          </Tooltip>
                        </div>
                        {/* <div style={{ margin: '8px' }}>
                          <Tooltip title="Delete the project">
                            <Button variant="outlined" color="primary">Delete</Button>
                          </Tooltip>
                        </div> */}
                      </TableCell>
                    </TableRow>
                  )) : (
                    <TableRow>
                      <TableCell colSpan={4}>No projects available.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              <Grid item xs={12}>
                <Pagination
                  count={Math.ceil(totalElements / rowsPerPage)}
                  page={page + 1}
                  onChange={(event, newPage) => setPage(newPage - 1)}
                  color="primary"
                  shape="rounded"
                  showFirstButton
                  showLastButton
                  sx={{ margin: '16px', display: 'flex', justifyContent: 'center' }}
                />
            </Grid>
          </TableContainer>
        </TabPanel>
        <TabPanel value={tabValue} index={1} style={{width: '100%', margin: '0 auto', display: 'flex', justifyContent: 'center'}}>
          {/* Create Project Form */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minWidth: '600px' }}>
            <Paper elevation={3} style={{ padding: '20px', margin: '0 auto', boxSizing: 'border-box' }}>
              <TextField
                label="Project Title"
                fullWidth
                style={{ marginBottom: '10px' }}
                value={newProjectTitle}
                onChange={(e) => setNewProjectTitle(e.target.value)}
              />
              <TextField
                label="Project Details"
                fullWidth
                multiline
                style={{ marginBottom: '10px' }}
                value={newProjectDetails}
                onChange={(e) => setNewProjectDetails(e.target.value)}
              />
              <Button variant="contained" color="primary" onClick={handleCreateProject}>Create Project</Button>
            </Paper>
          </div>
        </TabPanel>
      <Dialog open={openEditDialog} onClose={handleCloseEditDialog}>
        <DialogTitle style={{ backgroundColor: '#2196F3', color: 'white' }}>Edit Project</DialogTitle>
        <DialogContent dividers>
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
        <DialogTitle style={{ backgroundColor: '#2196F3', color: 'white' }}>Allocated Employees</DialogTitle>
        <DialogContent dividers>
          {allocatedEmployees.length > 0 ? allocatedEmployees.map((employee) => (
            <DialogContentText key={employee.id}>
              {employee.name} - {employee.email}
            </DialogContentText>
          )) : (
            <DialogContentText>
            No candidates allocated yet.
          </DialogContentText>)}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAllocatedEmployeesDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

const TabPanel = ({ children, value, index }) => (
  <div role="tabpanel" hidden={value !== index}>
    {value === index && <Box p={3}>{children}</Box>}
  </div>
);

export default ManageProjects;
