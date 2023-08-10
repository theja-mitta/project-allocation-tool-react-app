import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { AuthService } from '../services/api/auth';
import { useSelector } from 'react-redux';
import { ProjectAllocationService } from '../services/api/projectAllocationService';

const EditProfileDialog = ({ open, onClose }) => {
  const authToken = useSelector(state => state.auth.authToken);
  const user = useSelector(state => state.auth.user);
  const [userDetails, setUserDetails] = useState({
      name: '',
      email: '',
      skills: [],
  });
  const [allSkills, setAllSkills] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);

  useEffect(() => {
      async function fetchData() {
          await fetchAllSkills();
          fetchUserDetails();
      }
      fetchData();
  }, []);

  const fetchUserDetails = async () => {
      try {
          const response = await AuthService.getUser(authToken);
          setUserDetails(response);
          console.log('res', response.skills.map(skill => skill.title));
          setSelectedSkills(response.skills.map(skill => skill.title));
      } catch (error) {
          console.error('Error fetching user details:', error);
      }
  };

  const fetchAllSkills = async () => {
      try {
          const response = await ProjectAllocationService.getSkills(authToken);
          console.log('fetchAllSkills', response);
          setAllSkills(response);
      } catch (error) {
          console.error('Error fetching skills:', error);
      }
  };

  const handleSkillChange = (event) => {
    setSelectedSkills(event.target.value);
  };

  const handleCancel = () => {
    onClose();
  };

  const handleSave = async () => {
    const updatedSkills = selectedSkills.map(skillTitle => {
      const matchingSkill = allSkills.find(skill => skill.title === skillTitle);
      return matchingSkill ? matchingSkill : null;
    });
  
    const updatedUserDetails = { ...userDetails, skills: updatedSkills };
    console.log('updatedUserDetails', updatedUserDetails);
    try {
      // Make an API call to update user details
      await AuthService.updateUserDetails(user.id, updatedUserDetails, authToken);
      onClose();
    } catch (error) {
      console.error('Error updating user details:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle style={{ backgroundColor: '#2196F3', color: 'white' }}>Edit Profile</DialogTitle>
      <DialogContent dividers>
        <TextField label="Name" value={userDetails.name} fullWidth margin="normal"/>
        <TextField label="Email" value={userDetails.email} fullWidth margin="normal"/>
        {/* <TextField
          label="Skills"
          fullWidth
          margin="normal"
          select
          SelectProps={{
            multiple: true,
            // Add other props as needed
          }}
          value={userDetails.skills}
          // Add onChange handler for skills
        /> */}
        <FormControl fullWidth margin='normal'>
          <InputLabel>Update Skills</InputLabel>
          <Select
            multiple
            label="Update skills"
            value={selectedSkills}
            onChange={handleSkillChange}
            renderValue={(selected) => selected.join(', ')}
          >
            {allSkills.map((skill) => (
              <MenuItem key={skill.id} value={skill.title}>
                {skill.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel}>Cancel</Button>
        <Button onClick={handleSave} color="primary">Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditProfileDialog;
