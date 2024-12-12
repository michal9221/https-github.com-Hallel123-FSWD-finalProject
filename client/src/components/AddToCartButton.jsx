import React, { useState, useEffect, useRef } from 'react';
import { Button, Popper, Paper, MenuItem, Snackbar, Alert, Box, InputBase, Typography } from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import api from '../services/api';

function AddToCartButton({ productId, onAddToCart, initialQuantity = 1, isInCart = false }) {
    const [quantity, setQuantity] = useState(initialQuantity);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [open, setOpen] = useState(false);
    const anchorRef = useRef(null);
    const dropdownRef = useRef(null);

    useEffect(() => {
        setQuantity(initialQuantity);

        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target) && 
                anchorRef.current && !anchorRef.current.contains(event.target)) {
                setOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [initialQuantity]);

    const handleAddToCart = async () => {
        try {
            await api.post('/api/orders/add-to-cart', { productId, quantity });
            setSuccess(true);
            setError(null);
            onAddToCart(quantity);
            setTimeout(() => setSuccess(false), 3000);
        } catch (error) {
            if (error.response) {
              switch (error.response.status) {
                case 400:
                  if (error.response.data.error === 'Institutions must order at least 20kg of product') {
                    alert(`As an institution, you must order at least 20kg.`);
                  } else {
                    alert(error.response.data.error || 'Invalid request. Please check your input.');
                  }
                  break;
                case 401:
                  alert('You need to be logged in to perform this action.');
                  break;
                case 403:
                  alert('You do not have permission to perform this action.');
                  break;
                case 404:
                  alert('Product not found. Please refresh the page and try again.');
                  break;
                case 500:
                  alert('An error occurred on the server. Please try again later.');
                  break;
                default:
                  alert('An unexpected error occurred. Please try again.');
              }
            } else if (error.request) {
              alert('Unable to reach the server. Please check your internet connection and try again.');
            } else {
              alert('An unexpected error occurred. Please try again.');
            }
          }
    };

    const handleQuantityChange = (newValue) => {
        if (newValue === '') {
            setQuantity('');
        } else {
            const numValue = Number(newValue);
            setQuantity(Math.max(1, numValue));
        }
    };

    const handleMenuItemClick = (value) => {
        setQuantity(value);
        setOpen(false);
    };

    const toggleDropdown = (event) => {
        event.stopPropagation();
        setOpen(prevOpen => !prevOpen);
    };

    const commonStyles = {
        width: '60px',
        height: '28px',
    };

    return (
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 0.5, position: 'relative' }}>
                <InputBase
                    value={quantity}
                    onChange={(e) => handleQuantityChange(e.target.value)}
                    inputProps={{
                        style: { 
                            ...commonStyles, 
                            padding: '0 3px 0 8px', 
                            fontSize: '0.8rem',
                            textAlign: 'center'
                        }
                    }}
                    sx={{
                        ...commonStyles,
                        mr: 0.5,
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                    }}
                    endAdornment={
                        <ArrowDropDownIcon 
                            style={{ cursor: 'pointer', fontSize: '1rem' }} 
                            onClick={toggleDropdown}
                        />
                    }
                    ref={anchorRef}
                />
                <Typography variant="caption" sx={{ fontSize: '0.65rem' }}>kg</Typography>
                <Popper 
                    open={open} 
                    anchorEl={anchorRef.current} 
                    placement="bottom-start" 
                    style={{ zIndex: 1500 }}
                    ref={dropdownRef}
                >
                    <Paper style={{ maxHeight: 200, overflow: 'auto' }}>
                        {[...Array(20)].map((_, i) => (
                            <MenuItem key={i + 1} onClick={() => handleMenuItemClick(i + 1)}>
                                {i + 1}
                            </MenuItem>
                        ))}
                    </Paper>
                </Popper>
            </Box>
            <Button
                variant="contained"
                color={isInCart ? "success" : "primary"}
                onClick={handleAddToCart}
                sx={{
                    ...commonStyles,
                    minWidth: 'unset',
                    padding: 0,
                }}
            >
                {isInCart ? <ShoppingCartIcon fontSize="small" /> : <AddShoppingCartIcon fontSize="small" />}
            </Button>
            <Snackbar 
                open={success || !!error} 
                autoHideDuration={3000} 
                onClose={() => { 
                    setSuccess(false); 
                    setError(null); 
                }}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert 
                    severity={success ? "success" : "error"} 
                    sx={{ width: '100%' }}
                >
                    {success ? "Added to cart!" : error}
                </Alert>
            </Snackbar>
        </Box>
    );
}

export default AddToCartButton;