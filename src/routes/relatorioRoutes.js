const express = require("express");
const router = express.Router();
const relatorioController = require("../controllers/relatorioController");
const { authenticateToken, requireCoach } = require("../middlewares/auth");

router.get("/", authenticateToken, requireCoach, relatorioController.getRelatorios);
router.get("/export/pdf", authenticateToken, requireCoach, relatorioController.exportarPDF);

module.exports = router;