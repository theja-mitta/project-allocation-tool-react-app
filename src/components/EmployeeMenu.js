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
import { Menu as MenuIcon, Dashboard as DashboardIcon } from '@mui/icons-material';

const EmployeeMenu = () => {
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
            Employee Dashboard
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer anchor="left" open={open} onClose={handleMenuClose}>
        <List>
          <ListItem button component={Link} to="/employee">
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Employee Dashboard" />
          </ListItem>
        </List>
      </Drawer>
    </div>
  );
};

export default EmployeeMenu;
