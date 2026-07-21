import React from 'react';
import { Edit2, Trash2, ChevronLeft, ChevronRight, Users } from 'lucide-react';

const TeacherList = ({
  teachers = [],
  loading,
  onEdit,
  onDelete,
  indexOfFirstItem = 0,
  itemsPerPage = 10,
  currentPage = 1,
  totalPages = 1,
  paginate,
  handleItemsPerPageChange,
  totalItems = 0
}) => {
  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      onDelete(id);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div className="flex items-center gap-2">
            <Users className="text-blue-600" size={24} />
            <div>
              <h3 className="text-lg font-bold text-gray-800">Teachers Directory</h3>
              <p className="text-sm text-gray-600">{totalItems} total teachers</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Show:</label>
            <select 
              value={itemsPerPage} 
              onChange={handleItemsPerPageChange} 
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm"
            >
              {/* <option value={1}>1</option> */}
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <svg className="animate-spin h-10 w-10 text-blue-600 mx-auto mb-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-gray-500 font-medium">Loading teachers...</p>
          </div>
        </div>
      ) : teachers.length === 0 ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <Users className="mx-auto mb-4 text-gray-300" size={64} />
            <p className="text-gray-500 text-lg font-medium">No teachers found</p>
            <p className="text-gray-400 text-sm mt-2">Add a teacher to get started</p>
          </div>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">#</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Employee ID</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Phone</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Subjects</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">RFID</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {teachers.map((t, idx) => (
                  <tr key={t._id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 text-sm text-gray-700 font-medium">{indexOfFirstItem + idx + 1}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{t.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{t.employeeId || '-'}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{t.email || '-'}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{t.phone || '-'}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{t.subjects || '-'}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {t.rfid}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex gap-2">
                        <button 
                          onClick={() => onEdit(t)} 
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-150 cursor-pointer"
                          title="Edit"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(t._id, t.name)} 
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-150 cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="lg:hidden divide-y divide-gray-200">
            {teachers.map((t, idx) => (
              <div key={t._id} className="p-4 hover:bg-gray-50 transition-colors duration-150">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">#{indexOfFirstItem + idx + 1}</div>
                    <h4 className="font-semibold text-gray-900">{t.name}</h4>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => onEdit(t)} 
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-150 cursor-pointer"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(t._id, t.name)} 
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-150 cursor-pointer"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  {t.employeeId && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Employee ID:</span>
                      <span className="text-gray-900 font-medium">{t.employeeId}</span>
                    </div>
                  )}
                  {t.email && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Email:</span>
                      <span className="text-gray-900">{t.email}</span>
                    </div>
                  )}
                  {t.phone && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Phone:</span>
                      <span className="text-gray-900">{t.phone}</span>
                    </div>
                  )}
                  {t.subjects && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Subjects:</span>
                      <span className="text-gray-900">{t.subjects}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">RFID:</span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {t.rfid}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div className="text-sm text-gray-600">
                Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{' '}
                <span className="font-medium">{Math.min(indexOfFirstItem + itemsPerPage, totalItems)}</span> of{' '}
                <span className="font-medium">{totalItems}</span> results
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg cursor-pointer border border-gray-300 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
                >
                  <ChevronLeft size={20} />
                </button>
                <div className="flex gap-1">
                  {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    return (
                      <button
                        key={pageNum}
                        onClick={() => paginate(pageNum)}
                        className={`px-3 py-2 rounded-lg text-sm cursor-pointer font-medium transition-colors duration-150 ${
                          currentPage === pageNum
                            ? 'bg-blue-600 text-white'
                            : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-gray-300 cursor-pointer hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TeacherList;