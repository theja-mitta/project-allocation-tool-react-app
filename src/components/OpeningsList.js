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
  Pagination
} from '@mui/material';
import { ProjectAllocationService } from '../services/api/projectAllocationService';
import ApplicationDetails from './ApplicationDetails';

const OpeningsList = ({ userType, showApplied, loggedinUser, ownOpenings }) => {
  const authToken = useSelector(state => state.auth.authToken);
  const [openings, setOpenings] = useState([]);
  const [skillsFilter, setSkillsFilter] = useState([]);
  const [levelFilter, setLevelFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [filteredOpenings, setFilteredOpenings] = useState([]);
  const [appliedOpenings, setAppliedOpenings] = useState(new Set());
  const [uniqueSkills, setUniqueSkills] = useState([]);
  const [uniqueLevels, setUniqueLevels] = useState([]);
  const [uniqueLocations, setUniqueLocations] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState(null);
  const [pageSize, setPageSize] = useState(3);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedOpeningId, setSelectedOpeningId] = useState(null);

  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);

  const applyToOpening = async (openingId, userId) => {
    try {
      // Make the API call to apply for the opening
      const response = await ProjectAllocationService.applyForOpening(openingId, userId, authToken);
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
    setSelectedOpeningId(openingId);
    setIsApplicationModalOpen(true);
  };

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage - 1); // Subtract 1 from newPage to convert to zero-based index
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        let response;  
        if (userType === 'employee') {
          response = await ProjectAllocationService.getProjectOpenings(authToken, pageSize, currentPage, showApplied ? true : false);
        } else if (userType === 'recruiter' || userType === 'admin') {
          response = await ProjectAllocationService.getProjectOpenings(authToken, pageSize, currentPage, undefined, ownOpenings ? true : false);
        }
  
        const projectOpenings = response.openings;
        const totalElements = response.totalElements;
  
          // Calculate total pages for pagination
        const calculatedTotalPages = Math.ceil(totalElements / pageSize);
        setTotalPages(calculatedTotalPages);

      // Update the openings state with the received data
      setOpenings(projectOpenings);
  
        // Rest of your code to filter and update projectOpenings based on userType
      } catch (error) {
        // Handle error
      }
    };
  
    fetchData();
  }, [loggedinUser, showApplied, userType, pageSize, currentPage]);
  

  useEffect(() => {
    if (openings.length > 0) {
      // Calculate unique skills, levels, and locations after 'openings' is available
      const allSkills = openings.flatMap((opening) => opening.skills);
      const uniqueSkills = allSkills.filter(
        (skill, index, self) => self.findIndex((s) => s.id === skill.id) === index
      );
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
      filteredData = filteredData.filter(opening =>
        skillsFilter.some(selectedSkillId =>
          opening.skills?.some(skill => skill.id === selectedSkillId)
        )
      );
    }
  
    if (levelFilter) {
      filteredData = filteredData.filter(opening => opening.level === levelFilter);
    }
  
    if (locationFilter) {
      filteredData = filteredData.filter(opening => opening.location === locationFilter);
    }
  
    if (showApplied && appliedOpenings.size > 0) {
      filteredData = filteredData.filter(opening => appliedOpenings.has(opening.id));
    }
  
    if ((userType === 'recruiter' || userType === 'admin') && ownOpenings) {
      filteredData = filteredData.filter(opening => opening.recruiter.id === loggedinUser.id);
    }
  
    setFilteredOpenings(filteredData);
  }, [skillsFilter, levelFilter, locationFilter, openings, userType, showApplied, appliedOpenings, ownOpenings, loggedinUser]);
  

  const handleClearFilters = () => {
    setSkillsFilter([]);
    setLevelFilter('');
    setLocationFilter('');

    if (userType === 'recruiter' || userType === 'admin') {
      setFilteredOpenings(openings.filter(opening => opening.recruiter.id === loggedinUser.id));
    }
  };

  const handleApplyOpening = async openingId => {
    if (!appliedOpenings.has(openingId)) {
      await applyToOpening(openingId, loggedinUser.id);

      if (userType === 'recruiter' || userType === 'admin') {
        setFilteredOpenings(openings.filter(opening => opening.recruiter.id === loggedinUser.id));
      }
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
      const response = await ProjectAllocationService.updateOpening(updatedOpening.id, payload, authToken);
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
    // Show the "Edit" button only for the openings posted by the logged-in recruiter
    if (userType === 'recruiter' || userType === 'admin') {
      setIsModalOpen(true);
      setEditFormData({
        id: opening.id,
        title: opening.title,
        details: opening.details,
        skills: opening.skills.map((skill) => skill.id),
        level: opening.level,
        location: opening.location,
      });
    }
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

  // Function to render action buttons based on user type
  const renderActionButtons = (opening) => {
    if (userType === 'recruiter' || userType === 'admin') {
      return (
        <Button variant="outlined" color="primary" onClick={() => handleOpenModal(opening)}>
          Edit
        </Button>
      );
    } else if (userType === 'employee') {
      if (showApplied) {
        return (
          <Link
            component="button"
            variant="body2"
            onClick={() => handleViewApplicationDetails(opening.id)}
          >
            View application details
          </Link>
        );
      } else {
        return (
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleApplyOpening(opening.id)}
          >
            Apply
          </Button>
        );
      }
    }
    return null;
  };

  // JSX for rendering opening rows
  const renderOpeningRows = (openings) => {
    return openings.map((opening) => (
      <TableRow key={opening.id}>
        <TableCell align="center">{opening.title}</TableCell>
        <TableCell align="center">{opening.details}</TableCell>
        <TableCell align="center">
          {opening.skills.map((skill) => (
            <Typography key={skill.id}>{skill.title}</Typography>
          ))}
        </TableCell>
        <TableCell align="center">{opening.level}</TableCell>
        <TableCell align="center">{opening.location}</TableCell>
        <TableCell align="center">{renderActionButtons(opening)}</TableCell>
      </TableRow>
    ));
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
        <DialogTitle style={{ backgroundColor: '#2196F3', color: 'white' }}>Edit Opening</DialogTitle>
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
    <Grid container spacing={2} style={{ maxWidth: '1200px', margin: '0 auto', backgroundColor: 'white', padding: '20px', borderRadius: '4px'  }}>
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
        {showApplied ? 'Applied Opportunities' : 'Project Opportunities'}
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
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
              <TableCell align="center">
                <Typography variant="subtitle1" fontWeight="bold">
                  Action
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
              {renderOpeningRows(filteredOpenings)}
          </TableBody>
        </Table>
      </TableContainer>
      {/* Pagination */}
      <div style={{ display: 'flex', justifyContent: 'center', padding: '10px' }}>
          <Pagination
            count={totalPages}
            page={currentPage+1}
            onChange={handlePageChange}
            color="primary"
            showFirstButton
            showLastButton
            shape="rounded"
          />
        </div>
    </Grid>
    <Dialog open={isApplicationModalOpen} onClose={() => setIsApplicationModalOpen(false)}>
      <DialogTitle style={{ backgroundColor: '#2196F3', color: 'white' }}>Application Details</DialogTitle>
      <DialogContent dividers>
        <DialogContentText>
          {/* Render the ApplicationDetails component if applicationData is available */}
          {isApplicationModalOpen && (
            <ApplicationDetails
              openingId={selectedOpeningId}
              loggedinUser={loggedinUser}
              onClose={() => setIsApplicationModalOpen(false)}
            />
          )}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setIsApplicationModalOpen(false)}>Close</Button>
      </DialogActions>
    </Dialog>
    {/* Render the Edit Opening Modal */}
    {renderEditModal()}
  </Grid>
  );
};

export default OpeningsList;
