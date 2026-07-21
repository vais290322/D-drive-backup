import React, { useState } from 'react';
import { useNavigate } from 'react-router';

const OfflineTest = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);

  const createData = async () => {
    const payload = {
      name: 'Test Item ' + Math.floor(Math.random() * 1000),
      amount: Math.floor(Math.random() * 5000),
    };

    await window.testDB.create(payload);
    alert('Test data created!');
  };

  const loadData = async () => {
    const result = await window.testDB.getAll();
    setData(result);
  };

  return (
    <div className="p-4 space-y-4">
      <button
        onClick={() => navigate('/')}
        className="bg-gray-200 px-3 py-1 rounded"
      >
        Back
      </button>

      <div className="space-x-3">
        <button
          onClick={createData}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Create Test Data
        </button>

        <button
          onClick={loadData}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Load Data
        </button>
      </div>

      <table className="border w-full mt-4">
        <thead>
          <tr className="bg-gray-100">
            <th>ID</th>
            <th>Name</th>
            <th>Amount</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody>
          {data.map(row => (
            <tr key={row.id} className="text-center">
              <td>{row.id}</td>
              <td>{row.name}</td>
              <td>{row.amount}</td>
              <td>{row.createdAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OfflineTest;
