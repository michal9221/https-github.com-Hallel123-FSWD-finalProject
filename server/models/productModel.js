const db = require('../config/db.js');
const path = require('path');

class Product {
  static async getAll() {
    try {
      const rows = await db.query('SELECT * FROM Products');
      // Add the full image URL to each product
      const productsWithImageUrls = rows.map(product => ({
        ...product,
        picture: product.picture
          ? `${process.env.SERVER_URL}/images/${path.basename(product.picture)}`
          : null
      }));
      return productsWithImageUrls;
    } catch (error) {
      console.error('Error fetching all products:', error);
      throw error;
    }
  }

  static async create(productData) {
    const { name, price, quantityInStock, picture, verbalDescription, category } = productData;
    try {
      const result = await db.query(
        'INSERT INTO Products (name, price, quantityInStock, picture, verbalDescription, category) VALUES (?, ?, ?, ?, ?, ?)',
        [name, price, quantityInStock, picture, verbalDescription, category]
      );
      productData.picture = productData.picture ? `${process.env.SERVER_URL}/images/${path.basename(productData.picture)}` : null;
      return { serialNumber: result.insertId, ...productData };
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  }

  static async getStockQuantity(productId) {
    try {
      const rows = await db.query('SELECT quantityInStock FROM Products WHERE serialNumber = ?', [productId]);
      return rows[0] ? rows[0].quantityInStock : 0;
    } catch (error) {
      console.error('Error getting stock quantity:', error);
      throw error;
    }
  }


  static async update(id, productData) {
    const { name, price, quantityInStock, picture, verbalDescription, category } = productData;
    try {
      await db.query('START TRANSACTION');

      // Update the product
      await db.query(
        'UPDATE Products SET name = ?, price = ?, quantityInStock = ?, picture = ?, verbalDescription = ?, category = ? WHERE serialNumber = ?',
        [name, price, quantityInStock, picture, verbalDescription, category, id]
      );

      await db.query('COMMIT');

      productData.picture= productData.picture ? `${process.env.SERVER_URL}/images/${path.basename(productData.picture)}`: null;
      return { id, ...productData };

    } catch (error) {
      await db.query('ROLLBACK');
      console.error('Error updating product:', error);
      throw error;
    }
  }

  static async delete(id) {
    try {
      await db.query('START TRANSACTION');

      // Remove the product from all carts
      await db.query('DELETE FROM ProductsInCarts WHERE product = ?', [id]);

      // Delete the product
      await db.query('DELETE FROM Products WHERE serialNumber = ?', [id]);

      await db.query('COMMIT');
    } catch (error) {
      await db.query('ROLLBACK');
      console.error('Error deleting product:', error);
      throw error;
    }
  }

  static async getById(id) {
    try {
      const rows = await db.query('SELECT * FROM Products WHERE serialNumber = ?', [id]);
      return rows[0];
    } catch (error) {
      console.error('Error getting product by id:', error);
      throw error;
    }
  }

  static async findWithPagination(page = 1, limit = 12) {
    const offset = (page - 1) * limit;
    try {
      const rows = await db.query(
        'SELECT * FROM Products LIMIT ? OFFSET ?',
        [limit, offset]
      );
      // Add the full image URL to each product
      const productsWithImageUrls = rows.map(product => ({
        ...product,
        picture: product.picture
          ? `${process.env.SERVER_URL}/images/${path.basename(product.picture)}`
          : null
      }));
      return productsWithImageUrls;
    } catch (error) {
      console.error('Error finding products with pagination:', error);
      throw error;
    }
  }

  static async countTotal() {
    try {
      const rows = await db.query('SELECT COUNT(*) as total FROM Products');
      return rows[0].total;
    } catch (error) {
      console.error('Error counting total products:', error);
      throw error;
    }
  } 
}

module.exports = Product;