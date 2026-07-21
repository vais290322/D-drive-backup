import React, { createContext, useContext, useState, useEffect } from 'react';
import { cn } from '../../utils/cn';

const TabsContext = createContext(undefined);

export const Tabs = ({ 
  defaultValue, 
  value, 
  onValueChange, 
  className, 
  children 
}) => {
  const [activeTab, setActiveTab] = useState(value || defaultValue);

  useEffect(() => {
    if (value !== undefined) {
      setActiveTab(value);
    }
  }, [value]);

  const handleTabChange = (newValue) => {
    if (value === undefined) {
      setActiveTab(newValue);
    }
    if (onValueChange) {
      onValueChange(newValue);
    }
  };

  return (
    <TabsContext.Provider value={{ activeTab, handleTabChange }}>
      <div className={cn("w-full", className)}>
        {children}
      </div>
    </TabsContext.Provider>
  );
};

export const TabsList = ({ className, ...props }) => {
  return (
    <div
      className={cn(
        "inline-flex h-12 items-center justify-center rounded-lg bg-gray-100 p-1 text-gray-500",
        className
      )}
      {...props}
    />
  );
};

export const TabsTrigger = ({ value, className, children, ...props }) => {
  const context = useContext(TabsContext);
  if (!context) throw new Error("TabsTrigger must be used within Tabs");

  const { activeTab, handleTabChange } = context;
  const isActive = activeTab === value;

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      onClick={() => handleTabChange(value)}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-md px-6 py-2 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        isActive
          ? "bg-white text-emerald-700 shadow-sm"
          : "text-gray-500 hover:text-gray-700 hover:bg-white/50",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export const TabsContent = ({ value, className, children, ...props }) => {
  const context = useContext(TabsContext);
  if (!context) throw new Error("TabsContent must be used within Tabs");

  const { activeTab } = context;

  if (activeTab !== value) return null;

  return (
    <div
      role="tabpanel"
      className={cn(
        "mt-4 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
