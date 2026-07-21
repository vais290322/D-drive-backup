import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Outlet, useNavigate } from 'react-router-dom';

const ProtectedRouteComponent = () => {
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  // const token = cookies.get("authToken");

  // console.log("token : ", token);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  if (!user) {
    return <div>Loading...</div>; // ✅ Fixed missing return statement
  }

  // ✅ Ensure the component always returns JSX
  return <Outlet />;
};

export default ProtectedRouteComponent;
