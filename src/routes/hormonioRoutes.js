const express = require("express")
const router = express.Router()
const hormonioController = require("../controllers/hormonioController")
const { authenticateToken, requireCoach } = require("../middlewares/auth")
const {
  createHormonioValidation,
  updateHormonioValidation,
  getHormonioValidation,
  queryValidation,
  searchValidation,
} = require("../middlewares/hormonioValidation")

/**
 * @swagger
 * components:
 *   schemas:
 *     Hormonio:
 *       type: object
 *       required:
 *         - nomeHormonio
 *         - tipo
 *         - categoria
 *         - dosagem
 *         - frequencia
 *         - viaAdministracao
 *         - duracaoUso
 *       properties:
 *         id:
 *           type: string
 *           description: ID único do hormônio
 *         nomeHormonio:
 *           type: string
 *           description: Nome do hormônio
 *         tipo:
 *           type: string
 *           enum: [PEPTIDEO, ESTEROIDE, TIREOIDE, CRESCIMENTO, INSULINA, CORTISOL, TESTOSTERONA, OUTRO]
 *           description: Tipo do hormônio
 *         categoria:
 *           type: string
 *           enum: [GH_RELEASING, INSULINA_LIKE, PEPTIDEO_TERAPEUTICO, ANABOLICO, ANDROGENICO, CORTICOSTEROIDE, T3, T4, TSH, SOMATOTROPINA, IGF, RAPIDA, LENTA, INTERMEDIARIA, MODULADOR_HORMONAL, OUTRO]
 *           description: Categoria do hormônio
 *         dosagem:
 *           type: string
 *           description: Dosagem do hormônio
 *         frequencia:
 *           type: string
 *           enum: [DIARIA, DIA_SIM_DIA_NAO, DUAS_VEZES_SEMANA, SEMANAL, QUINZENAL, MENSAL, CONFORME_NECESSARIO]
 *           description: Frequência de uso
 *         viaAdministracao:
 *           type: string
 *           enum: [SUBCUTANEA, INTRAMUSCULAR, ORAL, TOPICA, NASAL, INTRAVENOSA]
 *           description: Via de administração
 *         duracaoUso:
 *           type: string
 *           enum: [DUAS_SEMANAS, QUATRO_SEMANAS, SEIS_SEMANAS, OITO_SEMANAS, DOZE_SEMANAS, DEZESSEIS_SEMANAS, VINTE_SEMANAS, CONTINUO]
 *           description: Duração do uso
 *         observacoes:
 *           type: string
 *           description: Observações sobre o hormônio
 *         contraindicacoes:
 *           type: string
 *           description: Contraindicações do hormônio
 *         efeitosColaterais:
 *           type: string
 *           description: Efeitos colaterais do hormônio
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Data de criação
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Data de atualização
 */

/**
 * @swagger
 * /api/hormonios:
 *   post:
 *     summary: Criar um novo hormônio
 *     tags: [Hormônios]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Hormonio'
 *     responses:
 *       201:
 *         description: Hormônio criado com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 */
router.post("/", authenticateToken, requireCoach, createHormonioValidation, hormonioController.create)

/**
 * @swagger
 * /api/hormonios:
 *   get:
 *     summary: Listar todos os hormônios
 *     tags: [Hormônios]
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
 *         description: Limite de itens por página
 *       - in: query
 *         name: orderBy
 *         schema:
 *           type: string
 *           enum: [nomeHormonio, tipo, categoria, createdAt, updatedAt]
 *         description: Campo para ordenação
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Direção da ordenação
 *       - in: query
 *         name: tipo
 *         schema:
 *           type: string
 *           enum: [PEPTIDEO, ESTEROIDE, TIREOIDE, CRESCIMENTO, INSULINA, CORTISOL, TESTOSTERONA, OUTRO]
 *         description: Filtrar por tipo
 *       - in: query
 *         name: categoria
 *         schema:
 *           type: string
 *         description: Filtrar por categoria
 *       - in: query
 *         name: frequencia
 *         schema:
 *           type: string
 *         description: Filtrar por frequência
 *       - in: query
 *         name: viaAdministracao
 *         schema:
 *           type: string
 *         description: Filtrar por via de administração
 *     responses:
 *       200:
 *         description: Lista de hormônios
 *       401:
 *         description: Não autorizado
 */
