import React, { useState, useEffect, useCallback } from 'react';
import { Container, Typography, Grid, Card, CardMedia, CardContent, CircularProgress, Alert, Box, TextField, Select, MenuItem, InputAdornment, Button } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AddIcon from '@mui/icons-material/Add';
import api from '../services/api';
import AddToCartButton from '../components/AddToCartButton';
import ProductDetails from '../components/ProductDetails';
import AddNewProduct from '../components/AddNewProduct';
import SearchIcon from '@mui/icons-material/Search';

function CatalogPage() {
    const [allProducts, setAllProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [cart, setCart] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isManager, setIsManager] = useState(false);
    const [editedProduct, setEditedProduct] = useState(null);
    const [deleteConfirmation, setDeleteConfirmation] = useState(null);
    const [isAddProductDialogOpen, setIsAddProductDialogOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    const fetchProducts = useCallback(async (pageNumber = 1) => {
        if (!hasMore && pageNumber !== 1) return;
    
        try {
            setIsLoadingMore(true);
            const response = await api.get('/api/products/loadProducts', {
                params: { page: pageNumber, limit: 12 }
            });
            const fetchedProducts = response.data.products;
            
            setAllProducts(prev => pageNumber === 1 ? fetchedProducts : [...prev, ...fetchedProducts]);
            setHasMore(fetchedProducts.length === 12 && fetchedProducts.length > 0);
            setPage(pageNumber);
        } catch (error) {
            console.error('Error fetching products:', error);
            setError('Failed to fetch products. Please try again later.');
        } finally {
            setIsLoadingMore(false);
            setLoading(false);
        }
    }, [hasMore]);

    useEffect(() => {
        fetchProducts();
        loadCartFromLocalStorage();
        checkUserRole();
    }, [fetchProducts]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
                    fetchProducts(page + 1);
                }
            },
            { threshold: 1 }
        );
    
        const sentinel = document.querySelector('#sentinel');
        if (sentinel && hasMore) {
            observer.observe(sentinel);
        }
    
        return () => {
            if (sentinel) {
                observer.unobserve(sentinel);
            }
        };
    }, [hasMore, isLoadingMore, page, fetchProducts]);

    useEffect(() => {
        let filtered = allProducts;
    
        // Apply search filter
        if (searchTerm) {
            filtered = filtered.filter(product =>
                product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.verbalDescription.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
    
        // Apply category filter
        if (selectedCategory !== 'all') {
            filtered = filtered.filter(product => product.category === selectedCategory);
        }
    
        setFilteredProducts(filtered);

    }, [allProducts, searchTerm, selectedCategory]);

    const checkUserRole = () => {
        const token = localStorage.getItem('token');
        if (token) {
            const decodedToken = JSON.parse(atob(token.split('.')[1]));
            setIsManager(decodedToken.profile_type === 'manager');
        }
    };

    const loadCartFromLocalStorage = () => {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            setCart(JSON.parse(savedCart));
        }
    };

    const saveCartToLocalStorage = (updatedCart) => {
        localStorage.setItem('cart', JSON.stringify(updatedCart));
    };

    const handleAddToCart = (product, quantity) => {
        const updatedCart = { ...cart };
        if (updatedCart[product.serialNumber]) {
            updatedCart[product.serialNumber].quantity += quantity;
        } else {
            updatedCart[product.serialNumber] = { ...product, quantity };
        }
        setCart(updatedCart);
        saveCartToLocalStorage(updatedCart);
    };

    const handleProductClick = (product) => {
        setSelectedProduct(product);
        if (isManager) {
            setEditedProduct({ ...product });
        }
    };

    const handleCloseProductDialog = () => {
        setSelectedProduct(null);
        setEditedProduct(null);
    };

    const handleEditField = (field, value) => {
        setEditedProduct(prev => ({ ...prev, [field]: value }));
    };

    return (
        <Box display="flex" flexDirection="column" minHeight="100vh">
            <Box
                sx={{
                    bgcolor: 'rgba(255, 255, 255, 0.8)',
                    padding: 0.3,
                    margin: 2,
                    borderRadius: 2,
                }}
            >
                <Container>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                        <Typography variant="h4">Product Catalog</Typography>
                        {isManager && (
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<AddIcon />}
                                onClick={() => setIsAddProductDialogOpen(true)}
                            >
                                Add New Product
                            </Button>
                        )}
                    </Box>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                        <TextField
                            placeholder="Search products..."
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
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            variant="outlined"
                            sx={{ width: '25%' }}
                        >
                            <MenuItem value="all">All Categories</MenuItem>
                            <MenuItem value="fruits">Fruits</MenuItem>
                            <MenuItem value="vegetables">Vegetables</MenuItem>
                            <MenuItem value="other">Other</MenuItem>
                        </Select>
                    </Box>
                    {loading ? (
                        <CircularProgress />
                    ) : error ? (
                        <Alert severity="error">{error}</Alert>
                    ) : (
                        <>
                            <Grid container spacing={4}>
                                {filteredProducts.map((product) => (
                                    <Grid item key={product.serialNumber} xs={6} sm={4} md={3}>
                                        <Card sx={{
                                            bgcolor: product.quantityInStock === 0 ? 'lightgrey' : 'white',
                                            position: 'relative',
                                            height: '100%',
                                            display: 'flex',
                                            aspectRatio: '1 / 1',
                                            flexDirection: 'column'
                                        }}>
                                            <CardMedia
                                                component="img"
                                                height="160"
                                                image={product.picture}
                                                alt={product.name}
                                                sx={{ cursor: 'pointer' }}
                                                onClick={() => handleProductClick(product)}
                                            />
                                            {cart[product.serialNumber] && (
                                                <Box
                                                    sx={{
                                                        position: 'absolute',
                                                        top: 8,
                                                        right: 8,
                                                        bgcolor: 'rgba(255, 255, 255, 0.8)',
                                                        borderRadius: '50%',
                                                        padding: '4px'
                                                    }}
                                                >
                                                    <ShoppingCartIcon color="success" />
                                                </Box>
                                            )}
                                            <CardContent sx={{
                                                flexGrow: 1,
                                                display: 'flex',
                                                flexDirection: 'column',
                                                justifyContent: 'space-between',
                                                p: 1,
                                                '&:last-child': { pb: 1 }
                                            }}>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexGrow:1 }}>
                                                    <Box>
                                                        <Typography
                                                            gutterBottom
                                                            variant="subtitle1"
                                                            component="div"
                                                            sx={{
                                                                cursor: 'pointer',
                                                                fontWeight: 'bold',
                                                                mb: 0.5,
                                                                fontFamily: '"Comic Sans MS", "Rounded Mplus 1c", sans-serif',
                                                                fontSize: '1.1rem'
                                                            }}
                                                            onClick={() => handleProductClick(product)}
                                                        >
                                                            {product.name}
                                                        </Typography>
                                                        <Typography variant="body2">${product.price}</Typography>
                                                    </Box>
                                                    {isManager ? (
                                                        <Typography variant="caption" sx={{ fontSize: '0.6rem', lineHeight: 1 }} color={product.quantityInStock === 0 ? 'error' : 'textPrimary'}>
                                                            {product.quantityInStock === 0 ? 'Missing' : `In stock: ${product.quantityInStock}`}
                                                        </Typography>
                                                    ) : product.quantityInStock === 0 ? (
                                                        <Typography color="error">Out of stock</Typography>
                                                    ) : null}
                                                    {!isManager && product.quantityInStock > 0 && (
                                                        <AddToCartButton
                                                            productId={product.serialNumber}
                                                            onAddToCart={(quantity) => handleAddToCart(product, quantity)}
                                                            initialQuantity={cart[product.serialNumber]?.quantity || 1}
                                                            isInCart={!!cart[product.serialNumber]}
                                                        />
                                                    )}
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                            {hasMore && !isLoadingMore && <div id="sentinel" style={{ height: '10px' }}></div>}
                            {isLoadingMore && <CircularProgress />}
                        </>
                    )}
                </Container>
            </Box>

            <ProductDetails
                open={!!selectedProduct}
                onClose={handleCloseProductDialog}
                product={selectedProduct}
                isManager={isManager}
                editedProduct={editedProduct}
                handleEditField={handleEditField}
                handleAddToCart={handleAddToCart}
                cart={cart}
            />

            <AddNewProduct
                open={isAddProductDialogOpen}
                onClose={() => setIsAddProductDialogOpen(false)}
                setError={setError}
                setProducts={setAllProducts} // עדכון כאן
            />
        </Box>
    );
}

export default CatalogPage;
