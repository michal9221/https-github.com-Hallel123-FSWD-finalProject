import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import videoSrc from '../assets/videos/video.mp4'; // ייבוא הסרטון

const About = () => {
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
            maxWidth: 600,
            width: '100%',
          }}
        >
          <Typography variant="h4" component="h2" sx={{ color: '#D2B48C' }} gutterBottom>
            Welcome to Our Website!
          </Typography>
          <Typography variant="body1" paragraph>
            The home of the freshest and highest quality Israeli fruits and vegetables. We take pride in bringing you locally sourced produce, carefully selected directly from the fields and orchards of Israeli farmers, with an emphasis on quality, freshness, and sustainability.
          </Typography>
          <Typography variant="body1" paragraph>
            On our website, you will find a wide variety of fruits and vegetables, both seasonal and year-round, all from local farms that represent the best of Israeli agricultural produce. We are committed to promoting sustainable Israeli farming and spreading the values of supporting the local economy and protecting the environment.
          </Typography>
          <Typography variant="body1" paragraph>
            Every fruit and vegetable on our site is carefully chosen to ensure that you receive the best products. Our produce comes to you directly from the farmers, ensuring exceptional freshness and uncompromising quality.
          </Typography>
          <Typography variant="body1" paragraph>
            We believe in the personal connection between the farmer and the customer. Therefore, we strive to provide a shopping experience tailored to each customer, with personalized and professional service, and complete transparency about the origin of our products.
          </Typography>
          <Typography variant="body1" paragraph>
            Thank you for choosing us, and we invite you to enjoy the abundance of Israeli nature, straight from the field to your home. We are here to serve you with a smile and bring you the best flavors our country has to offer.
          </Typography>
          
          {/* הוספת הסרטון */}
          <Box
            sx={{
              position: 'relative',
              paddingTop: '56.25%', // יחס גובה-רוחב של 16:9
              marginTop: 4,
              borderRadius: 2,
              overflow: 'hidden',
              boxShadow: 3,
              width: '100%',  // מלא את רוחב המיכל
              height: 0,      // נדרש כדי לשמור על יחס גובה-רוחב
            }}
          >
            <video
              src={videoSrc}
              title="לומדים שמות של פירות וירקות"
              controls
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                borderRadius: 'inherit',
              }}
            ></video>
          </Box>
          
        </Box>
      </Box>
    </Box>
  );
};

export default About;
