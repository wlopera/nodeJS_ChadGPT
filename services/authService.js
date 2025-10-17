const pool = require("../config/db");
const bcrypt = require("bcryptjs");

class AuthService {
  // Validar login
  async validateLogin({ username, password }) {
    console.log("Validando usuario: ", username);
    try {
      // Buscar usuario en la DB
      const res = await pool.query("SELECT * FROM users WHERE username = $1", [
        username,
      ]);
      const user = res.rows[0];

      if (!user) {
        throw { status: 401, message: "Usuario no encontrado" };
      }

      // Verificar contraseña
      const valid = bcrypt.compareSync(password, user.password);
      if (!valid) {
        throw { status: 401, message: "Contraseña incorrecta" };
      }

      // Retornar usuario válido
      return user;
    } catch (err) {
      // Manejo de errores
      if (!err.status) {
        throw { status: 500, message: "Error interno", error: err };
      }
      throw err;
    }
  }
}

module.exports = AuthService;
