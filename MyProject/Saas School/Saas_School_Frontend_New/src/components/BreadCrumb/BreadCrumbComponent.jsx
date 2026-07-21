import { useBreadcrumb } from '@/context/BreadCrumbContext';
import { useTheme } from '@/context/ThemeContext';
import React from 'react'

const BreadCrumbComponent = () => {
    const { breadcrumb } = useBreadcrumb();
    const { theme } = useTheme();

    return (
      <div   className={`hidden sm:block font-bold ${theme === "light" ? 'text-white' : 'text-[#6b289e]'} text-[28px]`} >
        {breadcrumb.join(" > ")} {/* Example: "Dashboard > Academic > Class" */}
      </div>
    );
}

export default BreadCrumbComponent