const AuthService = require("../services/authService");
const jwt = require("jsonwebtoken");
const jwtConfig = require("../📂 config/jwtConfig");

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
    const token = jwt.sign({ username: user.username }, jwtConfig.secret, {
      expiresIn: jwtConfig.expiresIn,
    });

    res.status(200).json({ message: "Login exitoso ✅", user, token });
  } catch (err) {
    res
      .status(err.status || 500)
      .json({ error: err.message || "Error interno" });
  }
};
