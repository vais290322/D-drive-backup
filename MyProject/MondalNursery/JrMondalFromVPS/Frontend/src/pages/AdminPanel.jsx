// import React, { useEffect } from "react";
// import { useSelector } from "react-redux";
// import { FaRegCircleUser } from "react-icons/fa6";
// import { Link, Outlet, useNavigate } from "react-router-dom";
// import ROLE from "../common/role";

// const AdminPanel = () => {
//   const user = useSelector((state) => state?.user?.user);
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (user?.role !== ROLE.ADMIN) {
//       navigate("/");
//     }
//   }, [user]);

//   return (
//     <div className="min-h-[calc(100vh-120px)] md:flex  bg-red-500">
//       <aside className="bg-white min-h-full  w-full  max-w-60 customShadow">
//         <div className="h-32  flex justify-center items-center flex-col">
//           <div className="text-5xl cursor-pointer relative flex justify-center">
//             {user?.profilePic ? (
//               <img
//                 src={user?.profilePic}
//                 className="w-20 h-20 rounded-full"
//                 alt={user?.name}
//               />
//             ) : (
//               <FaRegCircleUser />
//             )}
//           </div>
//           <p className="capitalize text-lg font-semibold">{user?.name}</p>
//           <p className="text-sm">{user?.role}</p>
//         </div>

//         {/***navigation */}
//         <div>
//           <nav className="grid p-4">
//             <Link to={"all-users"} className="px-2 py-1 hover:bg-slate-100">
//               All Users
//             </Link>
//             <Link to={"all-products"} className="px-2 py-1 hover:bg-slate-100">
//               All Products
//             </Link>
//             <Link to={"all-orders"} className="px-2 py-1 hover:bg-slate-100">
//               All Orders
//             </Link>
//             <Link to={"add-category"} className="px-2 py-1 hover:bg-slate-100">
//               Add Product Category
//             </Link>
//             <Link
//               to={"add-shipping-cost"}
//               className="px-2 py-1 hover:bg-slate-100"
//             >
//               Add Shipping Cost
//             </Link>
//           </nav>
//         </div>
//       </aside>

//       <main className="w-full h-full p-2">
//         <Outlet />
//       </main>
//     </div>
//   );
// };

// export default AdminPanel;
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { FaRegCircleUser } from "react-icons/fa6";
import { Link, Outlet, useNavigate } from "react-router-dom";
import ROLE from "../common/role";

const AdminPanel = () => {
  const user = useSelector((state) => state?.user?.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role !== ROLE.ADMIN) {
      navigate("/");
    }
  }, [user]);

  return (
    <div className="min-h-[calc(100vh-120px)] flex flex-col md:flex-row ">
      {/* Sidebar */}
      <aside className="bg-white w-full md:w-60 min-h-full customShadow p-4">
        <div className="h-32 flex justify-center items-center flex-col">
          <div className="text-5xl cursor-pointer relative flex justify-center">
            {user?.profilePic ? (
              <img
                src={user?.profilePic}
                className="w-20 h-20 rounded-full"
                alt={user?.name}
              />
            ) : (
              <FaRegCircleUser />
            )}
          </div>
          <p className="capitalize text-lg font-semibold">{user?.name}</p>
          <p className="text-sm">{user?.role}</p>
        </div>

        {/* Navigation Links */}
        <nav className="mt-4">
          <Link to={"all-users"} className="block px-2 py-1 hover:bg-slate-100">
            All Users
          </Link>
          <Link to={"all-products"} className="block px-2 py-1 hover:bg-slate-100">
            All Products
          </Link>
          <Link to={"all-orders"} className="block px-2 py-1 hover:bg-slate-100">
            All Orders
          </Link>
          <Link to={"add-category"} className="block px-2 py-1 hover:bg-slate-100">
            Add Product Category
          </Link>
          <Link
            to={"add-shipping-cost"}
            className="block px-2 py-1 hover:bg-slate-100"
          >
            Add Shipping Cost
          </Link>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminPanel;
