import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  Grid,
  Typography,
  Divider,
} from '@mui/material';
import { useSelector } from 'react-redux';
import { ProjectAllocationService } from '../services/api/projectAllocationService';

const labelStyle = {
  fontWeight: 'bold',
};

const valueStyle = {
  marginBottom: '8px',
};

const ApplicationDetails = ({ openingId, loggedinUser, onClose }) => {
  const authToken = useSelector(state => state.auth.authToken);
  const [applicationData, setApplicationData] = useState(null);

  useEffect(() => {
    const fetchApplicationDetails = async () => {
      try {
        const applicationDetails = await ProjectAllocationService.fetchApplicationDetails(openingId, loggedinUser.id, authToken);
        console.log(`Application details: ${applicationDetails}`);
        setApplicationData(applicationDetails);
      } catch (error) {
        console.error(error);
      }
    };

      fetchApplicationDetails();
  }, [openingId, loggedinUser]);

  if (!applicationData) {
    return null;
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
