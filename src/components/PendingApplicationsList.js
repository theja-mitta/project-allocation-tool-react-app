import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Link,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  Tooltip,
  Snackbar,
  SnackbarContent,
} from '@mui/material';
import { ProjectAllocationService } from "../services/api/projectAllocationService";
import CandidateDetails from './CandidateDetails';
import ScheduleInterviewModal from './ScheduleInterviewModal';
import { useSelector } from 'react-redux';


const UpdateInterviewStatusDialog = ({ open, onClose, interviewId, currentStatus, onUpdateInterviewStatus, updatedInterviewsMap }) => {
  const [newStatus, setNewStatus] = useState(currentStatus);
  const [interviewUpdated, setInterviewUpdated] = useState(false);

  useEffect(() => {
    // Reset the newStatus state when the dialog is opened
    if (open) {
      setNewStatus(currentStatus);
    }
  }, [open, currentStatus]);

  const handleUpdateStatus = () => {
    onUpdateInterviewStatus(interviewId, newStatus);
    setInterviewUpdated(true);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle style={{ backgroundColor: '#2196F3', color: 'white' }}>Update Interview Status</DialogTitle>
      <DialogContent style={{ paddingTop: '30px' }}>
        <DialogContentText>
          <FormControl fullWidth>
            <InputLabel>Choose Status</InputLabel>
            <Select
              label="Choose Status"
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
            >
              <MenuItem value="SCHEDULED">SCHEDULED</MenuItem>
              <MenuItem value="COMPLETED">COMPLETED</MenuItem>
              <MenuItem value="CANCELLED">CANCELLED</MenuItem>
            </Select>
          </FormControl>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleUpdateStatus} color="primary" disabled={updatedInterviewsMap[interviewId]}>
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const PendingApplicationsList = () => {
  const authToken = useSelector(state => state.auth.authToken);
  const [pendingApplications, setPendingApplications] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [isCandidateDialogOpen, setIsCandidateDialogOpen] = useState(false);
  const [isInterviewModalOpen, setIsInterviewModalOpen] = useState(false);
  const [selectedApplicationId, setSelectedApplicationId] = useState(null);
  const [isViewScheduledInterviewsOpen, setIsViewScheduledInterviewsOpen] = useState(false);
  const [selectedApplicationInterviews, setSelectedApplicationInterviews] = useState([]);

  const [isUpdateStatusDialogOpen, setIsUpdateStatusDialogOpen] = useState(false);
  const [selectedInterviewIdToUpdate, setSelectedInterviewIdToUpdate] = useState(null);
  const [selectedInterviewStatusToUpdate, setSelectedInterviewStatusToUpdate] = useState(null);
  const [updatedInterviewsMap, setUpdatedInterviewsMap] = useState({});
  const [page, setPage] = useState(0);  
  const [rowsPerPage, setRowsPerPage] = useState(2);
  const [totalPages, setTotalPages] = useState(null);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const handleUpdateInterview = (interviewId, currentStatus) => {
    setSelectedInterviewIdToUpdate(interviewId);
    setSelectedInterviewStatusToUpdate(currentStatus);
    setIsUpdateStatusDialogOpen(true);
  };

  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleUpdateInterviewStatus = (interviewId, newStatus) => {
    ProjectAllocationService.updateInterviewStatus(interviewId, newStatus, authToken)
      .then(() => {
        setUpdatedInterviewsMap((prevMap) => ({
          ...prevMap,
          [interviewId]: newStatus,
        }));
        const successMessage = 'Interview status updated successfully';
        showSnackbar(successMessage, 'success');
      })
      .catch((error) => {
        console.error('Error updating interview status:', error);
        let errorMessage = 'An error occurred while updating interview status';
        
        if (error.response && error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message;
        }
        
        showSnackbar(errorMessage, 'error');
      });
  };
  

  const fetchData = async () => {
    try {
      const response = await ProjectAllocationService.getAllApplications('APPLIED', rowsPerPage, page, authToken);
      if (response.applications.length > 0) {
        setPendingApplications(response.applications);
        
        // Calculate total pages for pagination
        const calculatedTotalPages = Math.ceil(response.totalElements / rowsPerPage);
        setTotalPages(calculatedTotalPages);
      } else {
        setPendingApplications([]);
      }
    } catch (error) {
      console.log(error);
    }
  };
  
  useEffect(() => {
    fetchData();
  }, []);
  
  useEffect(() => {
    fetchData();
  }, [page, rowsPerPage]);  

  useEffect(() => {
    const updatedInterviews = selectedApplicationInterviews.map((interview) => ({
      ...interview,
      status: updatedInterviewsMap[interview.id] || interview.status,
    }));
    setSelectedApplicationInterviews(updatedInterviews);
  }, [updatedInterviewsMap, selectedApplicationInterviews]);

  const handleViewScheduledInterviews = (applicationId) => {
    const selectedApplication = pendingApplications.find(app => app.id === applicationId);
  
    if (selectedApplication) {
      setSelectedApplicationInterviews(selectedApplication.interviews);
      setIsViewScheduledInterviewsOpen(true);
    } else {
      console.error('Application not found with ID:', applicationId);
    }
  };

  const handleCloseViewScheduledInterviews = () => {
    setIsViewScheduledInterviewsOpen(false);
  };

  const handleViewCandidateDetails = (candidate) => {
    setSelectedCandidate(candidate);
    setIsCandidateDialogOpen(true);
  };

  const handleCloseCandidateDialog = () => {
    setSelectedCandidate(null);
    setIsCandidateDialogOpen(false);
  };

  const handleScheduleInterview = (applicationId) => {
    setSelectedApplicationId(applicationId);
    setIsInterviewModalOpen(true);
  };

  const handleAllocateApplicant = async (applicationId) => {
    try {
      const allocationSuccessful = await ProjectAllocationService.handleAllocateApplicant(applicationId, authToken);
  
      if (allocationSuccessful) {
        // Application allocated successfully
        setPendingApplications((prevApplications) =>
          prevApplications.map((app) =>
            app.id === applicationId ? { ...app, status: "ALLOCATED" } : app
          )
        );
        showSnackbar('Applicant allocated successfully', 'success');
      } else {
        // Handle error response
        const errorMessage = allocationSuccessful.statusText || 'Failed to allocate applicant. Please try again.';
        showSnackbar(errorMessage, 'error');
      }
    } catch (error) {
      console.error('Error allocating applicant:', error);
  
      // Check if the error object has a message field
      const errorMessage = error.response.data || 'Error accepting applicantion. Please try again.';
      showSnackbar(errorMessage, 'error');
    }
  };

  const handleRejectApplication = async (applicationId) => {
    try {
      await ProjectAllocationService.handleRejectApplicant(applicationId, authToken);
      
      // Update the application status to REJECTED in the frontend
      setPendingApplications((prevApplications) =>
        prevApplications.map((app) =>
          app.id === applicationId ? { ...app, status: "REJECTED" } : app
        )
      );
      
      showSnackbar('Applicantion rejected successfully', 'success'); // Show success Snackbar
    } catch (error) {  
      // Check if the error object has a message field
      const errorMessage = error.response.data || 'Error rejecting applicantion. Please try again.';
      showSnackbar(errorMessage, 'error');
    }
  };
  

  return (
    <Grid container spacing={2} style={{ width: '100%', margin: '0 auto', backgroundColor: 'white', padding: '10px', borderRadius: '4px', height: 'calc(100vh - 100px)'  }}>
      <Grid item xs={12}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center">
                  <Typography variant="subtitle1" fontWeight="bold">
                    Application ID
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography variant="subtitle1" fontWeight="bold">
                    Applied At
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography variant="subtitle1" fontWeight="bold">
                    Status
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography variant="subtitle1" fontWeight="bold">
                    Opening Title
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography variant="subtitle1" fontWeight="bold">
                    Opening Details
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography variant="subtitle1" fontWeight="bold">
                    Opening Level
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography variant="subtitle1" fontWeight="bold">
                    Opening Location
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography variant="subtitle1" fontWeight="bold">
                    Candidate Details
                  </Typography>
                </TableCell>
                <TableCell align="center" colSpan={3}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Actions
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pendingApplications.map((application) => (
                <TableRow key={application.id}>
                  <TableCell align="center">{application.id}</TableCell>
                  <TableCell align="center">
                      {new Date(application.appliedAt).toLocaleString()}
                  </TableCell>
                  <TableCell align="center">{application.status}</TableCell>
                  <TableCell align="center">{application.opening.title}</TableCell>
                  <TableCell align="center">{application.opening.details}</TableCell>
                  <TableCell align="center">{application.opening.level}</TableCell>
                  <TableCell align="center">{application.opening.location}</TableCell>
                  <TableCell align="center">
                    <Button onClick={() => handleViewCandidateDetails(application.candidate)}>
                      View Candidate Profile
                    </Button>
                  </TableCell>
                  <TableCell align="center" colSpan={3}>
                    <div style={{ margin: '8px' }}>
                      <Button 
                        variant="contained"
                        color="primary"
                        style={{ width: 150 }}
                        onClick={() => handleScheduleInterview(application.id)}>
                        Schedule Interview
                      </Button>
                    </div>
                    <div style={{ margin: '8px' }}>
                      <Link component="button" variant="body2" onClick={() => handleViewScheduledInterviews(application.id)}>
                        View Scheduled Interviews
                      </Link>
                    </div>
                    <div style={{ margin: '8px' }}>
                      <Tooltip title="Accept the application">
                        <Button
                          variant="outlined"
                          color="secondary"
                          style={{ width: 150 }}
                          onClick={() => handleAllocateApplicant(application.id)}
                          disabled={application.status === "ALLOCATED"}
                        >
                          Accept
                        </Button>
                      </Tooltip>
                    </div>
                    <div style={{ margin: '8px' }}>
                      <Tooltip title="Reject the application">
                        <Button
                          variant="outlined"
                          color="error"
                          style={{ width: 150 }}
                          onClick={() => handleRejectApplication(application.id)}
                          disabled={application.status === "REJECTED" || application.status === "ALLOCATED"}
                        >
                          Reject
                        </Button>
                      </Tooltip>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {/* Pagination */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '10px' }}>
          <Pagination
              count={totalPages} // Replace with the total number of pages
              page={page + 1} // Add 1 to convert zero-based page index to one-based
              onChange={(event, newPage) => setPage(newPage - 1)} // Subtract 1 to convert back to zero-based
              showFirstButton
              showLastButton
            />
          </div>
      </Grid>
      <Dialog open={isViewScheduledInterviewsOpen} onClose={handleCloseViewScheduledInterviews}>
        <DialogTitle style={{ backgroundColor: '#2196F3', color: 'white' }}>Scheduled Interviews</DialogTitle>
        <DialogContent dividers>
          <DialogContentText>
            {selectedApplicationInterviews.length > 0 ? (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell style={{ textAlign: 'center', fontWeight: 'bold' }}>Interview Title</TableCell>
                      <TableCell style={{ textAlign: 'center', fontWeight: 'bold' }}>Scheduled Time</TableCell>
                      <TableCell style={{ textAlign: 'center', fontWeight: 'bold' }}>Interviewer</TableCell>
                      <TableCell style={{ textAlign: 'center', fontWeight: 'bold' }}>Status</TableCell>
                      <TableCell style={{ textAlign: 'center', fontWeight: 'bold' }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedApplicationInterviews.map((interview) => (
                      <TableRow key={interview.id}>
                        <TableCell  align="center">{interview.title}</TableCell>
                        <TableCell  align="center">{new Date(interview.scheduledTime).toLocaleString()}</TableCell>
                        <TableCell  align="center">{interview.interviewer.name}</TableCell>
                        <TableCell  align="center">{interview.status}</TableCell>
                        <TableCell  align="center">
                          <Button
                            variant="outlined"
                            onClick={() => handleUpdateInterview(interview.id, interview.status)}
                            disabled={updatedInterviewsMap[interview.id] || interview.status === "COMPLETED" || interview.status === "CANCELLED"}
                          >
                            Update Interview Status
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography>No scheduled interviews found.</Typography>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseViewScheduledInterviews}>Close</Button>
        </DialogActions>
      </Dialog>
      {selectedInterviewIdToUpdate && (
        <UpdateInterviewStatusDialog
          open={isUpdateStatusDialogOpen}
          onClose={() => setIsUpdateStatusDialogOpen(false)}
          interviewId={selectedInterviewIdToUpdate}
          currentStatus={selectedInterviewStatusToUpdate}
          onUpdateInterviewStatus={(interviewId, newStatus) => handleUpdateInterviewStatus(interviewId, newStatus)}
          updatedInterviewsMap={updatedInterviewsMap}
        />
      )}
      <Dialog open={isInterviewModalOpen} onClose={() => setIsInterviewModalOpen(false)}>
        <ScheduleInterviewModal
          applicationId={selectedApplicationId}
          onClose={() => setIsInterviewModalOpen(false)}
          onInterviewScheduled={() => {
            fetchData();
            // Implement any necessary action after interview scheduling, such as refreshing the data
          }}
        />
      </Dialog>
      <Dialog open={isCandidateDialogOpen} onClose={handleCloseCandidateDialog}>
        {selectedCandidate && (
          <>
            <DialogTitle style={{ backgroundColor: '#2196F3', color: 'white' }}>Candidate Details</DialogTitle>
            <DialogContent dividers>
              <DialogContentText>
                <CandidateDetails
                  name={selectedCandidate.name}
                  email={selectedCandidate.email}
                  skills={selectedCandidate.skills}
                />
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseCandidateDialog}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
      <Snackbar
            open={snackbarOpen}
            autoHideDuration={4000} // Adjust the duration as needed
            onClose={() => setSnackbarOpen(false)}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <SnackbarContent
              style={{
                backgroundColor:
                  snackbarSeverity === 'success' ? '#43a047' : '#d32f2f',
              }}
              message={<span>{snackbarMessage}</span>}
            />
          </Snackbar>
    </Grid>
  );
};

export default PendingApplicationsList;
