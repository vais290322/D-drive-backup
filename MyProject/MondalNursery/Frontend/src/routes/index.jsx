import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import Home from "../pages/Home";
import Login from '../pages/Login';
import ForgotPassword from '../pages/ForgotPassword'; // Ensure this path is correct
import SignUp from '../pages/SignUp';
import AdminPanel from '../pages/AdminPanel';
import AllUsers from '../pages/AllUsers';
import AllProducts from '../pages/AllProducts';
import CategoryProduct from '../pages/CategoryProduct';
import ProductDetails from '../pages/ProductDetails';
import Cart from '../pages/Cart';
import SearchProduct from '../pages/SearchProduct';
import ErrorPage from '../pages/ErrorPage';
import ResePassword from '../pages/ResePassword';
import CheckOut from '../pages/CheckOut';
import MyOrders from '../pages/MyOrders';
import AllOrders from '../pages/AllOrders';
import About from '../pages/About';
import Contact from '../pages/Contact';


const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "",
                element: <Home />
            },
            {
                path: "login",
                element: <Login />
            },
            {
                path: "forgot-password",
                element: <ForgotPassword /> 
            },
            {
                path: "reset-password/:id/:token",
                element: <ResePassword />
            },
            {
                path: "sign-up",
                element: <SignUp />
            },
            {
                path: "product-category",
                element: <CategoryProduct />
            },
            {
                path: "product/:id",
                element: <ProductDetails />
            },
            {
                path: "checkout",
                element: <CheckOut />
            },
            {
                path: 'cart',
                element: <Cart />,
            },
            {
                path: "search",
                element: <SearchProduct />
            },
            {
                path: "my-orders",
                element: <MyOrders />
            },
            {
                path : "about",
                element: <About/>
            },
            {
                path: "contact",
                element: <Contact/>
            },

            {
                path: "admin-panel",
                element: <AdminPanel />,
                children: [
                    {
                        path: "all-users",
                        element: <AllUsers />
                    },
                    {
                        path: "all-products",
                        element: <AllProducts />
                    },
                    {
                        path: "all-orders",
                        element: <AllOrders/>
                    }
                ]
            },
            {
                path: "*",
                element: <ErrorPage />
            }
        ]
    }
]);

export default router;
