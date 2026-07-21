import { createBrowserRouter } from "react-router-dom";
import Header from "../components/Header/Header";
import App from "../App";
import Footer from "../components/Footer/Footer";
import Login from "../components/Login/Login";
import Dashboard from "@/components/Dashboard/Dashboard";
import MainDashboard from "@/pages/MainDashboard";
import AddStuff from "@/pages/staff/AddStuff";
import ManageStuff from "@/pages/staff/ManageStuff";
import StaffRole from "@/pages/staff/StaffRole";
import AddClient from "@/pages/client/AddClient";
import ManageClient from "@/pages/client/ManageClient";
import UpdateClient from "@/pages/client/UpdateClient";
import ServiceType from "@/pages/setting/ServiceType";
import CallType from "@/pages/setting/CallType";
import DefaultRemark from "@/pages/setting/DefaultRemark";
import Signup from "@/components/Register/Signup";
import StaffInformation from "@/pages/staff/StaffInformation";
import CompanyInformation from "@/pages/setting/CompanyInformation";
import ClientInformation from "@/pages/client/ClientInformation";
import ErrorBoundary from "./error/ErrorBoundry";
import ErrorPage from "./error/ErrorPage";




const router = createBrowserRouter([
    {
        path: "/",
        element:(
            <ErrorBoundary>
            <App/>
            </ErrorBoundary>
        ),
        errorElement: <ErrorPage />,
        children:[
            {
            path: "",
            element:<Login/>
            },
            {
            path: "/signup",
            element:<Signup/>
            },
            {
                path:"footer",
                element:<Footer/>
            },
            {
                path:"main",
                element:<Dashboard/>,
                children:[
                    {
                        index: true, // This makes it the default route for "main"
                        element: <MainDashboard />
                    },
                    {
                        path:"dashboard",
                        element:<MainDashboard/>
                    },
                    {
                        path:"staff",
                        element:<StaffInformation/>
                    },
                    {
                        path:"staff/add",
                        element:<AddStuff/>
                    },
                    {
                        path:"staff/manage",
                        element:<ManageStuff/>
                    },
                    {
                        path:"staff/role",
                        element:<StaffRole/>
                    },
                    {
                        path:"client",
                        element:<ClientInformation/>
                    },
                    {
                        path:"client/add",
                        element:<AddClient/>
                    },
                    {
                        path:"client/manage",
                        element:<ManageClient/>
                    },
                    {
                        path:"client/update",
                        element:<UpdateClient/>
                    },
                    {
                        path:"setting/service-type",
                        element:<ServiceType/>
                    },
                    {
                        path:"setting/call-type",
                        element:<CallType/>
                    },
                    {
                        path:"setting/default-remark",
                        element:<DefaultRemark/>
                    },
                    {
                        path:"setting/company-information",
                        element:<CompanyInformation/>
                    },
                    
                ]
            }

        ]
    }
])


  

export default router;