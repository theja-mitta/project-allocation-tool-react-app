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
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { ProjectAllocationService } from '../services/api/projectAllocationService';
import { useSelector } from 'react-redux';

const timePeriodTextMap = {
  last_week: 'last week',
  last_month: 'last month',
  last_year: 'last year'
};

const CandidateAllocationDashboard = () => {
  const authToken = useSelector(state => state.auth.authToken);
  const [freePoolUsers, setFreePoolUsers] = useState([]);
  const [allocatedUsers, setAllocatedUsers] = useState([]);
  const [selectedTimePeriod, setSelectedTimePeriod] = useState('last_week');
  const [selectedChartSection, setSelectedChartSection] = useState('allocated');
  const [allocatedPage, setAllocatedPage] = useState(0);
  const [freePoolPage, setFreePoolPage] = useState(0);  
  const [chartData, setChartData] = useState([
    { name: 'Allocated Users', value: 0 },
    { name: 'Free Pool Users', value: 0 },
  ]);
  const [totalElements, setTotalElements] = useState(0);
  const [freePoolTotalElements, setFreePoolTotalElements] = useState(0);
  const rowsPerPage = 9;

  useEffect(() => {
    fetchFreePoolUsers();
    fetchAllocatedUsers(selectedTimePeriod, allocatedPage);
  }, [selectedTimePeriod, allocatedPage, freePoolPage]);

  useEffect(() => {
    updateChartData();
  }, [allocatedUsers, freePoolUsers]);

  const handleAllocatedPageChange = (event, newPage) => {
    setAllocatedPage(newPage - 1); // Adjusted to match API's page numbering
  };
  
  const handleFreePoolPageChange = (event, newPage) => {
    setFreePoolPage(newPage - 1); // Adjusted to match API's page numbering
  };

  const fetchFreePoolUsers = async () => {
    try {
      const response = await ProjectAllocationService.fetchFreePoolUsers(authToken, rowsPerPage, freePoolPage);
      setFreePoolUsers(response.freePoolUsers);
      setFreePoolTotalElements(response.totalElements);
    } catch (error) {
      console.error('Error fetching free pool users:', error);
    }
  };

  const fetchAllocatedUsers = async (timePeriod, page) => {
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
      const response = await ProjectAllocationService.fetchAllocatedUsers(startDate, endDate, authToken, rowsPerPage, page);
      const usersWithProjects = await Promise.all(response.allocatedUsers.map(async (user) => {
          const projects = await ProjectAllocationService.getProjectsForUser(authToken, user.id);
          return { ...user, projects };
      }));
      setAllocatedUsers(usersWithProjects);
      setTotalElements(response.totalElements);
      // ... (rest of the code)
    } catch (error) {
      console.error('Error fetching allocated users:', error);
    }
  };

  const updateChartData = () => {
    setChartData([
      { name: 'Allocated Users', value: totalElements },
      { name: 'Free Pool Users', value: freePoolTotalElements },
    ]);
  };

  const handleTabChange = (event, newValue) => {
    setSelectedTimePeriod(newValue);
    setAllocatedPage(0);
    setFreePoolPage(0);
    setAllocatedUsers([]);
    setFreePoolUsers([]);
  };

  const handleChartClick = (data, index) => {
    setSelectedChartSection(index === 0 ? 'allocated' : 'free_pool');
  };

  return (
    <Grid container spacing={2} style={{ display: 'flex', width: '100%', justifyContent: 'space-around', margin: '0 auto', backgroundColor: 'white', padding: '10px', borderRadius: '4px', height: 'calc(100vh - 100px)'  }}>
        <Box flex="0 0 48%" justifyContent={'center'}>
          <Typography variant="h6" gutterBottom>
            {selectedChartSection === 'free_pool' ? 'Free Pool Users' : `Allocated Users ${timePeriodTextMap[selectedTimePeriod]}`}
          </Typography>
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
                    {allocatedUsers.length > 0 ? (
                      allocatedUsers.map((user) => (
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
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} align='center'>
                          {`No candidates allocated ${timePeriodTextMap[selectedTimePeriod]}`}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
                <Grid item xs={12}>
                  <Pagination
                    count={Math.ceil(totalElements / rowsPerPage)}
                    page={allocatedPage + 1} // Add 1 to match displayed page number
                    onChange={handleAllocatedPageChange}
                    color="primary"
                    shape="rounded"
                    showFirstButton
                    showLastButton
                    sx={{ margin: '16px', display: 'flex', justifyContent: 'center' }}
                  />
                </Grid>
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
                    {freePoolUsers.length > 0 && freePoolUsers.map((user) => (
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
                    count={Math.ceil(freePoolTotalElements / rowsPerPage)}
                    page={freePoolPage + 1} // Add 1 to match displayed page number
                    onChange={handleFreePoolPageChange}
                    color="primary"
                    shape="rounded"
                    showFirstButton
                    showLastButton
                    sx={{ margin: '16px', display: 'flex', justifyContent: 'center' }}
                  />
                </Grid>
              </TableContainer>
            )}
        </Box>
        <Box flex="0 0 48%" justifyContent={'center'}>
          <Tabs value={selectedTimePeriod} onChange={handleTabChange} indicatorColor="primary" textColor="primary">
            <Tab value="last_week" label="Last Week" />
            <Tab value="last_month" label="Last Month" />
            <Tab value="last_year" label="Last Year" />
          </Tabs>
          <Paper style={{ padding: '20px', display: 'flex', justifyContent: 'center' }}>
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
              <Tooltip />
              <Legend />
            </PieChart>
          </Paper>
        </Box>
    </Grid>
  );
};

export default CandidateAllocationDashboard;
