import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from '../components/userProvider';
import {  TextField, Button, Typography, Box, Link as MuiLink } from '@mui/material';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';


function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const { saveUser } = useContext(UserContext);

  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await api.post('/auth/login', { email, password });
      
      const { user, token } = response.data;

      // Store the token in localStorage
      localStorage.setItem('token', token);

      // Save user details in context
      saveUser(user);

      //get the user cart to the local storage
      const responseCart = await api.get('/api/cart');
      localStorage.setItem('cart', JSON.stringify(responseCart.data));


      navigate('/catalog');
    } catch (error) {
      console.error('Login error:', error);
      if (error.response) {
        switch (error.response.status) {
          case 404:
            setError("The user is not in the system");
            break;
          case 401:
            setError("The password is incorrect, please try again");
            break;
          default:
            setError("Login failed, please try again");
        }
      } else {
        setError('Server error, please try again later');
      }
    }
  };

  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <Box
        component="main"
        flexGrow={1}
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        textAlign="center"
        padding={3}
        
      >
        <Box
          sx={{
            bgcolor: 'rgba(255, 255, 255, 0.8)',
            padding: 5,
            margin: 2,
            borderRadius: 2,
            boxShadow: 3,
            maxWidth: 600,
            width: '100%',
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom>
            Login
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              label="Email"
              fullWidth
              margin="normal"
              required
            />
            <TextField
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              label="Password"
              fullWidth
              margin="normal"
              required
            />
            {error && <Typography color="error" variant="body2" sx={{ mt: 2 }}>{error}</Typography>}
            <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 3 }}>
              Login
            </Button>
          </form>
          <Typography variant="body2" color="textSecondary" marginTop={3}>
          Don't have an account yet?{' '}
            <MuiLink href="/register" sx={{ color: '#1976D2' }}>
            Register here
            </MuiLink>
          </Typography>
          <Typography variant="body2" color="textSecondary" marginTop={3}>
            Manager?{' '}
            <MuiLink href="/Manager" sx={{ color: '#1976D2' }}>
              Click here
            </MuiLink>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default LoginPage;
