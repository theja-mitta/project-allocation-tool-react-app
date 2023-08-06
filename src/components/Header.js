import React from 'react';
import { AppBar, Toolbar, Tabs, Tab, IconButton, Menu, MenuItem, Avatar } from '@mui/material';
import { Link } from 'react-router-dom';
import { makeStyles } from '@mui/styles';
import { AccountCircle } from '@mui/icons-material';

const useStyles = makeStyles((theme) => ({
  appBar: {
    backgroundColor: 'transparent',
    boxShadow: 'none',
    zIndex: theme.zIndex.appBar + 1,
    color: '#333',
  },
  fixedAppBar: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  tabs: {
    flexGrow: 1,
    display: 'flex',
    justifyContent: 'center',
  },
  tab: {
    textTransform: 'none',
  },
  avatar: {
    marginLeft: theme.spacing(2),
  },
}));

const Header = ({ menuOptions, value, onChange }) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    // Add your logout logic here
    // For example, call a logout function from your authentication service
    // and redirect the user to the login page.
    handleMenuClose();
  };

  return (
    <AppBar position="static" className={`${classes.appBar} ${classes.fixedAppBar}`}>
      <Toolbar className={classes.toolbar}>
        <Tabs value={value} onChange={onChange}>
          {menuOptions.map((option, index) => (
            <Tab key={index} label={option.label} component={Link} to={option.path} />
          ))}
        </Tabs>
        <IconButton edge="end" color="inherit" onClick={handleMenuOpen} className={classes.avatar}>
          <AccountCircle />
        </IconButton>
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
          <MenuItem onClick={handleMenuClose}>Edit Profile</MenuItem>
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
