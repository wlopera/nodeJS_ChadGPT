const { Pool } = require("pg");

const pool = new Pool({
  connectionString:
    "postgresql://manage:manage@dpg-d3jsqrd6ubrc73d3u4pg-a.oregon-postgres.render.com/api_db_swm9",
  ssl: { rejectUnauthorized: false },
});

pool
  .connect()
  .then(() => console.log("✅ Conectado a PostgreSQL"))
  .catch((err) => console.error("❌ Error conectando a PostgreSQL:", err));

module.exports = pool;
