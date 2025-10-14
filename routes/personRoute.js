const express = require("express");
const router = express.Router();
const personController = require("../controllers/personController");
const authenticate = require("../middlewares/authMiddleware");
const multer = require("multer");

// 🔹 Todas las rutas requieren token válido
router.use(authenticate);

// Carpeta temporal para recibir archivos
const upload = multer({ dest: "temp_uploads/" }); // los archivos se guardan temporalmente aquí

// Rutas para CRUD de personas
router.get("/", personController.getAll);
router.get("/:id", personController.getById);
router.post("/", upload.single("photo"), personController.create);
router.put("/:id", personController.update);
router.delete("/:id", personController.delete);

module.exports = router;
