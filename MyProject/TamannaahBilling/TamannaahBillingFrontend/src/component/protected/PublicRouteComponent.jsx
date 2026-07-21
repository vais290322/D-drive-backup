import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Outlet, useNavigate } from 'react-router-dom';

const PublicRouteComponent = () => {
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/"); // Redirect to home if user is already logged in
    }
  }, [user, navigate]);

  return <Outlet />;
};

export default PublicRouteComponent;