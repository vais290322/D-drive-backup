import React from 'react';
import { TableRow, TableCell } from './Table';

/**
 * Shimmer skeleton for a single table row
 */
const TableRowSkeleton = ({ columns = 7 }) => (
  <TableRow className="animate-pulse border-b border-gray-100/50">
    <TableCell className="py-5 px-4">
      <div className="flex items-center gap-4">
        <div className="h-14 w-14 bg-gray-100 rounded-xl shrink-0" />
        <div className="space-y-2 flex-1">
          <div className="h-4 bg-gray-100 rounded-full w-2/3" />
          <div className="h-3 bg-gray-50 rounded-full w-1/3" />
        </div>
      </div>
    </TableCell>
    {[...Array(columns - 2)].map((_, i) => (
      <TableCell key={i} className="py-5 px-4 hidden md:table-cell">
        <div className="h-4 bg-gray-50 rounded-full w-20 mx-auto" />
      </TableCell>
    ))}
    <TableCell className="py-5 px-4 text-right">
      <div className="h-8 w-24 bg-gray-100 rounded-lg ml-auto" />
    </TableCell>
  </TableRow>
);

/**
 * ProductTableSkeleton - Displays multiple shimmer rows to match the table footprint
 */
const ProductTableSkeleton = ({ rows = 5, columns = 7 }) => {
  return (
    <>
      {[...Array(rows)].map((_, i) => (
        <TableRowSkeleton key={i} columns={columns} />
      ))}
    </>
  );
};

export default ProductTableSkeleton;
