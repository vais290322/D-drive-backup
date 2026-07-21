import React, { useState } from 'react';
import SummaryApi from '../common';

const DistanceCalculator = () => {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleCalculate = async () => {
    setResult(null);
    setError(null);

    try {
      const response = await fetch(`${SummaryApi.distance.url}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ origin, destination }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch distance');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md max-w-md">
        <h2 className="text-2xl font-bold mb-4">Shipment Distance Calculator</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Origin Pin Code:</label>
          <input
            type="text"
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            className="w-full px-4 py-2 border rounded mt-1"
            placeholder="Enter origin pin code"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Destination Pin Code:</label>
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="w-full px-4 py-2 border rounded mt-1"
            placeholder="Enter destination pin code"
          />
        </div>

        <button
          onClick={handleCalculate}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Calculate
        </button>

        {result && (
          <div className="mt-4 p-4 bg-green-100 rounded">
            <p><strong>Distance:</strong> {result.distance}</p>
            <p><strong>Duration:</strong> {result.duration}</p>
          </div>
        )}

        {error && (
          <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
            <p>Error: {error}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DistanceCalculator;
