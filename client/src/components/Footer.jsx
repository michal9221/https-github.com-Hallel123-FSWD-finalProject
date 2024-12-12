import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Container, Grid, Typography, List, ListItem, ListItemText, IconButton } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

const Footer = () => {
  return (
    <Box component="footer" sx={{ backgroundColor: '#D2B48C', color: 'white', py: 4, mt: 'auto' }}>
      <Container maxWidth="lg">
        <Grid container spacing={4} justifyContent="space-around">
          {/* Contact Information */}
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>Contact Us</Typography>
            <Typography>Phone: 055-5555555</Typography>
            <Typography>Email: israely@gmail.com</Typography>
            <Typography>Address: 123 Israeli farm, Jerusalem, Israel</Typography>
          </Grid>

          {/* Social Media Links */}
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>Follow Us</Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
              <IconButton component="a" href="https://facebook.com" target="_blank" rel="noopener noreferrer" sx={{ color: 'white' }}>
                <FacebookIcon />
              </IconButton>
              <IconButton component="a" href="https://twitter.com" target="_blank" rel="noopener noreferrer" sx={{ color: 'white' }}>
                <TwitterIcon />
              </IconButton>
              <IconButton component="a" href="https://linkedin.com" target="_blank" rel="noopener noreferrer" sx={{ color: 'white' }}>
                <LinkedInIcon />
              </IconButton>
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>Quick Links</Typography>
            <List>
              <ListItem disablePadding>
                <ListItemText primary={<Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Home</Link>} />
              </ListItem>
              <ListItem disablePadding>
                <ListItemText primary={<Link to="/about" style={{ color: 'white', textDecoration: 'none' }}>About Us</Link>} />
              </ListItem>
              <ListItem disablePadding>
                <ListItemText primary={<Link to="/services" style={{ color: 'white', textDecoration: 'none' }}>Services</Link>} />
              </ListItem>
              <ListItem disablePadding>
                <ListItemText primary={<Link to="/contact" style={{ color: 'white', textDecoration: 'none' }}>Contact</Link>} />
              </ListItem>
            </List>
          </Grid>
        </Grid>
        
        {/* Copyright and Legal Links */}
        <Box sx={{ borderTop: '1px solid white', pt: 2, mt: 3, textAlign: 'center' }}>
          <Typography variant="body2">&copy; {new Date().getFullYear()} תוצרת ישראלית. כל הזכויות שמורות</Typography>
          <List sx={{ display: 'flex', justifyContent: 'center', mt: 1, p: 0 }}>
            <ListItem disablePadding>
              <ListItemText primary={<Link to="/privacy" style={{ color: 'white', textDecoration: 'none', margin: '0 10px' }}>Privacy Policy</Link>} />
            </ListItem>
            <ListItem disablePadding>
              <ListItemText primary={<Link to="/terms" style={{ color: 'white', textDecoration: 'none', margin: '0 10px' }}>Terms of Service</Link>} />
            </ListItem>
          </List>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
