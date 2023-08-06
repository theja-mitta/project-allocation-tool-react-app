// FreePoolUsersTable.js
import React from 'react';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

const FreePoolUsersTable = ({ freePoolUsers }) => {
  return (
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
          {freePoolUsers.map((user) => (
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
  );
};

export default FreePoolUsersTable;
