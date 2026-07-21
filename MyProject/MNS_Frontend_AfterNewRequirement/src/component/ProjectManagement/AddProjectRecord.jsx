// // import { useState } from "react";
// // import axios from "axios";
// // import debounce from "lodash/debounce";
// // import { useParams } from "react-router-dom";

// // const SEARCH_EMPLOYEE_URL = "http://192.168.0.141:8090/api/employees/search?email=";

// // const AddProjectRecord = ({operationId}) => {
// //   // const { operationId } = useParams(); 

// //   if (!operationId) {
// //     return <div className="text-red-600 text-center">Error: operationId is missing!</div>;
// //   }

// //   const API_URL = `http://192.168.0.156:8080/api/v1/mns/operation/add-record/${operationId}`;

// //   const [records, setRecords] = useState([
// //     { employeeEmail: "", employeeCost: "", materialCost: "", date: "" },
// //   ]);
// //   const [employees, setEmployees] = useState([]);
// //   const [loading, setLoading] = useState(false);
// //   const [dropdownVisible, setDropdownVisible] = useState(false);

// //   const fetchEmployees = async (email) => {
// //     if (!email) return;
// //     setLoading(true);
// //     try {
// //       const response = await axios.get(`${SEARCH_EMPLOYEE_URL}${email}`);
// //       setEmployees(response.data.data || []);
// //       setDropdownVisible(true);
// //     } catch (error) {
// //       console.error("Error fetching employees:", error);
// //       setEmployees([]);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const debouncedFetchEmployees = debounce(fetchEmployees, 300);

// //   const handleChange = (index, field, value) => {
// //     const updatedRecords = [...records];
// //     updatedRecords[index][field] = value;
// //     setRecords(updatedRecords);
// //   };

// //   const addRecord = () => {
// //     setRecords([...records, { employeeEmail: "", employeeCost: "", materialCost: "", date: "" }]);
// //   };

// //   const removeRecord = (index) => {
// //     setRecords(records.filter((_, i) => i !== index));
// //   };

// //   const handleSubmit = async () => {
// //     try {
// //       const formattedRecords = records.map(({ employeeEmail, employeeCost, materialCost, date }) => ({
// //         employeeCode: employeeEmail,
// //         employeeCost: Number(employeeCost) || 0,
// //         materialCost: Number(materialCost) || 0,
// //         date: date || new Date().toISOString().split("T")[0],
// //       }));

// //       const response = await axios.post(API_URL, { recordDetails: formattedRecords });

// //       if (response.status === 200) {
// //         alert("Records added successfully!");
// //         setRecords([{ employeeEmail: "", employeeCost: "", materialCost: "", date: "" }]);
// //       } else {
// //         throw new Error("Unexpected response from server");
// //       }
// //     } catch (error) {
// //       console.error("Error adding records:", error);
// //       alert("Failed to add records. Please try again.");
// //     }
// //   };

// //   return (
// //     <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
// //       <div className="max-w-4xl w-full bg-white p-8 rounded-lg shadow-lg">
// //         <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Add Project Records</h1>

// //         <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
// //           {records.map((record, index) => (
// //             <div key={index} className="mb-6 p-4 border rounded-lg shadow-sm relative">
// //               <div className="mb-4 relative">
// //                 <label className="block text-sm font-medium text-gray-700 mb-1">Employee Email</label>
// //                 <input
// //                   type="email"
// //                   value={record.employeeEmail}
// //                   onChange={(e) => debouncedFetchEmployees(e.target.value)}
// //                   placeholder="Enter employee email"
// //                   className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
// //                 />
// //                 {dropdownVisible && employees.length > 0 && (
// //                   <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-auto">
// //                     {employees.map((item, i) => (
// //                       <li
// //                         key={i}
// //                         onClick={() => {
// //                           handleChange(index, "employeeEmail", item.email);
// //                           setDropdownVisible(false);
// //                         }}
// //                         className="cursor-pointer px-3 py-2 hover:bg-indigo-600 hover:text-white"
// //                       >
// //                         {item.email}
// //                       </li>
// //                     ))}
// //                   </ul>
// //                 )}
// //               </div>

// //               <div className="grid grid-cols-2 gap-4">
// //                 <div>
// //                   <label className="block text-sm font-medium text-gray-700 mb-1">Employee Cost</label>
// //                   <input
// //                     type="number"
// //                     value={record.employeeCost}
// //                     onChange={(e) => handleChange(index, "employeeCost", e.target.value)}
// //                     placeholder="Enter cost"
// //                     className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
// //                   />
// //                 </div>
// //                 <div>
// //                   <label className="block text-sm font-medium text-gray-700 mb-1">Material Cost</label>
// //                   <input
// //                     type="number"
// //                     value={record.materialCost}
// //                     onChange={(e) => handleChange(index, "materialCost", e.target.value)}
// //                     placeholder="Enter cost"
// //                     className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
// //                   />
// //                 </div>
// //               </div>

// //               <div className="mt-4">
// //                 <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
// //                 <input
// //                   type="date"
// //                   value={record.date}
// //                   onChange={(e) => handleChange(index, "date", e.target.value)}
// //                   className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
// //                 />
// //               </div>

// //               {records.length > 1 && (
// //                 <button
// //                   type="button"
// //                   onClick={() => removeRecord(index)}
// //                   className="absolute top-3 right-3 text-red-600 hover:text-red-800 text-sm font-semibold"
// //                 >
// //                   Delete
// //                 </button>
// //               )}
// //             </div>
// //           ))}

