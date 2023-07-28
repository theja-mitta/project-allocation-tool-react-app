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
  ListItemText,
  Divider,
} from '@mui/material';
import { Menu as MenuIcon, Dashboard as DashboardIcon, People as PeopleIcon, EventNote as EventNoteIcon } from '@mui/icons-material';

const AdminMenu = () => {
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
            Admin Dashboard
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer anchor="left" open={open} onClose={handleMenuClose}>
        <List>
          <ListItem button component={Link} to="/admin">
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Admin Dashboard" />
          </ListItem>
          <Divider />
          <ListItem button component={Link} to="/user-management">
            <ListItemIcon>
              <PeopleIcon />
            </ListItemIcon>
            <ListItemText primary="User Management" />
          </ListItem>
          <ListItem button component={Link} to="/audit-logging">
            <ListItemIcon>
              <EventNoteIcon />
            </ListItemIcon>
            <ListItemText primary="Audit Logging" />
          </ListItem>
        </List>
      </Drawer>
    </div>
  );
};

export default AdminMenu;
