const cron = require("node-cron");
const pool = require("../config/db");
const { sendBirthdayMail } = require("../config/mail");

/**
 * Consulta personas que cumplen años hoy
 */
async function checkBirthdays() {
  try {
    const today = new Date();
    const month = today.getMonth() + 1; // enero = 0
    const day = today.getDate();

    console.log(`🔎 Verificando cumpleaños del ${day}/${month}`);

    const query = `
      SELECT * FROM birthday
      WHERE EXTRACT(MONTH FROM date) = $1
      AND EXTRACT(DAY FROM date) = $2
    `;

    const { rows } = await pool.query(query, [month, day]);

    if (rows.length === 0) {
      console.log("🎈 No hay cumpleaños hoy.");
      return;
    }

    for (const person of rows) {
      await sendBirthdayMail(person);
    }

    console.log(`✅ Correos enviados: ${rows.length}`);
  } catch (error) {
    console.error("❌ Error al verificar cumpleaños:", error.message);
  }
}

/**
 * Programa el job para que se ejecute todos los días a las 8 AM
 */
function startBirthdayJob() {
  // "18 17 * * *" -> minuto 18, hora 17 (5:18 PM)
  cron.schedule("18 17 * * *", () => {
    console.log("🕗 Ejecutando job diario de cumpleaños...");
    checkBirthdays();
  });

  console.log("🎯 Job programado: todos los días a las 8:00 AM");
}

/**
 * Permite ejecutar manualmente el job con:
 *    node jobs/birthdayJob.js
 */
if (require.main === module) {
  console.log("🧪 Modo prueba: ejecutando job manualmente...");
  checkBirthdays();
}

module.exports = { startBirthdayJob, checkBirthdays };
