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
 *  Ejecutar todos los días a las 8:00 PM hora Panamá (1:00 AM UTC)
 * hora_local_Panamá + 5 = hora_UTC
 *  Hora Panamá	Expresión cron (UTC)
 *    8:00 AM	      "0 13 * * *"
 *    12:45 PM	    "45 17 * * *"
 *    6:00 PM	      "0 23 * * *"
 *    8:00 PM	      "0 1 * * *"
 */
function startBirthdayJob() {
  const JOB_MM = parseInt(process.env.JOB_MM || 0, 10);
  const JOB_HH = parseInt(process.env.JOB_HH || 20, 10); // default 20 = 8 PM Panamá

  // Mostrar hora de Panamá en consola
  const nowPanama = new Date().toLocaleTimeString("es-PA", {
    timeZone: "America/Panama",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  // Calcular hora local de Panamá para mostrar en consola
  const utcDate = new Date(Date.UTC(2025, 0, 1, JOB_HH, JOB_MM)); // Ejemplo base UTC
  utcDate.setUTCHours(utcDate.getUTCHours() + 5);
  const programmingTime = utcDate.toLocaleTimeString("es-PA", {
    timeZone: "America/Panama",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  // Para cron: ejecuta todos los días a JOB_HH:JOB_MM hora Panamá
  cron.schedule(`${JOB_MM} ${JOB_HH} * * *`, () => {
    const currentPanama = new Date().toLocaleTimeString("es-PA", {
      timeZone: "America/Panama",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    console.log(
      `🕗 Ejecutando job diario de cumpleaños a las ${currentPanama} (hora Panamá)`
    );
    checkBirthdays();
  });

  console.log(
    `🎯 Job programado: todos los días a las ${programmingTime} hora Panamá (actual: ${nowPanama})`
  );
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
