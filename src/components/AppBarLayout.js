import React from 'react';
import { Box } from '@mui/material';

const AppBarLayout = ({ children }) => {
  return (
    <Box paddingTop="64px"> {/* Add some top padding to create space for the fixed AppBarMenu */}
          {children}
        </Box>
  );
};
  

export default AppBarLayout;
