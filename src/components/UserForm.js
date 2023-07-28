// components/UserForm.js

import React, { useState, useEffect } from 'react';
import { TextField, Button, Select, MenuItem, FormControl, InputLabel } from '@mui/material';

const UserForm = ({ user }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setRole(user.role);
    }
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        label="Name"
        variant="outlined"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        fullWidth
        margin="normal"
      />
      <TextField
        label="Email"
        variant="outlined"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        fullWidth
        margin="normal"
      />
      <FormControl fullWidth variant="outlined" margin="normal">
        <InputLabel>Role</InputLabel>
        <Select
          label="Role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          required
        >
          <MenuItem value="Employee">Employee</MenuItem>
          <MenuItem value="Recruiter">Recruiter</MenuItem>
          {/* Add more role options here if needed */}
        </Select>
      </FormControl>
      {/* Show "Update" button if user is being edited, otherwise show "Add User" button */}
      {user !== null ? (
        <Button type="submit" variant="contained" color="primary">
          Update
        </Button>
      ) : (
        <Button type="submit" variant="contained" color="primary">
          Add User
        </Button>
      )}
    </form>
  );
};

export default UserForm;
