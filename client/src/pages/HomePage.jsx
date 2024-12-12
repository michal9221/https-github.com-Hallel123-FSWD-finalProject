import React from 'react';
import { Button, Box, Typography, Link as MuiLink } from '@mui/material';

function HomePage() {
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
          <Typography variant="h4" component="h2" sx={{ color: '#D2B48C' }} gutterBottom>
            Welcome to Fruits and Vegetables made in Israel
          </Typography>
          <Typography variant="body1" color="textSecondary" paragraph>
            Discover the best produce grown locally in Israel.
          </Typography>

          <Box display="flex" justifyContent="center" gap={2} marginTop={3}>
          </Box>

          
        </Box>
      </Box>
    </Box>
  );
}

export default HomePage;
