const db = require('../config/db.js');

class User {

  static async findByEmail(email) {
    try {
      const rows = await db.query('SELECT * FROM Users WHERE Email = ?', [email]);
      if (Array.isArray(rows) && rows.length > 0) {
        return rows[0];
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error in findByEmail:', error);
      throw error;
    }
  }


  static async create(userData) {
    const { fullName, email, password, paymentDetails, ID, profile_type } = userData;

    try {
      const result = await db.query(
        'INSERT INTO Users (fullName, email, password, paymentDetails, ID, profile_type) VALUES (?, ?, ?, ?, ?, ?)',
        [fullName, email, password, paymentDetails, ID, profile_type]
      );

      if (result && result.insertId) {
        return { serialNumber: result.insertId, ...userData };
      } else {
        throw new Error('Failed to create user: No insert ID returned');
      }
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  static async updatePaymentDetails(id, paymentDetails) {
    try {
      const [result] = await db.query(
        'UPDATE Users SET paymentDetails = ? WHERE serialNumber = ?',
        [paymentDetails, id]
      );

      if (result.affectedRows === 0) {
        return null;
      }

      return this.findById(id);
    } catch (error) {
      console.error('Error in User.updatePaymentDetails:', error);
      throw error;
    }
  }

  static async findById(id) {
    try {
      const rows = await db.query('SELECT * FROM Users WHERE serialNumber = ?', [id]);
      return rows[0];
    } catch (error) {
      console.error('Error in User.findById:', error);
      throw error;
    }
  }

}

module.exports = User;