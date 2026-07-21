import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getProduct, updateProduct, deleteProduct } from '../services/api';

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    description: '',
    price: 0,
    weight: 0,
    dimensions: {
      length: 0,
      width: 0,
      height: 0
    },
    category: '',
    stock: 0
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await getProduct(id);
        setProduct(response.data);
        setFormData({
          name: response.data.name,
          sku: response.data.sku,
          description: response.data.description || '',
          price: response.data.price,
          weight: response.data.weight,
          dimensions: {
            length: response.data.dimensions?.length || 0,
            width: response.data.dimensions?.width || 0,
            height: response.data.dimensions?.height || 0
          },
          category: response.data.category || '',
          stock: response.data.stock
        });
        setError(null);
      } catch (err) {
        setError('Failed to fetch product details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: parseFloat(value) || 0
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: name === 'price' || name === 'weight' || name === 'stock' 
          ? parseFloat(value) || 0 
          : value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await updateProduct(id, formData);
      setProduct(response.data);
      setIsEditing(false);
      setError(null);
    } catch (err) {
      setError('Failed to update product');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id);
        navigate('/products');
      } catch (err) {
        setError('Failed to delete product');
        console.error(err);
      }
    }
  };

  if (loading && !product) {
    return <div className="text-center py-10">Loading product details...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
        <p>{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-2 text-red-700 underline"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!product) {
    return <div className="text-center py-10">Product not found</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          {isEditing ? 'Edit Product' : 'Product Details'}
        </h1>
        <div className="space-x-2">
          <Link to="/products" className="btn btn-secondary">
            Back to Products
          </Link>
          {!isEditing && (
            <button 
              onClick={() => setIsEditing(true)} 
              className="btn btn-primary"
            >
              Edit Product
            </button>
          )}
        </div>
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit} className="card">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="form-label">Product Name</label>
              <input
                type="text"
                id="name"
                name="name"
                className="form-input"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div>
              <label htmlFor="sku" className="form-label">SKU</label>
              <input
                type="text"
                id="sku"
                name="sku"
                className="form-input"
                value={formData.sku}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="md:col-span-2">
              <label htmlFor="description" className="form-label">Description</label>
              <textarea
                id="description"
                name="description"
                className="form-input h-24"
                value={formData.description}
                onChange={handleInputChange}
              ></textarea>
            </div>
            
            <div>
              <label htmlFor="price" className="form-label">Price (₹)</label>
              <input
                type="number"
                id="price"
                name="price"
                className="form-input"
                value={formData.price}
                onChange={handleInputChange}
                min="0"
                step="0.01"
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
                value={formData.weight}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                required
              />
            </div>
            
            <div>
              <label htmlFor="category" className="form-label">Category</label>
              <input
                type="text"
                id="category"
                name="category"
                className="form-input"
                value={formData.category}
                onChange={handleInputChange}
              />
            </div>
            
            <div>
              <label htmlFor="stock" className="form-label">Stock</label>
              <input
                type="number"
                id="stock"
                name="stock"
                className="form-input"
                value={formData.stock}
                onChange={handleInputChange}
                min="0"
              />
            </div>
            
            <div className="md:col-span-2">
              <h3 className="text-lg font-medium mb-2">Dimensions</h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label htmlFor="dimensions.length" className="form-label">Length (cm)</label>
                  <input
                    type="number"
                    id="dimensions.length"
                    name="dimensions.length"
                    className="form-input"
                    value={formData.dimensions.length}
                    onChange={handleInputChange}
                    min="0"
                    step="0.1"
                  />
                </div>
                <div>
                  <label htmlFor="dimensions.width" className="form-label">Width (cm)</label>
                  <input
                    type="number"
                    id="dimensions.width"
                    name="dimensions.width"
                    className="form-input"
                    value={formData.dimensions.width}
                    onChange={handleInputChange}
                    min="0"
                    step="0.1"
                  />
                </div>
                <div>
                  <label htmlFor="dimensions.height" className="form-label">Height (cm)</label>
                  <input
                    type="number"
                    id="dimensions.height"
                    name="dimensions.height"
                    className="form-input"
                    value={formData.dimensions.height}
                    onChange={handleInputChange}
                    min="0"
                    step="0.1"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 mt-6">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="btn btn-secondary"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card md:col-span-2">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-2xl font-semibold">{product.name}</h2>
                <p className="text-gray-500">SKU: {product.sku}</p>
              </div>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                {product.category || 'Uncategorized'}
              </span>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Description</h3>
              <p className="text-gray-700">{product.description || 'No description available.'}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Pricing</h3>
                <p className="text-2xl font-bold text-blue-600">₹{product.price}</p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Inventory</h3>
                <p className="text-xl">
                  <span className={`font-semibold ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {product.stock} units
                  </span> in stock
                </p>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Shipping Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Weight</p>
                  <p className="font-semibold">{product.weight} kg</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">Dimensions (L × W × H)</p>
                  <p className="font-semibold">
                    {product.dimensions?.length || 0} × {product.dimensions?.width || 0} × {product.dimensions?.height || 0} cm
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="card">
              <h3 className="text-lg font-medium mb-4">Actions</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setIsEditing(true)}
                  className="btn btn-primary w-full block text-center"
                >
                  Edit Product
                </button>
                <button
                  onClick={handleDelete}
                  className="btn btn-danger w-full block text-center"
                >
                  Delete Product
                </button>
              </div>
            </div>
            
            <div className="card">
              <h3 className="text-lg font-medium mb-4">Product Stats</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Created</span>
                  <span>{new Date(product.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Updated</span>
                  <span>{new Date(product.updatedAt).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status</span>
                  <span className={`${product.isActive ? 'text-green-600' : 'text-red-600'}`}>
                    {product.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductDetails;