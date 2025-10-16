const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com", // o smtp.office365.com
  port: 587,
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

/**
 * Envía un correo de cumpleaños
 * @param {Object} birthday - Datos de la persona (name, email, phone, date, image)
 */
async function sendBirthdayMail(birthday) {
  const formattedCurrentDate = new Date().toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
  });

  const formattedDate = new Date(birthday.date).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const imageHtml = birthday.image
    ? `<img src="${birthday.image}" alt="${birthday.name}" style="max-width:200px;border-radius:10px;margin-top:10px;" />`
    : "";

  const mailOptions = {
    from: `"Cumpleaños App" <${process.env.MAIL_USER}>`,
    to: process.env.NOTIFY_EMAIL || "william.lopera@pranical.com",
    subject: `🎉 Hoy cumpleaños ${birthday.name}!`,
    html: `
      <div style="font-family:Arial, sans-serif; color:#333;">
        <h2 style="color:#007bff;">🎂 ¡Feliz cumpleaños, ${birthday.name}!</h2>
        <p>Hoy ${formattedCurrentDate} está de cumpleaños 🎈</p>
        <p>Aquí tienes sus datos:</p>
        <ul>
          <li><b>Nombre:</b> ${birthday.name}</li>
          <li><b>Email:</b> ${birthday.email || "No registrado"}</li>
          <li><b>Teléfono:</b> ${birthday.phone || "No disponible"}</li>
          <li><b>Fecha de nacimiento:</b> ${formattedDate}</li>
        </ul>
        ${imageHtml}
        <br/>
        <p style="font-size:13px;color:#777;">Este mensaje fue enviado automáticamente por el sistema de cumpleaños.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
  console.log(
    `📧 Enviado correo con imagen por el cumpleaños de ${birthday.name}`
  );
}

module.exports = { sendBirthdayMail };
