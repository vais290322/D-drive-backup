import React, { useState } from 'react'
import { useTheme } from "@/context/ThemeContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import DashboardComponent from '@/components/Billing/DashboardComponent';
import BillingComponent from '@/components/Billing/BillingComponent';
import InvoiceesComponent from '@/components/Billing/InvoiceesComponent';
import InventoryComponent from '@/components/Billing/InventoryComponent';
import PurchaseComponent from '@/components/Billing/PurchaseComponent';
import CategoryComponent from '@/components/Billing/CategoryComponent';
import PurchaseInvoiceComponent from '@/components/Billing/PurchaseInvoiceComponent';
import ReportComponent from '@/components/Billing/ReportComponent';
import SubCategoryComponent from '@/components/Billing/SubCategoryComponent';

const BillingPage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const { theme } = useTheme();

    const isDark = theme === "light";

    return (
        <div
            className={`${isLoading ? "h-auto" : "h-[100vh]"
                } overflow-y-scroll ${isDark ? "bg-[#0f172a] text-white" : "bg-gray-100 text-black"
                }`}
        >
            <div className="max-w-7xl mx-auto mt-2 p-4 rounded-lg">
                <Tabs defaultValue="dashboard">
                    {/* Tabs Header */}
                    <TabsList
                        className={`flex gap-2 p-2 rounded-lg ${isDark ? "bg-[#112038]" : "bg-white"
                            }`}
                    >
                        {["dashboard", "billing", "invoicees", "inventory", "purchases", "purchase Invoice", "reports", "category", "subcategory"].map((tab) => (
                            <TabsTrigger
                                key={tab}
                                value={tab}
                                className={`
                  relative px-4 py-2 rounded-md text-sm font-medium
                  transition-all duration-300 ease-in-out
                  hover:scale-[1.03]
                  
                  ${isDark ? "text-slate-300" : "text-gray-600"}

                  data-[state=active]:scale-105
                  data-[state=active]:shadow-lg
                  data-[state=active]:text-white
                  data-[state=active]:bg-gradient-to-r
                  data-[state=active]:from-indigo-500
                  data-[state=active]:to-purple-600
                `}
                            >
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    {/* Tabs Content */}
                    <TabsContent
                        value="dashboard"
                        className={`mt-4 p-4 rounded-lg transition-all duration-300 animate-in fade-in zoom-in ${isDark ? "bg-[#1e293b]" : "bg-white"
                            }`}
                    >
                        <DashboardComponent />
                    </TabsContent>

                    <TabsContent
                        value="billing"
                        className={`mt-4 p-4 rounded-lg transition-all duration-300 animate-in fade-in zoom-in ${isDark ? "bg-[#1e293b]" : "bg-white"
                            }`}
                    >
                        <BillingComponent />
                    </TabsContent>

                    <TabsContent
                        value="invoicees"
                        className={`mt-4 p-4 rounded-lg transition-all duration-300 animate-in fade-in zoom-in ${isDark ? "bg-[#1e293b]" : "bg-white"
                            }`}
                    >
                        <InvoiceesComponent />
                    </TabsContent>

                    <TabsContent
                        value="inventory"
                        className={`mt-4 p-4 rounded-lg transition-all duration-300 animate-in fade-in zoom-in ${isDark ? "bg-[#1e293b]" : "bg-white"
                            }`}
                    >
                        <InventoryComponent />
                    </TabsContent>
                    <TabsContent
                        value="purchases"
                        className={`mt-4 p-4 rounded-lg transition-all duration-300 animate-in fade-in zoom-in ${isDark ? "bg-[#1e293b]" : "bg-white"
                            }`}
                    >
                        <PurchaseComponent />
                    </TabsContent>
                    <TabsContent
                        value="purchase Invoice"
                        className={`mt-4 p-4 rounded-lg transition-all duration-300 animate-in fade-in zoom-in ${isDark ? "bg-[#1e293b]" : "bg-white"
                            }`}
                    >
                        <PurchaseInvoiceComponent />
                    </TabsContent>
                    <TabsContent
                        value="reports"
                        className={`mt-4 p-4 rounded-lg transition-all duration-300 animate-in fade-in zoom-in ${isDark ? "bg-[#1e293b]" : "bg-white"
                            }`}
                    >
                        <ReportComponent />

                    </TabsContent>
                    <TabsContent
                        value="category"
                        className={`mt-4 p-4 rounded-lg transition-all duration-300 animate-in fade-in zoom-in ${isDark ? "bg-[#1e293b]" : "bg-white"
                            }`}
                    >
                        <CategoryComponent />
                    </TabsContent>
                    <TabsContent
                        value="subcategory"
                        className={`mt-4 p-4 rounded-lg transition-all duration-300 animate-in fade-in zoom-in ${isDark ? "bg-[#1e293b]" : "bg-white"
                            }`}
                    >
                        <SubCategoryComponent />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

export default BillingPage;
