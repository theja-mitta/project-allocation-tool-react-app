import React, { useState, useEffect } from 'react';
import {
  Typography,
  AppBar,
  Tabs,
  Tab,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Container,
} from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useSelector } from 'react-redux';
import { ProjectAllocationService } from '../services/api/projectAllocationService';

const CandidateAllocationDashboard = () => {
  const authToken = useSelector(state => state.auth.authToken);
  const [freePoolUsers, setFreePoolUsers] = useState([]);
  const [allocatedUsers, setAllocatedUsers] = useState([]);
  const [selectedTab, setSelectedTab] = useState('free_pool');
  const [selectedTimePeriod, setSelectedTimePeriod] = useState('last_week');
  const [allocatedUsersChartData, setAllocatedUsersChartData] = useState([]);

  useEffect(() => {
    fetchFreePoolUsers();
    fetchAllocatedUsers(selectedTimePeriod);
  }, [selectedTimePeriod]);

  const fetchFreePoolUsers = async () => {
    // Fetch free pool users data using API (replace with your API call)
    try {
      const response = await ProjectAllocationService.fetchFreePoolUsers(authToken);
      setFreePoolUsers(response);
    } catch (error) {
      console.error('Error fetching free pool users:', error);
    }
  };

  const fetchAllocatedUsers = async (timePeriod) => {
    // Fetch allocated users data using API (replace with your API call)
    const currentDate = new Date();
    let startDate, endDate;

    if (timePeriod === 'last_week') {
      startDate = new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000);
      endDate = currentDate;
    } else if (timePeriod === 'last_month') {
      startDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, currentDate.getDate());
      endDate = currentDate;
    } else if (timePeriod === 'last_year') {
      startDate = new Date(currentDate.getFullYear() - 1, currentDate.getMonth(), currentDate.getDate());
      endDate = currentDate;
    }

    // try {
    //   const response = await ProjectAllocationService.fetchAllocatedUsers(startDate, endDate, authToken);
    //   setAllocatedUsers(response);

    //   // Prepare data for the bar chart
    //   const chartData = [{ time_period: 'Allocated', count: response.length }];
    //   setAllocatedUsersChartData(chartData);
    // } catch (error) {
    //   console.error('Error fetching allocated users:', error);
    // }
    try {
      const response = await ProjectAllocationService.fetchAllocatedUsers(startDate, endDate, authToken);
      console.log('here', response)
      // Fetch associated projects for each user and add to allocatedUsers
      const usersWithProjects = await Promise.all(response.map(async (user) => {
          const projects = await ProjectAllocationService.getProjectsForUser(authToken, user.id);
          return { ...user, projects };
      }));
      setAllocatedUsers(usersWithProjects);
      // ... (rest of the code)
      } catch (error) {
          console.error('Error fetching allocated users:', error);
      }
    };

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleTimePeriodChange = (event, newValue) => {
    setSelectedTimePeriod(newValue);
  };

  return (
    <Container maxWidth="lg" style={{ marginTop: '20px', backgroundColor: 'white', padding: '10px', borderRadius: '4px' }}>
      <Typography variant="h4" gutterBottom>
        Candidate Allocation Dashboard
      </Typography>
      <AppBar position="static" color="default" style={{ marginBottom: '20px' }}>
        <Tabs value={selectedTab} onChange={handleTabChange} indicatorColor="primary" textColor="primary">
          <Tab value="free_pool" label="Free Pool Users" />
          <Tab value="allocated" label="Allocated Users" />
        </Tabs>
      </AppBar>
      {selectedTab === 'free_pool' ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell style={{ textAlign: 'center', fontWeight: 'bold' }}>ID</TableCell>
                <TableCell style={{ textAlign: 'center', fontWeight: 'bold' }}>Name</TableCell>
                <TableCell style={{ textAlign: 'center', fontWeight: 'bold' }}>Email</TableCell>
                <TableCell style={{ textAlign: 'center', fontWeight: 'bold' }}>Skills</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {freePoolUsers.length && freePoolUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell align='center'>{user.id}</TableCell>
                  <TableCell align='center'>{user.name}</TableCell>
                  <TableCell align='center'>{user.email}</TableCell>
                  <TableCell align='center'>{user.skills.length > 0 ? user.skills.map((skill) => skill.title).join(', ') : 'N/A'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Box>
          <AppBar position="static" color="default" style={{ maxWidth: '400px', margin: '0 auto' }}>
            <Tabs value={selectedTimePeriod} onChange={handleTimePeriodChange} indicatorColor="primary" textColor="primary" centered>
              <Tab value="last_week" label="Last Week" />
              <Tab value="last_month" label="Last Month" />
              <Tab value="last_year" label="Last Year" />
            </Tabs>
          </AppBar>
          <div style={{ width: '50%', margin: '0 auto' }}>
            <Box height={300} display="flex" justifyContent="center" alignItems="center" marginTop="20px">
              <ResponsiveContainer width="100%" height="80%">
                <BarChart data={allocatedUsersChartData} margin={{ left: 20, right: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time_period" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </div>
          <TableContainer component={Paper} style={{ marginTop: '20px' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell style={{ textAlign: 'center', fontWeight: 'bold' }}>ID</TableCell>
                  <TableCell style={{ textAlign: 'center', fontWeight: 'bold' }}>Name</TableCell>
                  <TableCell style={{ textAlign: 'center', fontWeight: 'bold' }}>Email</TableCell>
                  <TableCell style={{ textAlign: 'center', fontWeight: 'bold' }}>Projects</TableCell>
                  <TableCell style={{ textAlign: 'center', fontWeight: 'bold' }}>Skills</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {allocatedUsers.length ? allocatedUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell align='center'>{user.id}</TableCell>
                    <TableCell align='center'>{user.name}</TableCell>
                    <TableCell align='center'>{user.email}</TableCell>
                    <TableCell align='center'>
                      {user.projects && user.projects.length > 0
                        ? user.projects.map((project) => project.title).join(', ')
                        : 'No projects'}
                    </TableCell>
                    <TableCell align='center'>
                      {user.skills && user.skills.length > 0
                        ? user.skills.map((skill) => skill.title).join(', ')
                        : 'N/A'}
                    </TableCell>
                  </TableRow>
                )) : 
                (<TableRow>
                  <TableCell>No users data found</TableCell>
                </TableRow>)}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}
    </Container>
  );
};

export default CandidateAllocationDashboard;
