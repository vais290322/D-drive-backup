import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Outlet, useLocation, useNavigate } from 'react-router';

const ProtectedRouteComponent = () => {
//   const user = useSelector((state) => state.auth.user);
  const user = "admin";
//   const user = null;
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



  // Render child routes
  return <Outlet />;
};

export default ProtectedRouteComponent;
