
import App from '@/App'
import ForgotPassowrdPage from '@/pages/auth/ForgotPassowrdPage';
import LoginPage from '@/pages/auth/LoginPage';
import ResetPasswordpage from '@/pages/auth/ResetPasswordpage';

import SignupPage from '@/pages/auth/SignupPage';
import React from 'react'
import { createBrowserRouter, } from 'react-router'


const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
          path:"/signup",
          element:<SignupPage/>
        },
  {
    path:"/forgot-password",
    element:<ForgotPassowrdPage/>
  },
  {
    path: "/",
    element:<App/>,
    children:[
      {
        path:"/",
        element:<div>HomePage</div>
        },
        {
          path:"/auth/login",
          element:<LoginPage/>
        },
        
        {
          path:"/auth/reset-password",
          element:<ResetPasswordpage/>
        },
        {
          path:"/auth/forgot-password",
          element:<ForgotPassowrdPage/>
        },
    ]
  },
]);

export default router;
