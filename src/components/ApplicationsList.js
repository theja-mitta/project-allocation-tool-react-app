import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Modal, Typography } from '@mui/material';

// Mock data for applications
const applicationsData = [
  {
    id: 1,
    status: 'Pending',
    employeeId: 101,
  },
  {
    id: 2,
    status: 'Interview Scheduled',
    employeeId: 102,
  },
  // Add more applications data here as needed
];

// Mock data for employee profiles
const employeeProfilesData = [
  {
    id: 101,
    name: 'John Doe',
    email: 'john.doe@example.com',
    skills: ['JavaScript', 'React', 'Node.js'],
    // Add more employee profile data here as needed
  },
  {
    id: 102,
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    skills: ['SQL', 'Python', 'Data Visualization'],
    // Add more employee profile data here as needed
  },
  // Add more employee profile data here as needed
];

// Mock data for interviews
const interviewsData = [
  {
    id: 1,
    applicationId: 2,
    date: '2023-07-20',
    time: '10:00 AM',
    interviewer: 'Interviewer Name',
    // Add more interview data here as needed
  },
  // Add more interview data here as needed
];

const ApplicationsList = () => {
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [selectedEmployeeProfile, setSelectedEmployeeProfile] = useState(null);

  const handleViewInterviews = (applicationId) => {
    // Find interviews for the selected applicationId
    const interviews = interviewsData.filter((interview) => interview.applicationId === applicationId);

    // Set the selected application and its interviews to show in the modal
    setSelectedApplication({
      id: applicationId,
      interviews: interviews,
    });
  };

  const handleViewEmployeeProfile = (employeeId) => {
    // Find the employee profile for the selected employeeId
    const employeeProfile = employeeProfilesData.find((profile) => profile.id === employeeId);

    // Set the selected employee profile to show in the modal
    setSelectedEmployeeProfile(employeeProfile);
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow>
            <TableCell>Application ID</TableCell>
            <TableCell align="left">Application Status</TableCell>
            <TableCell align="left">View Interviews</TableCell>
            <TableCell align="left">Employee Name</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {applicationsData.map((application) => (
            <TableRow key={application.id}>
              <TableCell component="th" scope="row">
                {application.id}
              </TableCell>
              <TableCell align="left">{application.status}</TableCell>
              <TableCell align="left">
                <Button onClick={() => handleViewInterviews(application.id)}>View Interviews</Button>
              </TableCell>
              <TableCell align="left">
                <Button onClick={() => handleViewEmployeeProfile(application.employeeId)}>
                  {employeeProfilesData.find((profile) => profile.id === application.employeeId)?.name}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Modal for showing interviews */}
      <Modal open={selectedApplication !== null} onClose={() => setSelectedApplication(null)}>
        <div>
          <Typography variant="h5">Interviews for Application ID: {selectedApplication?.id}</Typography>
          {selectedApplication?.interviews.map((interview) => (
            <div key={interview.id}>
              <Typography>Date: {interview.date}</Typography>
              <Typography>Time: {interview.time}</Typography>
              <Typography>Interviewer: {interview.interviewer}</Typography>
            </div>
          ))}
        </div>
      </Modal>

      {/* Modal for showing employee profile */}
      <Modal open={selectedEmployeeProfile !== null} onClose={() => setSelectedEmployeeProfile(null)}>
        <div>
          <Typography variant="h5">Employee Profile</Typography>
          <Typography>Name: {selectedEmployeeProfile?.name}</Typography>
          <Typography>Email: {selectedEmployeeProfile?.email}</Typography>
          <Typography>Skills: {selectedEmployeeProfile?.skills?.join(', ')}</Typography>
        </div>
      </Modal>
    </TableContainer>
  );
};

export default ApplicationsList;
