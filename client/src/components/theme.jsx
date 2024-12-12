import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // צבע הכפתורים והמקטעים העיקריים
    },
    secondary: {
      main: '#D2B48C', // צבע הטקסט ב-Typography והפרטים המשניים
    },
    text: {
      primary: '#333333', // צבע טקסט העיקרי
      secondary: '#555555', // צבע טקסט המשני
    },
    background: {
      default: '#f5f5f5', // צבע רקע דפים
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
      color: '#D2B48C', // צבע כתום לכותרת H4
    },
    h5: {
      fontWeight: 600,
      color: '#333333', // צבע כותרת H5
    },
    body2: {
      color: '#555555', // צבע טקסט משני
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none', // ביטול אותיות גדולות בכפתורים
          borderRadius: '8px', // פינות מעוגלות
          padding: '8px 16px', // גודל padding סטנדרטי לכפתורים
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)', // צל עדין לכרטיסים
          borderRadius: '8px', // פינות מעוגלות
        },
      },
    },
    MuiCardMedia: {
      styleOverrides: {
        root: {
          borderRadius: '8px 8px 0 0', // תמונות עם פינות עליונות מעוגלות
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          padding: '24px',
          borderRadius: '8px',
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)', // צל לכרטיסיות
        },
      },
    },
    MuiBox: {
      styleOverrides: {
        root: {
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        },
      },
    },
    MuiMainBox: {
      styleOverrides: {
        root: {
          backgroundImage: 'url(https://res.cloudinary.com/bizportal/image/upload/f_auto,q_auto/v1609665178/giflib/news/rsPhoto/sz_192/rsz_615_346_soy802349002.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: 3,
        },
      },
    },
    MuiContentBox: {
      styleOverrides: {
        root: {
          bgcolor: 'rgba(255, 255, 255, 0.8)',
          padding: 5,
          margin: 2,
          borderRadius: 2,
          boxShadow: 3,
          maxWidth: 600,
          width: '100%',
        },
      },
    },
  },
});

export default theme;
