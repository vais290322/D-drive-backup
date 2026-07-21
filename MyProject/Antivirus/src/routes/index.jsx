import { createBrowserRouter } from "react-router";
import App from "../App";
import Home from "../Pages/Home";
import Features from "../Pages/Features";
import Reviews from "../Pages/Reviews";
import Support from "../Pages/Support";
import Pricing from "../Pages/Pricing";
import Gdpr from "../Pages/Gdpr";
import CookiePolicy from "../Pages/CookiePolicy";
import Term from "../Pages/Term";
import PrivacyPolicy from "../Pages/PrivacyPolicy";
import About from "../Pages/About";
import Contact from "../Pages/Contact";
import SystemRequirement from "../Pages/SystemRequirement";
import UserGuide from "../Pages/UserGuide";
import ReportBug from "../Pages/ReportBug";
import SecurityCenter from "../Pages/SecurityCenter";
import Eula from "../Pages/Eula";
import HelpCenter from "../Pages/HelpCenter";
import Security from "../Pages/Security";
import IdCard from "../Pages/IdCard";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },

      {
        path: "about",
        element: <About />,
      },

      {
        path: "contact",
        element: <Contact />,
      },

      {
        path: "features",
        element: <Features />,
      },
      {
        path: "reviews",
        element: <Reviews />,
      },
      {
        path: "support",
        element: <Support />,
      },
      {
        path: "pricing",
        element: <Pricing />,
      },
      {
        path: "gdpr-compliance",
        element: <Gdpr />,
      },
      {
        path: "cookie-policy",
        element: <CookiePolicy />,
      },
      {
        path: "terms-of-service",
        element: <Term />,
      },
      {
        path: "privacy-policy",
        element: <PrivacyPolicy />,
      },

      {
        path: "system-requirements",
        element: <SystemRequirement />,
      },

      {
        path: "user-guide",
        element: <UserGuide />,
      },
      {
        path: "report-bug",
        element: <ReportBug />,
      },
      {
        path: "security-center",
        element: <SecurityCenter />,
      },
      {
        path: "eula",
        element: <Eula />,
      },

      {
        path: "*",
        element: <Home />,
      },

      {
        path: "help-center",
        element: <HelpCenter />,
      },
      {
        path: "security",
        element: <Security />,
      },
      {
        path: "id-card",
        element: <IdCard />,
      },
     

    ],
  },
]);

export default router;
