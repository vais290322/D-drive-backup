import React from 'react';

const AdminTable = ({ headers, children }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50 border-b border-slate-100">
          <tr>
            {headers.map((header, index) => (
              <th 
                key={index} 
                className="px-6 py-4 font-semibold text-slate-700 whitespace-nowrap"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {children}
        </tbody>
      </table>
    </div>
  );
};

export default AdminTable;
