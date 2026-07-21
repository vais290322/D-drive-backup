import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { productUrl } from '@/config'
import axios from 'axios'
import { Pencil, Plus, X } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'react-hot-toast'
import { useSelector } from 'react-redux'

function ProductDialog({ isEditMode = false, id, productData }) {
  console.log(productData)

  const [formData, setFormData] = useState({
    name: productData?.name || '',
    sku: productData?.sku || '',
    category: productData?.category || '',
    unit: productData?.unit || '',
    brand: productData?.brand || '',
    description: productData?.description || '',
    status: productData?.status || 'active',
    price: productData?.price || '',
    discount: productData?.discount || '',
    discountedPrice: productData?.discountedPrice || '',
    stock: productData?.stock || '',
    images: productData?.images || [],
    imagePreviews: productData?.imagePreviews || [],
    existingImages: productData?.existingImages || []
  })
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const { categories } = useSelector((state) => state.category || [])
  const categoryLoading = useSelector((state) => state.categories?.loading)

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData((prev) => {
      let updated = { ...prev, [name]: value }

      if (name === 'price' || name === 'discount') {
        const price = Number(updated.price || 0)
        const discount = Number(updated.discount || 0)
        updated.discountedPrice = Math.max(price - (discount / 100) * price, 0)
      }
      return updated
    })
  }

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files)
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg']
    const maxImages = 5

    const validFiles = files.filter((f) => allowedTypes.includes(f.type))

    if (validFiles.length !== files.length) {
      toast.error('Only JPG, JPEG, PNG images allowed')
    }

    if (validFiles.length > maxImages) {
      toast.error(`Maximum ${maxImages} images allowed`)
      return
    }

    setFormData((prev) => ({
      ...prev,
      images: validFiles,
      imagePreviews: validFiles.map((f) => URL.createObjectURL(f))
    }))
  }

  const handleRemoveImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
      imagePreviews: prev.imagePreviews.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const fd = new FormData()

      Object.entries({
        name: formData.name,
        sku: formData.sku,
        category: formData.category,
        unit: formData.unit,
        brand: formData.brand,
        description: formData.description,
        status: formData.status,
        price: Number(formData.price),
        discount: Number(formData.discount),
        discountedPrice: Number(formData.discountedPrice),
        stock: Number(formData.stock)
      }).forEach(([key, value]) => fd.append(key, value))

      formData.images.forEach((img) => fd.append('images', img))

      if (isEditMode) {
        await axios.put(`${productUrl.updateProduct}/${id}`, fd)
        toast.success('Product updated successfully')
      } else {
        await axios.post(productUrl.addProduct, fd)
        toast.success('Product created successfully')
      }

      setIsOpen(false)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save product')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {isEditMode ? (
          <Button
            title="Edit"
            size="icon"
            variant="outline"
            className="h-6 flex items-center justify-center text-blue-600"
          >
            <Pencil className="h-3 w-3" />
          </Button>
        ) : (
          <Button size="sm">
            <Plus className="h-4 w-4" />
            Add Product
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-sm font-semibold">
            {isEditMode ? 'Edit Product' : 'Add Product'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Basic Fields */}
          <div className="grid grid-cols-2 gap-3">
            <Input
              name="name"
              placeholder="Product name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <Input name="sku" placeholder="SKU" value={formData.sku} onChange={handleChange} />

            {/* ✅ Category Select */}
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              disabled={categoryLoading}
              className="h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
              required
            >
              <option value="">
                {categoryLoading ? 'Loading categories...' : 'Select category'}
              </option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>

            <Input
              name="unit"
              placeholder="Unit (kg / pcs)"
              value={formData.unit}
              onChange={handleChange}
            />

            <Input
              name="brand"
              placeholder="Brand"
              value={formData.brand}
              onChange={handleChange}
            />
          </div>

          <Textarea
            name="description"
            placeholder="Product description"
            rows={2}
            value={formData.description}
            onChange={handleChange}
          />

          {/* Pricing */}
          <div className="grid grid-cols-4 gap-3">
            <Input
              name="price"
              type="number"
              placeholder="Price"
              value={formData.price}
              onChange={handleChange}
            />
            <Input
              name="discount"
              type="number"
              placeholder="Discount %"
              value={formData.discount}
              onChange={handleChange}
            />
            <Input value={formData.discountedPrice} disabled placeholder="Discounted" />
            <Input
              name="stock"
              type="number"
              placeholder="Stock"
              value={formData.stock}
              onChange={handleChange}
            />
          </div>

          {/* Images */}
          <div>
            <Input type="file" multiple accept="image/*" onChange={handleImageChange} />
            <div className="flex gap-2 mt-2">
              {formData.imagePreviews.map((src, i) => (
                <div key={i} className="relative">
                  <img
                    src={src}
                    alt="preview"
                    className="h-14 w-14 object-cover rounded-sm border"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(i)}
                    className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Product'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default ProductDialog
