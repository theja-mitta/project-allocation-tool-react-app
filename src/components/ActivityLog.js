import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Link,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Grid,
  Pagination
} from '@mui/material';

import { ProjectAllocationService } from '../services/api/projectAllocationService';

const ActivityLog = () => {
  const authToken = useSelector(state => state.auth.authToken);
  const [activityLogs, setActivityLogs] = useState([]);
  const [selectedLog, setSelectedLog] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [logComments, setLogComments] = useState([]);

  const [selectedUser, setSelectedUser] = useState(null);
  const [openUserDialog, setOpenUserDialog] = useState(false);

  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(10);
  const [totalElements, setTotalElements] = useState(0);

  useEffect(() => {
    // API call to get activity logs
    ProjectAllocationService.getAllActivityLogs(authToken, rowsPerPage, page)
      .then((response) => {
        setActivityLogs(response.auditLogs);
        setTotalElements(response.totalElements);
      })
      .catch((error) => console.error(error));
  }, [page]);

  const handleViewComments = (logId) => {
    // API call to get comments for the selected logId
    ProjectAllocationService.getActivityLogComments(logId, authToken)
      .then((response) => {
        // Check if the response is an array, otherwise, create a new array with the single comment
        const commentsArray = Array.isArray(response) ? response : [response];
        setLogComments(commentsArray);
        setOpenDialog(true);
      })
      .catch((error) => console.error(error));
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleViewUserDetails = (user) => {
    setSelectedUser(user);
    setOpenUserDialog(true);
  };

  const handleCloseUserDialog = () => {
    setOpenUserDialog(false);
  };

  // Function to format the date to a readable string
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    };
    return date.toLocaleString(undefined, options);
  };

  return (
    <Grid container style={{ width: '100%', margin: '0 auto', height: 'calc(100vh - 100px)' }}>
      <Grid item xs={12}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell style={{ textAlign: 'center', fontWeight: 'bold' }}>Log ID</TableCell>
                <TableCell style={{ textAlign: 'center', fontWeight: 'bold' }}>Action</TableCell>
                <TableCell style={{ textAlign: 'center', fontWeight: 'bold' }}>Logged At</TableCell>
                <TableCell style={{ textAlign: 'center', fontWeight: 'bold' }}>User</TableCell>
                <TableCell style={{ textAlign: 'center', fontWeight: 'bold' }}>Comments</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {activityLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell style={{ textAlign: 'center' }}>{log.id}</TableCell>
                  <TableCell style={{ textAlign: 'center' }}>{log.action}</TableCell>
                  <TableCell style={{ textAlign: 'center' }}>{formatDate(log.loggedAt)}</TableCell>
                  <TableCell style={{ textAlign: 'center' }}>
                    <Link
                      component="button"
                      variant="body2"
                      onClick={() => handleViewUserDetails(log.user)}
                    >
                      View User Details
                    </Link>
                  </TableCell>
                  <TableCell style={{ textAlign: 'center' }}>
                      <Link
                        component="button"
                        variant="body2"
                        onClick={() => handleViewComments(log.id)}
                      >
                        View Log Comments
                      </Link>
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
      </Grid>
      {/* Dialog to display log comments */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle style={{ backgroundColor: '#2196F3', color: 'white' }}>Log Comments</DialogTitle>
        <DialogContent dividers>
          {/* Map over the logComments array to render each comment */}
          {logComments.map((comment) => (
            <DialogContentText key={comment.id}>{comment.comment}</DialogContentText>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
      {/* Dialog to display user details */}
      <Dialog open={openUserDialog} onClose={handleCloseUserDialog}>
        <DialogTitle style={{ backgroundColor: '#2196F3', color: 'white' }}>User Details</DialogTitle>
        <DialogContent dividers>
          {selectedUser && (
            <div>
              <DialogContentText>
                <strong>Id:</strong> {selectedUser.id}
              </DialogContentText>
              <DialogContentText>
                <strong>Name:</strong> {selectedUser.name}
              </DialogContentText>
              <DialogContentText>
                <strong>Email:</strong> {selectedUser.email}
              </DialogContentText>
              {/* Add any other user details you want to display */}
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseUserDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

export default ActivityLog;
