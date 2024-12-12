import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    CircularProgress,
    Alert,
    Box,
    TextField,
    Select,
    MenuItem,
    InputAdornment,
    IconButton,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import api from '../services/api';
import Header from '../components/Header';
import Footer from '../components/Footer';

function OrdersPage() {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('all');

    useEffect(() => {
        fetchOrders();
    }, []);

    useEffect(() => {
        filterOrders();
    }, [orders, searchTerm, selectedStatus]);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await api.get('/api/orders');
            setOrders(response.data);
        } catch (error) {
            console.error('Error fetching orders:', error);
            setError('Failed to fetch orders. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const filterOrders = () => {
        let filtered = orders.filter(order => order.status !== 'not ordered');
        
        if (searchTerm) {
            filtered = filtered.filter(order => 
                order.customerName.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (selectedStatus !== 'all') {
            filtered = filtered.filter(order => order.status === selectedStatus);
        }

        setFilteredOrders(filtered);
    };

    const handleDeleteOrder = async (orderNumber) => {
        try {
            await api.delete(`/api/orders/${orderNumber}`);
            setOrders(prevOrders => prevOrders.filter(order => order.orderNumber !== orderNumber));
            alert('Order deleted successfully');
        } catch (error) {
            console.error('Error deleting order:', error);
            setError('Failed to delete order. Please try again.');
        }
    };

    return (
        <Box display="flex" flexDirection="column" minHeight="100vh">
            <Header />
            <Box component="main" flexGrow={1} padding={3}>
                <Container>
                    <Typography variant="h4" gutterBottom>Orders</Typography>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                        <TextField
                            placeholder="Search by customer name..."
                            variant="outlined"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{ width: '70%' }}
                        />
                        <Select
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            variant="outlined"
                            sx={{ width: '25%' }}
                        >
                            <MenuItem value="all">All Statuses</MenuItem>
                            <MenuItem value="ordered">Ordered</MenuItem>
                            <MenuItem value="delivered">Delivered</MenuItem>
                            <MenuItem value="cancelled">Cancelled</MenuItem>
                        </Select>
                    </Box>
                    {loading ? (
                        <CircularProgress />
                    ) : error ? (
                        <Alert severity="error">{error}</Alert>
                    ) : (
                        <Grid container spacing={4}>
                            {filteredOrders.map((order) => (
                                <Grid item key={order.orderNumber} xs={12} sm={6} md={4}>
                                    <Card>
                                        <CardContent>
                                            <Typography variant="h6" component="div">
                                                Order #{order.orderNumber}
                                            </Typography>
                                            <Typography color="textSecondary">
                                                Customer: {order.customerName}
                                            </Typography>
                                            <Typography color="textSecondary">
                                                Date: {new Date(order.orderDate).toLocaleDateString()}
                                            </Typography>
                                            <Typography color="textSecondary">
                                                Status: {order.status}
                                            </Typography>
                                            <IconButton
                                                aria-label="delete"
                                                onClick={() => handleDeleteOrder(order.orderNumber)}
                                                sx={{ position: 'absolute', top: 8, right: 8 }}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    )}
                </Container>
            </Box>
            <Footer />
        </Box>
    );
}

export default OrdersPage;