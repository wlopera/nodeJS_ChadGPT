const express = require("express");
const router = express.Router();
const personController = require("../controllers/personController");

// Rutas para CRUD de personas
router.get("/", personController.getAll);
router.get("/:id", personController.getById);
router.post("/", personController.create); // ❌ Ya no necesitamos multer
router.put("/:id", personController.update); // Puedes actualizar con JSON también
router.delete("/:id", personController.delete);

module.exports = router;
