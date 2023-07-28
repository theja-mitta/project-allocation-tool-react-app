import React from 'react';
import { useSelector } from 'react-redux';

const Home = () => {
  const userRole = useSelector((state) => state.auth.userRole);

  return (
    <div>
      <h1>Welcome to Project Allocation Tool</h1>
      {userRole === 'admin' && <AdminDashboardSummary />}
      {userRole === 'recruiter' && <RecruiterDashboardSummary />}
      {userRole === 'employee' && <EmployeeDashboardSummary />}
    </div>
  );
};

const AdminDashboardSummary = () => {
  // Add summary content for admin dashboard
  return <p>Admin Dashboard Summary</p>;
};

const RecruiterDashboardSummary = () => {
  // Add summary content for recruiter dashboard
  return <p>Recruiter Dashboard Summary</p>;
};

const EmployeeDashboardSummary = () => {
  // Add summary content for employee dashboard
  return <p>Employee Dashboard Summary</p>;
};

export default Home;
