import { LoginPage } from '../pages/Login.Page';
import { RegisterPage } from '../pages/Register.Page';
import AdminDashboard from '../pages/Admin.Dashboard.Page';
import RecruiterDashboard from '../pages/Recruiter.Dashboard.Page';
import EmployeeDashboard from '../pages/Dashboard.Page';

const routes = [
    {
      path: '/login',
      component: LoginPage,
      data: {
        public: true,
      },
    },
    {
      path: '/register',
      component: RegisterPage,
      data: {
        public: true,
      },
    },
    {
      path: '/employee',
      component: EmployeeDashboard,
      data: {
        roles: ['employee'],
      },
    },
    {
      path: '/recruiter',
      component: RecruiterDashboard,
      data: {
        roles: ['recruiter'],
      },
    },
    {
      path: '/admin',
      component: AdminDashboard,
      data: {
        roles: ['admin'],
      },
    },
  ];

  export default routes;