import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { BrowserRouter } from 'react-router-dom';
import {
    Box,
    Button,
    Container,
    Grid,
    MenuItem,
    Paper,
    Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
  } from '@mui/material';

// Sample Openings Data
const sampleOpenings = [
    {
      id: 1,
      title: 'Software Engineer',
      details: 'We are looking for a skilled Software Engineer with expertise in frontend and backend development.',
      skillsRequiredForOpening: ['JavaScript', 'React', 'Node.js'],
      level: 2,
      location: 'San Francisco, CA',
    },
    {
      id: 2,
      title: 'Data Analyst',
      details: 'We are seeking a Data Analyst to analyze and interpret complex data sets.',
      skillsRequiredForOpening: ['SQL', 'Python', 'Data Visualization'],
      level: 3,
      location: 'New York, NY',
    },
    {
      id: 3,
      title: 'UX/UI Designer',
      details: 'We are looking for a talented UX/UI Designer to create intuitive and visually appealing user interfaces.',
      skillsRequiredForOpening: ['Adobe XD', 'Figma', 'HTML/CSS'],
      level: 2,
      location: 'Seattle, WA',
    },
    // Add more openings data here as needed
  ];

const RecruiterDashbaord = () => {
    // const userRole = useSelector((state) => state.auth.role);
    const userRole = 'admin';
  // State to store the list of openings
  const [openings, setOpenings] = useState([]);

  // Sample data for filters (Replace this with your actual filter data)
  const skillsOptions = ['JavaScript', 'React', 'Python', 'Figma', 'SQL', 'Adobe XD', 'HTML/CSS'];
  const levelOptions = [1,2,3];
  const locationOptions = ['New York, NY', 'San Francisco, CA', 'Seattle, WA'];


  // States to store the selected filters
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');


  // Effect to simulate API call and update the openings state
  useEffect(() => {
    // Simulate an API call delay (replace this with your actual API call)
    const fetchOpenings = () => {
      setTimeout(() => {
        // Update the openings state with the sample data
        setOpenings(sampleOpenings);
      }, 1000);
    };

    // Call the fetchOpenings function to simulate the API call
    fetchOpenings();
  }, []);

  // Function to handle applying filters
  const handleApplyFilters = () => {
    // Filter the openings based on the selected filters
    const filteredOpenings = sampleOpenings.filter((opening) => {
      const skillsMatch = selectedSkills.length === 0 || selectedSkills.some((skill) => opening.skillsRequiredForOpening.includes(skill));
      const levelMatch = selectedLevel === '' || opening.level === selectedLevel;
      const locationMatch = selectedLocation === '' || opening.location === selectedLocation;
      return skillsMatch && levelMatch && locationMatch;
    });
  
    // Update the openings state with the filtered openings
    setOpenings(filteredOpenings);
  };

  // Render the Employee Dashboard
  return (
    <Container maxWidth="md">
      <Typography variant="h4" align="center" gutterBottom>
        Employee Dashboard
      </Typography>
      <Grid container spacing={2}>
        {/* Filters Section */}
        <Grid item xs={12} md={4}>
          {/* Skills multiselect dropdown */}
          <Select
            multiple
            label="Skills"
            value={selectedSkills}
            onChange={(e) => setSelectedSkills(e.target.value)}
            fullWidth
            displayEmpty
            renderValue={(selected) => (selected.length === 0 ? 'Select' : selected.join(', '))}
            MenuProps={{
              PaperProps: {
                style: {
                  maxHeight: 300,
                },
              },
            }}
          >
            {skillsOptions.map((skill) => (
              <MenuItem key={skill} value={skill}>
                {skill}
              </MenuItem>
            ))}
          </Select>
        </Grid>
        <Grid item xs={12} md={4}>
          {/* Level dropdown */}
          <Select
            label="Level"
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            fullWidth
            displayEmpty
          >
            <MenuItem value="" disabled>
              Select
            </MenuItem>
            {levelOptions.map((level) => (
              <MenuItem key={level} value={level}>
                {level}
              </MenuItem>
            ))}
          </Select>
        </Grid>
        <Grid item xs={12} md={4}>
          {/* Location dropdown */}
          <Select
            label="Location"
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            fullWidth
            displayEmpty
          >
            <MenuItem value="" disabled>
              Select
            </MenuItem>
            {locationOptions.map((location) => (
              <MenuItem key={location} value={location}>
                {location}
              </MenuItem>
            ))}
          </Select>
        </Grid>
        <Grid item xs={12}>
          {/* Apply button to trigger filter action */}
          <Box display="flex" justifyContent="center" my={2}>
            <Button variant="contained" color="primary" onClick={handleApplyFilters}>
              Apply Filters
            </Button>
          </Box>
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        {/* List of Openings */}
        <Grid item xs={12}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Details</TableCell>
                  <TableCell>Skills Required</TableCell>
                  <TableCell>Level</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {openings.map((opening) => (
                  <TableRow key={opening.id}>
                    <TableCell>{opening.title}</TableCell>
                    <TableCell>{opening.details}</TableCell>
                    <TableCell>{opening.skillsRequiredForOpening.join(', ')}</TableCell>
                    <TableCell>{opening.level}</TableCell>
                    <TableCell>{opening.location}</TableCell>
                    {userRole === 'admin' || userRole === 'recruiter' ? (
                        <Link to={`/applications/${opening.id}`}>
                        <Button variant="contained" color="primary">
                            View Applications
                        </Button>
                        </Link>
                    ) : null}
                    <TableCell>
                      <Button variant="contained" color="primary">
                        Apply
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
      
    </Container>
  );
};

export default RecruiterDashbaord;
