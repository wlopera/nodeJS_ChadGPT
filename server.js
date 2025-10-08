const express = require("express");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/authRoute");
const dashboardRoutes = require("./routes/dashboardRoute");

const app = express();
const PORT = 3000;

// Middleware para parsear JSON
app.use(bodyParser.json());

// Rutas
app.use("/auth", authRoutes);
app.use("/dashboard", dashboardRoutes);

// Ruta 404 para cualquier endpoint no definido
app.use((req, res) => {
  res.status(404).json({ error: "404 - Página no encontrada" });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
