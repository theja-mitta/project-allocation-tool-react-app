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
} from '@mui/material';
import { ProjectAllocationService } from "../services/api/projectAllocationService";
import CandidateDetails from './CandidateDetails';

const PendingApplicationsList = () => {
  const [pendingApplications, setPendingApplications] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [isCandidateDialogOpen, setIsCandidateDialogOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const applications = await ProjectAllocationService.getAllApplications();

        // Check if logged-in user exists and applications data is available
        if (applications) {
          const pendingApplications = applications.filter(app => app.status === 'APPLIED');
          setPendingApplications(pendingApplications);
        } else {
          setPendingApplications([]);
        }
      } catch (error) {
        // Handle the error here
        console.log(error);
      }
    };

    fetchData();
  }, []);

  const handleViewCandidateDetails = (candidate) => {
    setSelectedCandidate(candidate);
    setIsCandidateDialogOpen(true);
  };

  const handleCloseCandidateDialog = () => {
    setSelectedCandidate(null);
    setIsCandidateDialogOpen(false);
  };

  const handleScheduleInterview = (applicationId) => {
    // Implement the logic for scheduling an interview here
    console.log(`Scheduling interview for application with ID: ${applicationId}`);
  };

  return (
    <Grid container spacing={2} style={{ maxWidth: '1200px', margin: '0 auto' }}>
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
                <TableCell align="center">
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
                      View Candidate
                    </Button>
                  </TableCell>
                  <TableCell align="center">
                    <Button 
                        variant="contained"
                        color="primary"
                        style={{ width: 150 }}
                        onClick={() => handleScheduleInterview(application.id)}>
                      Schedule Interview
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
      <Dialog open={isCandidateDialogOpen} onClose={handleCloseCandidateDialog}>
        {selectedCandidate && (
          <>
            <DialogTitle>Candidate Details</DialogTitle>
            <DialogContent dividers>
              <DialogContentText>
                {/* Pass the selectedCandidate details as props to the CandidateDetails component */}
                <CandidateDetails
                  name={selectedCandidate.name}
                  email={selectedCandidate.email}
                  skills={selectedCandidate.skills}
                />
                {/* Add more candidate details as needed */}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseCandidateDialog}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Grid>
  );
};

export default PendingApplicationsList;
