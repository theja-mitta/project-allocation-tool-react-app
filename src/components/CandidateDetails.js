import React from 'react';
import { Grid, Typography } from '@mui/material';

const labelStyle = {
  fontWeight: 'bold',
  minWidth: '130px',
  display: 'inline-block',
};

const valueStyle = {
  marginBottom: '8px',
  display: 'inline-block',
};

const CandidateDetails = ({ name, email, skills }) => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        {/* Candidate Name */}
        <Typography>
          <span style={labelStyle}>Candidate Name:</span>
          <span style={valueStyle}>{name}</span>
        </Typography>

        {/* Candidate Email */}
        <Typography>
          <span style={labelStyle}>Candidate Email:</span>
          <span style={valueStyle}>{email}</span>
        </Typography>

        {/* Candidate Skills */}
        {skills && skills.length > 0 && (
          <Typography>
            <span style={labelStyle}>Candidate Skills:</span>
            <span style={valueStyle}>{skills.map((skill) => skill.title).join(', ')}</span>
          </Typography>
        )}
      </Grid>
    </Grid>
  );
};

export default CandidateDetails;
