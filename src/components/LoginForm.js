import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Container,
  Paper,
  Typography,
  Box,
  Snackbar,
  SnackbarContent,
} from "@mui/material";
import { AuthService } from "../services/api/auth";
import {
  setAuthTokenAndFetchUserPermissions,
  setStateToInitialState,
} from "../store/reducers/authReducer";

const LoginForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userRole = useSelector((state) => state.auth.userRole);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  
  // State to manage Snackbar
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  // useEffect hook to dispatch the resetState action when the component mounts
  useEffect(() => {
    dispatch(setStateToInitialState());
  }, [dispatch]);

  const handleLogin = async () => {
    // Validate email format
    if (!validateEmail(email)) {
      setEmailError(true);
      return;
    }

    // Validate password length
    if (password.length < 6) {
      setPasswordError(true);
      return;
    }

    try {
      const authToken = await AuthService.login(email, password);
      if (authToken) {
        dispatch(setAuthTokenAndFetchUserPermissions(authToken));
        // Show success Snackbar
        showSnackbar("Login successful!");

        // Navigate after a short delay to give time for the Snackbar to be seen
        setTimeout(() => {
          navigate("/dashboard");
        }, 1000); 
      } else {
        setLoginError(true);
        setErrorMessage("Invalid credentials. Please try again.");
        showSnackbar("Invalid credentials. Please try again.");
      }
    } catch (error) {
      setLoginError(true);
      setErrorMessage("Invalid credentials. Please try again.");
      showSnackbar("Invalid credentials. Please try again.");
    }
  };

  const showSnackbar = (message) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setLoginError(false);
    setErrorMessage('');
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setLoginError(false);
    setErrorMessage('');
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  return (
    <Container
      maxWidth="sm" // Adjusted the maxWidth for a larger form
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      <Paper elevation={3} sx={{ padding: 3 }}>
        <Typography  component="h1" variant="h5" gutterBottom align="center"> {/* Increased the heading size */}
          Login
        </Typography>
        <Box
          component="form"
          noValidate
          sx={{ display: "flex", flexDirection: "column" }}
        >
          <Typography variant="body1" sx={{ marginBottom: 2 }}>
            Welcome back! You are logging in to the{" "}
            <strong>Project Allocation Tool</strong>.
          </Typography>
          <TextField
            label="Email"
            variant="outlined"
            type="email"
            value={email}
            onChange={handleEmailChange}
            required
            fullWidth
            margin="normal"
            error={emailError}
            helperText={emailError ? "Please enter a valid email address" : ""}
            inputProps={{
              pattern: "[^s@]+@[^s@]+.[^s@]+", // Validate email format
            }}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Password"
            variant="outlined"
            type="password"
            value={password}
            onChange={handlePasswordChange}
            required
            fullWidth
            margin="normal"
            error={passwordError}
            helperText={
              passwordError ? "Password should be at least 6 characters" : ""
            }
            inputProps={{
              minLength: 6, // Minimum password length
            }}
            sx={{ mb: 2 }}
          />
          {loginError && (
            <Typography variant="body2" color="error">
              {errorMessage}
            </Typography>
          )}
          <Button
            onClick={handleLogin}
            variant="contained"
            color="primary"
            fullWidth
          >
            Login
          </Button>
          <Typography variant="body2" mt={2}>
            <Link component="button" variant="body2" onClick={() => {}}>
              Forgot Password?
            </Link>
          </Typography>
          <Typography variant="body2" mt={2} textAlign="center">
            Don't have an account?{" "}
            <Link to="/register">Register here</Link>
          </Typography>
        </Box>
      </Paper>
      {/* Snackbar component */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={5000}
        onClose={handleSnackbarClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <SnackbarContent
          message={snackbarMessage}
          onClose={handleSnackbarClose}
          sx={
            loginError
              ? { backgroundColor: "red" } // Red background for login errors
              : { backgroundColor: "green" } // Green background for successful login
          }
        />
      </Snackbar>
    </Container>
  );
};

export default LoginForm;
