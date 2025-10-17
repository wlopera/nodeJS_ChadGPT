const pool = require("../config/db");

class PersonService {
  async getAll() {
    console.log("Consultando todas las Personas");
    const res = await pool.query("SELECT * FROM person ORDER BY id ASC");
    return res.rows;
  }

  async getById(id) {
    console.log("Consultando persona por id: ", id);
    const res = await pool.query("SELECT * FROM person WHERE id = $1", [id]);
    return res.rows[0];
  }

  async create({
    name,
    phone,
    email,
    birth_date,
    identity_number,
    address,
    photo,
  }) {
    console.log("Creando Persona, ", name);
    const res = await pool.query(
      `INSERT INTO person (name, phone, email, birth_date, identity_number, address, photo)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [name, phone, email, birth_date, identity_number, address, photo]
    );
    return res.rows[0];
  }

  async update(
    id,
    { name, phone, email, birth_date, identity_number, address, photo }
  ) {
    console.log("Actualizando Persona, ", name);
    const res = await pool.query(
      `UPDATE person
       SET name = $1, phone = $2, email = $3, birth_date = $4, identity_number = $5, address = $6, photo = $7
       WHERE id = $8
       RETURNING *`,
      [name, phone, email, birth_date, identity_number, address, photo, id]
    );
    return res.rows[0];
  }

  async delete(id) {
    console.log("Borrando Persona id: ", id);
    await pool.query("DELETE FROM person WHERE id = $1", [id]);
    return { message: "Persona eliminada correctamente" };
  }
}

module.exports = new PersonService();
