// import React, { useState, useEffect, useMemo } from 'react';
// import { useSelector } from 'react-redux';
// import AppBarMenu from '../components/AppBarMenu';
// import { Box, Typography } from '@mui/material';
// import OpeningsList from '../components/OpeningsList';
// import NotFound from './NotFound.Page';

// const UserDashboard = () => {
//   const userPermissions = useSelector((state) => state.auth.userPermissions);
//   // const menuOptions = [
//   //   { label: 'Project Openings', component: <OpeningsList /> },
//   //   { label: 'Not Found', component: <NotFound /> }
//   // ];

//   const [value, setValue] = React.useState(0);
//   const handleChange = (event, newValue) => {
//     setValue(newValue);
//   };

//   // Define the menu options mapping based on user permissions
//   const menuOptionsMapping = {
//     'VIEW_OPENINGS': { label: 'Project Openings', component: <OpeningsList /> },
//     // Add more menu options based on other user permissions
//     // 'ANOTHER_PERMISSION': { label: 'Another Permission', component: <AnotherComponent /> },
//     // ...
//   };

// // Generate the menu options based on user permissions
// const menuOptions = useMemo(() => {
//   const defaultMenuOptions = [
//   ];

//   // Check if userPermissions is not null before mapping over it
//   const userMenuOptions = userPermissions ? userPermissions.map((permission) => menuOptionsMapping[permission]) : [];

//   // Filter out any undefined menu options
//   const filteredMenuOptions = userMenuOptions.filter((option) => option);

//   // Return the updated menu options, combining user-specific options with the default options
//   return [...defaultMenuOptions, ...filteredMenuOptions];
// }, [userPermissions, menuOptionsMapping]);

//   // // Update menuOptions whenever userPermissions change
//   // useEffect(() => {
//   //   const updatedMenuOptions = generateMenuOptions();
//   //   setMenuOptions(updatedMenuOptions);
//   // }, [userPermissions]);

//   // // Initial menuOptions state based on default and user-specific options
//   // const [menuOptions, setMenuOptions] = useState(generateMenuOptions());

//   return (
//     <div>
//       <AppBarMenu menuOptions={menuOptions} value={value} onChange={handleChange} />
//       <Box p={3}>
//         {/* Conditional rendering based on the selected tab index */}
//         {menuOptions[value].component}
//       </Box>
//     </div>
//   );
// };

// export default UserDashboard;


import React, { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import AppBarMenu from '../components/AppBarMenu';
import { Box, Typography } from '@mui/material';
import OpeningsList from '../components/OpeningsList';
import PendingApplicationsList from '../components/PendingApplicationsList';
import UsersList from '../components/UsersList';
import OpeningForm from '../components/OpeningForm';
import AppliedOpeningsList from '../components/AppliedOpeningsList';

const UserDashboard = () => {
  const userPermissions = useSelector((state) => state.auth.userPermissions);
  const loggedinUser = useSelector((state) => state.auth.user);

// Define menu options mapping based on user permissions
const menuOptionsMapping = {
  'VIEW_ALL_OPENINGS': { label: 'Project Opportunities', component: () => <OpeningsList userType="employee" showApplied={false} loggedinUser={loggedinUser} /> },
    'VIEW_APPLIED_OPENINGS': { label: 'Openings Applied', component: () => <OpeningsList userType="employee" showApplied={true} loggedinUser={loggedinUser} /> },
    'RECRUITER_OWN_OPENINGS': { label: 'Your Openings', component: () => <OpeningsList userType="recruiter" showApplied={false} loggedinUser={loggedinUser} /> },
    'RECRUITER_OTHER_OPENINGS': { label: 'Other Recruiters\' Openings', component: () => <OpeningsList userType="recruiter" showApplied={false} loggedinUser={loggedinUser} /> },
  // 'ADMIN_OWN_OPENINGS': { label: 'Your Openings', component: () => <OpeningsList userType="admin" /> },
  // 'ADMIN_OTHER_OPENINGS': { label: 'Other Recruiters\' Openings', component: () => <OpeningsList userType="admin" /> },
  // 'VIEW_ALL_OPENINGS': { label: 'Project Openings', component: OpeningsList },
  // 'VIEW_APPLIED_OPENINGS': { label: 'Openings applied', component: AppliedOpeningsList },
  // 'VIEW_PENDING_APPLICATIONS': { label: 'Pending Requests', component: PendingApplicationsList },
  // 'MANAGE_USERS': { label: 'Manage Users', component: UsersList },
  // 'CREATE_OPENING': { label: 'Create Opening', component: OpeningForm}
  // ... and so on
};

  // Generate the menu options based on user permissions
  const menuOptions = useMemo(() => {
    const defaultMenuOptions = [];

    // Check if userPermissions is not null before mapping over it
    const userMenuOptions = userPermissions ? userPermissions.map((permission) => menuOptionsMapping[permission]) : [];

    // Filter out any undefined menu options
    const filteredMenuOptions = userMenuOptions.filter((option) => option);

    // Return the updated menu options, combining user-specific options with the default options
    return [...defaultMenuOptions, ...filteredMenuOptions];
  }, [userPermissions, menuOptionsMapping]);

  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div>
      <AppBarMenu menuOptions={menuOptions} value={value} onChange={handleChange} />
      <Box p={3}>
        {/* Conditional rendering based on the selected tab index */}
        {menuOptions[value]?.component && React.createElement(menuOptions[value].component)}
      </Box>
    </div>
  );
};

export default UserDashboard;

