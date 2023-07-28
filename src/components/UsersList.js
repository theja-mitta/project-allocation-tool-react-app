import React from 'react';
import { Typography, Paper } from '@mui/material';

const UsersList = () => {
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
        Users list
      </Typography>
    </Paper>
  );
};

export default UsersList;
