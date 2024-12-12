import React, { useState, useEffect, useContext } from 'react';
import { Typography, Button, Box } from '@mui/material';
import { UserContext } from '../components/userProvider';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [error, setError] = useState(null);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const fetchCartItems = async () => {
    try {
      const response = await api.get('/api/cart');
      setCartItems(response.data);
    } catch (error) {
      console.error('Error fetching cart items:', error);
      setError('Failed to load cart items. Please try again.');
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  const handleUpdateQuantity = async (productId, newQuantity) => {
    try {
      await api.put(`/api/cart/update/${productId}`, { quantity: newQuantity });
      fetchCartItems(); // Refresh cart items after update
      const cart = JSON.parse(localStorage.getItem('cart'));
      
      if (cart[productId]) {
        if (newQuantity > 0) {
          cart[productId].quantity = newQuantity;
        } else {
          // If quantity is 0 or less, remove the product
          delete cart[productId];
        }
        localStorage.setItem('cart', JSON.stringify(cart));
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
      setError('Failed to update quantity. Please try again.');
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      await api.delete(`/api/cart/remove/${productId}`);
      fetchCartItems();
      // Remove the item from the local storage
      const cart = JSON.parse(localStorage.getItem('cart'));
      delete cart[productId];
      localStorage.setItem('cart', JSON.stringify(cart));
    } catch (error) {
      console.error('Error removing item:', error);
      setError('Failed to remove item. Please try again.');
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  return (
    <Box minHeight="100vh">
      <main>
        <Typography variant="h4" component="h4" sx={{ color: '#D2B48C' }}>
          Your Cart
        </Typography>
        {error && <Typography sx={{ color: 'red' }}>{error}</Typography>}
        {cartItems.length === 0 ? (
          <Typography sx={{ color: "black" }}>Your cart is empty.</Typography>
        ) : (
          <Box>
            {cartItems.map((item) => (
              <Box key={item.serialNumber} sx={{
                bgcolor: 'rgba(255, 255, 255, 0.8)',
                padding: 0.3,
                margin: 2,
                borderRadius: 2,
            }}>
                <Typography variant="h6" component="h3" sx={{ color: '#D2B48C' }}>
                  {item.name}
                </Typography>
                <Typography sx={{ color: '#D2B48C' }}>Price: ${item.price}</Typography>
                <Typography sx={{ color: '#D2B48C' }}>Quantity:</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Button
                    onClick={() => handleUpdateQuantity(item.serialNumber, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    -
                  </Button>
                  <input 
                    type="number" 
                    value={item.quantity} 
                    onChange={(e) => handleUpdateQuantity(item.serialNumber, e.target.value)}
                    min="1"
                    style={{ width: '50px', textAlign: 'center' }}
                  />
                  <Button
                    onClick={() => handleUpdateQuantity(item.serialNumber, parseInt(item.quantity) + 1)}
                    disabled={item.quantity >= item.stock}
                  >
                    +
                  </Button>
                </Box>
                <Button onClick={() => handleRemoveItem(item.serialNumber)}>Remove</Button>
              </Box>
            ))}
            <Typography variant="h6" component="h3" sx={{ color: '#D2B48C' }}>
              Total: ${calculateTotal()}
            </Typography>
            <Button onClick={() => navigate('/order')}>To order</Button>
          </Box>
        )}
      </main>
    </Box>
  );
}

export default CartPage;
