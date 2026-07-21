import { CheckCircle2, Eye, EyeOff, Package, Pencil, Plus, Search, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/components/ui/pagination'
import { deleteCategory } from '@/store/features/categorySlice'

function Categories() {
  const { categories } = useSelector((state) => state.category)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const itemsPerPage = 12

  // Filter categories based on search
  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalCategories = categories.length
  const activeCategories = categories.filter((c) => c.visibility).length
  const hiddenCategories = categories.filter((c) => !c.visibility).length

  // Pagination Logic
  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedCategories = filteredCategories.slice(startIndex, startIndex + itemsPerPage)

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  const handleDelete = async (categoryId) => {
    if (!confirm('Are you sure you want to delete this category?')) return

    try {
      await deleteCategory(categoryId)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="flex flex-col gap-4 p-4 animate-in fade-in zoom-in-95 duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Categories
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Manage your product categories and their visibility.
          </p>
        </div>
        <Button
          size="sm"
          className="w-full md:w-auto shadow-sm hover:shadow-primary/25 transition-all duration-300"
        >
          <Plus className="h-3.5 w-3.5" /> Add New
        </Button>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Total */}
        <div className="rounded-sm border border-muted/60 border-l-4 border-l-primary/60 bg-white p-3 transition-all duration-200 hover:shadow-sm hover:-translate-y-[1px]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              Total
            </span>
            <Package className="h-4 w-4 text-muted-foreground" />
          </div>

          <div className="mt-1.5">
            <div className="text-2xl font-semibold leading-none">{totalCategories}</div>
            <p className="text-[11px] text-muted-foreground mt-1">All registered categories</p>
          </div>
        </div>

        {/* Active */}
        <div className="rounded-sm border border-muted/60 border-l-4 border-l-green-500/60 bg-white p-3 transition-all duration-200 hover:shadow-sm hover:-translate-y-[1px]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              Active
            </span>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </div>

          <div className="mt-1.5">
            <div className="text-2xl font-semibold leading-none">{activeCategories}</div>
            <p className="text-[11px] text-muted-foreground mt-1">Visible on store</p>
          </div>
        </div>

        {/* Hidden */}
        <div className="rounded-sm border border-muted/60 border-l-4 border-l-gray-500/60 bg-white p-3 transition-all duration-200 hover:shadow-sm hover:-translate-y-[1px]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              Hidden
            </span>
            <EyeOff className="h-4 w-4 text-gray-500" />
          </div>

          <div className="mt-1.5">
            <div className="text-2xl font-semibold leading-none">{hiddenCategories}</div>
            <p className="text-[11px] text-muted-foreground mt-1">Hidden categories</p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col gap-4">
        {/* Search Bar */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search categories..."
              className="pl-8 h-9 text-sm w-full md:w-[550px] bg-background shadow-sm"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setCurrentPage(1) // Reset to page 1 on search
              }}
            />
          </div>
        </div>

        {/* Categories Grid */}
        {paginatedCategories.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {paginatedCategories.map((category) => (
              <div
                key={category._id}
                className="group border border-muted/60 rounded-sm overflow-hidden bg-white hover:shadow-sm transition-shadow duration-200 shadow-md"
              >
                {/* Image */}
                <div className="relative h-40 overflow-hidden bg-muted">
                  <img
                    src={category.image.url}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* Status Badge */}
                  <Badge
                    className={`absolute top-1 right-1 leading-4 text-white ${
                      category.visibility ? 'bg-green-200/90 text-green-600' : ''
                    }`}
                    variant={category.visibility ? 'default' : 'destructive'}
                  >
                    {category.visibility ? 'Active' : 'Hidden'}
                  </Badge>
                </div>

                {/* Content */}
                <div className="px-2 py-1.5">
                  <h3 className="text-sm font-semibold truncate capitalize" title={category.name}>
                    {category.name}
                  </h3>

                  <p className="text-xs text-muted-foreground">
                    {new Date(category.createdAt).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between px-2 py-1 border-t border-muted/60">
                  <div className="flex gap-0.5">
                    <Button
                      title="Edit"
                      size="icon"
                      variant="outline"
                      className="h-6 flex items-center justify-center text-blue-600"
                    >
                      <Pencil className="h-3 w-3" />
                    </Button>

                    <Button
                      title={category.visibility ? 'Hide' : 'Show'}
                      size="icon"
                      variant="outline"
                      className={`h-6 flex items-center justify-center rounded-sm hover:bg-gray-100 ${
                        category.visibility ? 'text-gray-600' : 'text-green-600'
                      }`}
                    >
                      {category.visibility ? (
                        <EyeOff className="h-3 w-3" />
                      ) : (
                        <Eye className="h-3 w-3" />
                      )}
                    </Button>
                  </div>

                  <Button
                    title="Delete"
                    size="icon"
                    variant="outline"
                    className="h-6 flex items-center justify-center text-red-600"
                    onClick={() => handleDelete(category._id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-sm">No categories found.</p>
          </div>
        )}

        {/* Pagination */}
        {filteredCategories.length > itemsPerPage && (
          <div className="mt-2 text-xs">
            <Pagination className="justify-end">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => handlePageChange(currentPage - 1)}
                    className={`h-7 px-2 text-xs ${currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}`}
                  />
                </PaginationItem>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      isActive={currentPage === page}
                      onClick={() => handlePageChange(page)}
                      className="h-7 w-7 text-xs cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext
                    onClick={() => handlePageChange(currentPage + 1)}
                    className={`h-7 px-2 text-xs ${currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}`}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </div>
  )
}

export default Categories
