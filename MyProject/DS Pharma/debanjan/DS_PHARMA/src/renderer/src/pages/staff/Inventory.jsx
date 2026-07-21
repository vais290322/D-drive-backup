import React, { useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/components/ui/pagination'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  MoreHorizontal,
  Package,
  AlertTriangle,
  DollarSign,
  Search,
  Filter,
  Trash2,
  Edit,
  Plus,
  ChevronRight,
  ChevronLeft
} from 'lucide-react'
import { productUrl } from '@/config'

export default function Inventory() {
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [pagination, setPagination] = useState({
    totalItems: 0,
    totalPages: 1,
    currentPage: 1,
    limit: 10
  })
  const [deleteId, setDeleteId] = useState(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const stats = [
    {
      title: 'Total Products',
      value: '2,345',
      icon: Package,
      description: '+180 from last month'
    },
    {
      title: 'Low Stock',
      value: '12',
      icon: AlertTriangle,
      description: 'Items below minimum level',
      alert: true
    },
    {
      title: 'Total Value',
      value: '$45,231.89',
      icon: DollarSign,
      description: '+20.1% from last month'
    }
  ]

  const fetchProducts = async (page = 1, limit = 10, searchTerm = '') => {
    setIsLoading(true)
    try {
      const response = await axios.get(productUrl.getAllProducts, {
        params: { page, limit, search: searchTerm }
      })
      setProducts(response.data.data || [])
      setPagination(
        response.data.pagination || {
          totalItems: 0,
          totalPages: 1,
          currentPage: 1,
          limit
        }
      )
    } catch (error) {
      console.error(error)
      toast.error('Failed to fetch products')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts(pagination.currentPage, pagination.limit, search)
  }, [pagination.currentPage, pagination.limit, search])

  const handlePageChange = (page) => {
    if (page < 1 || page > pagination.totalPages) return
    setPagination((prev) => ({ ...prev, currentPage: page }))
  }

  const handleSearchChange = (e) => {
    setSearch(e.target.value)
    setPagination((prev) => ({ ...prev, currentPage: 1 }))
  }

  const handleDeleteClick = (id) => {
    setDeleteId(id)
    setConfirmOpen(true)
  }

  const handleDelete = async () => {
    if (!deleteId) return

    setDeleteLoading(true)
    try {
      await axios.delete(`${productUrl.deleteProduct}/${deleteId}`)
      toast.success('Product deleted successfully')

      setConfirmOpen(false)
      setDeleteId(null)

      fetchProducts(pagination.currentPage, pagination.limit)
    } catch (error) {
      console.error(error)
      toast.error('Failed to delete product')
    } finally {
      setDeleteLoading(false)
    }
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Inventory</h2>
        <div className="flex items-center space-x-2">
          <Button>
            <Plus className="h-4 w-4" /> Add Product
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon
                className={`h-4 w-4 ${stat.alert ? 'text-red-500' : 'text-muted-foreground'}`}
              />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters and Search */}
      <div className="flex items-center justify-between">
        <div className="flex flex-1 items-center space-x-2">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={search}
              onChange={handleSearchChange}
              className="pl-8"
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Products Table */}
      <div className=" border border-secondary">
        <Table>
          <TableHeader>
            <TableRow
              style={{
                background: 'linear-gradient(to right, #f0fdf4, #f0fdfa)'
              }}
            >
              <TableHead
                className="font-semibold text-gray-700 text-[8px] sm:text-sm"
                style={{ padding: '6px 8px' }}
              >
                Image
              </TableHead>
              <TableHead
                className="font-semibold text-gray-700 text-[8px] sm:text-sm"
                style={{ padding: '6px 8px' }}
              >
                Name
              </TableHead>
              <TableHead
                className="font-semibold text-gray-700 text-[8px] sm:text-sm"
                style={{ padding: '6px 8px' }}
              >
                Brand
              </TableHead>
              <TableHead
                className="font-semibold text-gray-700 text-[8px] sm:text-sm"
                style={{ padding: '6px 8px' }}
              >
                Category
              </TableHead>
              <TableHead
                className="font-semibold text-gray-700 text-[8px] sm:text-sm"
                style={{ padding: '6px 8px' }}
              >
                SKU
              </TableHead>
              <TableHead
                className="font-semibold text-gray-700 text-[8px] sm:text-sm"
                style={{ padding: '6px 8px' }}
              >
                Unit
              </TableHead>
              <TableHead
                className="font-semibold text-gray-700 text-[8px] sm:text-sm"
                style={{ padding: '6px 8px' }}
              >
                Price
              </TableHead>
              <TableHead
                className="font-semibold text-gray-700 text-[8px] sm:text-sm"
                style={{ padding: '6px 8px' }}
              >
                Discount
              </TableHead>
              <TableHead
                className="font-semibold text-gray-700 text-[8px] sm:text-sm"
                style={{ padding: '6px 8px' }}
              >
                Disc. Price
              </TableHead>
              <TableHead
                className="font-semibold text-gray-700 text-[8px] sm:text-sm"
                style={{ padding: '6px 8px' }}
              >
                Stock
              </TableHead>
              <TableHead
                className="font-semibold text-gray-700 text-[8px] sm:text-sm"
                style={{ padding: '6px 8px' }}
              >
                Status
              </TableHead>
              <TableHead
                className="text-right font-semibold text-gray-700 text-[8px] sm:text-sm"
                style={{ padding: '6px 8px' }}
              >
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={12} className="h-24 text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={12} className="h-24 text-center">
                  No products found.
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow key={product.id || product._id}>
                  <TableCell style={{ padding: '6px 8px' }}>
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={product.image[0].url} alt={product.name} />
                      <AvatarFallback>{product.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell className="font-medium" style={{ padding: '6px 8px' }}>
                    {product.name}
                  </TableCell>
                  <TableCell style={{ padding: '6px 8px' }}>{product.brand}</TableCell>
                  <TableCell style={{ padding: '6px 8px' }}>{product.category}</TableCell>
                  <TableCell style={{ padding: '6px 8px' }}>{product.sku}</TableCell>
                  <TableCell style={{ padding: '6px 8px' }}>{product.unit}</TableCell>
                  <TableCell style={{ padding: '6px 8px' }}>${product.price}</TableCell>
                  <TableCell style={{ padding: '6px 8px' }}>{product.discount}%</TableCell>
                  <TableCell style={{ padding: '6px 8px' }}>${product.discountedPrice}</TableCell>
                  <TableCell style={{ padding: '6px 8px' }}>{product.stock}</TableCell>
                  <TableCell style={{ padding: '6px 8px' }}>
                    <Badge variant={product.stock > 10 ? 'default' : 'destructive'}>
                      {product.stock > 10 ? 'In Stock' : 'Low Stock'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right" style={{ padding: '6px 8px' }}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => handleDeleteClick(product.id || product._id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-end space-x-2 py-4">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <Button
                variant="ghost"
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage <= 1}
              >
                <ChevronLeft className="h-4 w-4" /> Previous
              </Button>
            </PaginationItem>

            <PaginationItem>
              <div className="flex items-center px-4">
                Page {pagination.currentPage} of {pagination.totalPages}
              </div>
            </PaginationItem>

            <PaginationItem>
              <Button
                variant="ghost"
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage >= pagination.totalPages}
              >
                Next <ChevronRight className="h-4 w-4" />
              </Button>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the product from the
              inventory.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setConfirmOpen(false)}
              disabled={deleteLoading}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleteLoading}>
              {deleteLoading ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
