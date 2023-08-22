import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  SnackbarContent
} from '@mui/material';
import { ProjectAllocationService } from "../services/api/projectAllocationService";
import { AuthService } from '../services/api/auth';

const ScheduleInterviewModal = ({ applicationId, onClose, onInterviewScheduled }) => {
  const authToken = useSelector(state => state.auth.authToken);
  const [title, setTitle] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [interviewers, setInterviewers] = useState([]);
  const [selectedInterviewer, setSelectedInterviewer] = useState('');

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  useEffect(() => {
    // Fetch the list of users to populate the interviewers dropdown
    AuthService.getAllUsersWithoutPagination(authToken)
      .then((users) => {
        setInterviewers(users);
        setSelectedInterviewer(users[0]?.id || ''); // Select the first user by default
      })
      .catch((error) => {
        console.error('Error fetching interviewers:', error);
      });

    // Prefill the "Scheduled Time" with the current date and time
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().slice(0, 16); // Format to 'YYYY-MM-DDTHH:mm'
    setScheduledTime(formattedDate);
  }, []);

  const handleScheduleInterview = () => {
    // Make the API call to schedule the interview
    const interviewData = {
      title,
      scheduledTime,
      interviewer: {
        id: selectedInterviewer,
      },
    };
  
    ProjectAllocationService.scheduleInterview(applicationId, interviewData, authToken)
      .then((response) => {
        // Show success message based on the response (adjust this according to your API's response structure)
        showSnackbar(response.message || 'Interview scheduled successfully', 'success');
        setTimeout(() => {
          // Interview scheduled successfully, close the modal and trigger the callback
          onClose();
          onInterviewScheduled();
        }, 500);
      })
      .catch((error) => {
        console.error('Error scheduling interview:', error);
        if (error.response && error.response.data && error.response.data.message) {
          // Show error message from API response
          showSnackbar(error.response.data.message, 'error');
        } else {
          // Show a generic error message if no specific error message is available
          showSnackbar('Error scheduling interview. Please try again.', 'error');
        }
      });
  };
  

  return (
    <Dialog open={true} onClose={onClose}>
      <DialogTitle style={{ backgroundColor: '#2196F3', color: 'white' }}>Schedule Interview</DialogTitle>
      <DialogContent dividers>
        <DialogContentText>
          <TextField
            label="Title"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <br />
          <br />
          <TextField
            label="Scheduled Time"
            type="datetime-local"
            fullWidth
            value={scheduledTime}
            onChange={(e) => setScheduledTime(e.target.value)}
          />
          <br />
          <br />
          <FormControl fullWidth>
            <InputLabel>Interviewer</InputLabel>
            <Select
              label="Interviewer"
              value={selectedInterviewer}
              onChange={(e) => setSelectedInterviewer(e.target.value)}
            >
              {interviewers.map((interviewer) => (
                <MenuItem key={interviewer.id} value={interviewer.id}>
                  {interviewer.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleScheduleInterview} color="primary">
          Schedule
        </Button>
      </DialogActions>
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
    </Dialog>
  );
};

export default ScheduleInterviewModal;
