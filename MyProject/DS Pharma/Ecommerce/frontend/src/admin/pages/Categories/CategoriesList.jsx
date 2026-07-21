import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Loading from '@/shared/components/common/Loading';
import { Plus, Edit, Trash2, Search, Sparkles, Eye, EyeOff, ImageIcon } from 'lucide-react';
import { Button } from '@/admin/components/ui/Button';
import { Input } from '@/admin/components/ui/Input';
import { Card, CardContent } from '@/admin/components/ui/Card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/admin/components/ui/Table';
import { Pagination } from '@/admin/components/ui/Pagination';
import ConfirmationModal from '@/admin/components/ui/ConfirmationModal';
import useDataStore from '@/store/useDataStore';
import { useCategories, useDeleteCategory, useUpdateCategory } from '@/shared/hooks/queries/useCategories';
import { useQuery } from '@tanstack/react-query';
import { productService } from '@/services/productService';
import { mediaCloudService } from '@/services/mediaCloud.service';

const CategoriesList = () => {
    const navigate = useNavigate();

    // Search and Pagination State
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // Debounce search input
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(searchQuery);
            setCurrentPage(1); // Reset to page 1 on search
        }, 500);
        return () => clearTimeout(handler);
    }, [searchQuery]);

    // API Hooks with backend-driven params
    const { data, isLoading, isError, refetch } = useCategories({
        search: debouncedSearch,
        page: currentPage,
        limit: itemsPerPage
    });

    // Fetch all products for accurate counting (legacy name vs new ID match)
    const { data: allProducts = [] } = useQuery({
        queryKey: ['all-products-count'],
        queryFn: () => productService.getAllProductsAtOnce(),
        staleTime: 60 * 1000 // 1 minute stale time
    });

    const deleteMutation = useDeleteCategory();
    const updateMutation = useUpdateCategory();

    // Extract metadata from backend response
    const categories = data?.categories || [];
    const totalPages = data?.totalPages || 1;
    const totalItems = data?.totalItems || 0;

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [currentCategory, setCurrentCategory] = useState(null);

    // Use fetched products if available, fallback to store (though store might be empty)
    const storeProducts = useDataStore((state) => state.products);
    const productsForCount = allProducts.length > 0 ? allProducts : storeProducts;

    const handleToggleVisibility = async (category) => {
        try {
            const formData = new FormData();
            formData.append('visibility', String(!category.visibility));
            formData.append('name', category.name);

            await updateMutation.mutateAsync({
                id: category.id,
                data: formData
            });
        } catch {
            // Error managed by hook
        }
    };

    const handleDelete = async () => {
        try {
            // Delete images from MediaCloud first
            if (currentCategory?.images && currentCategory.images.length > 0) {
                for (const img of currentCategory.images) {
                    if (img.fileId) {
                        try {
                            await mediaCloudService.deleteFile(img.fileId);
                        } catch (error) {
                            console.error(`Failed to delete image ${img.fileId}:`, error);
                        }
                    }
                }
            } else if (currentCategory?.image && typeof currentCategory.image === 'object' && currentCategory.image.fileId) {
                // Fallback for single image object
                try {
                    await mediaCloudService.deleteFile(currentCategory.image.fileId);
                } catch (error) {
                    console.error(`Failed to delete image ${currentCategory.image.fileId}:`, error);
                }
            }

            await deleteMutation.mutateAsync(currentCategory.id);
            setIsDeleteModalOpen(false);
        } catch {
            // Error managed by hook
        }
    };

    const openDeleteModal = (category) => {
        setCurrentCategory(category);
        setIsDeleteModalOpen(true);
    };

    if (isLoading && categories.length === 0) {
        return (
            <div className="flex h-[70vh] items-center justify-center">
                <Loading size="large" text="Loading categories..." />
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full space-y-4 sm:space-y-6 max-w-full overflow-x-hidden animate-in fade-in slide-in-from-bottom-6 duration-700" style={{ padding: '0px 1rem', background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 50%, #f0fdfa 100%)' }}>
            <div className="flex flex-row justify-between items-start sm:items-center gap-3 sm:gap-4" style={{ padding: '10px 0px' }}>
                <div>
                    <h2 className="text-xl sm:text-2xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 via-emerald-800 to-teal-800 bg-clip-text text-transparent flex items-center gap-2">
                        Categories
                        <Sparkles className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-emerald-500" />
                    </h2>
                    <p className="text-gray-500 text-[10px] sm:text-[8px] sm:text-xs md:text-sm mt-0.5 font-medium">Manage product categories</p>
                </div>
                <Button onClick={() => navigate('/admin/categories/new')} className="text-[10px] sm:text-[8px] sm:text-xs md:text-sm h-7 sm:h-9 md:h-10 shadow-md transition-transform hover:scale-105 active:scale-95" style={{ padding: '0px 15px' }}>
                    <Plus className="mr-0.5 sm:mr-1 md:mr-2 h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4" /> <span style={{ marginTop: '3px' }}>Add Category</span>
                </Button>
            </div>

            <Card className="flex-1 flex flex-col overflow-hidden">
                <CardContent className="flex flex-col flex-1 min-h-0 p-2 sm:p-3 md:p-4 lg:p-6 space-y-2 sm:space-y-3 md:space-y-4 overflow-hidden" style={{ padding: '5px' }}>
                    {/* Filters & Search Bar */}
                    <div className="flex flex-col gap-3">
                        <div className="flex flex-row gap-2 sm:gap-4" style={{ paddingBottom: '5px' }}>
                            <div className="relative flex-1">
                                <Search className="absolute right-2.5 top-2.5 h-3 w-3 sm:h-4 sm:w-4 text-gray-500" />
                                <Input
                                    placeholder="Search by name..."
                                    className="pl-8 sm:pl-9 text-[8px] sm:text-sm h-9 sm:h-10"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    style={{ padding: '15px' }}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 overflow-auto rounded-md border border-gray-200 shadow-sm bg-white">
                        <Table>
                            <TableHeader>
                                <TableRow style={{ background: 'linear-gradient(to right, #f0fdf4, #f0fdfa)' }}>
                                    <TableHead className="w-16 font-semibold text-gray-700 text-[8px] sm:text-sm text-center" style={{ padding: '6px 8px' }}>SR NO</TableHead>
                                    <TableHead className="font-semibold text-gray-700 text-[8px] sm:text-sm" style={{ padding: '6px 8px' }}>Image</TableHead>
                                    <TableHead className="font-semibold text-gray-700 text-[8px] sm:text-sm" style={{ padding: '6px 8px' }}>Name</TableHead>
                                    <TableHead className="font-semibold text-gray-700 text-[8px] sm:text-sm hidden sm:table-cell" style={{ padding: '6px 8px' }}>Slug</TableHead>
                                    <TableHead className="font-semibold text-gray-700 text-[8px] sm:text-sm hidden md:table-cell text-center" style={{ padding: '6px 8px' }}>Products</TableHead>
                                    <TableHead className="font-semibold text-gray-700 text-[8px] sm:text-sm" style={{ padding: '6px 8px' }}>Visibility</TableHead>
                                    <TableHead className="text-right font-semibold text-gray-700 text-[8px] sm:text-sm" style={{ padding: '6px 8px' }}>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isError ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="h-32 text-center">
                                            <div className="flex flex-col items-center justify-center gap-2">
                                                <p className="text-red-500 font-medium">Failed to load categories.</p>
                                                <Button size="sm" onClick={() => refetch()}>Retry</Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : categories.length > 0 ? (
                                    categories.map((category, index) => {
                                        const srNo = (currentPage - 1) * itemsPerPage + index + 1;
                                        // Robust counting: check ID (standard) or Name (legacy)
                                        const productCount = productsForCount.filter(
                                            p => p.category === category.name ||
                                                p.category === category.id ||
                                                (p.category && p.category._id === category.id)
                                        ).length;

                                        return (
                                            <TableRow key={category.id} className="hover:bg-emerald-50/50 transition-all duration-200 border-b border-gray-100 group">
                                                <TableCell className="text-center font-medium text-gray-500 text-[8px] sm:text-sm" style={{ padding: '8px' }}>{srNo}</TableCell>
                                                <TableCell style={{ padding: '6px' }}>
                                                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center border border-gray-200 shadow-xs">
                                                        {category.image ? (
                                                            <img
                                                                src={category.image}
                                                                alt={category.name}
                                                                className="w-full h-full object-cover"
                                                                onError={(e) => {
                                                                    e.target.onerror = null;
                                                                    e.target.style.display = 'none';
                                                                    e.target.parentElement.innerHTML = '<div class="text-gray-400"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg></div>';
                                                                }}
                                                            />
                                                        ) : (
                                                            <ImageIcon className="w-5 h-5 text-gray-400" />
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="font-semibold text-gray-800 text-[8px] sm:text-sm" style={{ padding: '8px' }}>
                                                    {category.name}
                                                </TableCell>
                                                <TableCell className="text-gray-500 text-[8px] sm:text-xs hidden sm:table-cell font-mono" style={{ padding: '6px' }}>{category.slug || '-'}</TableCell>
                                                <TableCell className="text-gray-900 text-[8px] sm:text-xs hidden md:table-cell text-center" style={{ padding: '6px' }}>
                                                    <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-bold ring-1 ring-inset ring-emerald-600/20">{productCount}</span>
                                                </TableCell>
                                                <TableCell className="text-[8px] sm:text-xs text-center" style={{ padding: '6px' }}>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-6 w-6 hover:bg-gray-100"
                                                        title={category.visibility ? "Hide to website" : "Show toggle website"}
                                                        onClick={() => handleToggleVisibility(category)}
                                                    >
                                                        {category.visibility
                                                            ? <Eye className="w-4 h-4 text-emerald-600" />
                                                            : <EyeOff className="w-4 h-4 text-gray-400" />
                                                        }
                                                    </Button>
                                                </TableCell>
                                                <TableCell className="text-right" style={{ padding: '6px' }}>
                                                    <div className="flex items-center justify-center gap-1 sm:gap-2 opacity-100">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-7 w-7 sm:h-8 sm:w-8 hover:bg-blue-50"
                                                            onClick={() => navigate(`/admin/categories/edit/${category.id}`)}
                                                        >
                                                            <Edit className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-7 w-7 sm:h-8 sm:w-8 hover:bg-red-50"
                                                            onClick={() => openDeleteModal(category)}
                                                        >
                                                            <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 text-red-600" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={7} className="h-32 text-center text-gray-500">
                                            <div className="flex flex-col items-center justify-center gap-2">
                                                <Search className="w-8 h-8 text-gray-300" />
                                                <p className="text-sm font-medium">No categories found matching your search.</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {!isLoading && totalItems > 0 && (
                        <div className="shrink-0 mt-auto pt-4" style={{ bottom: '0', marginTop: '10px' }}>
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={page => setCurrentPage(page)}
                                itemsPerPage={itemsPerPage}
                                onItemsPerPageChange={(val) => {
                                    setItemsPerPage(val);
                                    setCurrentPage(1);
                                }}
                            />
                        </div>
                    )}
                </CardContent>
            </Card>

            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDelete}
                title="Delete Category"
                message={
                    currentCategory
                        ? (() => {
                            const count = productsForCount.filter(
                                p => p.category === currentCategory.name ||
                                    p.category === currentCategory.id ||
                                    (p.category && p.category._id === currentCategory.id)
                            ).length;

                            return count > 0
                                ? `"${currentCategory.name}" has ${count} product(s). Are you sure you want to delete it? Products will remain but lose their category association.`
                                : `Are you sure you want to delete "${currentCategory.name}"? This action cannot be undone.`;
                        })()
                        : "Are you sure you want to delete this category?"
                }
                confirmText="Delete"
                variant="danger"
                isLoading={deleteMutation.isPending}
            />
        </div>
    );
};

export default CategoriesList;