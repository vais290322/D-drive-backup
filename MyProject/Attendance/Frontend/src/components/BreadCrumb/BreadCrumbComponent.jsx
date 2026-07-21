import { useBreadcrumb } from '@/context/BreadCrumbContext';
import { useTheme } from '@/context/ThemeContext';
import React from 'react'
import { ChevronRight } from 'lucide-react';

const BreadCrumbComponent = () => {
    const { breadcrumb } = useBreadcrumb();
    const { theme } = useTheme();

    return (
      <div className="hidden md:flex items-center text-sm">
        {breadcrumb.map((item, index) => (
          <React.Fragment key={index}>
            {index > 0 && (
              <ChevronRight className="mx-1 h-4 w-4 text-muted-foreground" />
            )}
            <span className={index === breadcrumb.length - 1 ? "font-medium" : "text-muted-foreground"}>
              {item}
            </span>
          </React.Fragment>
        ))}
      </div>
    );
}

export default BreadCrumbComponent