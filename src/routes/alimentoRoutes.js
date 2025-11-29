const express = require("express")
const router = express.Router()
const alimentoController = require("../controllers/alimentoController")
const { authenticateToken, requireCoach } = require("../middlewares/auth")
const {
  createAlimentoValidation,
  updateAlimentoValidation,
  getAlimentoValidation,
  queryAlimentoValidation,
} = require("../middlewares/alimentoValidation")
const { handleValidationErrors } = require("../middlewares/validation")

/**
 * @swagger
 * components:
 *   schemas:
 *     Alimento:
 *       type: object
 *       required:
 *         - nomeAlimento
 *         - categoria
 *         - quantidade
 *         - unidade
 *         - calorias
 *         - proteinas
 *         - carboidratos
 *         - gorduras
 *       properties:
 *         id:
 *           type: string
 *         nomeAlimento:
 *           type: string
 *         categoria:
 *           type: string
 *           enum: [PROTEINA, CARBOIDRATO, GORDURA, FRUTA, VEGETAL, LATICINIO, OUTRO]
 *         quantidade:
 *           type: number
 *         unidade:
 *           type: string
 *           enum: [GRAMAS, MILILITROS, UNIDADE, COLHER, XICARA, PORCAO]
 *         calorias:
 *           type: number
 *         proteinas:
 *           type: number
 *         carboidratos:
 *           type: number
 *         gorduras:
 *           type: number
 *         fibras:
 *           type: number
 *         observacoes:
 *           type: string
 */

/**
 * @swagger
 * /api/alimentos:
 *   post:
 *     summary: Criar novo alimento
 *     tags: [Alimentos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Alimento'
 *     responses:
 *       201:
 *         description: Alimento criado com sucesso
 */
router.post(
  "/",
  authenticateToken,
  requireCoach,
  createAlimentoValidation,
  handleValidationErrors,
  alimentoController.create,
)

/**
 * @swagger
 * /api/alimentos:
 *   get:
 *     summary: Listar alimentos do coach
 *     tags: [Alimentos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: categoria
 *         schema:
 *           type: string
 *       - in: query
 *         name: nomeAlimento
 *         schema:
 *           type: string
 *       - in: query
 *         name: orderBy
 *         schema:
 *           type: string
 *           default: nomeAlimento
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           default: asc
 *     responses:
 *       200:
 *         description: Lista de alimentos
 */
router.get(
  "/",
  authenticateToken,
  requireCoach,
  queryAlimentoValidation,
  handleValidationErrors,
  alimentoController.getAll,
)

/**
 * @swagger
 * /api/alimentos/{id}:
 *   get:
 *     summary: Obter alimento por ID
 *     tags: [Alimentos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Alimento encontrado
 *       404:
 *         description: Alimento não encontrado
 */
router.get(
  "/:id",
  authenticateToken,
  requireCoach,
  getAlimentoValidation,
  handleValidationErrors,
  alimentoController.getById,
)

/**
 * @swagger
 * /api/alimentos/{id}:
 *   put:
 *     summary: Atualizar alimento
 *     tags: [Alimentos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Alimento'
 *     responses:
 *       200:
 *         description: Alimento atualizado com sucesso
 */
router.put(
  "/:id",
  authenticateToken,
  requireCoach,
  updateAlimentoValidation,
  handleValidationErrors,
  alimentoController.update,
)

/**
 * @swagger
 * /api/alimentos/{id}:
 *   delete:
 *     summary: Excluir alimento
 *     tags: [Alimentos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Alimento excluído com sucesso
 */
router.delete(
  "/:id",
  authenticateToken,
  requireCoach,
  getAlimentoValidation,
  handleValidationErrors,
  alimentoController.delete,
)

/**
 * @swagger
 * /api/alimentos/categoria/{categoria}:
 *   get:
 *     summary: Obter alimentos por categoria
 *     tags: [Alimentos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: categoria
 *         required: true
 *         schema:
 *           type: string
 *           enum: [PROTEINA, CARBOIDRATO, GORDURA, FRUTA, VEGETAL, LATICINIO, OUTRO]
 *     responses:
 *       200:
 *         description: Alimentos da categoria
 */
router.get("/categoria/:categoria", authenticateToken, requireCoach, alimentoController.getByCategoria)

module.exports = router
