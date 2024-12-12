const db = require('../config/db');

class Manager {
  static async findById(id) {
    try {
      const [rows] = await db.query('SELECT * FROM Managers WHERE ID = ?', [id]);
      return rows[0];
    } catch (error) {
      console.error('Error finding manager by ID:', error);
      throw error;
    }
  }

  static async login(id, password, adminCode) {
    try {
      const rows = await db.query('SELECT * FROM Managers WHERE ID = ? AND password = ? AND adminCode = ?', [id, password, adminCode]);
      return rows[0];
    } catch (error) {
      console.error('Error logging in manager:', error);
      throw error;
    }
  }
}

module.exports = Manager;