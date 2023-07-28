import React from 'react';
import { Link } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  AssignmentInd as AssignmentIndIcon,
  Work as WorkIcon,
} from '@mui/icons-material';

const RecruiterMenu = () => {
  const [open, setOpen] = React.useState(false);

  const handleMenuOpen = () => {
    setOpen(true);
  };

  const handleMenuClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <IconButton color="inherit" onClick={handleMenuOpen}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Recruiter Dashboard
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer anchor="left" open={open} onClose={handleMenuClose}>
        <List>
          <ListItem button component={Link} to="/recruiter">
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Recruiter Dashboard" />
          </ListItem>
          <ListItem button component={Link} to="/pending-requests">
            <ListItemIcon>
              <AssignmentIndIcon />
            </ListItemIcon>
            <ListItemText primary="Pending Requests" />
          </ListItem>
          <ListItem button component={Link} to="/project-opening-management">
            <ListItemIcon>
              <WorkIcon />
            </ListItemIcon>
            <ListItemText primary="Project Opening Management" />
          </ListItem>
        </List>
      </Drawer>
    </div>
  );
};

export default RecruiterMenu;
