import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Outlet, useLocation, useNavigate } from 'react-router';

const ProtectedRouteComponent = () => {
  const isAuth = useSelector((state) => state.auth.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuth) {
      navigate("/login", { replace: true });
    }
  }, [isAuth, navigate]);

  if (!isAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-purple-500 border-t-transparent animate-spin"></div>
          <p className="text-lg font-medium text-purple-200 animate-pulse">Verifying session...</p>
        </div>
      </div>
    );
  }

  // Render child routes
  return <Outlet />;
};

export default ProtectedRouteComponent;
