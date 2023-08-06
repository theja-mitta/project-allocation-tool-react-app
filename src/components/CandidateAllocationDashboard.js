import React, { useState, useEffect } from 'react';
import {
  Typography,
  Container,
  Paper,
  Box,
  TableContainer,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tabs,
  Tab,
  Pagination,
  Grid
} from '@mui/material';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts'; // Updated import
import { ProjectAllocationService } from '../services/api/projectAllocationService';
import { useSelector } from 'react-redux';

const CandidateAllocationDashboard = () => {
  const authToken = useSelector(state => state.auth.authToken);
  const [freePoolUsers, setFreePoolUsers] = useState([]);
  const [allocatedUsers, setAllocatedUsers] = useState([]);
  const [selectedTimePeriod, setSelectedTimePeriod] = useState('last_week');
  const [selectedChartSection, setSelectedChartSection] = useState('allocated');
  const [chartData, setChartData] = useState([
    { name: 'Allocated Users', value: 0 },
    { name: 'Free Pool Users', value: 0 },
  ]);
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(5);
  const [totalElements, setTotalElements] = useState(0);

  useEffect(() => {
    fetchFreePoolUsers();
    fetchAllocatedUsers(selectedTimePeriod);
  }, [selectedTimePeriod, page]);

  useEffect(() => {
    updateChartData();
  }, [allocatedUsers, freePoolUsers]);

  const fetchFreePoolUsers = async () => {
    try {
      const response = await ProjectAllocationService.fetchFreePoolUsers(authToken, rowsPerPage, page);
      setFreePoolUsers(response.freePoolUsers);
      setTotalElements(response.totalElements);
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

  const updateChartData = () => {
    setChartData([
      { name: 'Allocated Users', value: allocatedUsers.length },
      { name: 'Free Pool Users', value: totalElements },
    ]);
  };

  const handleTabChange = (event, newValue) => {
    setSelectedTimePeriod(newValue);
  };

  const handleChartClick = (data, index) => {
    if (index === 0) {
      setSelectedChartSection('allocated');
    } else if (index === 1) {
      setSelectedChartSection('free_pool');
    }
  };

  return (
    <Container maxWidth="lg" style={{ marginTop: '20px', backgroundColor: 'white', padding: '20px', borderRadius: '4px' }}>
      <Typography variant="h4" gutterBottom>
        Allocation Dashboard
      </Typography>
      <Box display="flex">
        <Box width="50%" marginRight="20px">
          <Typography variant="h6" gutterBottom>
            {/* {selectedTimePeriod.charAt(0).toUpperCase() + selectedTimePeriod.slice(1)} Allocated Users */}
            {selectedChartSection === 'free_pool' ? 'Free Pool Users' : 'Allocated Users'}
          </Typography>
          <Paper style={{ padding: '20px' }}>
            {selectedChartSection === 'allocated' && (
              <TableContainer component={Paper}>
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
                    {allocatedUsers.map((user) => (
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
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
            {selectedChartSection === 'free_pool' && (
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
                        <TableCell align='center'>
                          {user.skills.length > 0 ? user.skills.map((skill) => skill.title).join(', ') : 'N/A'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <Grid item xs={12}>
                  <Pagination
                    count={Math.ceil(totalElements / rowsPerPage)}
                    page={page + 1}
                    onChange={(event, newPage) => setPage(newPage - 1)}
                    color="primary"
                    shape="rounded"
                    showFirstButton
                    showLastButton
                    sx={{ margin: '16px', display: 'flex', justifyContent: 'center' }}
                  />
              </Grid>
              </TableContainer>
            )}
          </Paper>
        </Box>
        <Box width="50%">
          {/* <Typography variant="h6" gutterBottom>
            Free Pool Users vs Allocated Users
          </Typography> */}
          <Tabs value={selectedTimePeriod} onChange={handleTabChange} indicatorColor="primary" textColor="primary">
            <Tab value="last_week" label="Last Week" />
            <Tab value="last_month" label="Last Month" />
            <Tab value="last_year" label="Last Year" />
          </Tabs>
          <Paper style={{ padding: '20px' }}>
            <PieChart width={400} height={300}>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                onClick={handleChartClick}
              >
                <Cell fill="#8884d8" />
                <Cell fill="#82ca9d" />
              </Pie>
              <Tooltip /> {/* Tooltip added */}
              <Legend /> {/* Legend added */}
            </PieChart>
          </Paper>
        </Box>
      </Box>
    </Container>
  );
};

export default CandidateAllocationDashboard;
