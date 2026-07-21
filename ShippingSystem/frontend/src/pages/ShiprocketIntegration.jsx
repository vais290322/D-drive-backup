import { useState } from 'react';
import { 
  checkServiceability, 
  getShiprocketToken, 
  createShiprocketOrder,
  processCompleteOrder
} from '../services/api';

function ShiprocketIntegration() {
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [serviceabilityParams, setServiceabilityParams] = useState({
    pickup_postcode: '',
    delivery_postcode: '',
    weight: '',
    cod: '0'
  });
  const [serviceabilityResult, setServiceabilityResult] = useState(null);

  const handleGetToken = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getShiprocketToken();
      setToken(response.data.token);
    } catch (err) {
      setError('Failed to get Shiprocket token: ' + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleServiceabilityParamChange = (e) => {
    const { name, value } = e.target;
    setServiceabilityParams(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckServiceability = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      const response = await checkServiceability(serviceabilityParams);
      setServiceabilityResult(response.data);
    } catch (err) {
      setError('Failed to check serviceability: ' + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Shiprocket Integration</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Authentication</h2>
          <div className="space-y-4">
            <div>
              <p className="mb-2">
                Get a Shiprocket authentication token. The token is valid for 10 days.
              </p>
              <button 
                onClick={handleGetToken} 
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? 'Loading...' : 'Get Token'}
              </button>
            </div>
            
            {token && (
              <div className="p-3 bg-gray-50 rounded-md overflow-x-auto">
                <p className="font-mono text-sm break-all">{token}</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Check Serviceability</h2>
          <form onSubmit={handleCheckServiceability} className="space-y-4">
            <div>
              <label htmlFor="pickup_postcode" className="form-label">Pickup Pincode</label>
              <input
                type="text"
                id="pickup_postcode"
                name="pickup_postcode"
                className="form-input"
                value={serviceabilityParams.pickup_postcode}
                onChange={handleServiceabilityParamChange}
                required
              />
            </div>
            
            <div>
              <label htmlFor="delivery_postcode" className="form-label">Delivery Pincode</label>
              <input
                type="text"
                id="delivery_postcode"
                name="delivery_postcode"
                className="form-input"
                value={serviceabilityParams.delivery_postcode}
                onChange={handleServiceabilityParamChange}
                required
              />
            </div>
            
            <div>
              <label htmlFor="weight" className="form-label">Weight (kg)</label>
              <input
                type="number"
                id="weight"
                name="weight"
                className="form-input"
                value={serviceabilityParams.weight}
                onChange={handleServiceabilityParamChange}
                required
                step="0.01"
                min="0.1"
              />
            </div>
            
            <div>
              <label htmlFor="cod" className="form-label">COD Amount (0 for prepaid)</label>
              <input
                type="number"
                id="cod"
                name="cod"
                className="form-input"
                value={serviceabilityParams.cod}
                onChange={handleServiceabilityParamChange}
                min="0"
              />
            </div>
            
            <button 
              type="submit" 
              className="btn btn-primary w-full"
              disabled={loading}
            >
              {loading ? 'Checking...' : 'Check Serviceability'}
            </button>
          </form>
        </div>
      </div>
      
      {error && (
        <div className="mt-6 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
          <p>{error}</p>
        </div>
      )}
      
      {serviceabilityResult && (
        <div className="mt-6 card">
          <h2 className="text-xl font-semibold mb-4">Serviceability Results</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Courier</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rate</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ETA</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">COD</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {serviceabilityResult.data.available_courier_companies?.map((courier, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2 whitespace-nowrap">{courier.courier_name}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{courier.courier_company_id}</td>
                    <td className="px-4 py-2 whitespace-nowrap">₹{courier.rate}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{courier.etd} days</td>
                    <td className="px-4 py-2 whitespace-nowrap">{courier.is_cod ? 'Yes' : 'No'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default ShiprocketIntegration;