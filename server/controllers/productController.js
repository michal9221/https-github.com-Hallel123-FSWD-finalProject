const Product = require('../models/productModel');
const fs = require('fs');
const path = require('path');

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.getAll();

    res.json(products);
  } catch (error) {
    console.error('Error in getAllProducts:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};



exports.addProduct = async (req, res) => {
  try {
    const { name, price, quantityInStock, verbalDescription, category } = req.body;
    const imagePath = req.file ? `/images/${req.file.filename}` : null;

    const newProduct = await Product.create({
      name,
      price: parseFloat(price),
      quantityInStock: parseInt(quantityInStock),
      picture: imagePath,
      verbalDescription,
      category
    });

    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ error: 'Failed to add product' });
  }
};

exports.updateProduct = async (req, res) => {

  try {
    const { id } = req.params;
    const { name, price, quantityInStock, picture, verbalDescription, category } = req.body;
    
    let imagePath = null;

    if (picture && picture.startsWith('data:image')) {
      // It's a new image (base64 encoded)
      const base64Data = picture.replace(/^data:image\/\w+;base64,/, "");
      const buffer = Buffer.from(base64Data, 'base64');
      const fileName = `product_${id}_${Date.now()}.jpg`;
      //imagePath = `/images/${fileName}`;
      imagePath = fileName;
      const fullPath = path.join(__dirname, '../../server/images', fileName);
      
      fs.writeFileSync(fullPath, buffer);

      // Delete old image if it exists
      const oldProduct = await Product.getById(id);
      if (oldProduct && oldProduct.picture) {
        const oldImagePath = path.join(__dirname, '../../server/images', oldProduct.picture);
        fs.unlink(oldImagePath, (err) => {
          if (err) console.error('Error deleting old image:', err);
        });
      }
    } else if (picture) {
      // It's the existing image path
      imagePath = picture;
    }

    const updatedProduct = await Product.update(id, {
      name,
      price: parseFloat(price),
      quantityInStock: parseInt(quantityInStock),
      picture: imagePath,
      verbalDescription,
      category
    });

    res.json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Get product details before deletion
    const product = await Product.getById(id);

    
    // Delete the product
    await Product.delete(id);
    
    // Delete associated image if it exists
    if (product.picture) {
      const imagePath = path.join(__dirname, '', product.picture);
      fs.unlink(imagePath, (err) => {
        if (err) console.error('Error deleting image:', err);
      });
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
};

//get products using paging
exports.loadProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;

    const products = await Product.findWithPagination(page, limit);
    const total = await Product.countTotal();

    res.json({
      products,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalProducts: total
    });
  } catch (error) {
    console.error('Error in loadProducts:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

