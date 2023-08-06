// AllocatedUsersTable.js
import React from 'react';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

const AllocatedUsersTable = ({ allocatedUsers }) => {
  return (
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
          {allocatedUsers.map((user) => (
            <TableRow key={user.id}>
              <TableCell align='center'>{user.id}</TableCell>
              <TableCell align='center'>{user.name}</TableCell>
              <TableCell align='center'>{user.email}</TableCell>
              <TableCell align='center'>
                {user.projects && user.projects.length > 0 ? user.projects.map((project) => project.title).join(', ') : 'No projects'}
              </TableCell>
              <TableCell align='center'>
                {user.skills && user.skills.length > 0 ? user.skills.map((skill) => skill.title).join(', ') : 'N/A'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default AllocatedUsersTable;
