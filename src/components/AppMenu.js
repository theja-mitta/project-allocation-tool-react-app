import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Menu, MenuItem } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AppMenu = () => {
  const navigate = useNavigate();
  const userRole = useSelector((state) => state.auth.userRole);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (path) => {
    navigate(path);
    setAnchorEl(null);
  };

  // Define menu options based on user roles
  const getMenuOptions = () => {
    const adminOptions = [
      { label: 'Manage Users', path: '/manage-users' },
      { label: 'Audit Logging', path: '/audit-logging' },
      { label: 'Reports', path: '/reports' },
      { label: 'Manage Projects', path: '/manage-projects' },
    ];

    const recruiterOptions = [
      { label: 'Manage Project Openings', path: '/manage-project-openings' },
      { label: 'Pending Applications', path: '/pending-applications' },
    ];

    const employeeOptions = [{ label: 'Project Openings', path: '/project-openings' }];

    switch (userRole) {
      case 'ADMIN':
        return adminOptions;
      case 'RECRUITER':
        return recruiterOptions;
      case 'EMPLOYEE':
        return employeeOptions;
      default:
        return [];
    }
  };

  return (
    <div>
      <AppBar position="fixed">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu" onClick={handleMenu}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6">Your App Name</Typography>
        </Toolbar>
      </AppBar>

      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={open}
        onClose={handleClose}
      >
        {getMenuOptions().map((option, index) => (
          <MenuItem key={index} component={Link} to={option.path} onClick={() => handleMenuItemClick(option.path)}>
            {option.label}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};

export default AppMenu;
