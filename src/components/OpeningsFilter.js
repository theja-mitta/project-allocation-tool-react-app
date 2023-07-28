import React, { useState } from 'react';
import { Box, FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material';

const OpeningsFilter = () => {
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');

  // Sample data for skills, levels, and locations
  const skills = ['Skill A', 'Skill B', 'Skill C'];
  const levels = ['Level 1', 'Level 2', 'Level 3'];
  const locations = ['Location X', 'Location Y', 'Location Z'];

  const handleSkillsChange = (event) => {
    setSelectedSkills(event.target.value);
  };

  const handleLevelChange = (event) => {
    setSelectedLevel(event.target.value);
  };

  const handleLocationChange = (event) => {
    setSelectedLocation(event.target.value);
  };

  return (
    <Box mt={3}>
      <Typography variant="h5" gutterBottom>
        Filters
      </Typography>
      <Box display="flex" alignItems="center" mt={2}>
        <FormControl fullWidth sx={{ mr: 2 }}>
          <InputLabel>Skills</InputLabel>
          <Select
            multiple
            value={selectedSkills}
            onChange={handleSkillsChange}
            label="Skills"
          >
            {skills.map((skill) => (
              <MenuItem key={skill} value={skill}>
                {skill}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth sx={{ mr: 2 }}>
          <InputLabel>Level</InputLabel>
          <Select value={selectedLevel} onChange={handleLevelChange} label="Level">
            {levels.map((level) => (
              <MenuItem key={level} value={level}>
                {level}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel>Location</InputLabel>
          <Select value={selectedLocation} onChange={handleLocationChange} label="Location">
            {locations.map((location) => (
              <MenuItem key={location} value={location}>
                {location}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    </Box>
  );
};

export default OpeningsFilter;
