const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const app = express();
const path = require('path');
const errorHandler = require('./middleware/errorMiddleware');
dotenv.config();

app.use(errorHandler);
app.use(cors());
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

const authRoutes = require('./routes/authRoute');
const productRoute = require('./routes/productRoute');
const orderRoute = require('./routes/orderRoute');
const cartRoutes = require('./routes/cartRoute');
const userRoutes = require('./routes/userRoute');

app.use('/images', express.static(path.join(__dirname, 'images')));

// Routes
app.use('/users', userRoutes);
app.use('/api/orders', orderRoute);
app.use('/auth', authRoutes);
app.use('/api/products', productRoute);
app.use('/api/orders', orderRoute);
app.use('/api/cart', cartRoutes);


// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

