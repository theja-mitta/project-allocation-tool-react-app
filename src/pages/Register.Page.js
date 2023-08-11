import React, { useState } from 'react';
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Link,
  Grid,
  Box,
  Typography,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Paper,
  Snackbar, 
  SnackbarContent
} from '@mui/material';
import { LockOutlined } from '@mui/icons-material';
import { AuthService } from '../services/api/auth';
import { useNavigate } from 'react-router-dom';

export const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
  });

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
  });

  const [signUpError, setSignUpError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarColor, setSnackbarColor] = useState("red"); // Default color for errors

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: '',
    }));
  };

  const handleSignUp = async (event) => {
    event.preventDefault();
    if (validateForm()) {
        try {
            const authToken = await AuthService.register(
                formData.name,
                formData.email,
                formData.password,
                formData.role
            );
            if (authToken) {
                showSnackbar("Registration successful!", "green");

                setTimeout(() => {
                    navigate("/login");
                }, 800);
            }
        } catch (error) {
            setSignUpError(true);
            setErrorMessage(error.message); 
            showSnackbar(error.message, "red"); 
        }
    }
  }; 

  const showSnackbar = (message, color) => {
    setSnackbarMessage(message);
    setSnackbarColor(color);
    setSnackbarOpen(true);
  };  

  const validateForm = () => {
    let valid = true;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const nameRegex = /^[a-zA-Z]*$/; // Allow only alphabetic characters for the name

    if (!formData.name.trim()) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        name: 'Please enter a valid name.',
      }));
      valid = false;
    } else if (!nameRegex.test(formData.name)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        name: 'Name should only contain alphabetic characters.',
      }));
      valid = false;
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        name: '', // Reset the error if the name is valid
      }));
    }

    if (!formData.email.trim()) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: 'Please enter a valid email address.',
      }));
      valid = false;
    } else if (!emailRegex.test(formData.email)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: 'Please enter a valid email address.',
      }));
      valid = false;
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: '', // Reset the error if the email is valid
      }));
    }

    if (!formData.password.trim()) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        password: 'Please enter a valid password.',
      }));
      valid = false;
    } else if (formData.password.length < 8) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        password: 'Password should be at least 8 characters long.',
      }));
      valid = false;
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        password: '', // Reset the error if the password is valid
      }));
    }

    if (!formData.role) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        role: 'Please select a role.',
      }));
      valid = false;
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        role: '', // Reset the error if a role is selected
      }));
    }

    return valid;
  };

  return (
    <div className='background-container'>
      <Container 
            component="main"
            maxWidth="xs"
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "100vh"
          }}>
            <CssBaseline />
            <Paper elevation={3} sx={{ padding: 3 }}>
            <Box
              sx={{
                marginTop: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                <LockOutlined />
              </Avatar>
              <Typography component="h1" variant="h5">
                Sign up
              </Typography>
              <Box component="form" noValidate sx={{ mt: 3 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      autoComplete="name"
                      name="name"
                      required
                      fullWidth
                      id="name"
                      label="Name"
                      autoFocus
                      value={formData.name}
                      onChange={handleChange}
                      error={Boolean(errors.name)}
                      helperText={errors.name}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      id="email"
                      label="Email Address"
                      name="email"
                      autoComplete="email"
                      value={formData.email}
                      onChange={handleChange}
                      error={Boolean(errors.email)}
                      helperText={errors.email}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      name="password"
                      label="Password"
                      type="password"
                      id="password"
                      autoComplete="new-password"
                      value={formData.password}
                      onChange={handleChange}
                      error={Boolean(errors.password)}
                      helperText={errors.password}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth error={Boolean(errors.role)}>
                      <InputLabel>Role</InputLabel>
                      <Select
                        label="Role"
                        id="role"
                        name="role"
                        required
                        value={formData.role}
                        onChange={handleChange}
                      >
                        <MenuItem value="ADMIN">Admin</MenuItem>
                        <MenuItem value="RECRUITER">Recruiter</MenuItem>
                        <MenuItem value="EMPLOYEE">Employee</MenuItem>
                      </Select>
                      {Boolean(errors.role) && (
                        <Typography variant="caption" color="error">
                          {errors.role}
                        </Typography>
                      )}
                    </FormControl>
                  </Grid>
                </Grid>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  onClick={handleSignUp}
                >
                  Sign Up
                </Button>
                {signUpError && (
                  <Typography variant="body1" color="error" align="center">
                    {errorMessage}
                  </Typography>
                )}
                <Grid container justifyContent="flex-end">
                  <Grid item>
                    <Link href="/login" variant="body2">
                      Already have an account? Sign in
                    </Link>
                  </Grid>
                </Grid>
              </Box>
            </Box>
            </Paper>
            <Snackbar
              open={snackbarOpen}
              autoHideDuration={5000}
              onClose={() => setSnackbarOpen(false)}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
            >
              <SnackbarContent
                message={snackbarMessage}
                onClose={() => setSnackbarOpen(false)}
                sx={{ backgroundColor: snackbarColor }} // Set background color based on snackbarColor
              />
            </Snackbar>
          </Container>
    </div>
  );
};
