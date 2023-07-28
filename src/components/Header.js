import React from 'react';
import { useLocation } from 'react-router-dom';
import AppBarMenu from './AppBarMenu';

const Header = () => {
  const location = useLocation();

  // Function to check if the current path is /login or /register
  const isLoginPageOrRegisterPage = () => {
    return location.pathname === '/login' || location.pathname === '/register';
  };

  // Render the AppBarMenu only if not on Login or Register pages
  return !isLoginPageOrRegisterPage() && <AppBarMenu />;
};

export default Header;
