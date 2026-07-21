import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';

const PublicRouteComponent = ({ children }) => {
  const { auth } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    // If user is already authenticated, redirect to dashboard
    if (auth) {
      navigate('/');
    }
  }, [auth, navigate]);

  // Render the children (login/signup pages) if not authenticated
  return !auth ? children : null;
};

export default PublicRouteComponent;