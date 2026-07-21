import React, { useState } from 'react';
import { Search, Loader2, Plus, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/admin/components/ui/Dialog';
import { Input } from '@/admin/components/ui/Input';
import { Button } from '@/admin/components/ui/Button';
import { useAllProducts } from '@/shared/hooks/queries/useFeaturedProducts';
import { Pagination } from '@/admin/components/ui/Pagination';
import { FALLBACK_IMAGE, handleImageError } from '@/shared/constants/assets';

const ProductSelectionModal = ({ isOpen, onClose, onSelect, isSubmitting, featuredIds = [] }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedProductId, setSelectedProductId] = useState(null);
    const itemsPerPage = 6;

    // Fetch all products with pagination and search
    const { data: productsData, isLoading } = useAllProducts({
        search: searchQuery,
        page: currentPage,
        limit: itemsPerPage
    });

    const products = productsData?.data || (Array.isArray(productsData) ? productsData : []);
    const totalItems = productsData?.pagination?.totalItems || productsData?.total || 0;
    const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
        setSelectedProductId(null);
    };

    const handleConfirm = () => {
        if (selectedProductId) {
            onSelect(selectedProductId);
        }
    };

// Helper for images
    const getImageUrl = (image) => {
        if (!image) return FALLBACK_IMAGE;
        const url = typeof image === 'string' ? image : (image.url || image[0]?.url || '');
        if (url.startsWith('http')) return url;
        const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const cleanPath = url.startsWith('/') ? url.substring(1) : url;
        return `${apiBase}/${cleanPath}`;
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-3xl h-[80vh] flex flex-col p-0 gap-0 overflow-hidden bg-white/95 backdrop-blur-xl border-gray-200 shadow-2xl">
                <DialogHeader className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                    <DialogTitle className="text-xl font-bold bg-gradient-to-r from-gray-900 to-emerald-900 bg-clip-text text-transparent flex items-center gap-2">
                         Select Product
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">
                           {totalItems} Available
                        </span>
                    </DialogTitle>
                </DialogHeader>

                <div className="p-4 bg-white border-b border-gray-100 sticky top-0 z-10">
                    <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Search by name..."
                            value={searchQuery}
                            onChange={handleSearch}
                            className="pl-10 bg-gray-50 border-gray-200 focus:bg-white transition-all"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 min-h-0 bg-gray-50/30">
                    {/* Grid of products */}
                    {isLoading ? (
                        <div className="flex h-full items-center justify-center">
                            <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
                        </div>
                    ) : products.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {products.map((product) => {
                                const isSelected = selectedProductId === (product._id || product.id);
                                const isAlreadyFeatured = featuredIds.includes(product._id || product.id);

                                return (
                                    <div
                                        key={product._id || product.id}
                                        onClick={() => !isAlreadyFeatured && setSelectedProductId(product._id || product.id)}
                                        className={`
                                            relative flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all duration-200 group
                                            ${isSelected 
                                                ? 'border-emerald-500 bg-emerald-50/50 shadow-md ring-1 ring-emerald-500/20' 
                                                : 'border-gray-200 bg-white hover:border-emerald-200 hover:shadow-sm hover:bg-white'}
                                            ${isAlreadyFeatured ? 'opacity-60 cursor-not-allowed bg-gray-50' : ''}
                                        `}
                                    >
                                        <div className="h-12 w-12 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden shrink-0 relative">
                                            <img 
                                                src={getImageUrl(product.image || product.images)} 
                                                alt={product.name}
                                                className="h-full w-full object-cover"
                                                onError={handleImageError}
                                            />
                                            {isAlreadyFeatured && (
                                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                                    <span className="text-[9px] font-bold text-white bg-emerald-600 px-1 rounded">ADDED</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start">
                                                <h4 className={`text-sm font-semibold truncate ${isSelected ? 'text-emerald-900' : 'text-gray-800'}`}>
                                                    {product.name}
                                                </h4>
                                                {isAlreadyFeatured && (
                                                     <span className="text-[10px] text-emerald-600 font-bold ml-1 shrink-0">Featured</span>
                                                )}
                                            </div>
                                            <p className="text-xs text-gray-500 mt-0.5">₹{product.price}</p>
                                        </div>
                                        
                                        {!isAlreadyFeatured && (
                                            <div className={`
                                                w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-1
                                                ${isSelected ? 'bg-emerald-500 border-emerald-500' : 'border-gray-300'}
                                            `}>
                                                {isSelected && <div className="w-2 h-2 bg-white rounded-full" />}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400">
                            <Search className="h-10 w-10 mb-2 opacity-20" />
                            <p>No products found matching "{searchQuery}"</p>
                        </div>
                    )}
                </div>

                <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                        showControls={false} // Minimal controls if desired
                        className="scale-90 origin-left"
                    />
                    
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <Button variant="outline" onClick={onClose} className="flex-1 sm:flex-none">
                            Cancel
                        </Button>
                        <Button 
                            onClick={handleConfirm} 
                            disabled={!selectedProductId || isSubmitting}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white min-w-[100px] flex-1 sm:flex-none"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Adding...
                                </>
                            ) : (
                                <>
                                    <Plus className="w-4 h-4 mr-2" /> Add Selection
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ProductSelectionModal;
