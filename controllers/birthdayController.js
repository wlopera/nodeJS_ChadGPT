const birthdayService = require("../services/birthdayService");
const cloudinary = require("../config/cloudinary");

exports.create = async (req, res) => {
  try {
    const birthdayData = req.body; // Campos del formulario

    // ⚡ Si se subió archivo
    if (req.file) {
      console.log("Archivo recibido:", req.file.path);

      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "birthday_photos",
      });

      birthdayData.image = result.secure_url; // URL de Cloudinary
    }

    const newBirthday = await birthdayService.create(birthdayData); // Guardar en DB
    res.status(201).json(newBirthday);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// 🔹 Actualizar birthday
exports.update = async (req, res) => {
  try {
    const birthdayData = req.body;
    if (req.file) {
      birthdayData.photo = req.file.buffer;
    }
    const updated = await birthdayService.update(req.params.id, birthdayData);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🔹 Consultar todas las birthdays
exports.getAll = async (req, res) => {
  try {
    const data = await birthdayService.getAll();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🔹 Consultar birthday por ID
exports.getById = async (req, res) => {
  try {
    const birthday = await birthdayService.getById(req.params.id);
    if (!birthday)
      return res.status(404).json({ error: "birthday no encontrada" });

    // Si la foto está en binario, convertir a base64 (opcional)
    if (birthday.photo) birthday.photo = birthday.photo.toString("base64");

    res.json(birthday);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🔹 Eliminar birthday
exports.delete = async (req, res) => {
  try {
    const result = await birthdayService.delete(req.params.id);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
