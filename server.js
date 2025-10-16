const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/authRoute");
const personRoutes = require("./routes/personRoute");
const birthdayRoutes = require("./routes/birthdayRoute");
const { checkBirthdays } = require("./jobs/birthdayJob");
const pool = require("./config/db"); // si quieres verificar conexión

const app = express();
const PORT = process.env.PORT || 3000;
const URL_CORS = process.env.URL_CORS;

// Permitir CORS desde tu frontend
app.use(
  cors({
    origin: URL_CORS, // URL de tu React dev server
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // si vas a usar cookies
  })
);

// Middleware para parsear JSON
app.use(bodyParser.json());

// ✅ Verificar conexión a PostgreSQL (opcional)
pool
  .connect()
  .then(() => console.log("✅ Conectado a PostgreSQL"))
  .catch((err) => console.error("❌ Error al conectar a PostgreSQL", err));

// Rutas principales
app.use("/auth", authRoutes);
app.use("/api/person", personRoutes); // 👈 nueva ruta para CRUD de personas
app.use("/api/birthday", birthdayRoutes); // 👈 nueva ruta para CRUD de cumpleaños

// Job de cumpleaños (ya se programa automáticamente)
const { startBirthdayJob } = require("./jobs/birthdayJob");
startBirthdayJob();

// Ruta 404 (debe ir después de las rutas válidas)
app.use((req, res) => {
  res.status(404).json({ error: "404 - Página no encontrada" });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
