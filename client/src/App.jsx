import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '../src/components/theme';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ManagerPage from '../src/components/managerPage';
import CatalogPage from './pages/CatalogPage';
import CartPage from './pages/cartPage';
import AboutPage from './pages/AboutPage';
import OrderPage from './pages/OrderPage';
import ProfilePage from './pages/ProfilePage';
import Footer from './components/Footer';
import Header from './components/Header';
import OrdersPage from './pages/OrdersListPage';
import { Box } from '@mui/material';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* מחיל סטיילים גלובליים כמו איפוס סגנונות ברירת מחדל */}
      <Router>
        <Header /> {/* ה-Header חייב להיות בתוך ה-Router */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
            backgroundImage: 'url(https://res.cloudinary.com/bizportal/image/upload/f_auto,q_auto/v1609665178/giflib/news/rsPhoto/sz_192/rsz_615_346_soy802349002.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <Box sx={{ flexGrow: 1 }}> {/* תיבת תוכן עיקרית שתגדל ותשאיר מקום ל-Footer */}
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/manager" element={<ManagerPage />} />
              <Route path="/catalog" element={<CatalogPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/order" element={<OrderPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path= "/orderList" element={<OrdersPage />} />
            </Routes>
          </Box>
          <Footer /> {/* הוספת ה-Footer בתחתית העמוד */}
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
