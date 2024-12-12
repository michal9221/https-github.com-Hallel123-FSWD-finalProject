import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Typography,
    Button,
    Grid,
    Box,
    Avatar,
    InputAdornment,
    useMediaQuery,
    useTheme
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import AddToCartButton from './AddToCartButton';
import api from '../services/api';

function ProductDetails({
    open,
    onClose,
    product,
    isManager,
    editedProduct,
    handleEditField,
    handleAddToCart,
    cart,
    setProducts
}) {
    const [newImage, setNewImage] = useState(null);
    const [supplyToAdd, setSupplyToAdd] = useState(0);
    const [deleteConfirmation, setDeleteConfirmation] = useState(null);
    const [error, setError] = useState(null);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    if (!product) return null;

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setNewImage(e.target.result);
                handleEditField('picture', e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmitUpdate = async (e) => {
        e.preventDefault();
        setError(null);

        if (!editedProduct.name || !editedProduct.price || editedProduct.quantityInStock === undefined) {
            setError('Please fill in all required fields');
            return;
        }

        const formData = new FormData();
        for (const key in editedProduct) {
            formData.append(key, editedProduct[key]);
        }
        if (newImage) {
            formData.append('image', newImage);
        }

        try {
            const response = await api.put(`/api/products/${editedProduct.serialNumber}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setProducts(prevProducts => {
                const updatedProducts = prevProducts.filter(p => p.serialNumber !== editedProduct.serialNumber);
                return [...updatedProducts, response.data];
            });
            onClose();
            setNewImage(null);
            alert('Updated successfully')
        } catch (error) {
            console.error('Error updating product:', error);
            setError(error.response?.data?.error || 'Failed to update product');
        }
    };

    const handleDeleteProduct = async () => {
        try {
            await api.delete(`/api/products/${deleteConfirmation}`);
            setNewImage(null);
            setProducts(prevProducts => {
                const updatedProducts = prevProducts.filter(p => p.serialNumber !== deleteConfirmation);
                return updatedProducts;
            });
            setDeleteConfirmation(null);
            onClose();
            alert('Deleted successfully')
        } catch (error) {
            console.error('Error deleting product:', error);
            setError('Failed to delete product. Please try again.');
        }
    };

    const handleAddSupply = () => {
        const newQuantity = editedProduct.quantityInStock + supplyToAdd;
        handleEditField('quantityInStock', newQuantity);
        setSupplyToAdd(0);
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth fullScreen={fullScreen}>
            <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white', fontSize: { xs: '1.2rem', sm: '1.5rem' } }}>
                {isManager ? 'Edit Product' : 'Product Details'}
            </DialogTitle>
            <DialogContent dividers>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <Box sx={{ position: 'relative', width: '100%', paddingTop: { xs: '60%', md: '100%' }, mb: { xs: 1, md: 0 } }}>
                            <Avatar
                            
                                src={newImage || editedProduct?.picture || product.picture}
                                alt={product.name}
                                variant="rounded"
                                sx={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover'
                                }}
                            />
                            {isManager && (
                                <label htmlFor="image">
                                    <input
                                        accept="image/*"
                                        id="image"
                                        name="image"
                                        type="file"
                                        style={{ display: 'none' }}
                                        onChange={handleImageChange}
                                    />
                                    <Button
                                        variant="contained"
                                        component="span"
                                        startIcon={<EditIcon />}
                                        sx={{
                                            position: 'absolute',
                                            bottom: 8,
                                            right: 8,
                                            fontSize: { xs: '0.7rem', sm: '0.8rem' }
                                        }}
                                    >
                                        Change Image
                                    </Button>
                                </label>
                            )}
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        {isManager ? (
                            <>
                                <TextField
                                    fullWidth
                                    margin="normal"
                                    label="Name"
                                    required 
                                    value={editedProduct.name}
                                    onChange={(e) => handleEditField('name', e.target.value)}
                                    sx={{ mb: 2 }}
                                />
                                <TextField
                                    fullWidth
                                    margin="normal"
                                    label="Price"
                                    type="number"
                                    required 
                                    value={editedProduct.price}
                                    onChange={(e) => handleEditField('price', parseFloat(e.target.value))}
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                    }}
                                    sx={{ mb: 2 }}
                                />
                                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center', mb: 2 }}>
                                    <TextField
                                        label="Current Stock"
                                        type="number"
                                        required 
                                        value={editedProduct.quantityInStock}
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                        sx={{ mb: { xs: 2, sm: 0 }, mr: { sm: 2 }, width: { xs: '100%', sm: 'auto' } }}
                                    />
                                    <TextField
                                        label="Add Supply"
                                        type="number"
                                        value={supplyToAdd}
                                        onChange={(e) => setSupplyToAdd(Math.max(0, parseInt(e.target.value) || 0))}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <Button
                                                        onClick={handleAddSupply}
                                                        variant="contained"
                                                        color="primary"
                                                        size="small"
                                                        startIcon={<AddIcon />}
                                                    >
                                                        Add
                                                    </Button>
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{ width: { xs: '100%', sm: 'auto' } }}
                                    />
                                </Box>
                                <TextField
                                    fullWidth
                                    margin="normal"
                                    label="Description (Optional)"
                                    multiline
                                    rows={4}
                                    value={editedProduct.verbalDescription}
                                    onChange={(e) => handleEditField('verbalDescription', e.target.value)}
                                />
                            </>
                        ) : (
                                <>
                                <Typography variant="h4" gutterBottom sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }}>{product.name}</Typography>
                                <Typography variant="h6" color="primary" gutterBottom sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>Price: ${product.price}</Typography>
                                <Typography variant="body1" paragraph sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                                    {product.verbalDescription}
                                </Typography>
                                
                                
                                {product.quantityInStock > 0 ? (
                                    <Box mt={2}>
                                        <AddToCartButton
                                            productId={product.serialNumber}
                                            onAddToCart={(quantity) => handleAddToCart(product, quantity)}
                                            initialQuantity={cart[product.serialNumber]?.quantity || 1}
                                            isInCart={!!cart[product.serialNumber]}
                                        />
                                    </Box>
                                ) : (
                                    <Typography color="error">Out of stock</Typography>
                                )}
                                </>
                        )}
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'space-between', padding: 2, flexDirection: isMobile ? 'column' : 'row' }}>
                
                {isManager ? (
                    <>
                        <Button
                            onClick={() => setDeleteConfirmation(product.serialNumber)}
                            color="error"
                            type="button"
                            startIcon={<DeleteIcon />}
                            fullWidth={isMobile}
                            sx={{ mb: isMobile ? 1 : 0 }}
                        >
                            Delete
                        </Button>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: isMobile ? '100%' : 'auto' }}>
                            <Button onClick={onClose} sx={{ mr: 1 }}>Cancel</Button>
                            <Button onClick={handleSubmitUpdate} type="submit" variant="contained" color="primary">Update</Button>
                        </Box>
                    </>
                ) : (
                    <Button onClick={onClose} variant="contained" type="button" fullWidth={isMobile}>Close</Button>
                )}
            </DialogActions>
            {/* Delete Confirmation Dialog */}
            <Dialog open={!!deleteConfirmation} onClose={() => setDeleteConfirmation(null)}>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to delete this product?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteConfirmation(null)}>Cancel</Button>
                    <Button onClick={handleDeleteProduct} color="error">Yes, Delete</Button>
                </DialogActions>
            </Dialog>
        </Dialog>
    );
}

export default ProductDetails;