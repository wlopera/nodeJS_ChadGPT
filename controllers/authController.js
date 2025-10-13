const AuthService = require("../services/authService");
const jwt = require("jsonwebtoken");
/*const jwtConfig = require("../config/jwtConfig");*/
require("dotenv").config();

const authService = new AuthService();

exports.login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username y password son requeridos" });
  }

  try {
    const user = await authService.validateLogin({ username, password });

    // Generar JWT
    const token = jwt.sign(
      { username: user.username },
      process.env.TOKEN_SECRET_JWT,
      {
        expiresIn: process.env.EXPIRATION_IN_JWT,
      }
    );

    res
      .status(200)
      .json({ message: "Login exitoso ✅", user: user.username, token });
  } catch (err) {
    res
      .status(err.status || 500)
      .json({ error: err.message || "Error interno" });
  }
};
