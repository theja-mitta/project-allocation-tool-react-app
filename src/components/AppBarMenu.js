// import React from 'react';
// import { AppBar, Toolbar, IconButton, Box, Tab, Tabs } from '@mui/material';
// import { Link, useNavigate } from 'react-router-dom';
// import { useSelector } from 'react-redux';
// import Avatar from '@mui/material/Avatar';

// const AppBarMenu = () => {
//   const navigate = useNavigate();
//   const userRole = useSelector((state) => state.auth.userRole);
//   const [value, setValue] = React.useState(0);

//   const [anchorEl, setAnchorEl] = React.useState(null);
//   const open = Boolean(anchorEl);

//   const handleMenu = (event) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const handleMenuChange = (event, newValue) => {
//     setValue(newValue);
//   };

//   const handleClose = () => {
//     setAnchorEl(null);
//   };

//   const handleMenuItemClick = (path) => {
//     navigate(path);
//     setAnchorEl(null);
//   };

//   // Define menu options based on user roles
//   const getMenuOptions = () => {
//     const adminOptions = [
//       { label: 'Manage Users', path: '/manage-users' },
//       { label: 'Audit Logging', path: '/audit-logging' },
//       { label: 'Reports', path: '/reports' },
//       { label: 'Manage Projects', path: '/manage-projects' },
//     ];

//     const recruiterOptions = [
//       { label: 'Manage Project Openings', path: '/manage-project-openings' },
//       { label: 'Pending Applications', path: '/pending-applications' },
//     ];

//     const employeeOptions = [{ label: 'Project Openings', path: '/project-openings' }];

//     switch (userRole) {
//       case 'ADMIN':
//         return adminOptions;
//       case 'RECRUITER':
//         return recruiterOptions;
//       case 'EMPLOYEE':
//         return employeeOptions;
//       default:
//         return [];
//     }
//   };

//   return (
//     <AppBar position="fixed">
//       <Toolbar>
//         {/* Place the profile or logout icon here (you can use an image or an icon) */}
//         <Avatar alt="User Avatar" src="/path/to/avatar.jpg" style={{ marginRight: '10px' }} />
//         {/* Horizontal Menu using Tabs */}
//         <Tabs value={value} onChange={handleMenuChange}>
//           {getMenuOptions().map((option, index) => (
//             <Tab
//               key={index}
//               label={option.label}
//               component={Link}
//               to={option.path}
//               onClick={() => handleMenuItemClick(option.path)}
//             />
//           ))}
//         </Tabs>
//       </Toolbar>
//     </AppBar>
//   );
// };

// export default AppBarMenu;


// import React from 'react';
// import { AppBar, Toolbar, IconButton, Box, Tab, Tabs, Typography } from '@mui/material';
// import { Link, useNavigate } from 'react-router-dom';
// import { useSelector } from 'react-redux';
// import Avatar from '@mui/material/Avatar';
// import { makeStyles } from '@mui/styles';

// const useStyles = makeStyles((theme) => ({
//   appBar: {
//     backgroundColor: 'transparent', // Set the header background to transparent
//     boxShadow: 'none', // Remove the default box shadow from the header
//     position: 'relative',
//     color: '#333', // Set the color to your desired text color
//   },
//   tabs: {
//     flexGrow: 1,
//     display: 'flex',
//     justifyContent: 'center',
//   },
//   tab: {
//     textTransform: 'none',
//   },
//   avatar: {
//     marginLeft: 'auto', // Align Avatar or Logout button to the right
//   },
// }));

// const AppBarMenu = () => {
//   const classes = useStyles();
//   const navigate = useNavigate();
//   const userRole = useSelector((state) => state.auth.userRole);
//   const [value, setValue] = React.useState(0);

//   const [anchorEl, setAnchorEl] = React.useState(null);
//   const open = Boolean(anchorEl);

//   const handleMenu = (event) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const handleMenuChange = (event, newValue) => {
//     setValue(newValue);
//   };

//   const handleClose = () => {
//     setAnchorEl(null);
//   };

//   const handleMenuItemClick = (path) => {
//     navigate(path);
//     setAnchorEl(null);
//   };

//   // Define menu options based on user roles
//   const getMenuOptions = () => {
//     const adminOptions = [
//       { label: 'Manage Users', path: '/manage-users' },
//       { label: 'Audit Logging', path: '/audit-logging' },
//       { label: 'Reports', path: '/reports' },
//       { label: 'Manage Projects', path: '/manage-projects' },
//     ];

//     const recruiterOptions = [
//       { label: 'Manage Project Openings', path: '/manage-project-openings' },
//       { label: 'Pending Applications', path: '/pending-applications' },
//     ];

//     const employeeOptions = [{ label: 'Project Openings', path: '/project-openings' }];

//     switch (userRole) {
//       case 'ADMIN':
//         return adminOptions;
//       case 'RECRUITER':
//         return recruiterOptions;
//       case 'EMPLOYEE':
//         return employeeOptions;
//       default:
//         return [];
//     }
//   };

//   return (
//     <AppBar position="fixed" className={classes.appBar}>
//       <Toolbar>
//         <Tabs value={value} onChange={handleMenuChange} className={classes.tabs}>
//           {getMenuOptions().map((option, index) => (
//             <Tab
//               key={index}
//               label={option.label}
//               component={Link}
//               to={option.path}
//               onClick={() => handleMenuItemClick(option.path)}
//               className={classes.tab}
//             />
//           ))}
//         </Tabs>
//         {/* Place the profile or logout icon here (you can use an image or an icon) */}
//         <Avatar alt="User Avatar" src="/path/to/avatar.jpg" className={classes.avatar} />
//       </Toolbar>
//     </AppBar>
//   );
// };

// export default AppBarMenu;


import React from 'react';
import { AppBar, Toolbar, Tabs, Tab, Avatar } from '@mui/material';
import { Link } from 'react-router-dom';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
  appBar: {
    backgroundColor: 'transparent', // Set the header background to transparent
    boxShadow: 'none', // Remove the default box shadow from the header
    position: 'relative',
    color: '#333', // Set the color to your desired text color
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
    marginLeft: 'auto', // Align Avatar or Logout button to the right
  },
}));

const AppBarMenu = ({ menuOptions, value, onChange }) => {
    const classes = useStyles();
  return (
    <AppBar position="fixed" className={classes.appBar}>
      <Toolbar>
        <Tabs value={value} onChange={onChange}>
          {menuOptions.map((option, index) => (
            <Tab
              key={index}
              label={option.label}
              component={Link}
              to={option.path}
            />
          ))}
        </Tabs>
        {/* Place the profile or logout icon here (you can use an image or an icon) */}
        {/* <Avatar alt="User Avatar" src="/path/to/avatar.jpg" /> */}
      </Toolbar>
    </AppBar>
  );
};

export default AppBarMenu;

