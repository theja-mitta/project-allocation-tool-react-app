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
} from "@mui/material";
import { AuthService } from "../services/api/auth";
import { setAuthTokenAndFetchUserPermissions, setStateToInitialState } from "../store/reducers/authReducer";

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
        navigate("/dashboard");
      } else {
        setLoginError(true);
        setErrorMessage("Invalid credentials. Please try again.");
      }
    } catch (error) {
      setLoginError(true);
      setErrorMessage("Invalid credentials. Please try again.");
    }
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
      maxWidth="xs"
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      <Paper elevation={3} sx={{ padding: 3 }}>
        <Typography variant="h5" gutterBottom>
          Login
        </Typography>
        <Box
          component="form"
          noValidate
          sx={{ display: "flex", flexDirection: "column" }}
        >
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
    </Container>
  );
};

export default LoginForm;
