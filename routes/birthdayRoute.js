const express = require("express");
const router = express.Router();
const birthdayController = require("../controllers/birthdayController");
const authenticate = require("../middlewares/authMiddleware");
const multer = require("multer");

// 🔹 Todas las rutas requieren token válido
router.use(authenticate);

// Carpeta temporal para recibir archivos
const upload = multer({ dest: "temp_uploads/" }); // los archivos se guardan temporalmente aquí

// Rutas para CRUD de personas
router.get("/", birthdayController.getAll);
router.get("/:id", birthdayController.getById);
router.post("/", upload.single("image"), birthdayController.create);
router.put("/:id", birthdayController.update);
router.delete("/:id", birthdayController.delete);

module.exports = router;
