import React, { useEffect, useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    IconButton,
    Box,
    CircularProgress,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TablePagination,
    InputAdornment,
    Typography,
} from '@mui/material';
import {
    Add as AddIcon,
    Remove as RemoveIcon,
    Delete as DeleteIcon,
    Edit as EditIcon,
    Visibility as ViewIcon,
    Search as SearchIcon
} from '@mui/icons-material';
import axios from 'axios';
import { backendDomainS } from '../../../Common/index';
import { toast } from "react-hot-toast";

const NewOrderPage = () => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [orders, setOrders] = useState([]);
    const [formData, setFormData] = useState({
        invoiceNumber: '',
        category: '',
        name: '',
        lotNo: '',
        dNo: '',
        item_id: '',
        dName: '',
        embroideryMan: '',
        totalPrice: '',
        date: '',
        sizes: [{ size: '', quantity: '' }],
    });
    const [viewOpen, setViewOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [editMode, setEditMode] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        setEditMode(false);
        setFormData({
            invoiceNumber: '',
            item_id: '',
            category: '',
            name: '',
            lotNo: '',
            dNo: '',
            dName: '',
            embroideryMan: '',

            date: '',
            totalPrice: '',
            sizes: [{ size: '', quantity: '' }],
        });
    };

    const handleAddSize = () => {
        setFormData({
            ...formData,
            sizes: [...formData.sizes, { size: '', quantity: '' }],
        });
    };

    const handleRemoveSize = (index) => {
        const newSizes = formData.sizes.filter((_, i) => i !== index);
        setFormData({ ...formData, sizes: newSizes });
    };

    const handleInputChange = (e, index) => {
        const { name, value } = e.target;
        if (index !== undefined) {
            const newSizes = [...formData.sizes];
            newSizes[index] = { ...newSizes[index], [name]: value };
            setFormData({ ...formData, sizes: newSizes });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleEdit = (order) => {
        setEditMode(true);
        setFormData({
            ...order,
            date: new Date(order.date).toISOString().split('T')[0],
        });
        setOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate required fields
        const requiredFields = ['invoiceNumber', 'category', 'name', 'lotNo', 'dNo', 'dName', 'embroideryMan', 'date','item_id'];
        const hasEmptyFields = requiredFields.some(field => !formData[field]);

        // Validate sizes
        const hasEmptySizes = formData.sizes.some(size => !size.size || !size.quantity);

        if (hasEmptyFields || hasEmptySizes) {
            alert('Please fill all required fields');
            return;
        }

        setLoading(true);
        try {
            let response;
            if (editMode) {
                response = await axios.put(
                    `${backendDomainS}/api/v1/orders/update/${formData._id}`,
                    formData
                );
            } else {
                response = await axios.post(
                    `${backendDomainS}/api/v1/orders/create`,
                    formData
                );
            }

            const data = response.data.data;

            if (editMode) {
                setOrders(orders.map(o => o._id === data._id ? data : o));
            } else {
                setOrders([...orders, data]);
            }

            handleClose();
        } catch (error) {
            console.error('Error:', error);
            alert('Error occurred while saving the order');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this order?')) {
            try {
                await axios.delete(`${backendDomainS}/api/v1/orders/delete/${id}`);
                setOrders(orders.filter(order => order._id !== id));
                toast.success('Order deleted successfully');
            } catch (error) {
                console.error('Error:', error);
                alert('Error occurred while deleting the order');
            }
        }
    };

    // Handle pagination
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // Handle search
    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
        setPage(0);
    };

    // Filter orders based on search term
    const filteredOrders = orders.filter((order) =>
        Object.values(order).some((value) =>
            value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    // Handle view dialog
    const handleViewOpen = (order) => {
        setSelectedOrder(order);
        setViewOpen(true);
    };

    const handleViewClose = () => {
        setViewOpen(false);
        setSelectedOrder(null);
    };

    const fetchOrders = async () => {
        try {
            const response = await axios.get(`${backendDomainS}/api/v1/orders/all`);
            setOrders(response.data.data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Button variant="contained" onClick={handleOpen}>
                    New Order
                </Button>
                <TextField
                    placeholder="Search orders..."
                    variant="outlined"
                    size="small"
                    value={searchTerm}
                    onChange={handleSearch}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                />
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Job Number</TableCell>
                            <TableCell>Category</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Lot No</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredOrders
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((order) => (
                                <TableRow key={order._id}>
                                    <TableCell>{order.invoiceNumber || order.jobNumber}</TableCell>
                                    <TableCell>{order.category}</TableCell>
                                    <TableCell>{order.name}</TableCell>
                                    <TableCell>{order.lotNo}</TableCell>
                                    <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                                    <TableCell>
                                        <IconButton onClick={() => handleViewOpen(order)}>
                                            <ViewIcon />
                                        </IconButton>
                                        <IconButton onClick={() => handleEdit(order)}>
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton onClick={() => handleDelete(order._id)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
                <TablePagination
                    component="div"
                    count={filteredOrders.length}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    rowsPerPageOptions={[5, 10, 25]}
                />
            </TableContainer>

            {/* View Dialog */}
            <Dialog open={viewOpen} onClose={handleViewClose} maxWidth="md" fullWidth>
                <DialogTitle>Order Details</DialogTitle>
                <DialogContent>
                    {selectedOrder && (
                        <Box sx={{ p: 2 }}>
                            <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: 'repeat(2, 1fr)' }}>
                                <TextField
                                    label="Job Number"
                                    value={selectedOrder.invoiceNumber || selectedOrder.jobNumber}
                                    InputProps={{ readOnly: true }}
                                    fullWidth
                                />
                                <TextField
                                    label="Category"
                                    value={selectedOrder.category}
                                    InputProps={{ readOnly: true }}
                                    fullWidth
                                />
                                <TextField
                                    label="Name"
                                    value={selectedOrder.name}
                                    InputProps={{ readOnly: true }}
                                    fullWidth
                                />
                                <TextField
                                    label="Lot No"
                                    value={selectedOrder.lotNo}
                                    InputProps={{ readOnly: true }}
                                    fullWidth
                                />
                                <TextField
                                    label="D. No"
                                    value={selectedOrder.dNo}
                                    InputProps={{ readOnly: true }}
                                    fullWidth
                                />
                                <TextField
                                    label="D. Name"
                                    value={selectedOrder.dName}
                                    InputProps={{ readOnly: true }}
                                    fullWidth
                                />
                                <TextField
                                    label="Item ID"
                                    value={selectedOrder.item_id}
                                    InputProps={{ readOnly: true }}
                                    fullWidth
                                />
                                <TextField
                                    label="Embroidery Man"
                                    value={selectedOrder.embroideryMan}
                                    InputProps={{ readOnly: true }}
                                    fullWidth
                                />
                                <TextField
                                    label="Date"
                                    value={new Date(selectedOrder.date).toLocaleDateString()}
                                    InputProps={{ readOnly: true }}
                                    fullWidth
                                />
                                <TextField
                                    label="Total Price"
                                    value={selectedOrder.totalPrice}
                                    InputProps={{ readOnly: true }}
                                    fullWidth
                                />

                            </Box>
                            <Box sx={{ mt: 3 }}>
                                <Typography variant="h6">Sizes</Typography>
                                <TableContainer>
                                    <Table size="small">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Size</TableCell>
                                                <TableCell>Quantity</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {selectedOrder.sizes.map((size, index) => (
                                                <TableRow key={index}>
                                                    <TableCell>{size.size}</TableCell>
                                                    <TableCell>{size.quantity}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Box>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleViewClose}>Close</Button>
                </DialogActions>
            </Dialog>

            {/* Create/Edit Dialog */}
            <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
                <DialogTitle>
                    {editMode ? 'Edit Work Order' : 'New Work Order'}
                </DialogTitle>
                <DialogContent>
                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                        <TextField
                            fullWidth
                            margin="normal"
                            label="Job Number"
                            name="invoiceNumber"
                            value={formData.invoiceNumber}
                            onChange={handleInputChange}
                        />
                        <TextField
                            fullWidth
                            margin="normal"
                            label="Category"
                            name="category"
                            value={formData.category}
                            onChange={handleInputChange}
                        />
                        <TextField
                            fullWidth
                            margin="normal"
                            label="Name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                        />
                        <TextField
                            fullWidth
                            margin="normal"
                            label="Lot No"
                            name="lotNo"
                            value={formData.lotNo}
                            onChange={handleInputChange}
                        />
                        <TextField
                            fullWidth
                            margin="normal"
                            label="D. No"
                            name="dNo"
                            value={formData.dNo}
                            onChange={handleInputChange}
                        />
                        <TextField
                            fullWidth
                            margin="normal"
                            label="D. Name"
                            name="dName"
                            value={formData.dName}
                            onChange={handleInputChange}
                        />
                        <TextField
                            fullWidth
                            margin="normal"
                            label="Item ID"
                            name="item_id"
                            value={formData.item_id}
                            onChange={handleInputChange}
                        />
                        <TextField
                            fullWidth
                            margin="normal"
                            label="Embroidery Man"
                            name="embroideryMan"
                            value={formData.embroideryMan}
                            onChange={handleInputChange}
                        />
                        <TextField
                            fullWidth
                            margin="normal"
                            type="date"
                            label="Date"
                            name="date"
                            value={formData.date}
                            onChange={handleInputChange}
                            InputLabelProps={{ shrink: true }}
                        />
                        <TextField
                            fullWidth
                            margin="normal"
                            type="text"
                            label="Total Price"
                            name="totalPrice"
                            value={formData.totalPrice}
                            onChange={handleInputChange}

                        />

                        {formData.sizes.map((size, index) => (
                            <Box key={index} sx={{ display: 'flex', gap: 2, mt: 2 }}>
                                <TextField
                                    label="Size"
                                    name="size"
                                    value={size.size}
                                    onChange={(e) => handleInputChange(e, index)}
                                />
                                <TextField
                                    label="Quantity"
                                    name="quantity"
                                    type="number"
                                    value={size.quantity}
                                    onChange={(e) => handleInputChange(e, index)}
                                />
                                {index > 0 && (
                                    <IconButton onClick={() => handleRemoveSize(index)}>
                                        <RemoveIcon />
                                    </IconButton>
                                )}
                                {index === formData.sizes.length - 1 && (
                                    <IconButton onClick={handleAddSize}>
                                        <AddIcon />
                                    </IconButton>
                                )}
                            </Box>
                        ))}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} /> : 'Submit'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default NewOrderPage;