const express = require("express")
const router = express.Router()
const suplementoController = require("../controllers/suplementoController")
const { authenticateToken, requireCoach } = require("../middlewares/auth")
const {
  createSuplementoValidation,
  updateSuplementoValidation,
  getSuplementoValidation,
  getSuplementosByCategoryValidation,
  getSuplementosByTipoValidation,
  searchSuplementosValidation,
  getSuplementosValidation,
} = require("../middlewares/suplementoValidation")

/**
 * @swagger
 * components:
 *   schemas:
 *     Suplemento:
 *       type: object
 *       required:
 *         - tipo
 *         - categoria
 *         - dosagem
 *         - frequencia
 *         - momento
 *       properties:
 *         id:
 *           type: string
 *           description: ID único do suplemento
 *         nomeSuplemento:
 *           type: string
 *           description: Nome do suplemento (obrigatório se tipo for SUPLEMENTO)
 *         nomeManipulado:
 *           type: string
 *           description: Nome do manipulado (obrigatório se tipo for MANIPULADO)
 *         tipo:
 *           type: string
 *           enum: [SUPLEMENTO, MANIPULADO]
 *           description: Tipo do produto
 *         categoria:
 *           type: string
 *           enum: [TERMOGENICO, PRE_TREINO, HORMONAL, ANTIOXIDANTE, DIGESTIVO, SONO, VITAMINA, MINERAL, PROTEINA, CREATINA, BCAA, OUTRO]
 *           description: Categoria do suplemento
 *         dosagem:
 *           type: string
 *           description: Dosagem recomendada
 *         frequencia:
 *           type: string
 *           description: Frequência de uso
 *         momento:
 *           type: string
 *           enum: [PRE_TREINO, POS_TREINO, MANHA, TARDE, NOITE, JEJUM, REFEICAO]
 *           description: Momento de consumo
 *         observacoes:
 *           type: string
 *           description: Observações adicionais
 *         contraindicacoes:
 *           type: string
 *           description: Contraindicações
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/suplementos:
 *   post:
 *     summary: Criar um novo suplemento
 *     tags: [Suplementos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Suplemento'
 *     responses:
 *       201:
 *         description: Suplemento criado com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 */
router.post("/", authenticateToken, requireCoach, createSuplementoValidation, suplementoController.createSuplemento)

/**
 * @swagger
 * /api/suplementos:
 *   get:
 *     summary: Listar todos os suplementos do coach
 *     tags: [Suplementos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Número da página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *         description: Itens por página
 *       - in: query
 *         name: orderBy
 *         schema:
 *           type: string
 *           enum: [nomeSuplemento, nomeManipulado, categoria, tipo, momento, createdAt]
 *         description: Campo para ordenação
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Direção da ordenação
 *       - in: query
 *         name: categoria
 *         schema:
 *           type: string
 *         description: Filtrar por categoria
 *       - in: query
 *         name: tipo
 *         schema:
 *           type: string
 *         description: Filtrar por tipo
 *       - in: query
 *         name: momento
 *         schema:
 *           type: string
 *         description: Filtrar por momento
 *     responses:
 *       200:
 *         description: Lista de suplementos
 *       401:
 *         description: Não autorizado
 */
router.get("/", authenticateToken, requireCoach, getSuplementosValidation, suplementoController.getAllSuplementos)

/**
 * @swagger
 * /api/suplementos/search:
 *   get:
 *     summary: Buscar suplementos por nome
 *     tags: [Suplementos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: nome
 *         required: true
 *         schema:
 *           type: string
 *           minLength: 2
 *         description: Nome para busca
 *     responses:
 *       200:
 *         description: Resultados da busca
 *       400:
 *         description: Parâmetros inválidos
 *       401:
 *         description: Não autorizado
 */
router.get(
  "/search",
  authenticateToken,
  requireCoach,
  searchSuplementosValidation,
  suplementoController.searchSuplementos,
)

/**
 * @swagger
 * /api/suplementos/categoria/{categoria}:
 *   get:
 *     summary: Buscar suplementos por categoria
 *     tags: [Suplementos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: categoria
 *         required: true
 *         schema:
 *           type: string
 *         description: Categoria do suplemento
 *     responses:
 *       200:
 *         description: Suplementos da categoria
 *       400:
 *         description: Categoria inválida
 *       401:
 *         description: Não autorizado
 */
router.get(
  "/categoria/:categoria",
  authenticateToken,
  requireCoach,
  getSuplementosByCategoryValidation,
  suplementoController.getSuplementosByCategory,
)

/**
 * @swagger
 * /api/suplementos/tipo/{tipo}:
 *   get:
 *     summary: Buscar suplementos por tipo
 *     tags: [Suplementos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tipo
 *         required: true
 *         schema:
 *           type: string
 *         description: Tipo do suplemento
 *     responses:
 *       200:
 *         description: Suplementos do tipo
 *       400:
 *         description: Tipo inválido
 *       401:
 *         description: Não autorizado
 */
router.get(
  "/tipo/:tipo",
  authenticateToken,
  requireCoach,
  getSuplementosByTipoValidation,
  suplementoController.getSuplementosByTipo,
)

/**
 * @swagger
 * /api/suplementos/{id}:
 *   get:
 *     summary: Buscar suplemento por ID
 *     tags: [Suplementos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do suplemento
 *     responses:
 *       200:
 *         description: Suplemento encontrado
 *       404:
 *         description: Suplemento não encontrado
 *       401:
 *         description: Não autorizado
 */
router.get("/:id", authenticateToken, requireCoach, getSuplementoValidation, suplementoController.getSuplementoById)

/**
 * @swagger
 * /api/suplementos/{id}:
 *   put:
 *     summary: Atualizar suplemento
 *     tags: [Suplementos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do suplemento
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Suplemento'
 *     responses:
 *       200:
 *         description: Suplemento atualizado com sucesso
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Suplemento não encontrado
 *       401:
 *         description: Não autorizado
 */
router.put("/:id", authenticateToken, requireCoach, updateSuplementoValidation, suplementoController.updateSuplemento)

/**
 * @swagger
 * /api/suplementos/{id}:
 *   delete:
 *     summary: Excluir suplemento
 *     tags: [Suplementos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do suplemento
 *     responses:
 *       200:
 *         description: Suplemento excluído com sucesso
 *       404:
 *         description: Suplemento não encontrado
 *       401:
 *         description: Não autorizado
 */
router.delete("/:id", authenticateToken, requireCoach, getSuplementoValidation, suplementoController.deleteSuplemento)

module.exports = router
