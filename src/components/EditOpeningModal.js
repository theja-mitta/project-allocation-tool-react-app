import React from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';

const EditOpeningModal = ({
  isModalOpen,
  handleCloseModal,
  editFormData,
  setEditFormData,
  uniqueSkills,
  openings,
  setFilteredOpenings,
  handleEditOpening,
}) => {
  // Helper function to format selected skills for display
  const formatSelectedSkills = (selectedSkillIds) => {
    const selectedSkills = uniqueSkills
      .filter((skill) => selectedSkillIds.includes(skill.id))
      .map((skill) => skill.title);

    // Check if there are any selected skills before joining them with commas
    return selectedSkills.length > 0 ? selectedSkills.join(', ') : '';
  };

  // Function to handle changes in the form fields
  const handleFormChange = (field, value) => {
    setEditFormData((prevFormData) => ({
      ...prevFormData,
      [field]: value,
    }));
  };

  // Function to handle saving the edited opening
  const handleSaveOpening = () => {
    // Find the index of the opening in the openings array
    const openingIndex = openings.findIndex((opening) => opening.id === editFormData.id);
    if (openingIndex !== -1) {
      // Update the opening with the edited data
      const updatedOpenings = [...openings];
      updatedOpenings[openingIndex] = editFormData;
      setFilteredOpenings(updatedOpenings);

      // Close the modal
      handleCloseModal();
    }
  };

  return (
    <Dialog open={isModalOpen} onClose={handleCloseModal}>
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
        <FormControl fullWidth margin="normal">
          <InputLabel>Skills</InputLabel>
          <Select
            multiple
            value={editFormData.skills}
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
        <Button onClick={handleCloseModal} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSaveOpening} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditOpeningModal;
