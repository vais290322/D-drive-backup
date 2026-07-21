import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const Table = ({ children, className }) => (
  <table className={`w-full border rounded-lg ${className}`}>{children}</table>
);

export const Thead = ({ children }) => <thead className="bg-gray-200">{children}</thead>;
export const Tbody = ({ children }) => <tbody>{children}</tbody>;
export const Tr = ({ children, className }) => <tr className={`border-b hover:bg-gray-100 ${className}`}>{children}</tr>;
export const Th = ({ children, className }) => <th className={`text-left p-2 ${className}`}>{children}</th>;
export const Td = ({ children, className }) => <td className={`p-2 ${className}`}>{children}</td>;

export const Input = ({ value, onChange, placeholder, className }) => (
  <input
    type="text"
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className={`border p-2 rounded ${className}`}
  />
);

export const Button = ({ children, onClick, disabled, className }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`px-4 py-2 rounded border transition-colors duration-300 ${disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-opacity-80"} ${className}`}
  >
    {children}
  </button>
);

const PaginationTable = ({ data, itemsPerPage = 5 }) => {
    console.log(data);
    
  const columns = [
    { header: "S/N", accessor: "serial_number" },
    { header: "Item Name ", accessor: "item_name" },
    { header: "Quantity", accessor: "quantity" },
    { header: "Unit Price", accessor: "unit_prize" },
    { header: "Total Price", accessor: "total_prize" },
    { header: "Actions", accessor: "actions" }
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState(data);
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalType, setModalType] = useState(null);
  const totalPages = Math.ceil(filteredData?.length / itemsPerPage);

  React.useEffect(() => {
    setFilteredData(
      data.filter((item) =>
        columns.some((col) =>
          col.accessor !== "serial_number" &&
          String(item[col.accessor]).toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    );
    setCurrentPage(1);
  }, [searchTerm, data]);

  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const openModal = (item, type) => {
    setSelectedItem(item);
    setModalType(type);
  };


  const closeModal = () => {
    setSelectedItem(null);
    setModalType(null);
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-lg">
      <div className="mb-4 flex justify-between">
        <Input
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-1/3"
        />
      </div>
      <Table>
        <Thead>
          <Tr>
            {columns.map((col) => (
              <Th key={col.accessor}>{col.header}</Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {paginatedData.map((row, idx) => (
            <Tr key={idx}>
              <Td>{(currentPage - 1) * itemsPerPage + idx + 1}</Td>
              {columns.slice(1, -1).map((col) => (
                <Td key={col.accessor}>{row[col.accessor]}</Td>
              ))}
              <Td>
                <Button className="mr-2 bg-blue-500 text-white hover:bg-blue-600" onClick={() => openModal(row, 'edit')}>Edit</Button>
                <Button className="bg-red-500 text-white hover:bg-red-600" onClick={() => openModal(row, 'delete')}>Delete</Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      <div className="mt-4 flex justify-between items-center">
        <p className="text-gray-600">
          Page {currentPage} of {totalPages}
        </p>
        <div>
          <Button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            className="mr-2"
          >
            <ChevronLeft size={16} />
          </Button>
          <Button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          >
            <ChevronRight size={16} />
          </Button>
        </div>
      </div>
      {modalType && (
        <div className="absolute top-0 left-0 w-full h-full bg-black/50 backdrop-blur-md flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg shadow-lg w-1/3">
            <h2 className="text-xl font-bold mb-4">{modalType === 'edit' ? "Edit Item" : "Delete Item"}</h2>
            <p>{modalType === 'edit' ? "Modify item details" : "Are you sure you want to delete this item?"}</p>
            <div className="mt-4 flex justify-end">
              <Button className="mr-2 bg-gray-400 text-white hover:bg-gray-500" onClick={closeModal}>Cancel</Button>
              {modalType === 'edit' ? (
                <Button className="bg-blue-500 text-white hover:bg-blue-600">Save</Button>
              ) : (
                <Button onClick={closeModal
                } className="bg-red-500 text-white hover:bg-red-600">Confirm Delete</Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaginationTable;