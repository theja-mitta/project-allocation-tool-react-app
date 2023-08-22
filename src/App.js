// App.js
import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { Login } from './pages/Login.Page';
import { Register } from './pages/Register.Page';
import NotFound from './pages/NotFound.Page';
import UserDashboard from './pages/Dashboard.Page';
import Layout from './containers/Layout';
import theme from './utils/theme';
import Homepage from './pages/HomePage';

const App = () => {

  return (
    <div>
      <ThemeProvider theme={theme}>
        <Router>
          <div>
            {/* Main Content */}
            <Layout>
              <Routes>
                <Route path="/" exact element={<Homepage/>} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<UserDashboard />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
          </div>
        </Router>
      </ThemeProvider>
    </div>
  );
};

export default App;
