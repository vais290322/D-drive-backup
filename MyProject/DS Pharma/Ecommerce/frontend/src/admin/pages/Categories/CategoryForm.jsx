import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft, Tag, Eye, EyeOff } from 'lucide-react';
import toastUtil from '@/shared/utils/toast';
import { Button } from '@/admin/components/ui/Button';
import { Input } from '@/admin/components/ui/Input';
import { Label } from '@/admin/components/ui/Label';
import { Switch } from '@/admin/components/ui/Switch';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/admin/components/ui/Card';
import ConfirmationModal from '@/admin/components/ui/ConfirmationModal';
import ImageUpload from '@/shared/components/common/ImageUpload';
import Loading from '@/shared/components/common/Loading';
import { useCategoryById, useCreateCategory, useUpdateCategory } from '@/shared/hooks/queries/useCategories';
import { mediaCloudService } from '@/services/mediaCloud.service';

const CategoryForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Use specific hook for single category to ensure details are loaded correctly in Edit mode
  const { data: category, isLoading: isFetching } = useCategoryById(id);

  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    images: [],
    visibility: true
  });

  const [imageList, setImageList] = useState([]);

  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  };

  // Populate form when category data is fetched
  useEffect(() => {
    if (isEditMode && category) {
      setFormData({
        name: category.name || '',
        slug: category.slug || '',
        visibility: category.visibility !== undefined ? category.visibility : true,
        images: category.images || (category.image ? [category.image] : [])
      });

      const currentImages = category.images || (category.image ? [category.image] : []);
      setImageList(currentImages);
    }
  }, [isEditMode, category]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updated = { ...prev, [name]: value };
      if (name === 'name' && !isEditMode) updated.slug = generateSlug(value);
      return updated;
    });
  };

  const handleImageChange = async (newImages) => {
    // Determine which images were removed
    const removedImages = imageList.filter(img =>
      !newImages.some(newImg => (newImg.fileId && newImg.fileId === img.fileId) || (typeof newImg === 'string' && newImg === img))
    );

    // Filter out strings that might be URLs if they don't have fileId
    for (const img of removedImages) {
      if (img && typeof img === 'object' && img.fileId) {
        try {
          await mediaCloudService.deleteFile(img.fileId);
        } catch (error) {
          console.error("Failed to delete image from MediaCloud:", error);
        }
      }
    }

    // Handle new uploads
    const processedImages = [...newImages];
    for (let i = 0; i < processedImages.length; i++) {
      const item = processedImages[i];
      if (item instanceof File) {
        try {
          const uploaded = await mediaCloudService.uploadFile(item);
          processedImages[i] = {
            fileId: uploaded.fileId,
            url: uploaded.url,
            name: uploaded.name
          };
        } catch (error) {
          toastUtil.error(`Failed to upload ${item.name}`);
          processedImages.splice(i, 1);
          i--;
        }
      }
    }

    setImageList(processedImages);
    setFormData(prev => ({ ...prev, images: processedImages }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return toastUtil.error('Category name is required');
    if (formData.images.length === 0) return toastUtil.error('Please upload at least one category image before submitting');
    setIsModalOpen(true);
  };

  const handleConfirm = async () => {
    const payload = {
      name: formData.name.trim(),
      slug: formData.slug.trim(),
      visibility: formData.visibility,
      images: formData.images
    };

    try {
      if (isEditMode) {
        await updateMutation.mutateAsync({ id, data: payload });
      } else {
        await createMutation.mutateAsync(payload);
      }
      navigate('/admin/categories');
    } catch (err) {
      // Error is handled by apiClient interceptor
      console.error('Submission Error:', err);
    } finally {
      setIsModalOpen(false);
    }
  };

  if (isEditMode && isFetching && !formData.name) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loading size="large" text="Fetching category details..." />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6 min-h-screen animate-in fade-in slide-in-from-bottom-6 duration-700 w-full" style={{ padding: '0px 1rem', background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 50%, #f0fdfa 100%)' }}>
      <Button variant="ghost" className="pl-0 text-gray-500 hover:text-gray-900 text-[8px] sm:text-sm" onClick={() => navigate('/admin/categories')}>
        <ArrowLeft className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
        <span style={{ marginTop: '3px' }}>Back to Categories</span>
      </Button>

      <div className="flex justify-between items-center" style={{ marginTop: '0px' }}>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-gray-900">
          {isEditMode ? 'Edit Category' : 'Add New Category'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
          <div className="lg:col-span-2 space-y-4 lg:space-y-6">
            <Card className="shadow-sm border-gray-100">
              <CardHeader className="pb-3 border-b border-gray-50 bg-gray-50/30">
                <CardTitle className="text-base sm:text-lg font-bold text-gray-800">Category Details</CardTitle>
                <CardDescription className="text-[10px] sm:text-xs">Enter basic category information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-4 lg:pt-6" style={{ paddingBottom: '1rem' }}>
                <div className="grid gap-2" style={{ marginTop: '10px' }}>
                  <Label htmlFor="name" className="text-xs sm:text-sm font-semibold text-gray-700">Category Name</Label>
                  <Input
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Tablets"
                    icon={Tag}
                    className="h-9 sm:h-10 text-xs sm:text-sm"
                    style={{ paddingLeft: '30px' }}
                  />
                </div>
                <div className="grid gap-2" style={{ marginTop: '10px' }}>
                  <Label htmlFor="slug" className="text-xs sm:text-sm font-semibold text-gray-700">Slug (URL-friendly)</Label>
                  <Input
                    id="slug"
                    name="slug"
                    value={formData.slug}
                    onChange={handleChange}
                    placeholder="e.g. tablets"
                    icon={Tag}
                    className="h-9 sm:h-10 text-xs sm:text-sm"
                    style={{ paddingLeft: '30px' }}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4 lg:space-y-6">
            <Card className="shadow-sm border-gray-100">
              <CardHeader className="pb-3 border-b border-gray-50 bg-gray-50/30">
                <CardTitle className="text-base sm:text-lg font-bold text-gray-800">Image</CardTitle>
                <CardDescription className="text-[10px] sm:text-xs">Upload category image</CardDescription>
              </CardHeader>
              <CardContent className="pt-4 lg:pt-6" style={{ paddingBottom: '10px' }}>
                <ImageUpload
                  images={imageList}
                  onChange={handleImageChange}
                  maxFiles={1}
                />
              </CardContent>
            </Card>

            <div className="grid gap-2" style={{ paddingBottom: '1rem' }}>
              <Card className="shadow-sm border-gray-100">
                <CardHeader className="pb-3 border-b border-gray-50 bg-gray-50/30">
                  <CardTitle className="text-base sm:text-lg font-bold text-gray-800">Visibility</CardTitle>
                  <CardDescription className="text-[10px] sm:text-xs text-gray-500">Public visibility on store</CardDescription>
                </CardHeader>
                <CardContent className="pt-4 lg:pt-6" style={{ paddingBottom: '1rem' }}>
                  <div className="flex items-center justify-between p-3 sm:p-4 bg-gray-50/50 rounded-lg border border-gray-100 transition-all hover:bg-gray-100/50 group">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full transition-colors ${formData.visibility ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-200 text-gray-500'}`}>
                        {formData.visibility ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs sm:text-sm font-bold text-gray-800">{formData.visibility ? 'Visible' : 'Hidden'}</span>
                        <span className="text-[9px] sm:text-[10px] text-gray-500 font-medium">Public Status</span>
                      </div>
                    </div>
                    <Switch
                      checked={formData.visibility}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, visibility: checked }))}
                      className="data-[state=checked]:bg-emerald-600"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        <div className="flex justify-end items-center pt-6 sm:pt-8">
          <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending} className="h-10 sm:h-11 px-8 min-w-[140px] shadow-lg shadow-emerald-700/10 hover:shadow-emerald-700/20 active:scale-95 transition-all bg-emerald-600 hover:bg-emerald-700">
            <Save className="mr-2 h-4 w-4" />
            <span className="font-semibold text-sm" style={{ marginTop: '4px', padding: '0 4px' }}>{(createMutation.isPending || updateMutation.isPending) ? 'Saving...' : 'Save Category'}</span>
          </Button>
        </div>
      </form>

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirm}
        title={isEditMode ? "Update Category" : "Create Category"}
        message={`Are you sure you want to ${isEditMode ? 'update' : 'create'} this category?`}
        confirmText={isEditMode ? "Update" : "Create"}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />
    </div>
  );
};

export default CategoryForm;
