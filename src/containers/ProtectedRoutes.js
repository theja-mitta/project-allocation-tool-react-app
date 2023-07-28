import React from 'react';
import { useSelector } from 'react-redux';
import { Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import AdminMenu from '../components/AdminMenu';
import RecruiterMenu from '../components/RecruiterMenu';
import EmployeeMenu from '../components/EmployeeMenu';
import AdminDashboard from '../pages/Admin.Dashboard.Page';
import RecruiterDashboard from '../pages/Recruiter.Dashboard.Page';
import EmployeeDashboardPage from '../pages/Dashboard.Page';

const ProtectedRoute = ({ element: Element, requiredRoles }) => {
  const userRole = useSelector((state) => state.auth.userRole);
  const navigate = useNavigate();

  if (!requiredRoles.includes(userRole)) {
    // Redirect to unauthorized page if the user role doesn't match any required roles
    navigate('/unauthorized');
    return null;
  }

  // Render the protected component if the user has the required role
  return <Element />;
};

const ProtectedRoutes = () => {
  const userRole = useSelector((state) => state.auth.userRole);
  const location = useLocation();

  const adminPermissions = ['CREATE_PROJECT'];
  const recruiterPermissions = ['CREATE_OPENING', 'VIEW_OPENINGS'];
  const employeePermissions = ['VIEW_OPENINGS'];

  const renderMenu = () => {
    const isLoginOrRegisterPage = ['/login', '/register'].includes(location.pathname);
    if (userRole === 'ADMIN' && !isLoginOrRegisterPage) {
      return <AdminMenu />;
    } else if (userRole === 'RECRUITER' && !isLoginOrRegisterPage) {
      return <RecruiterMenu />;
    } else if (userRole === 'EMPLOYEE' && !isLoginOrRegisterPage) {
      return <EmployeeMenu />;
    }
    return null;
  };

  const protectedRoutes = [
    { path: '/admin', element: <AdminDashboard />, requiredRoles: ['ADMIN'] },
    { path: '/recruiter', element: <RecruiterDashboard />, requiredRoles: ['RECRUITER'] },
    { path: '/project-openings', element: <EmployeeDashboardPage />, requiredRoles: ['EMPLOYEE'] },
  ];

  return (
    <div>
      {renderMenu()}
      <Routes>
        {/* The ProtectedRoute components should be nested inside the Routes component */}
        {protectedRoutes.map((route, index) => (
          <Route
            key={index}
            path={route.path}
            element={(props) => <ProtectedRoute {...props} element={route.element} requiredRoles={route.requiredRoles} />}
          />
        ))}
      </Routes>
    </div>
  );
};

export default ProtectedRoutes;
