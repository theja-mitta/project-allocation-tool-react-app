import React from 'react';
import { Typography, Paper, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const Unauthorized = () => {
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
        Unauthorized Access
      </Typography>
      <Typography variant="body1" gutterBottom>
        You don't have permission to access this page.
      </Typography>
      <Button component={Link} to="/login" variant="contained" color="primary" style={{ marginTop: '20px' }}>
        Go to Login
      </Button>
    </Paper>
  );
};

export default Unauthorized;
