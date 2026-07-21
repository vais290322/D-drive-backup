import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProducts, createDummyProducts, deleteProduct } from '../services/api';

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleCreateDummyProducts = async () => {
    try {
      setLoading(true);
      await createDummyProducts();
      fetchProducts();
    } catch (err) {
      setError('Failed to create dummy products');
      console.error(err);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id);
        setProducts(products.filter(product => product._id !== id));
      } catch (err) {
        setError('Failed to delete product');
        console.error(err);
      }
    }
  };

  if (loading && products.length === 0) {
    return <div className="text-center py-10">Loading products...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Products</h1>
        <div className="space-x-2">
          <button 
            onClick={handleCreateDummyProducts} 
            className="btn btn-secondary"
          >
            Create Dummy Products
          </button>
          <Link to="/products/create" className="btn btn-primary">
            Add New Product
          </Link>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
          <p>{error}</p>
        </div>
      )}

      {products.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500 mb-4">No products found</p>
          <button 
            onClick={handleCreateDummyProducts} 
            className="btn btn-primary"
          >
            Create Dummy Products
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(product => (
            <div key={product._id} className="card">
              <div className="flex justify-between items-start">
                <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                  {product.category}
                </span>
              </div>
              <p className="text-gray-600 mb-2">{product.description}</p>
              <p className="text-lg font-bold mb-4">₹{product.price}</p>
              
              <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                <span>SKU: {product.sku}</span>
                <span>Stock: {product.stock}</span>
              </div>
              
              <div className="flex justify-between">
                <Link 
                  to={`/products/${product._id}`} 
                  className="text-blue-600 hover:underline"
                >
                  View Details
                </Link>
                <button 
                  onClick={() => handleDeleteProduct(product._id)} 
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Products;