import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, IconButton, Badge, Box, Button, Stack, Drawer, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import StoreIcon from '@mui/icons-material/Store';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import { UserContext } from '../components/userProvider';

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { logout } = useContext(UserContext);

  // Check if user is logged in and if the user is a manager
  const token = localStorage.getItem('token');
  const isLoggedIn = token ? true : false;
  const isManager = token ? JSON.parse(atob(token.split('.')[1])).profile_type === 'manager' : false;

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    logout();
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <List>
        <ListItem button component={Link} to="/">
          <ListItemIcon>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText primary="Home" />
        </ListItem>
        <ListItem button component={Link} to="/about">
          <ListItemIcon>
            <InfoIcon />
          </ListItemIcon>
          <ListItemText primary="About" />
        </ListItem>
        <ListItem button component={Link} to="/catalog">
          <ListItemIcon>
            <StoreIcon />
          </ListItemIcon>
          <ListItemText primary="Products" />
        </ListItem>
        <ListItem button component={Link} to="/contact">
          <ListItemIcon>
            <ContactMailIcon />
          </ListItemIcon>
          <ListItemText primary="Contact" />
        </ListItem>
        {/* Add Order List link if manager */}
        {isLoggedIn && isManager && (
          <ListItem button component={Link} to="/orderList">
            <ListItemIcon>
              <InfoIcon /> {/* You can change this to a more appropriate icon */}
            </ListItemIcon>
            <ListItemText primary="Order List" />
          </ListItem>
        )}
      </List>
    </Box>
  );

  return (
    <AppBar position="static" sx={{ bgcolor: '#D2B48C' }}>
      <Toolbar>
        {/* Logo and Branding */}
        <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            <img src="src/assets/IsraeliFarm.png" alt="Logo" style={{ height: 50, marginRight: 3 }} />
          </Link>
          <Typography variant="h6" noWrap color="green" fontFamily="cursive">
            Israeli Farm
          </Typography>
        </Box>

        {/* Navigation Menu - Desktop */}
        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'block' } }}>
          <Stack direction="row" spacing={2} justifyContent="center">
            <Button color="inherit" startIcon={<HomeIcon />} component={Link} to="/">
              Home
            </Button>
            <Button color="inherit" startIcon={<InfoIcon />} component={Link} to="/about">
              About
            </Button>
            <Button color="inherit" startIcon={<StoreIcon />} component={Link} to="/catalog">
              Products
            </Button>
            {/* Add Order List button if manager */}
            {isLoggedIn && isManager && (
              <Button color="inherit" startIcon={<InfoIcon />} component={Link} to="/orderList">
                Order List
              </Button>
            )}
          </Stack>
        </Box>

        {/* Mobile Menu Toggle */}
        <Box sx={{ display: { xs: 'block', md: 'none' } }}>
          <IconButton color="inherit" onClick={handleDrawerToggle}>
            <MenuIcon />
          </IconButton>
        </Box>

        {/* User Account Links and Cart */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton color="inherit" component={Link} to="/cart">
            <Badge badgeContent={0} color="error">
              <ShoppingCartIcon />
            </Badge>
            <Typography variant="body1" sx={{ ml: 1 }}>
              Cart
            </Typography>
          </IconButton>
          {isLoggedIn ? (
            <>
              {!isManager && (
                <Button color="inherit" component={Link} to="/profile">
                  Profile
                </Button>
              )}
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <IconButton color="inherit" component={Link} to="/login">
              <AccountCircleIcon />
              <Typography variant="body1" sx={{ ml: 1 }}>
                Login
              </Typography>
            </IconButton>
          )}
        </Box>
      </Toolbar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, 
        }}
      >
        {drawer}
      </Drawer>
    </AppBar>
  );
};

export default Header;
