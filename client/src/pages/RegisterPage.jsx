import React, { useState, useContext } from 'react';
import { UserContext } from '../components/userProvider';
import { Button, TextField, Container, Typography, Box, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';


function RegisterPage() {

  const { saveUser } = useContext(UserContext);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    paymentDetails: '',
    ID: '',
    profile_type: 'regular',
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    const tempErrors = {};
    if (!formData.fullName) tempErrors.fullName = "Full Name is required";
    if (!formData.email) tempErrors.email = "Email is required";
    if (!formData.password) tempErrors.password = "Password is required";
    if (formData.password !== formData.confirmPassword) tempErrors.confirmPassword = "Passwords do not match";
    if (!formData.paymentDetails) tempErrors.paymentDetails = "Payment Details are required";
    if (!formData.ID) tempErrors.ID = "ID is required";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      const response = await api.post('/auth/signup', formData);
      alert('Registration successful. Welcome!');
      //save token in local storage
      localStorage.setItem('token', response.data.token);
      //save user in context
      saveUser(response.data.user);
      const responseCart = await api.get('/api/cart');
      localStorage.setItem('cart', JSON.stringify(responseCart.data));
      navigate('/catalog');
    } catch (error) {
      console.error('Sign up error:', error.response?.data?.error || error.message);
      setErrors({ ...errors, server: error.response?.data?.error || 'An error occurred during sign up' });
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
          <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#D2B48C' }}>
            Register
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              name="fullName"
              label="Full Name"
              fullWidth
              value={formData.fullName}
              onChange={handleChange}
              error={!!errors.fullName}
              helperText={errors.fullName}
              margin="normal"
            />
            <TextField
              name="email"
              label="Email"
              fullWidth
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
              margin="normal"
            />
            <TextField
              name="password"
              label="Password"
              type="password"
              fullWidth
              value={formData.password}
              onChange={handleChange}
              error={!!errors.password}
              helperText={errors.password}
              margin="normal"
            />
            <TextField
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              fullWidth
              value={formData.confirmPassword}
              onChange={handleChange}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
              margin="normal"
            />
            <TextField
              name="paymentDetails"
              label="Payment Details"
              fullWidth
              value={formData.paymentDetails}
              onChange={handleChange}
              error={!!errors.paymentDetails}
              helperText={errors.paymentDetails}
              margin="normal"
            />
            <TextField
              name="ID"
              label="ID"
              fullWidth
              value={formData.ID}
              onChange={handleChange}
              error={!!errors.ID}
              helperText={errors.ID}
              margin="normal"
            />
            <TextField
              name="profile_type"
              label="Profile Type"
              select
              fullWidth
              value={formData.profile_type}
              onChange={handleChange}
              margin="normal"
            >
              <MenuItem value="regular">Regular</MenuItem>
              <MenuItem value="institution">Institution</MenuItem>
            </TextField>
            <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 3 }}>
              Register
            </Button>
          </form>
        </Box>
      </Box>
    </Box>
  );
}

export default RegisterPage;
