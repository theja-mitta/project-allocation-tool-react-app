import React, { useState, useEffect } from 'react';
import {
  Typography,
  AppBar,
  Toolbar,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  Select,
  MenuItem,
  InputLabel
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useSelector } from 'react-redux';
import { AuthService } from '../services/api/auth';
import Pagination from '@mui/material/Pagination';

const AdminPanel = () => {
  const authToken = useSelector(state => state.auth.authToken);
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [totalUsers, setTotalUsers] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);


  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await AuthService.getAllUsers(authToken, rowsPerPage, page);
      setUsers(response.users);
      setTotalUsers(response.totalElements);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };
  

  useEffect(() => {
    fetchUsers();
  }, [page, rowsPerPage]);  

  const validateName = (name) => {
    if (!name.trim()) {
      setNameError('Name is required');
      return false;
    }
    setNameError('');
    return true;
  };
  
  const validateEmail = (email) => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailPattern.test(email)) {
      setEmailError('Invalid email format');
      return false;
    }
    setEmailError('');
    return true;
  };

  
  const handleNameChange = (e) => {
    const newName = e.target.value;
    setName(newName);
    validateName(newName);
  };
  
  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    validateEmail(newEmail);
  };
  

  const handleEditUser = (user) => {
    console.log(user.role.charAt(0).toUpperCase() + user.role.slice(1).toLowerCase());
    setEditingUser(user);
    setRole(user.role); // Don't change the role value here
    setName(user.name);
    setEmail(user.email);
    setOpenDialog(true);
  };

  const handleUpdateUser = async () => {
    try {
      const updatedUser = {
        ...editingUser,
        name,
        email,
        role: role.toUpperCase(),
      };
      console.log('Updating user', updatedUser);
      console.log('token', authToken);
      await AuthService.updateUser(authToken, editingUser.id, updatedUser);
      fetchUsers();
      handleCloseDialog();
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await AuthService.deleteUser(authToken, userId);
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleCloseDialog = () => {
    setEditingUser(null);
    setName('');
    setEmail('');
    setRole('');
    setOpenDialog(false);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage - 1);
  };

  return (
    <Container maxWidth="lg" style={{ marginTop: '20px', backgroundColor: 'white', padding: '20px', borderRadius: '4px' }}>
      <Typography variant="h4" gutterBottom>
        Admin Panel
      </Typography>
      <AppBar position="static" color="default" style={{ marginBottom: '20px' }}>
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            All Users
          </Typography>
        </Toolbar>
      </AppBar>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center">
                <Typography variant="subtitle1" fontWeight="bold">
                  Name
                </Typography>
              </TableCell>
              <TableCell align="center">
                <Typography variant="subtitle1" fontWeight="bold">
                  Email
                </Typography>
              </TableCell>
              <TableCell align="center">
                <Typography variant="subtitle1" fontWeight="bold">
                  Role
                </Typography>
              </TableCell>
              <TableCell align="center">
                <Typography variant="subtitle1" fontWeight="bold">
                  Actions
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users && users.length > 0 ? (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell align="center">{user.name}</TableCell>
                  <TableCell align="center">{user.email}</TableCell>
                  <TableCell align="center">{user.role}</TableCell>
                  <TableCell align="center">
                    <IconButton color="primary" onClick={() => handleEditUser(user)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton color="secondary" onClick={() => handleDeleteUser(user.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {editingUser && (
        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle style={{ backgroundColor: '#2196F3', color: 'white' }}>Edit User</DialogTitle>
          <DialogContent>
          <FormControl fullWidth margin="normal">
            <TextField
              label="Name"
              value={name}
              onChange={handleNameChange}
              variant="outlined"
              error={!!nameError}
              helperText={nameError}
            />
          </FormControl>

          <FormControl fullWidth margin="normal">
            <TextField
              label="Email"
              value={email}
              onChange={handleEmailChange}
              variant="outlined"
              error={!!emailError}
              helperText={emailError}
            />
          </FormControl>

            <FormControl variant="outlined" fullWidth margin="normal">
              <InputLabel>Role</InputLabel>
              <Select
                label="Role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                {editingUser.role.toUpperCase() === 'ADMIN' ? (
                  [
                    <MenuItem key="Recruiter" value="Recruiter">Recruiter</MenuItem>,
                    <MenuItem key="Employee" value="Employee">Employee</MenuItem>
                  ]
                ) : editingUser.role.toUpperCase() === 'RECRUITER' ? (
                  [
                    <MenuItem key="Admin" value="Admin">Admin</MenuItem>,
                    <MenuItem key="Employee" value="Employee">Employee</MenuItem>
                  ]
                ) : (
                  [
                    <MenuItem key="Admin" value="Admin">Admin</MenuItem>,
                    <MenuItem key="Recruiter" value="Recruiter">Recruiter</MenuItem>
                  ]
                )}
              </Select>
          </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="primary">
              Cancel
            </Button>
            <Button onClick={handleUpdateUser} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      )}
      {/* ... (existing JSX code) */}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        <Pagination
          count={Math.ceil(totalUsers / rowsPerPage)}
          page={page + 1}
          onChange={handlePageChange}
          color="primary"
          shape="rounded"
          showFirstButton
          showLastButton
          sx={{ margin: '16px' }} // Add some margin around the pagination
        />
      </div>
    </Container>
  );
};

export default AdminPanel;
