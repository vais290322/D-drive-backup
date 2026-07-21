import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Outlet, useLocation, useNavigate } from 'react-router';

const ProtectedRouteComponent = () => {
  // Use the auth state from Redux instead of hardcoded value
  const { auth, email } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // If user is not authenticated, redirect to login
    if (!auth) {
      navigate("/login");
    }
  }, [auth, navigate]);

  if (!auth) {
    return <div>Loading...</div>;
  }

  // Render child routes
  return <Outlet />;
};

export default ProtectedRouteComponent;
