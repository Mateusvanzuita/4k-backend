// src/routes/protocoloRoutes.js

const express = require("express")
const router = express.Router()
const protocoloController = require("../controllers/protocoloController")
const { authenticateToken, requireCoach } = require("../middlewares/auth")
const { createProtocoloValidation, updateProtocoloValidation } = require("../middlewares/protocoloValidation")

/**
 * @swagger
 * tags:
 * name: Protocolos
 * description: Gerenciamento de Protocolos de alunos (Dieta, Treino, Suplementos, Hormônios)
 */

// POST /api/protocolos - Criar novo protocolo (rascunho ou ativo)
router.post(
  "/",
  authenticateToken,
  requireCoach,
  createProtocoloValidation,
  protocoloController.createProtocolo
)

// GET /api/protocolos - Listar protocolos do coach (com filtros/busca)
router.get(
  "/",
  authenticateToken,
  requireCoach,
  protocoloController.getProtocolos
)

// GET /api/protocolos/:id - Buscar protocolo por ID
router.get(
  "/:id",
  authenticateToken,
  requireCoach,
  protocoloController.getProtocoloById
)

// PUT /api/protocolos/:id - Atualizar protocolo existente
router.put(
  "/:id",
  authenticateToken,
  requireCoach,
  updateProtocoloValidation,
  protocoloController.updateProtocolo
)

// POST /api/protocolos/:id/clone - Clonar protocolo
router.post(
    "/:id/clone",
    authenticateToken,
    requireCoach,
    protocoloController.cloneProtocolo
)

// DELETE /api/protocolos/:id - Excluir protocolo
router.delete(
  "/:id",
  authenticateToken,
  requireCoach,
  protocoloController.deleteProtocolo
)

module.exports = router