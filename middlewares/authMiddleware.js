const jwt = require("jsonwebtoken");
const jwtConfig = require("../config/jwtConfig");

const authenticate = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader)
    return res.status(401).json({ error: "Token no proporcionado" });

  const token = authHeader.split(" ")[1]; // "Bearer <token>"
  if (!token) return res.status(401).json({ error: "Token inválido" });

  try {
    const decoded = jwt.verify(token, jwtConfig.secret);
    console.log("Contenido del token: ", decoded);
    req.user = decoded; // agregamos info del usuario a la request
    next();
  } catch (err) {
    return res.status(403).json({ error: "Token expirado o inválido" });
  }
};

module.exports = authenticate;