// //           <div className="mt-6 flex justify-between">
// //             <button
// //               type="button"
// //               onClick={addRecord}
// //               className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-md font-semibold"
// //             >
// //               + Add Another Record
// //             </button>
// //             <button
// //               type="submit"
// //               className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md font-semibold"
// //             >
// //               Submit
// //             </button>
// //           </div>
// //         </form>
// //       </div>
// //     </div>
// //   );
// // };

// // export default AddProjectRecord;


// import { useState } from "react";
// import axios from "axios";
// import debounce from "lodash/debounce";

// const SEARCH_EMPLOYEE_URL = "http://192.168.0.141:8090/api/employees/search?email=";

// const AddProjectRecord = ({ operationId }) => {
//   if (!operationId) {
//     return <div className="text-red-600 text-center">Error: operationId is missing!</div>;
//   }

//   const API_URL = `http://192.168.0.156:8080/api/v1/mns/operation/add-record/${operationId}`;

//   const [records, setRecords] = useState([
//     { employeeEmail: "", employeeCost: "", materialCost: "", date: "" },
//   ]);
//   const [employees, setEmployees] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [dropdownVisible, setDropdownVisible] = useState(false);

//   const fetchEmployees = async (email) => {
//     if (!email) return;
//     setLoading(true);
//     try {
//       const response = await axios.get(`${SEARCH_EMPLOYEE_URL}${email}`);
//       setEmployees(response.data.data || []);
//       setDropdownVisible(true);
//     } catch (error) {
//       console.error("Error fetching employees:", error);
//       setEmployees([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const debouncedFetchEmployees = debounce(fetchEmployees, 300);

//   const handleChange = (index, field, value) => {
//     const updatedRecords = [...records];
//     updatedRecords[index][field] = value;
//     setRecords(updatedRecords);
//   };

//   const addRecord = () => {
//     setRecords([...records, { employeeEmail: "", employeeCost: "", materialCost: "", date: "" }]);
//   };

//   const removeRecord = (index) => {
//     setRecords(records.filter((_, i) => i !== index));
//   };

//   const handleSubmit = async () => {
//     try {
//       const formattedRecords = records.map(({ employeeEmail, employeeCost, materialCost, date }) => ({
//         employeeCode: employeeEmail,
//         employeeCost: Number(employeeCost) || 0,
//         materialCost: Number(materialCost) || 0,
//         date: date || new Date().toISOString().split("T")[0],
//       }));

//       const response = await axios.post(API_URL, { recordDetails: formattedRecords });

//       if (response.status === 200) {
//         alert("Records added successfully!");
//         setRecords([{ employeeEmail: "", employeeCost: "", materialCost: "", date: "" }]);
//       } else {
//         throw new Error("Unexpected response from server");
//       }
//     } catch (error) {
//       console.error("Error adding records:", error);
//       alert("Failed to add records. Please try again.");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
//       <div className="max-w-4xl w-full bg-white p-8 rounded-lg shadow-lg">
//         <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Add Project Records</h1>

//         <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
//           {records.map((record, index) => (
//             <div key={index} className="mb-6 p-4 border rounded-lg shadow-sm relative">
//               <div className="mb-4 relative">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Employee Email</label>
//                 <input
//                   type="email"
//                   value={record.employeeEmail}
//                   onChange={(e) => debouncedFetchEmployees(e.target.value)}
//                   placeholder="Enter employee email"
//                   className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                 />
//                 {dropdownVisible && employees.length > 0 && (
//                   <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-auto">
//                     {employees.map((item, i) => (
//                       <li
//                         key={i}
//                         onClick={() => {
//                           handleChange(index, "employeeEmail", item.email);
//                           setDropdownVisible(false);
//                         }}
//                         className="cursor-pointer px-3 py-2 hover:bg-indigo-600 hover:text-white"
//                       >
//                         {item.email}
//                       </li>
//                     ))}
//                   </ul>
//                 )}
//               </div>

//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Employee Cost</label>
//                   <input
//                     type="number"
//                     value={record.employeeCost}
//                     onChange={(e) => handleChange(index, "employeeCost", e.target.value)}
//                     placeholder="Enter cost"
//                     className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Material Cost</label>
//                   <input
//                     type="number"
//                     value={record.materialCost}
//                     onChange={(e) => handleChange(index, "materialCost", e.target.value)}
//                     placeholder="Enter cost"
//                     className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                   />
//                 </div>
//               </div>

//               <div className="mt-4">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
//                 <input
//                   type="date"
//                   value={record.date}
//                   onChange={(e) => handleChange(index, "date", e.target.value)}
//                   className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                 />
//               </div>

//               {records.length > 1 && (
//                 <button
//                   type="button"
//                   onClick={() => removeRecord(index)}
//                   className="absolute top-3 right-3 text-red-600 hover:text-red-800 text-sm font-semibold"
//                 >
//                   Delete
//                 </button>
//               )}
//             </div>
//           ))}

//           <div className="mt-6 flex justify-between">
//             <button
//               type="button"
//               onClick={addRecord}
//               className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-md font-semibold"
//             >
//               + Add Another Record
//             </button>
//             <button
//               type="submit"
//               className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md font-semibold"
//             >
//               Submit
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AddProjectRecord;







