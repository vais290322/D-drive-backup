import { DonateSection, Footer, Header } from "@/V2/components";
import { Outlet, useLocation } from "react-router-dom";

export const MainLayout = () => {
  const location = useLocation();
  return (
    <div>
      <Header />

      <main className="text-black bg-white pt-[90px]">
        <Outlet />
      </main>
      {location.pathname !== "/volunteer" && <DonateSection/>}
      <Footer /> 
    </div>
  );
};
