// App.js
import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Login } from './pages/Login.Page';
import { Register } from './pages/Register.Page';
import NotFound from './pages/NotFound.Page';
import UserDashboard from './pages/Dashboard.Page';
import Header from './components/Header';
import Layout from './containers/Layout';

const App = () => {
  // const userRole = useSelector((state) => state.auth.userRole);
  // const userPermissions = useSelector(state => state.auth.userPermissions);

  return (
    <div>
      <Router>
        <div>
          {/* Fixed header with App Menu */}
          {/* <header>
            <Header />
          </header> */}

          {/* Main Content */}
          <Layout>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<UserDashboard />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </div>
      </Router>
    </div>
  );
};

export default App;
