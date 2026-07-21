import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProducts, createOrder } from '../services/api';

function CreateOrder() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [customer, setCustomer] = useState({
    name: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      pincode: '',
      country: 'India'
    }
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await getProducts();
        setProducts(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch products');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleCustomerChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setCustomer(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setCustomer(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleProductSelect = (e) => {
    const productId = e.target.value;
    if (productId === '') return;
    
    const product = products.find(p => p._id === productId);
    if (!product) return;
    
    const existingProduct = selectedProducts.find(p => p.product === productId);
    if (existingProduct) {
      setSelectedProducts(prev => 
        prev.map(p => 
          p.product === productId 
            ? { ...p, quantity: p.quantity + 1 } 
            : p
        )
      );
    } else {
      setSelectedProducts(prev => [
        ...prev,
        {
          product: productId,
          name: product.name,
          sku: product.sku,
          price: product.price,
          quantity: 1
        }
      ]);
    }
    
    // Reset select
    e.target.value = '';
  };

  const handleQuantityChange = (index, value) => {
    const quantity = parseInt(value);
    if (isNaN(quantity) || quantity < 1) return;
    
    setSelectedProducts(prev => 
      prev.map((product, i) => 
        i === index ? { ...product, quantity } : product
      )
    );
  };

  const handleRemoveProduct = (index) => {
    setSelectedProducts(prev => prev.filter((_, i) => i !== index));
  };

  const calculateTotal = () => {
    return selectedProducts.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (selectedProducts.length === 0) {
      alert('Please add at least one product');
      return;
    }
    
    try {
      setLoading(true);
      const orderData = {
        customer,
        items: selectedProducts,
        totalAmount: calculateTotal()
      };
      
      const response = await createOrder(orderData);
      alert('Order created successfully!');
      navigate(`/orders/${response.data._id}`);
    } catch (err) {
      setError('Failed to create order: ' + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && products.length === 0) {
    return <div className="text-center py-10">Loading products...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Create New Order</h1>
      
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
          <p>{error}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Customer Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="form-label">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                className="form-input"
                value={customer.name}
                onChange={handleCustomerChange}
                required
              />
            </div>
            
            <div>
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                className="form-input"
                value={customer.email}
                onChange={handleCustomerChange}
                required
              />
            </div>
            
            <div>
              <label htmlFor="phone" className="form-label">Phone</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                className="form-input"
                value={customer.phone}
                onChange={handleCustomerChange}
                required
              />
            </div>
          </div>
        </div>
        
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label htmlFor="address.street" className="form-label">Street Address</label>
              <input
                type="text"
                id="address.street"
                name="address.street"
                className="form-input"
                value={customer.address.street}
                onChange={handleCustomerChange}
                required
              />
            </div>
            
            <div>
              <label htmlFor="address.city" className="form-label">City</label>
              <input
                type="text"
                id="address.city"
                name="address.city"
                className="form-input"
                value={customer.address.city}
                onChange={handleCustomerChange}
                required
              />
            </div>
            
            <div>
              <label htmlFor="address.state" className="form-label">State</label>
              <input
                type="text"
                id="address.state"
                name="address.state"
                className="form-input"
                value={customer.address.state}
                onChange={handleCustomerChange}
                required
              />
            </div>
            
            <div>
              <label htmlFor="address.pincode" className="form-label">Pincode</label>
              <input
                type="text"
                id="address.pincode"
                name="address.pincode"
                className="form-input"
                value={customer.address.pincode}
                onChange={handleCustomerChange}
                required
              />
            </div>
            
            <div>
              <label htmlFor="address.country" className="form-label">Country</label>
              <input
                type="text"
                id="address.country"
                name="address.country"
                className="form-input"
                value={customer.address.country}
                onChange={handleCustomerChange}
                required
              />
            </div>
          </div>
        </div>
        
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Order Items</h2>
          
          <div className="mb-4">
            <label htmlFor="product" className="form-label">Add Product</label>
            <select
              id="product"
              className="form-input"
              onChange={handleProductSelect}
              defaultValue=""
            >
              <option value="" disabled>Select a product</option>
              {products.map(product => (
                <option key={product._id} value={product._id}>
                  {product.name} - ₹{product.price} ({product.stock} in stock)
                </option>
              ))}
            </select>
          </div>
          
          {selectedProducts.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No products added yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {selectedProducts.map((item, index) => (
                    <tr key={index}>
                      <td className="px-4 py-2 whitespace-nowrap">{item.name}</td>
                      <td className="px-4 py-2 whitespace-nowrap">{item.sku}</td>
                      <td className="px-4 py-2 whitespace-nowrap">₹{item.price}</td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <input
                          type="number"
                          className="w-16 px-2 py-1 border border-gray-300 rounded-md"
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(index, e.target.value)}
                          min="1"
                        />
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">₹{item.price * item.quantity}</td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleRemoveProduct(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td colSpan="4" className="px-4 py-2 text-right font-semibold">Total:</td>
                    <td className="px-4 py-2 font-bold">₹{calculateTotal()}</td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </div>
        
        <div className="flex justify-end">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading || selectedProducts.length === 0}
          >
            {loading ? 'Creating...' : 'Create Order'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateOrder;