import React from 'react';

const AdminCard = ({ title, children, className = '', actions }) => {
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-slate-100 ${className}`}>
      {(title || actions) && (
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
          {title && <h3 className="font-semibold text-slate-800">{title}</h3>}
          {actions && <div className="flex gap-2">{actions}</div>}
        </div>
      )}
      <div className="p-6 sm:p-8">
        {children}
      </div>
    </div>
  );
};

export default AdminCard;
