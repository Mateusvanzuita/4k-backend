// src/routes/evolucaoRoutes.js
const express = require("express");
const router = express.Router();
const upload = require("../config/multer"); // Certifique-se que este caminho está correto
const fotoController = require("../controllers/fotoController");
const { authenticateToken } = require("../middlewares/auth");

// O multer deve vir ANTES do controller
router.post(
  "/fotos", 
  authenticateToken, 
  upload.array("fotos", 5), // O nome 'fotos' deve ser idêntico ao do frontend
  fotoController.uploadEvolucao
);

router.get("/fotos", authenticateToken, fotoController.getHistorico);

module.exports = router;