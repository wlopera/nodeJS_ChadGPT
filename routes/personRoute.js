const express = require("express");
const router = express.Router();
const personController = require("../controllers/personController");
const authenticate = require("../middlewares/authMiddleware");

// 🔹 Todas las rutas requieren token válido
router.use(authenticate);

// Rutas para CRUD de personas
router.get("/", personController.getAll);
router.get("/:id", personController.getById);
router.post("/", personController.create);
router.put("/:id", personController.update);
router.delete("/:id", personController.delete);

module.exports = router;
