const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/authRoute");
const personRoutes = require("./routes/personRoute");
const birthdayRoutes = require("./routes/birthdayRoute");
const { startBirthdayJob } = require("./jobs/birthdayJob");
const pool = require("./config/db");

const app = express();
const PORT = process.env.PORT || 3000;
const URL_CORS = process.env.URL_CORS || "http://localhost:5173";

// 🟢 Configuración CORS
app.use(
  cors({
    origin: URL_CORS,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// 🟢 Parsear JSON
app.use(bodyParser.json());

// 🧩 Verificar conexión a PostgreSQL
pool
  .connect()
  .then(() => console.log("✅ Conectado a PostgreSQL"))
  .catch((err) => console.error("❌ Error al conectar a PostgreSQL", err));

// 🧩 Rutas principales
app.use("/auth", authRoutes);
app.use("/api/person", personRoutes);
app.use("/api/birthday", birthdayRoutes);

// 🕗 Iniciar job automático
startBirthdayJob();

// 🚧 Ruta 404 (después de todas las rutas válidas)
app.use((req, res) => {
  res.status(404).json({ error: "404 - Página no encontrada" });
});

// 🚀 Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
