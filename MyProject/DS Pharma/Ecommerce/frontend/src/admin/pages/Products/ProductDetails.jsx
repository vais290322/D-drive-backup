import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Edit, Trash2, ArrowLeft, Package, User } from 'lucide-react';
import toastUtil from '@/shared/utils/toast';
import { productService } from '@/services/admin/api/productService';
import { Button } from '@/admin/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/admin/components/ui/Card';
import { Badge } from '@/admin/components/ui/Badge';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

//   console.log("product from product details page : ",id);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await productService.getProduct(id);
        setProduct(data);
        // console.log("product from product details page : ",data);
      } catch (error) {
        console.error(error);
        toastUtil.error('Product not found');
        navigate('/admin/products');
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
  }, [id, navigate]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productService.deleteProduct(id);
        toastUtil.success('Product deleted successfully');
        navigate('/admin/products');
      } catch (error) {
        console.error(error);
        toastUtil.error('Failed to delete product');
      }
    }
  };

  const getStatusVariant = (status) => {
    const s = status?.toLowerCase() || '';
    if (s === 'active' || s === 'published') return 'success';
    if (s === 'low stock') return 'warning';
    return 'destructive';
  };

  if (isLoading) return <div className="p-12 text-center text-gray-500">Loading details...</div>;
  if (!product) return null;

  return (
    <div className="space-y-6 min-h-screen" style={{ padding: '10px 1rem', background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 50%, #f0fdfa 100%)' }}>
       <Button variant="ghost" className="pl-0 text-gray-500 hover:text-gray-900" onClick={() => navigate('/admin/products')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          <span>Back to Products</span>
       </Button>

       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
         <h1 className="text-3xl font-bold tracking-tight text-gray-900">{product.name}</h1>
         <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => navigate(`/admin/products/${id}/edit`)}>
                <Edit className="mr-2 h-4 w-4" /> Edit
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
                <Trash2 className="mr-2 h-4 w-4" /> Delete
            </Button>
         </div>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
             <Card>
                <CardHeader>
                    <CardTitle>Product Information</CardTitle>
                </CardHeader>
                <CardContent>
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-12">
                      <div>
                         <label className="text-sm font-medium text-gray-500">SKU</label>
                         <p className="text-gray-900 font-mono mt-1">{product.sku}</p>
                      </div>
                      <div>
                         <label className="text-sm font-medium text-gray-500">Category</label>
                         <p className="text-gray-900 mt-1">{product.category}</p>
                      </div>
                      <div>
                         <label className="text-sm font-medium text-gray-500">Price</label>
                         <p className="text-gray-900 font-bold text-lg mt-1">₹{product.price}</p>
                      </div>
                      <div>
                         <label className="text-sm font-medium text-gray-500">Stock Status</label>
                         <div className="mt-1 flex items-center gap-2">
                            <Badge variant={getStatusVariant(product.status)}>
                                {product.status}
                            </Badge>
                            <span className="text-gray-500 text-sm">({product.stock} units)</span>
                         </div>
                      </div>
                   </div>

                   <div className="mt-6 pt-6 border-t border-gray-100">
                      <label className="text-sm font-medium text-gray-500">Description</label>
                      <div className="text-gray-700 mt-2 leading-relaxed whitespace-pre-wrap">
                         {product.description || 'No description available for this product.'}
                      </div>
                   </div>
                </CardContent>
             </Card>
          </div>

          <div className="space-y-6">
             <Card className="p-6 flex flex-col items-center justify-center min-h-[200px] text-center">
                {product.image ? (
                     <img src={product.image} alt="" className="w-full h-auto rounded-md object-cover max-h-[300px]" />
                ) : (
                    <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                        <Package className="h-10 w-10" />
                    </div>
                )}
             </Card>
          </div>
       </div>
    </div>
  );
};

export default ProductDetails;
