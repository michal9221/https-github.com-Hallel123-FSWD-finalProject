const db = require('../config/db.js');
const path = require('path');

class Cart {
  static async getCartItems(userId) {
    try {
      const query = `
        SELECT p.serialNumber, p.name, p.price, pic.quantity, o.orderNumber
        FROM Orders o
        JOIN ProductsInCarts pic ON o.orderNumber = pic.orderID
        JOIN Products p ON pic.product = p.serialNumber
        WHERE o.customerNumber = ? AND o.status = 'not ordered'
      `;
      const rows = await db.query(query, [userId]);
      return rows;
    } catch (error) {
      console.error('Error in getCartItems:', error);
      throw error;
    }
  }


  static async removeFromCart(userId, productId) {
    try {
      const query = `
        DELETE pic FROM ProductsInCarts pic
        JOIN Orders o ON pic.orderID = o.orderNumber
        WHERE o.customerNumber = ? AND o.status = 'not ordered' AND pic.product = ?
      `;
      await db.query(query, [userId, productId]);
    } catch (error) {
      console.error('Error in removeFromCart:', error);
      throw error;
    }
  }

  static async updateCartItemQuantity(userId, productId, quantity) {
    try {
      const query = `
        UPDATE ProductsInCarts pic
        JOIN Orders o ON pic.orderID = o.orderNumber
        SET pic.quantity = ?
        WHERE o.customerNumber = ? AND o.status = 'not ordered' AND pic.product = ?
      `;
      await db.query(query, [quantity, userId, productId]);
    } catch (error) {
      console.error('Error in updateCartItemQuantity:', error);
      throw error;
    }
  }
}

module.exports = Cart;