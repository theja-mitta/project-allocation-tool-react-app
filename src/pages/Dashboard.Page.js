  import React, { useMemo } from 'react';
  import { useSelector } from 'react-redux';
  import AppBarMenu from '../components/AppBarMenu';
  import { Box } from '@mui/material';
  import OpeningsList from '../components/OpeningsList';
  import PendingApplicationsList from '../components/PendingApplicationsList';
  import OpeningForm from '../components/OpeningForm';
  import CandidateAllocationDashboard from '../components/CandidateAllocationDashboard';
  import AdminPanel from '../components/AdminPanel';
  import ActivityLog from '../components/ActivityLog';
  import ManageProjects from '../components/ManageProjects';


  const UserDashboard = () => {
    const userPermissions = useSelector((state) => state.auth.userPermissions);
    const loggedinUser = useSelector((state) => state.auth.user);

  // Define menu options mapping based on user permissions
  const menuOptionsMapping = {
    'VIEW_ALL_OPENINGS': { label: 'Project Opportunities', component: () => <OpeningsList userType="employee" showApplied={false} loggedinUser={loggedinUser} /> },
    'VIEW_APPLIED_OPENINGS': { label: 'Opportunities Applied', component: () => <OpeningsList userType="employee" showApplied={true} loggedinUser={loggedinUser} /> },
    'RECRUITER_OWN_OPENINGS': { label: 'Openings Posted by You', component: () => <OpeningsList userType="recruiter" showApplied={false} loggedinUser={loggedinUser} ownOpenings={true}/> },
    'RECRUITER_OTHER_OPENINGS': { label: 'Openings by Other Recruiters', component: () => <OpeningsList userType="recruiter" showApplied={false} loggedinUser={loggedinUser} ownOpenings={false}/> },
    'ADMIN_OWN_OPENINGS': { label: 'Openings Posted by You', component: () => <OpeningsList userType="admin" showApplied={false} loggedinUser={loggedinUser} ownOpenings={true}/> },
    'ADMIN_OTHER_OPENINGS': { label: 'Openings by Other Recruiters', component: () => <OpeningsList userType="admin" showApplied={false} loggedinUser={loggedinUser} ownOpenings={false}/> },
    'VIEW_PENDING_APPLICATIONS': { label: 'Pending Requests', component: PendingApplicationsList },
    'MANAGE_USERS': { label: 'Manage Users', component: AdminPanel },
    'CREATE_OPENING': { label: 'Create Opening', component: OpeningForm },
    'VIEW_REPORTS': { label: 'View Reports', component: CandidateAllocationDashboard },
    'VIEW_USER_ACTIVITY': { label: 'Activity Log', component: ActivityLog },
    'CREATE_PROJECT': { label: 'Manage Projects', component: ManageProjects }
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
        <Box p={2} style={{ marginTop: '64px' }} className="background-container">
            {/* Conditional rendering based on the selected tab index */}
            {menuOptions[value]?.component && React.createElement(menuOptions[value].component)}
          </Box>
      </div>
    );
  };

  export default UserDashboard;

