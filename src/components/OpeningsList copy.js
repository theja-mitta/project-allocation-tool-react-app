import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  Button,
  FormControl,
  Grid,
  InputLabel,
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Tooltip,
  Link
} from '@mui/material';
import { ProjectAllocationService } from "../services/api/projectAllocationService";
import ApplicationDetails from './ApplicationDetails';

const OpeningsList = () => {
  const loggedinUser = useSelector((state) => state.auth.user);
  const [openings, setOpenings] = useState();
  const [skillsFilter, setSkillsFilter] = useState([]);
  const [levelFilter, setLevelFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [filteredOpenings, setFilteredOpenings] = useState(openings);
  const [appliedOpenings, setAppliedOpenings] = useState(new Set());
  const [selectedOpeningId, setSelectedOpeningId] = useState(null);
  const [uniqueSkills, setUniqueSkills] = useState([]);
  const [uniqueLevels, setUniqueLevels] = useState([]);
  const [uniqueLocations, setUniqueLocations] = useState([]);

  // State to store the application details
  const [applicationData, setApplicationData] = useState(null);

   // State to store the applicationId for the dialog
   const [selectedApplicationId, setSelectedApplicationId] = useState(null);

  // Function to fetch application details
  const fetchApplicationDetails = async (applicationId) => {
    console.log(applicationId);
    try {
      const applicationDetails = await ProjectAllocationService.getApplicationDetails(applicationId);
      setApplicationData(applicationDetails);
    } catch (error) {
      // Handle error if the API call fails
      console.log(error);
    }
  };

  const applyToOpening = async (openingId, userId) => {
    try {
      // Make the API call to apply for the opening
      const response = await ProjectAllocationService.applyForOpening(openingId, userId);
      // Process the response if needed
      console.log(response);
  
      // Update the appliedOpenings state
      setAppliedOpenings((prevAppliedOpenings) => new Set(prevAppliedOpenings).add(openingId));
  
      // Update the filteredOpenings state
      setFilteredOpenings((prevFilteredOpenings) =>
        prevFilteredOpenings.map((opening) =>
          opening.id === openingId ? { ...opening, applied: true } : opening
        )
      );
    } catch (error) {
      // Handle the error if the API call fails
      console.log(error);
    }
  };  

  // Function to handle click of "View application details" link
  const handleViewApplicationDetails = async (applicationId) => {
    // Set the selectedApplicationId to open the dialog and show the application details
    setSelectedApplicationId(applicationId);

    // Call the API to fetch application details
    await fetchApplicationDetails(applicationId);
  };


  useEffect(() => {
    const fetchData = async () => {
      try {
        const projectOpenings = await ProjectAllocationService.getProjectOpenings();
        const applications = await ProjectAllocationService.getAllApplications();

        // Check if logged-in user exists and applications data is available
        if (loggedinUser && applications) {
          const alteredOpenings = projectOpenings.map((opening) => {
            const matchingApplication = applications.find((application) => application.opening.id === opening.id && application.candidate.id === loggedinUser.id);
            if (matchingApplication) {
              return {
                ...opening,
                applied: true,
                applicationId: matchingApplication.id,
              };
            } else {
              return opening;
            }
          });

          setOpenings(alteredOpenings);
        } else {
          setOpenings(projectOpenings);
        }
      } catch (error) {
        // Handle the error here
        console.log(error);
      }
    };

    fetchData();
  }, [loggedinUser]);

  useEffect(() => {
    // This effect will run when 'openings' state changes
    console.log(openings);

    if (openings) {
      // Calculate unique skills, levels, and locations after 'openings' is available
      const uniqueSkills = [...new Set(openings.flatMap((opening) => opening.skills))].sort();
      const uniqueLevels = [...new Set(openings.map((opening) => opening.level))].sort();
      const uniqueLocations = [...new Set(openings.map((opening) => opening.location))].sort();
      // Update state with the unique values
      setUniqueSkills(uniqueSkills);
      setUniqueLevels(uniqueLevels);
      setUniqueLocations(uniqueLocations);
    }
  }, [openings]);


  useEffect(() => {
    let filteredData = openings;

    if (skillsFilter.length > 0) {
      filteredData = filteredData.filter((opening) =>
        skillsFilter.some((selectedSkillId) =>
          opening.skills.some((skill) => skill.id === selectedSkillId)
        )
      );
    }

    if (levelFilter) {
      filteredData = filteredData.filter((opening) => opening.level === levelFilter);
    }

    if (locationFilter) {
      filteredData = filteredData.filter((opening) => opening.location === locationFilter);
    }

    setFilteredOpenings(filteredData);
  }, [skillsFilter, levelFilter, locationFilter, openings]);

  const handleApplyFilters = () => {
    // Perform filtering operations here if needed
  };

  const handleClearFilters = () => {
    setSkillsFilter([]);
    setLevelFilter('');
    setLocationFilter('');
  };

  const handleApplyOpening = async (openingId) => {
    if (!appliedOpenings.has(openingId)) {
      // Call the applyToOpening function with the openingId and loggedin user id
      await applyToOpening(openingId, loggedinUser.id);
    }
  };

  // Function to handle closing the dialog
  const handleCloseDialog = () => {
    setSelectedApplicationId(null);
  };

  return (
    <Grid container spacing={2}  style={{ width: '100%', margin: '0 auto' }}>
      <Grid item xs={12} sm={4}>
        {/* Skills Filter */}
        <FormControl variant="outlined" fullWidth>
          <InputLabel>Skills</InputLabel>
          <Select
            multiple
            value={skillsFilter}
            label="Skills"
            onChange={(e) => setSkillsFilter(e.target.value)}
            style={{ minWidth: 200 }}
          >
            {uniqueSkills.map((skill) => (
              <MenuItem key={skill.id} value={skill.id}>
                {skill.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={4}>
        {/* Level Filter */}
        <FormControl variant="outlined" fullWidth>
          <InputLabel>Experience level</InputLabel>
          <Select
            value={levelFilter}
            label="Experience Level"
            onChange={(e) => setLevelFilter(e.target.value)}
          >
            <MenuItem value="">All experience levels</MenuItem>
            {uniqueLevels.map((level) => (
              <MenuItem key={level} value={level}>
                {level}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={4}>
        {/* Location Filter */}
        <FormControl variant="outlined" fullWidth>
          <InputLabel>Work location</InputLabel>
          <Select
            value={locationFilter}
            label="Work location"
            onChange={(e) => setLocationFilter(e.target.value)}
          >
            <MenuItem value="">All work locations</MenuItem>
            {uniqueLocations.map((location) => (
              <MenuItem key={location} value={location}>
                {location}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={12} align="center">
        {/* <Button variant="contained" onClick={handleApplyFilters}>
          Apply Filters
        </Button> */}
        <Button variant="contained" onClick={handleClearFilters} style={{ marginLeft: '10px' }}>
          Clear Filters
        </Button>
      </Grid>

      {filteredOpenings ? (
      <Grid item xs={12}>
        <TableContainer component={Paper} style={{ width: '100%', margin: '0 auto' }}>
          <Table>
            <TableHead>
              <TableRow>
                {/* Existing table header cells */}
                <TableCell align="center">
                  <Typography variant="subtitle1" fontWeight="bold">
                    Title
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography variant="subtitle1" fontWeight="bold">
                    Details
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography variant="subtitle1" fontWeight="bold">
                    Skills
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography variant="subtitle1" fontWeight="bold">
                    Experience level
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography variant="subtitle1" fontWeight="bold">
                    Work location
                  </Typography>
                </TableCell>
                {/* Table Header Cell for "Actions" column */}
                <TableCell align="center">
                  <Typography variant="subtitle1" fontWeight="bold">
                    Actions
                  </Typography>
                </TableCell>
                {/* Add more table headers here if needed */}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredOpenings.map((opening) => (
                <TableRow key={opening.id}>
                  {/* Existing table cells */}
                  <TableCell align="center">{opening.title}</TableCell>
                  <TableCell align="center">{opening.details}</TableCell>
                  <TableCell align="center">{opening.skills.map((skill) => skill.title).join(", ")}</TableCell>
                  <TableCell align="center">{opening.level}</TableCell>
                  <TableCell align="center">{opening.location}</TableCell>
                  {/* TableCell for the "Actions" column */}
                  <TableCell align="center">
                    {opening.applied ? (
                      <Button
                        variant="contained"
                        color="success"
                        disabled
                        style={{ width: 150 }}
                      >
                        Applied
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        onClick={() => handleApplyOpening(opening.id)}
                        color="primary"
                        style={{ width: 150 }}
                      >
                        Apply
                      </Button>
                    )}
                    <div>
                      {opening.applied && (
                        <Link onClick={() => handleViewApplicationDetails(opening.applicationId)} sx={{ cursor: 'pointer' }}>
                          View application details
                        </Link>
                      )}
                    </div>
                  </TableCell>

                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
      ) : (
        // Show a loading indicator or return null when filteredOpenings is undefined
        <Grid item xs={12}>
          <Typography variant="body1">Loading...</Typography>
        </Grid>
      )}
      {/* Dialog to show application details */}
      <Dialog open={selectedApplicationId !== null} onClose={handleCloseDialog}>
        <DialogTitle style={{ backgroundColor: '#2196F3', color: 'white' }}>Application Details</DialogTitle>
        <DialogContent dividers>
          <DialogContentText>
            {applicationData ? (
              // Pass the applicationData to the ApplicationDetails component
              <ApplicationDetails applicationData={applicationData} />
            ) : (
              <Typography variant="body1">Loading application details...</Typography>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

export default OpeningsList;
