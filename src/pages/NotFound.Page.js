import React from 'react';
import { Typography, Paper } from '@mui/material';

const NotFound = () => {
  return (
    <Paper
      elevation={3}
      style={{
        padding: '20px',
        maxWidth: '500px',
        margin: 'auto',
        marginTop: '50px',
        textAlign: 'center',
      }}
    >
      <Typography variant="h4" gutterBottom>
        404 - Page Not Found
      </Typography>
      <Typography variant="body1" gutterBottom>
        The page you are looking for does not exist.
      </Typography>
    </Paper>
  );
};

export default NotFound;
