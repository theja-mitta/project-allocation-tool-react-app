import React, { useState } from 'react';
import { AppBar, Toolbar, Tabs, Tab, IconButton, Menu, MenuItem, Snackbar, SnackbarContent } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { makeStyles } from '@mui/styles';
import { AccountCircle } from '@mui/icons-material';
import { AuthService } from '../services/api/auth';
import { useSelector, useDispatch } from 'react-redux';
import { setStateToInitialState } from '../store/reducers/authReducer';
import EditProfileDialog from './EditProfileDialog';

const useStyles = makeStyles((theme) => ({
  tab: {
    textTransform: 'none',
  },
  avatar: {
    marginLeft: 'auto',
  },
}));

const AppBarMenu = ({ menuOptions, value, onChange }) => {
  const classes = useStyles();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const authToken = useSelector((state) => state.auth.authToken);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarColor, setSnackbarColor] = useState("red"); // Default color for errors


  // State variables for the dialog
  const [isEditProfileDialogOpen, setIsEditProfileDialogOpen] = useState(false);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    AuthService.logout(authToken);
    dispatch(setStateToInitialState());
    handleMenuClose();

    // Show success Snackbar
    showSnackbar("Logged out successfully.", "green");

    setTimeout(() => {
      navigate('/login');
    }, 500);
  };
  

  const showSnackbar = (message, color) => {
    setSnackbarMessage(message);
    setSnackbarColor(color);
    setSnackbarOpen(true);
  };  

  // Function to open the Edit Profile dialog
  const handleEditProfileClick = () => {
    handleMenuClose();
    setIsEditProfileDialogOpen(true);
  };

  return (
    <AppBar position="fixed">
      <Toolbar>
        <Tabs value={value} onChange={onChange} className={classes.tabs}
        sx={{
          flexGrow: 1,
          display: 'flex',
          justifyContent: 'center',
          '& .css-1p3oikn-MuiButtonBase-root-MuiTab-root': {
            color: 'white', // Set text color to white
            '&.Mui-selected': {
              color: 'white',
              borderBottom: '4px solid white', // Set text color of the active tab to white
              '&:active': {
                color: 'white',
                borderBottom: '3px solid white' // Set text color of the active tab on hover to white
              },
            },
            '&.css-dn9qk9-MuiTabs-indicator': {
              backgroundColor: 'red', // Set indicator (underline) color to white
            },
          },
        }}>
          {menuOptions.map((option, index) => (
            <Tab
              key={index}
              label={option.label}
              component={Link}
              to={option.path}
              className={classes.tab}
            />
          ))}
        </Tabs>
        <IconButton edge="end" color="inherit" onClick={handleMenuOpen} className={classes.avatar}>
          <AccountCircle />
        </IconButton>
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
          <MenuItem onClick={handleEditProfileClick}>Edit Profile</MenuItem>
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
        <EditProfileDialog
          open={isEditProfileDialogOpen}
          onClose={() => setIsEditProfileDialogOpen(false)} // Close the dialog
        />
      </Toolbar>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={5000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <SnackbarContent
          message={snackbarMessage}
          onClose={() => setSnackbarOpen(false)}
          sx={{ backgroundColor: snackbarColor }} // Set background color based on snackbarColor
        />
      </Snackbar>

    </AppBar>
  );
};

export default AppBarMenu;

