const cron = require("node-cron");
const pool = require("../config/db");
const { sendBirthdayMail } = require("../config/mail");
const { DateTime } = require("luxon");

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
 * Programa el job para que se ejecute todos los días
 * @param {number} JOB_HH Hora en Panamá (0-23)
 * @param {number} JOB_MM Minuto en Panamá (0-59)
 */
function startBirthdayJob() {
  const JOB_MM = parseInt(process.env.JOB_MM || 0, 10);
  const JOB_HH = parseInt(process.env.JOB_HH || 20, 10); // hora Panamá

  console.log(123, Intl.DateTimeFormat().resolvedOptions().timeZone);
  // Hora actual de Panamá
  const nowPanama = DateTime.now().setZone("America/Panama");

  // Hora de ejecución en UTC para cron
  const cronUTC = DateTime.now()
    .setZone("America/Panama")
    .set({ hour: JOB_HH, minute: JOB_MM, second: 0, millisecond: 0 })
    .toUTC();

  const cronHH = cronUTC.hour;
  const cronMM = cronUTC.minute;

  console.log(
    `🎯 Job programado: todos los días a las ${JOB_HH.toString().padStart(
      2,
      "0"
    )}:${JOB_MM.toString().padStart(
      2,
      "0"
    )} hora Panamá (cron: ${cronHH}:${cronMM} UTC)`
  );

  // Calcular hora local de Panamá para mostrar en consola
  const utcDate = new Date(Date.UTC(2025, 0, 1, JOB_HH, JOB_MM)); // Ejemplo base UTC
  utcDate.setUTCHours(utcDate.getUTCHours() + 5);
  const programmingTime = utcDate.toLocaleTimeString("es-PA", {
    timeZone: "America/Panama",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  cron.schedule(`${cronMM} ${cronHH} * * *`, () => {
    const currentPanama = DateTime.now()
      .setZone("America/Panama")
      .toFormat("hh:mm a");
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
