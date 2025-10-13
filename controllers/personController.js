const personService = require("../services/personService");
const cloudinary = require("../config/cloudinary");
const fs = require("fs");

exports.create = async (req, res) => {
  try {
    const personData = req.body;

    if (personData.photoPath) {
      // ✅ Verificar que el archivo existe
      if (!fs.existsSync(personData.photoPath)) {
        return res.status(400).json({
          error: "La ruta del archivo no existe: " + personData.photoPath,
        });
      }

      console.log("📤 Subiendo imagen desde:", personData.photoPath);

      const result = await cloudinary.uploader.upload(personData.photoPath, {
        folder: "person_photos",
      });

      console.log("✅ Subida exitosa:", result.secure_url);

      // Guardar URL en DB
      personData.photo = result.secure_url;
    }

    // Crear registro en la DB
    const newPerson = await personService.create(personData);
    res.status(201).json(newPerson);
  } catch (err) {
    console.error("❌ Error al crear persona:", err);
    res.status(500).json({ error: err.message });
  }
};

// 🔹 Actualizar persona
exports.update = async (req, res) => {
  try {
    const personData = req.body;
    if (req.file) {
      personData.photo = req.file.buffer;
    }
    const updated = await personService.update(req.params.id, personData);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🔹 Consultar todas las personas
exports.getAll = async (req, res) => {
  try {
    const data = await personService.getAll();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🔹 Consultar persona por ID
exports.getById = async (req, res) => {
  try {
    const person = await personService.getById(req.params.id);
    if (!person)
      return res.status(404).json({ error: "Persona no encontrada" });

    // Si la foto está en binario, convertir a base64 (opcional)
    if (person.photo) person.photo = person.photo.toString("base64");

    res.json(person);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🔹 Eliminar persona
exports.delete = async (req, res) => {
  try {
    const result = await personService.delete(req.params.id);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
