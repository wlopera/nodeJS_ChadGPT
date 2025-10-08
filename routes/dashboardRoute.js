const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboardController");
const authenticate = require("../middlewares/authMiddleware");

// GET /dashboard -> protegido con JWT
router.get("/", authenticate, dashboardController.getDashboard);

module.exports = router;
