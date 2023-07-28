// // components/AdminDashboard.js

import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import UserForm from '../components/UserForm';
import {
  Box,
  Button,
  Container,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
} from '@mui/material';

const AdminDashboard = () => {
    // const userRole = useSelector((state) => state.auth.role);
  const [selectedUser, setSelectedUser] = useState(null);
  const [sampleUsers, setSampleUsers] = useState([
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      role: 'Employee',
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      role: 'Recruiter',
    },
  ]);

  const handleEditUser = (user) => {
    setSelectedUser(user);
  };

  const handleDeleteUser = (userId) => {
    // Find the index of the user with the specified userId in the sampleUsers array
    const userIndex = sampleUsers.findIndex((user) => user.id === userId);

    // If the user with the specified userId is found
    if (userIndex !== -1) {
      // Create a new array by removing the user at the found index
      const updatedUsers = [...sampleUsers];
      updatedUsers.splice(userIndex, 1);

      // Update the sampleUsers array with the new array
      setSampleUsers(updatedUsers);

      // Clear the selectedUser state if the user being deleted is the currently selected user
      if (selectedUser && selectedUser.id === userId) {
        setSelectedUser(null);
      }
    }
  };

  const handleAddUser = () => {
    setSelectedUser(null);
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" align="center" gutterBottom>
        Admin Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ padding: 2 }}>
            <Typography variant="h5" gutterBottom>
              List of Users
            </Typography>
            <Divider />
            <List>
              {sampleUsers.map((user) => (
                <ListItem key={user.id}>
                  <ListItemText
                    primary={`${user.name}`}
                    secondary={`${user.email} - Role: ${user.role}`}
                  />
                  <Button color="primary" onClick={() => handleEditUser(user)}>
                    Edit
                  </Button>
                  <Button color="secondary" onClick={() => handleDeleteUser(user.id)}>
                    Delete
                  </Button>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ padding: 2 }}>
            <Typography variant="h5" gutterBottom>
              {selectedUser ? 'Edit User' : 'Add User'}
            </Typography>
            <Divider />
            <UserForm user={selectedUser} />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdminDashboard;

