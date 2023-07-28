import React, { useEffect, useState } from 'react'; // Add 'useEffect' and 'useState'
import {
  Card,
  CardContent,
  Grid,
  Typography,
  Divider,
} from '@mui/material';
import { ProjectAllocationService } from '../services/api/projectAllocationService';

const labelStyle = {
  fontWeight: 'bold',
};

const valueStyle = {
  marginBottom: '8px',
};

const ApplicationDetails = ({ applicationId, onClose }) => {
  const [applicationData, setApplicationData] = useState(null);

  // Function to fetch application details
  const fetchApplicationDetails = async () => {
    try {
      // Replace 'fetchDataFromServer' with the actual function to fetch application details
      const applicationDetails = await ProjectAllocationService.getApplicationDetails(applicationId);
      setApplicationData(applicationDetails);
    } catch (error) {
      // Handle error if the API call fails
      console.log(error);
    }
  };

  useEffect(() => {
    if (applicationId) {
      // Fetch application details when applicationId changes
      fetchApplicationDetails();
    }
  }, [applicationId]);

  if (!applicationData) {
    return null; // Render nothing if applicationData is not available yet
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <Typography style={labelStyle}>Application ID:</Typography>
        <Typography style={valueStyle}>{applicationData.id}</Typography>
        <Typography style={labelStyle}>Applicant Name:</Typography>
        <Typography style={valueStyle}>{applicationData.candidate.name}</Typography>
        <Typography style={labelStyle}>Application status:</Typography>
        <Typography style={valueStyle}>{applicationData.status}</Typography>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Typography style={labelStyle}>Applied at:</Typography>
        <Typography style={valueStyle}>
          {new Date(applicationData.appliedAt).toLocaleString()}
        </Typography>
        <Typography style={labelStyle}>Interviews scheduled:</Typography>
        <Typography style={valueStyle}>{applicationData.interviews.length}</Typography>
        {/* Add more application details here if needed */}
      </Grid>
    </Grid>
  );
};

export default ApplicationDetails;
