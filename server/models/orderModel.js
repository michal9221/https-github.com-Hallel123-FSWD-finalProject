const db = require('../config/db.js');

class Order {
  static async findCurrentOrder(customerNumber) {
    try {
      const order = await db.query(
        'SELECT * FROM Orders WHERE customerNumber = ? AND status = "not ordered"',
        [customerNumber]
      );

      if (order.length === 0) {
        return null;
      }

      return order[0];
    } catch (error) {
      console.error('Error in Order.findCurrentOrder:', error);
      throw error;
    }
  }

  static async confirmOrder(customerNumber, status, orderDate) {
    let orderId = await this.findCurrentOrder(customerNumber);

    try {
      console.log('orderModel...........', orderId);
      const user = await db.query('SELECT profile_type FROM Users WHERE serialNumber = ?', [customerNumber]);

      if (user.length === 0) {
        return null;
      }

      const userType = user[0].type;

      if (userType === 'manager') {
        throw new Error('Managers do not have permission to place orders.');
      }

      const result = await db.query(
        'UPDATE Orders SET status = ? WHERE orderNumber = ? AND status = "not ordered"',
        ["ordered", orderId]

      );

      if (result.affectedRows === 0) {
        return null;
      }

      // Update product quantities in the order
      const [productRows] = await db.query(
        `SELECT pic.product, pic.quantity, p.quantityInStock, p.price
         FROM ProductsInCarts pic
         JOIN Products p ON pic.product = p.serialNumber
         WHERE pic.orderID = ?`,
        [orderId]
      );

      const missingProducts = [];
      let totalPrice = 0;

      for (const productRow of productRows) {
        const { product, quantity, quantityInStock, price } = productRow;

        if (userType === 'institution' && quantity < 20) {
          missingProducts.push(`${20 - quantity} kg ${product.name}`);
          await db.query(
            'UPDATE ProductsInCarts SET quantity = ? WHERE orderID = ? AND product = ?',
            [20, orderId, product]
          );
        } else {
          await db.query(`
            UPDATE Orders 
            SET status = 'ordered' 
            WHERE orderNumber = ? 
            AND customerNumber = 1 
            AND status = 'not ordered' 
            AND dateSentToCustomer IS NULL`, [orderId]);

          connection.query(query, [orderId], function (error, results) {
            if (error) throw error;
            console.log("Order updated successfully");
          });
        }

        if (userType === 'institution' && quantity >= 20) {
          totalPrice += price * quantity * 0.8; // Apply 20% discount
        } else {
          totalPrice += price * quantity;
        }
      }

      const order = {
        orderId,
        missingProducts,
        totalPrice
      };

      console.log('orderModel...........', orderId);
      return order;
    } catch (error) {
      console.error('Error in Order.confirmOrder:', error);
      throw error;
    }
  }
}

module.exports = Order;
