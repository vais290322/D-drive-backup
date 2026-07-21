import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useState } from "react";
import { StaffSidebar } from "./StaffSidebar";
import { ProductManagement } from "./ProductManagement";

export default function ProductManagementPage() {
  const [currentUserRole] = useState("Staff");

  return (
    <div className="min-h-screen flex flex-col">
      {/* <Header cartItemCount={0} isLoggedIn={true} userName="Staff" /> */}
      
      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="hidden md:block">
          <StaffSidebar activeSection="products" />
        </div>
        
        {/* Main Content */}
        <main className="flex-1 bg-muted/30 p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold font-heading">Product Management</h1>
                <p className="text-muted-foreground">Manage product inventory and details</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <div className="px-3 py-2 bg-primary text-primary-foreground rounded-md text-sm">
                  {currentUserRole}
                </div>
              </div>
            </div>
            
            <ProductManagement />
          </div>
        </main>
      </div>

      {/* <Footer /> */}
    </div>
  );
}