router.get("/", authenticateToken, requireCoach, queryValidation, hormonioController.getAllHormonios)

/**
 * @swagger
 * /api/hormonios/search:
 *   get:
 *     summary: Buscar hormônios por nome
 *     tags: [Hormônios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: nome
 *         required: true
 *         schema:
 *           type: string
 *           minLength: 2
 *         description: Nome do hormônio para busca
 *     responses:
 *       200:
 *         description: Hormônios encontrados
 *       400:
 *         description: Parâmetros inválidos
 *       401:
 *         description: Não autorizado
 */
router.get("/search", authenticateToken, requireCoach, searchValidation, hormonioController.searchHormonios)

/**
 * @swagger
 * /api/hormonios/categoria/{categoria}:
 *   get:
 *     summary: Buscar hormônios por categoria
 *     tags: [Hormônios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: categoria
 *         required: true
 *         schema:
 *           type: string
 *         description: Categoria do hormônio
 *     responses:
 *       200:
 *         description: Hormônios da categoria
 *       401:
 *         description: Não autorizado
 */
router.get("/categoria/:categoria", authenticateToken, requireCoach, hormonioController.getHormoniosByCategory)

/**
 * @swagger
 * /api/hormonios/tipo/{tipo}:
 *   get:
 *     summary: Buscar hormônios por tipo
 *     tags: [Hormônios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tipo
 *         required: true
 *         schema:
 *           type: string
 *         description: Tipo do hormônio
 *     responses:
 *       200:
 *         description: Hormônios do tipo
 *       401:
 *         description: Não autorizado
 */
router.get("/tipo/:tipo", authenticateToken, requireCoach, hormonioController.getHormoniosByTipo)

/**
 * @swagger
 * /api/hormonios/via/{viaAdministracao}:
 *   get:
 *     summary: Buscar hormônios por via de administração
 *     tags: [Hormônios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: viaAdministracao
 *         required: true
 *         schema:
 *           type: string
 *         description: Via de administração
 *     responses:
 *       200:
 *         description: Hormônios por via de administração
 *       401:
 *         description: Não autorizado
 */
router.get("/via/:viaAdministracao", authenticateToken, requireCoach, hormonioController.getHormoniosByViaAdministracao)

/**
 * @swagger
 * /api/hormonios/{id}:
 *   get:
 *     summary: Buscar hormônio por ID
 *     tags: [Hormônios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do hormônio
 *     responses:
 *       200:
 *         description: Hormônio encontrado
 *       404:
 *         description: Hormônio não encontrado
 *       401:
 *         description: Não autorizado
 */
router.get("/:id", authenticateToken, requireCoach, getHormonioValidation, hormonioController.getHormonioById)

/**
 * @swagger
 * /api/hormonios/{id}:
 *   put:
 *     summary: Atualizar um hormônio
 *     tags: [Hormônios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do hormônio
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Hormonio'
 *     responses:
 *       200:
 *         description: Hormônio atualizado com sucesso
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Hormônio não encontrado
 *       401:
 *         description: Não autorizado
 */
router.put("/:id", authenticateToken, requireCoach, updateHormonioValidation, hormonioController.updateHormonio)

/**
 * @swagger
 * /api/hormonios/{id}:
 *   delete:
 *     summary: Excluir um hormônio
 *     tags: [Hormônios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do hormônio
 *     responses:
 *       200:
 *         description: Hormônio excluído com sucesso
 *       404:
 *         description: Hormônio não encontrado
 *       401:
 *         description: Não autorizado
 */
router.delete("/:id", authenticateToken, requireCoach, getHormonioValidation, hormonioController.deleteHormonio)

module.exports = router
