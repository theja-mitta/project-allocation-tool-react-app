import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Grid,
  Box,
  Container,
  Typography,
} from '@mui/material';
import { ProjectAllocationService } from '../services/api/projectAllocationService';

const OpeningForm = () => {
    const initialErrors = {
        title: '',
        details: '',
        level: '',
        location: '',
        skills: '',
        project: '', // Add project field to initialErrors
      };
    
      const initialState = {
        title: '',
        details: '',
        level: '',
        location: '',
        skills: [],
        project: '', // Clear project field as well
      };
    
      const [formData, setFormData] = useState(initialState);
      const [skills, setSkills] = useState([]);
      const [projects, setProjects] = useState([]);
      const [successMessage, setSuccessMessage] = useState('');
      const [errors, setErrors] = useState(initialErrors);

  useEffect(() => {
    // Fetch skills from API and set them in the state
    const fetchSkills = async () => {
      try {
        const skillsData = await ProjectAllocationService.getSkills();
        setSkills(skillsData);
      } catch (error) {
        console.error('Error fetching skills:', error);
      }
    };

    // Fetch projects from API and set them in the state
    const fetchProjects = async () => {
      try {
        const projectsData = await ProjectAllocationService.getProjects();
        console.log(projectsData);
        setProjects(projectsData);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    fetchSkills();
    fetchProjects();
  }, []);

  useEffect(() => {
    // Clear the success message after 3 seconds (adjust the time as needed)
    const timeoutId = setTimeout(() => {
      setSuccessMessage('');
    }, 3000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [successMessage]);

  // Validation function to check if title is not numeric
  const isTitleValid = (title) => {
    return isNaN(title);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    // Apply custom validation for title
    if (name === 'title') {
        const isTitleNumeric = !isTitleValid(value);
        setErrors((prevErrors) => ({
          ...prevErrors,
          title: isTitleNumeric ? 'Title should not be numeric.' : '', // Set the error message conditionally
        }));
      } else if (value) {
        // Clear the error message if the field has a value
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: '',
        }));
      }
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const validateForm = () => {
    let isValid = true;

    // Validate title
    if (!formData.title.trim()) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        title: 'Title is required.',
      }));
      isValid = false;
    }

    // Validate details
    if (!formData.details.trim()) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        details: 'Details is required.',
      }));
      isValid = false;
    }

    // Validate level
    if (!formData.level) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        level: 'Level is required.',
      }));
      isValid = false;
    }

    // Validate location
    if (!formData.location.trim()) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        location: 'Location is required.',
      }));
      isValid = false;
    }

    // Validate skills
    if (formData.skills.length === 0) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        skills: 'Skills are required.',
      }));
      isValid = false;
    }

    // Validate project
    if (!formData.project) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        project: 'Project is required.',
      }));
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async () => {
    try {
      const projectId = formData.project; // Get the selected project ID
      const payload = {
        title: formData.title,
        details: formData.details,
        level: formData.level,
        location: formData.location,
        skills: formData.skills.map((skillId) => ({ id: skillId })),
      };

      console.log(projectId, payload);
      const isValid = validateForm();

      if (isValid) {
        const response = await ProjectAllocationService.createOpening(
          projectId,
          payload
        );
        console.log('Opening created:', response.data);
        setSuccessMessage('Opening created successfully!');
        setFormData(initialState);
      }
    } catch (error) {
      console.error('Error creating opening:', error);
      // Handle error, e.g., show an error message
    }
  };

  return (
    <Container
      component="main"
      maxWidth="sm"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '70vh',
      }}
    >
      <Typography variant="h5" gutterBottom>
        Post Opening
      </Typography>
      <Box
        component="form"
        noValidate
        sx={{
          width: '100%',
          p: 2,
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Title"
              variant="outlined"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              fullWidth
              margin="normal"
              error={Boolean(errors.title)}
              helperText={errors.title}
              inputProps={{
                minLength: 4,
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Details"
              variant="outlined"
              name="details"
              value={formData.details}
              onChange={handleChange}
              required
              fullWidth
              margin="normal"
              error={Boolean(errors.details)}
              helperText={errors.details}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth error={Boolean(errors.level)}>
              <InputLabel>Level</InputLabel>
              <Select
                label="Level"
                name="level"
                value={formData.level}
                onChange={handleChange}
              >
                <MenuItem value={1}>1</MenuItem>
                <MenuItem value={2}>2</MenuItem>
                <MenuItem value={3}>3</MenuItem>
              </Select>
              {Boolean(errors.level) && (
                <Typography variant="caption" color="error">
                  {errors.level}
                </Typography>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Location"
              variant="outlined"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              fullWidth
              margin="normal"
              error={Boolean(errors.location)}
              helperText={errors.location}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth error={Boolean(errors.skills)}>
              <InputLabel>Skills</InputLabel>
              <Select
                label="Skills"
                name="skills"
                multiple
                value={formData.skills}
                onChange={handleChange}
              >
                {skills.map((skill) => (
                  <MenuItem key={skill.id} value={skill.id}>
                    {skill.title}
                  </MenuItem>
                ))}
              </Select>
              {Boolean(errors.skills) && (
                <Typography variant="caption" color="error">
                  {errors.skills}
                </Typography>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth error={Boolean(errors.project)}>
              <InputLabel>Project</InputLabel>
              <Select
                label="Project"
                name="project"
                value={formData.project}
                onChange={handleChange}
              >
                {projects.map((project) => (
                  <MenuItem key={project.id} value={project.id}>
                    {project.title}
                  </MenuItem>
                ))}
              </Select>
              {Boolean(errors.project) && (
                <Typography variant="caption" color="error">
                  {errors.project}
                </Typography>
              )}
            </FormControl>
          </Grid>
        </Grid>
        <Grid
          item
          xs={12}
          sx={{ display: 'flex', justifyContent: 'center', margin: '20px' }}
        >
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Submit
          </Button>
        </Grid>
        {successMessage && (
          <Typography variant="body1" color="success" align="center">
            {successMessage}
          </Typography>
        )}
      </Box>
    </Container>
  );
};

export default OpeningForm;