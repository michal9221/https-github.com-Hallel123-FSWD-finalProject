import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, TextField, Button, Typography, Box, Alert, Link as MuiLink } from '@mui/material';
import api from '../services/api';

const ManagerPage = () => {
  const [ID, setID] = useState('');
  const [adminCode, setAdminCode] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await api.post('/auth/manager-login', { ID, adminCode, password });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.manager));
      navigate('/catalog');
    } catch (error) {
      if (error.response.status === 401) {
        alert('Invalid credentials');
      } else {
        console.error('Login error:', error);
        setError(error.response?.data?.error || 'Failed to login');
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
        padding={3}
      >
        <Box
          sx={{
            bgcolor: 'rgba(255, 255, 255, 0.8)',
            padding: 5,
            margin: 2,
            borderRadius: 2,
            boxShadow: 3,
            maxWidth: 400,
            width: '100%',
          }}
        >
          <Typography variant="h4" component="h2" sx={{ color: '#D2B48C' }} gutterBottom>
            Manager Login
          </Typography>
          <form onSubmit={handleSubmit} style={{ width: '100%', marginTop: '1rem' }}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="ID"
              label="ID"
              name="ID"
              value={ID}
              onChange={(e) => setID(e.target.value)}
              autoComplete="id"
              autoFocus
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="adminCode"
              label="Admin Code"
              type="password"
              id="adminCode"
              value={adminCode}
              onChange={(e) => setAdminCode(e.target.value)}
              autoComplete="admin-code"
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
            {error && (
              <Alert severity="error" style={{ marginTop: '1rem' }}>
                {error}
              </Alert>
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 3, mb: 2 }}
            >
              Login as Manager
            </Button>
          </form>
          <Typography variant="body2" color="textSecondary" marginTop={3}>
            Not a Manager?{' '}
            <MuiLink href="/" sx={{ color: '#1976D2' }}>
              Go back to Home
            </MuiLink>
          </Typography>
        </Box>
      </Box>
    </Box>
  );

};

export default ManagerPage;
