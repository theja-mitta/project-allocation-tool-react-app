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
  TextField,
  Link,
} from '@mui/material';
import { ProjectAllocationService } from '../services/api/projectAllocationService';
import ApplicationDetails from './ApplicationDetails';

const OpeningsList = ({ userType, showApplied, loggedinUser }) => {
  const userPermissions = useSelector((state) => state.auth.userPermissions);
  const [openings, setOpenings] = useState([]);
  const [skillsFilter, setSkillsFilter] = useState([]);
  const [levelFilter, setLevelFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [filteredOpenings, setFilteredOpenings] = useState([]);
  const [appliedOpenings, setAppliedOpenings] = useState(new Set());
  const [selectedOpeningId, setSelectedOpeningId] = useState(null);
  const [uniqueSkills, setUniqueSkills] = useState([]);
  const [uniqueLevels, setUniqueLevels] = useState([]);
  const [uniqueLocations, setUniqueLocations] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState(null);
  const [applicationIdMap, setApplicationIdMap] = useState({});

  // State to store the application details
  const [applicationData, setApplicationData] = useState(null);

  // State to store the applicationId for the dialog
  const [selectedApplicationId, setSelectedApplicationId] = useState(null);

  // Function to fetch application details
  const fetchApplicationDetails = async (applicationId) => {
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
  const handleViewApplicationDetails = (openingId) => {
    // Set the selectedApplicationId to open the dialog and show the application details
    setSelectedApplicationId(applicationIdMap[openingId]);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all openings and applications
        let projectOpenings = await ProjectAllocationService.getProjectOpenings();
        let applications = await ProjectAllocationService.getAllApplications();

        // Filter openings based on user type and showApplied flag
        if (userType === 'employee') {
          // For employees, filter applications based on the logged-in user ID
          applications = applications.filter((application) => application.candidate.id === loggedinUser.id);
          const appliedOpeningIds = applications.map((application) => application.opening.id);

          if (showApplied) {
            // For employees viewing applied openings
            projectOpenings = projectOpenings.filter((opening) => appliedOpeningIds.includes(opening.id));
          } else {
            // For employees viewing unapplied openings
            projectOpenings = projectOpenings.filter((opening) => !appliedOpeningIds.includes(opening.id));
          }
        } else if (userType === 'recruiter') {
          // For recruiters, show only their own openings
          projectOpenings = projectOpenings.filter((opening) => opening.recruiter.id === loggedinUser.id);
        }

        // Create a mapping of openingId to applicationId
        const applicationIdMap = {};
        applications.forEach((application) => {
          applicationIdMap[application.opening.id] = application.id;
        });

        // Update the openings state with the filtered openings
        setOpenings(projectOpenings);

        // Set the appliedOpenings state with a Set containing applied opening IDs
        const appliedOpeningIds = applications.map((application) => application.opening.id);
        setAppliedOpenings(new Set(appliedOpeningIds));

        // Filter applied openings for renderEmployeeAppliedOpenings
        if (showApplied) {
          const filteredAppliedOpenings = projectOpenings.filter((opening) =>
            appliedOpeningIds.includes(opening.id)
          );
          setFilteredOpenings(filteredAppliedOpenings);
        }

        // Update the mapping of openingId to applicationId
        setApplicationIdMap(applicationIdMap);
      } catch (error) {
        // Handle the error here
        console.log(error);
      }
    };

    fetchData();
  }, [loggedinUser, showApplied, userType]);

  useEffect(() => {
    if (openings.length > 0) {
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
          opening.skills?.some((skill) => skill.id === selectedSkillId)
        )
      );
    }

    if (levelFilter) {
      filteredData = filteredData.filter((opening) => opening.level === levelFilter);
    }

    if (locationFilter) {
      filteredData = filteredData.filter((opening) => opening.location === locationFilter);
    }

    // Filter applied openings for renderEmployeeAppliedOpenings
    if (userType === 'employee' && showApplied) {
      filteredData = filteredData.filter((opening) => appliedOpenings.has(opening.id));
    }

    setFilteredOpenings(filteredData);
  }, [skillsFilter, levelFilter, locationFilter, openings, userType, showApplied, appliedOpenings]);

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

  const hasManageOpeningsPermission = (userPermissions) => {
    return userPermissions.includes('MANAGE_OPENINGS');
  };

  // Function to save the edited opening data with an API call
  const saveUpdatedOpening = async (updatedOpening) => {
    try {
      // Create an array of skill IDs from the updatedOpening.skills array
      const skillIds = updatedOpening.skills.map((skill) => ({ id: skill.id }));

      // Create the final payload with skill IDs and other opening properties
      const payload = {
        title: updatedOpening.title,
        details: updatedOpening.details,
        level: updatedOpening.level,
        location: updatedOpening.location,
        skills: skillIds,
      };

      // Make the API call with the payload
      const response = await ProjectAllocationService.updateOpening(updatedOpening.id, payload);
      // Process the response if needed
      console.log(response);

      console.log('Opening data updated successfully:', updatedOpening);
    } catch (error) {
      // Handle error if the API call fails
      console.error('Error updating opening data:', error);
    }
  };

  // Function to handle opening modal open and pre-fill form data
  const handleOpenModal = (opening) => {
    setIsModalOpen(true);
    setEditFormData({
      id: opening.id,
      title: opening.title,
      details: opening.details,
      skills: opening.skills.map((skill) => skill.id), // Pre-fill the skills field with skill IDs
      level: opening.level,
      location: opening.location,
      // Add other opening properties as needed
    });
  };

  // Function to handle changes in the form fields
  const handleFormChange = (field, value) => {
    setEditFormData((prevFormData) => ({
      ...prevFormData,
      [field]: value,
    }));
  };

  // Function to handle saving the edited opening
  const handleSaveOpening = async () => {
    // Find the opening data based on the openingId
    const openingToEdit = openings.find((opening) => opening.id === editFormData.id);

    // Create an updated opening object with the form data
    const updatedOpening = {
      ...openingToEdit,
      title: editFormData.title,
      details: editFormData.details,
      skills: editFormData.skills.map((skillId) => uniqueSkills.find((skill) => skill.id === skillId)),
      level: editFormData.level,
      location: editFormData.location,
      // Add other opening properties as needed
    };

    // Call the saveUpdatedOpening function to make the API call
    await saveUpdatedOpening(updatedOpening);

    // Update the openings state with the updatedOpening
    setOpenings((prevOpenings) =>
      prevOpenings.map((opening) => (opening.id === updatedOpening.id ? updatedOpening : opening))
    );

    // Close the modal after saving
    setIsModalOpen(false);
  };

  // JSX for the Edit Opening Modal
  const renderEditModal = () => {
    if (!editFormData) return null;

    // Helper function to format selected skills for display
    const formatSelectedSkills = (selectedSkillIds) => {
      const selectedSkills = uniqueSkills
        .filter((skill) => selectedSkillIds.includes(skill.id))
        .map((skill) => skill.title);

      // Check if there are any selected skills before joining them with commas
      return selectedSkills.length > 0 ? selectedSkills.join(', ') : '';
    };

    return (
      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <DialogTitle>Edit Opening</DialogTitle>
        <DialogContent dividers>
          <TextField
            label="Title"
            value={editFormData.title}
            onChange={(e) => handleFormChange('title', e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Details"
            value={editFormData.details}
            onChange={(e) => handleFormChange('details', e.target.value)}
            fullWidth
            margin="normal"
          />
          <FormControl variant="outlined" fullWidth margin="normal">
            <InputLabel>Skills</InputLabel>
            <Select
              multiple
              value={editFormData.skills}
              label="Skills"
              onChange={(e) => handleFormChange('skills', e.target.value)}
              renderValue={(selected) => formatSelectedSkills(selected)} // Format selected skills for display
            >
              {uniqueSkills.map((skill) => (
                <MenuItem key={skill.id} value={skill.id}>
                  {skill.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Experience level"
            value={editFormData.level}
            onChange={(e) => handleFormChange('level', e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Work location"
            value={editFormData.location}
            onChange={(e) => handleFormChange('location', e.target.value)}
            fullWidth
            margin="normal"
          />
          {/* Add more form fields for other opening properties */}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsModalOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSaveOpening} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  return (
    <Grid container spacing={2} style={{ maxWidth: '1200px', margin: '0 auto' }}>
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
            label="Work Location"
            onChange={(e) => setLocationFilter(e.target.value)}
          >
            <MenuItem value="">All locations</MenuItem>
            {uniqueLocations.map((location) => (
              <MenuItem key={location} value={location}>
                {location}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12}>
        {/* Apply and Clear Filters Buttons */}
        <Button variant="outlined" color="secondary" onClick={handleClearFilters}>
          Clear Filters
        </Button>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h5" gutterBottom>
          {showApplied ? 'Applied Openings' : 'Project Openings'}
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Details</TableCell>
                <TableCell>Skills</TableCell>
                <TableCell>Experience level</TableCell>
                <TableCell>Work location</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredOpenings.map((opening) => (
                <TableRow key={opening.id}>
                  <TableCell>{opening.title}</TableCell>
                  <TableCell>{opening.details}</TableCell>
                  <TableCell>
                    {opening.skills.map((skill) => (
                      <Typography key={skill.id}>{skill.title}</Typography>
                    ))}
                  </TableCell>
                  <TableCell>{opening.level}</TableCell>
                  <TableCell>{opening.location}</TableCell>
                  <TableCell>
                    {/* If userType is employee and showApplied is true, show "View application details" link */}
                    {userType === 'employee' && showApplied && appliedOpenings.has(opening.id) && (
                      <Link
                        component="button"
                        variant="body2"
                        onClick={() => handleViewApplicationDetails(opening.id)}
                      >
                        View application details
                      </Link>
                    )}
                    {/* If userType is employee and showApplied is false, show "Apply" button */}
                    {userType === 'employee' && !showApplied && !appliedOpenings.has(opening.id) && (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleApplyOpening(opening.id)}
                      >
                        Apply
                      </Button>
                    )}
                    {/* If userType is recruiter, show "Edit" button */}
                    {userType === 'recruiter' && hasManageOpeningsPermission(userPermissions) && (
                      <Button variant="outlined" color="primary" onClick={() => handleOpenModal(opening)}>
                        Edit
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
      <Dialog open={selectedApplicationId !== null} onClose={() => setSelectedApplicationId(null)}>
        <DialogTitle>Application Details</DialogTitle>
        <DialogContent dividers>
          <DialogContentText>
            {/* Render the ApplicationDetails component if applicationData is available */}
            {selectedApplicationId && (
              <ApplicationDetails
                applicationId={selectedApplicationId}
                onClose={() => setSelectedApplicationId(null)}
              />
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedApplicationId(null)}>Close</Button>
        </DialogActions>
      </Dialog>
      {/* Render the Edit Opening Modal */}
      {renderEditModal()}
    </Grid>
  );
};

export default OpeningsList;
