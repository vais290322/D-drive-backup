import DashboardPage from '@/pages/AllDashboard/DashboardPage';
import EdpDashboardPage from '@/pages/AllDashboard/EdpDashboardPage';
import LibrarianDashboardPage from '@/pages/AllDashboard/LibrarianDashboardPage';
import StudentDashboardPage from '@/pages/AllDashboard/StudentDashboardPage';
import TeacherDashboardPage from '@/pages/AllDashboard/TeacherDashboardPage';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

const ProtectedRouteComponent = () => {
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  if (!user) {
    return <div>Loading...</div>;
  }

  // Render role-based dashboards only for the root path
  if (location.pathname === "/") {
    if (user === "student") {
      return <StudentDashboardPage />;
    }
    if (user === "teacher") {
      return <TeacherDashboardPage />;
    }
    if (user === "edp") {
      return <EdpDashboardPage />;
    }
    if (user === "librarian") {
      return <LibrarianDashboardPage />;
    }
    if (user === "admin" || user === "vais") {
      return <DashboardPage />;
    }
  }

  // Render child routes
  return <Outlet />;
};

export default ProtectedRouteComponent;
