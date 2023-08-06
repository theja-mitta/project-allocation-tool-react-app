import React from "react";
import { Link } from "react-router-dom";
import { Container, Typography, Box, Button, Paper } from "@mui/material";

const Homepage = () => {
  return (
    <div className="background-container">
      <Container
        maxWidth="sm"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
        }}
      >
        <Paper elevation={3} sx={{ padding: 3 }}>
          <Typography variant="h5" gutterBottom align="center">
            Welcome to Project Allocation Tool
          </Typography>
          <Typography variant="body1" sx={{ marginBottom: 3, textAlign: "center" }}>
            Project Allocation Tool is designed to help manage project openings and
            candidate applications. It streamlines the process of matching skilled
            candidates with suitable project opportunities, making project
            allocation efficient and effective.
          </Typography>
          <Box sx={{ textAlign: "center" }}>
            <Button
              variant="contained"
              color="primary"
              component={Link}
              to="/login"
              sx={{ textDecoration: "none" }}
            >
              Login
            </Button>
          </Box>
        </Paper>
      </Container>
    </div>
  );
};

export default Homepage;
