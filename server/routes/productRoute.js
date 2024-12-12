const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const productController = require('../controllers/productController');
const { authenticateToken, isManager } = require('../middleware/authMiddleware');

//for images upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'images') 
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname))
    }
});

const upload = multer({ storage: storage });

//get all products
router.get('/', productController.getAllProducts);

//add a product (manager)
router.post('/', authenticateToken, isManager, upload.single('image'), productController.addProduct);

//apdate a product (manager)
router.put('/:id', authenticateToken, isManager, upload.single('image'), productController.updateProduct);

//delete a product (manager)
router.delete('/:id', authenticateToken, isManager, productController.deleteProduct);

// Get paginated products
router.get('/loadProducts', productController.loadProducts);

module.exports = router;

