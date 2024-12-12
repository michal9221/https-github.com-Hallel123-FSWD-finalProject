import React, { useState, useEffect } from 'react';
import { useContext } from 'react';
import { Button, TextField, Container, Typography, Grid, Box } from '@mui/material';
import * as jwtDecode from 'jwt-decode'; // השתמש ב-import * as
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../components/userProvider';


const ProfilePage = () => {
    const [userData, setUserData] = useState({
        email: '',
        paymentDetails: '',
        ID: '',
        fullName: '',
        profile_type: 'regular',
    });

    const {  getUser } = useContext(UserContext);
    const navigate = useNavigate();

    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({ ...userData });

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const user=getUser();
            setUserData(user);
            setFormData(user);
        } else {
            alert('No user connected');
            navigate('/login');
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleUpdate = (e) => {
        e.preventDefault();
        setUserData(formData);
        
        setEditMode(false);
        alert('Profile updated');
    };

    return (
        <Box display="flex" flexDirection="column" minHeight="100vh">
            <Container component="main" maxWidth="md" sx={{ flexGrow: 1, py: 3 }}>
                <Box
                    sx={{
                        bgcolor: 'rgba(255, 255, 255, 0.8)',
                        padding: 3,
                        margin: 2,
                        borderRadius: 2,
                        boxShadow: 3,
                    }}
                >
                    <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#D2B48C' }}>
                        User Profile
                    </Typography>
                    <form onSubmit={handleUpdate}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    name="email"
                                    label="Email"
                                    fullWidth
                                    value={formData.email}
                                    onChange={handleChange}
                                    disabled={!editMode}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    name="paymentDetails"
                                    label="Payment Details"
                                    fullWidth
                                    value={formData.paymentDetails}
                                    onChange={handleChange}
                                    disabled={!editMode}
                                    required
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    name="fullName"
                                    label="Full Name"
                                    fullWidth
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    disabled={!editMode}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    name="profile_type"
                                    label="Profile Type"
                                    fullWidth
                                    value={formData.profile_type}
                                    onChange={handleChange}
                                    disabled={!editMode}
                                    required
                                />
                            </Grid>
                            {editMode && (
                                <Grid item xs={12}>
                                    <Button type="submit" variant="contained" color="primary">
                                        Update Profile
                                    </Button>
                                </Grid>
                            )}
                        </Grid>
                        {!editMode && (
                            <Button
                                onClick={() => setEditMode(true)}
                                variant="contained"
                                color="secondary"
                                sx={{ mt: 2 }}
                            >
                                Edit Profile
                            </Button>
                        )}
                    </form>
                </Box>
            </Container>
        </Box>
    );
};

export default ProfilePage;
