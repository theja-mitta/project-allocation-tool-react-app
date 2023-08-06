// theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2196F3', // Replace this with your desired primary color
    },
    success: {
      main: '#4CAF50', // Define your success color here
    },
    overrides: {
      MuiTabs: {
        root: {
          '& .MuiTab-root': {
            color: 'white', // Set text color to white
          },
          '& .MuiTab-root.Mui-selected': {
            color: 'white', // Set text color of the active tab to white
          },
          '& .MuiTab-root.Mui-selected:hover': {
            color: 'white', // Set text color of the active tab on hover to white
          },
          '& .MuiTabs-indicator': {
            backgroundColor: 'white', // Set indicator (underline) color to white
          },
        },
      },
    },
    // You can add more custom colors if needed
  },
});

export default theme;
