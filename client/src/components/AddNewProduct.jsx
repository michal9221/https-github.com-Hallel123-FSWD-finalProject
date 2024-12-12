import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Grid,
    Box,
    Avatar,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    InputAdornment
} from '@mui/material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import api from '../services/api';

function AddNewProduct({ open, onClose, setError, setProducts }) {
    const [newProduct, setNewProduct] = useState({
        name: '',
        price: '',
        quantityInStock: '',
        verbalDescription: '',
        category: '',
    });
    const [image, setImage] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleInputChange = (e) => {
        setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
    };


    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file);
    
        if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
            setPreviewImage(reader.result);
          };
          reader.readAsDataURL(file);
        } else {
            setPreviewImage(null);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);

        //check if name, price, quantityInStock are filled
        if (!newProduct.name || !newProduct.price || !newProduct.quantityInStock) {
            alert('Please fill in all required fields');
            return;
        }

        const formData = new FormData();
        for (const key in newProduct) {
            formData.append(key, newProduct[key]);
        }
        if (image) {
            formData.append('image', image);
        }

        try {
            const response = await api.post('/api/products', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            onClose();
            setPreviewImage(null);
            setProducts(prevProducts => [...prevProducts, response.data]);
            alert('Product added successfully!');
        } catch (error) {
            console.error('Error adding product:', error);
            setError(error.response?.data?.error || 'Failed to add product');
        }
    };


    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white' }}>
                Add New Product
            </DialogTitle>
            <DialogContent dividers>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <Box sx={{ position: 'relative', width: '100%', paddingTop: '100%', bgcolor: 'grey.200', borderRadius: 1 }}>
                            <Avatar
                                src={previewImage}
                                alt="Product Preview"
                                variant="rounded"
                                sx={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover'
                                }}
                            >
                                {!previewImage && <AddPhotoAlternateIcon sx={{ width: '50%', height: '50%' }} />}
                            </Avatar>
                            <label htmlFor="image">
                                <input
                                    accept="image/*"
                                    id="image"
                                    type="file"
                                    name="image"
                                    style={{ display: 'none' }}
                                    onChange={handleImageChange}
                                />
                                <Button
                                    variant="contained"
                                    component="span"
                                    startIcon={<AddPhotoAlternateIcon />}
                                    sx={{
                                        position: 'absolute',
                                        bottom: 8,
                                        right: 8
                                    }}
                                >
                                    Choose Image
                                </Button>
                            </label>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            margin="normal"
                            label="Product Name"
                            name="name"
                            value={newProduct.name}
                            onChange={handleInputChange}
                        />
                        <TextField
                            fullWidth
                            margin="normal"
                            label="Price"
                            name="price"
                            type="number"
                            value={newProduct.price}
                            onChange={handleInputChange}
                            InputProps={{
                                startAdornment: <InputAdornment position="start">$</InputAdornment>,
                            }}
                        />
                        <TextField
                            fullWidth
                            margin="normal"
                            label="Initial Stock"
                            name="quantityInStock"
                            type="number"
                            value={newProduct.quantityInStock}
                            onChange={handleInputChange}
                        />
                        <FormControl fullWidth margin="normal">
                            <InputLabel>Category</InputLabel>
                            <Select
                                name="category"
                                value={newProduct.category}
                                onChange={handleInputChange}
                                label="Category"
                            >
                                <MenuItem value="fruits">Fruits</MenuItem>
                                <MenuItem value="vegetables">Vegetables</MenuItem>
                                <MenuItem value="other">Other</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField
                            fullWidth
                            margin="normal"
                            label="Description"
                            name="verbalDescription"
                            multiline
                            rows={4}
                            value={newProduct.verbalDescription}
                            onChange={handleInputChange}
                        />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'flex-end', padding: 2 }}>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleSubmit} variant="contained" color="primary">
                    Add Product
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default AddNewProduct;

