import React, { useEffect, useState } from 'react';
import {
  Grid,
  Typography,
  Link,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Tooltip,
} from '@mui/material';
import { useSelector } from 'react-redux';
import { ProjectAllocationService } from '../services/api/projectAllocationService';

const labelStyle = {
  fontWeight: 'bold',
};

const valueStyle = {
  marginBottom: '8px',
  cursor: 'pointer',
};

const ApplicationDetails = ({ openingId, loggedinUser, onClose }) => {
  const authToken = useSelector(state => state.auth.authToken);
  const [applicationData, setApplicationData] = useState(null);
  const [projectDialogOpen, setProjectDialogOpen] = useState(false);
  const [interviewDialogOpen, setInterviewDialogOpen] = useState(false);

  useEffect(() => {
    const fetchApplicationDetails = async () => {
      try {
        const applicationDetails = await ProjectAllocationService.fetchApplicationDetails(openingId, loggedinUser.id, authToken);
        setApplicationData(applicationDetails);
      } catch (error) {
        console.error(error);
      }
    };

    fetchApplicationDetails();
  }, [openingId, loggedinUser]);

  const handleProjectDialogOpen = () => {
    setProjectDialogOpen(true);
  };

  const handleInterviewDialogOpen = () => {
    setInterviewDialogOpen(true);
  };

  const handleDialogClose = () => {
    setProjectDialogOpen(false);
    setInterviewDialogOpen(false);
  };

  if (!applicationData) {
    return null;
  }

  const statusValueStyle = {
    color: applicationData.status === 'ALLOCATED' ? 'green' : applicationData.status === 'REJECTED' ? 'red' : 'inherit',
    marginBottom: '8px',
  };

  // Determine whether to show the "Interviews scheduled" information as plain text or a link
  const interviewsScheduledContent = applicationData.interviews.length > 0 ? (
    <Tooltip title="View interview details">
      <Typography
        style={{
          ...valueStyle,
          display: 'inline-block',
          textDecoration: 'underline',
        }}
        onClick={handleInterviewDialogOpen}
      >
        {applicationData.interviews.length}
      </Typography>
    </Tooltip>
  ) : (
    <Typography style={valueStyle}>No interviews scheduled</Typography>
  );

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <Typography style={labelStyle}>Application ID:</Typography>
        <Typography style={valueStyle}>{applicationData.id}</Typography>
        <Typography style={labelStyle}>Applicant Name:</Typography>
        <Typography style={valueStyle}>{applicationData.candidate.name}</Typography>
        <Typography style={labelStyle}>Application status:</Typography>
        <Typography style={statusValueStyle}>
          {applicationData.status === 'ALLOCATED' ? (
            <>
              ALLOCATED to project{' '}
              <Link
                component="button"
                variant="body2"
                onClick={handleProjectDialogOpen}
              >
                {applicationData.opening.project.title}
              </Link>
            </>
          ) : (
            applicationData.status
          )}
        </Typography>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Typography style={labelStyle}>Applied at:</Typography>
        <Typography style={valueStyle}>
          {new Date(applicationData.appliedAt).toLocaleString()}
        </Typography>
        <Typography style={labelStyle}>Interviews scheduled:</Typography>
        {interviewsScheduledContent}
        {/* Add more application details here if needed */}
      </Grid>
      <Dialog open={projectDialogOpen} onClose={handleDialogClose}>
        <DialogTitle style={{ fontWeight: 'bold' }}>Project Details</DialogTitle>
        <DialogContent dividers>
          {applicationData.opening.project && (
            <>
              <div>
                <span style={{ fontWeight: 'bold' }}>Project Name:</span> {applicationData.opening.project.title}
              </div>
              <div>
                <span style={{ fontWeight: 'bold' }}>Project Description:</span> {applicationData.opening.project.details}
              </div>
              {/* Add more project details rendering here */}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={interviewDialogOpen} onClose={handleDialogClose}>
        <DialogTitle style={{ fontWeight: 'bold' }}>Interview Details</DialogTitle>
        <DialogContent>
          <TableContainer style={{ textAlign: 'center' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell style={{ fontWeight: 'bold', textAlign: 'center' }}>Interview Date</TableCell>
                  <TableCell style={{ fontWeight: 'bold', textAlign: 'center' }}>Interviewer Name</TableCell>
                  <TableCell style={{ fontWeight: 'bold', textAlign: 'center' }}>Interviewer Email</TableCell>
                  <TableCell style={{ fontWeight: 'bold', textAlign: 'center' }}>Interview Status</TableCell>
                  {/* Add more table header cells here */}
                </TableRow>
              </TableHead>
              <TableBody>
                {applicationData.interviews.map(interview => (
                  <TableRow key={interview.id}>
                    <TableCell align='center'>{new Date(interview.scheduledTime).toLocaleString()}</TableCell>
                    <TableCell align='center'>{interview.interviewer.name}</TableCell>
                    <TableCell align='center'>{interview.interviewer.email}</TableCell>
                    <TableCell align='center'>{interview.status}</TableCell>
                    {/* Add more table cells for interview details */}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

export default ApplicationDetails;
