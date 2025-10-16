const pool = require("../config/db");

class BirthdayService {
  async getAll() {
    const res = await pool.query("SELECT * FROM birthday ORDER BY id ASC");
    return res.rows;
  }

  async getById(id) {
    const res = await pool.query("SELECT * FROM birthday WHERE id = $1", [id]);
    return res.rows[0];
  }

  async create({ name, date, email, phone, image }) {
    const res = await pool.query(
      `INSERT INTO birthday (name, date, email, phone, image)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [name, date, email, phone, image]
    );
    return res.rows[0];
  }

  async update(id, { name, date, email, phone, image }) {
    const res = await pool.query(
      `UPDATE birthday
       SET name = $1, date = $2, email = $3, phone = $4, image = $5
       WHERE id = $6
       RETURNING *`,
      [name, date, email, phone, image, id]
    );
    return res.rows[0];
  }

  async delete(id) {
    await pool.query("DELETE FROM birthday WHERE id = $1", [id]);
    return { message: "Cumpleaños eliminado correctamente" };
  }
}

module.exports = new BirthdayService();
