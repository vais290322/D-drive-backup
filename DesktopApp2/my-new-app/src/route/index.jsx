// src/route/index.js
import React from "react";
import App from "../App";
import Login from "../components/Login";
import Signup from "../components/Signup";
import { createHashRouter } from "react-router";
import Home from "../components/Home";
import About from "../components/About";
import Features from "../components/Features";
import Reviews from "../components/Reviews";
import Support from "../components/Support";
import Pricing from "../components/Pricing";
import Gdpr from "../components/Gdpr";
import CookiePolicy from "../components/CookiePolicy";
import Term from "../components/Term";
import PrivacyPolicy from "../components/PrivacyPolicy";
import OfflineTest from "../components/OfflineTest";


const router = createHashRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "signup",
        element: <Signup />,
      },
      {
        path:"about",
        element:<About/>
      },
      {
        path:'features',
        element:<Features/>
      },
      {
        path:'reviews',
        element:<Reviews/>
      },
      {
        path:'support',
        element:<Support/>
      },
      {
        path:'pricing',
        element:<Pricing/>
      },
      {
        path: 'gdpr-compliance',
        element:<Gdpr/>
      },
      {
        path: 'cookie-policy',
        element:<CookiePolicy/>
      },
      {
        path: 'terms-of-service',
        element: <Term />,
      },
      {
        path: 'privacy-policy',
        element: <PrivacyPolicy />,
      },
      {
        path: 'offline',
        element: <OfflineTest />,
      },
    ],
  },
]);

export default router;
