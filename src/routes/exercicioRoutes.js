const express = require("express")
const router = express.Router()
const exercicioController = require("../controllers/exercicioController")
const { authenticateToken, requireCoach } = require("../middlewares/auth")
const { handleValidationErrors } = require("../middlewares/validation")
const {
  createExercicioValidation,
  updateExercicioValidation,
  queryExercicioValidation,
} = require("../middlewares/exercicioValidation")

/**
 * @swagger
 * components:
 *   schemas:
 *     Exercicio:
 *       type: object
 *       required:
 *         - nomeExercicio
 *         - grupoMuscular
 *         - tipoExercicio
 *         - categoria
 *       properties:
 *         id:
 *           type: string
 *           description: ID único do exercício
 *         nomeExercicio:
 *           type: string
 *           description: Nome do exercício
 *           example: "Supino reto"
 *         grupoMuscular:
 *           type: string
 *           enum: [PEITO, COSTAS, PERNAS, OMBROS, BRACOS, ABDOMEN, GLUTEOS, PANTURRILHA, ANTEBRACO, TRAPEZIO]
 *           description: Grupo muscular principal trabalhado
 *           example: "PEITO"
 *         tipoExercicio:
 *           type: string
 *           enum: [FORCA, AEROBICO, MOBILIDADE, FLEXIBILIDADE, EQUILIBRIO, COORDENACAO]
 *           description: Tipo de exercício
 *           example: "FORCA"
 *         categoria:
 *           type: string
 *           enum: [INICIANTE, INTERMEDIARIO, AVANCADO]
 *           description: Nível de dificuldade
 *           example: "INTERMEDIARIO"
 *         linkVideo:
 *           type: string
 *           format: uri
 *           description: Link do YouTube para demonstração
 *           example: "https://www.youtube.com/watch?v=example"
 *         descricao:
 *           type: string
 *           description: Descrição detalhada do exercício
 *           example: "Exercício para desenvolvimento do peitoral maior"
 *         coachId:
 *           type: string
 *           description: ID do coach que criou o exercício
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/exercicios:
 *   post:
 *     summary: Criar novo exercício
 *     tags: [Exercícios]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nomeExercicio
 *               - grupoMuscular
 *               - tipoExercicio
 *               - categoria
 *             properties:
 *               nomeExercicio:
 *                 type: string
 *                 example: "Supino reto"
 *               grupoMuscular:
 *                 type: string
 *                 enum: [PEITO, COSTAS, PERNAS, OMBROS, BRACOS, ABDOMEN, GLUTEOS, PANTURRILHA, ANTEBRACO, TRAPEZIO]
 *                 example: "PEITO"
 *               tipoExercicio:
 *                 type: string
 *                 enum: [FORCA, AEROBICO, MOBILIDADE, FLEXIBILIDADE, EQUILIBRIO, COORDENACAO]
 *                 example: "FORCA"
 *               categoria:
 *                 type: string
 *                 enum: [INICIANTE, INTERMEDIARIO, AVANCADO]
 *                 example: "INTERMEDIARIO"
 *               linkVideo:
 *                 type: string
 *                 format: uri
 *                 example: "https://www.youtube.com/watch?v=example"
 *               descricao:
 *                 type: string
 *                 example: "Exercício para desenvolvimento do peitoral maior"
 *     responses:
 *       201:
 *         description: Exercício criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Exercicio'
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Token de acesso inválido
 *       500:
 *         description: Erro interno do servidor
 */
router.post("/", authenticateToken, requireCoach, createExercicioValidation, handleValidationErrors, exercicioController.create)

/**
 * @swagger
 * /api/exercicios:
 *   get:
 *     summary: Listar todos os exercícios com filtros e ordenação
 *     tags: [Exercícios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Número da página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Quantidade de itens por página
 *       - in: query
 *         name: grupoMuscular
 *         schema:
 *           type: string
 *           enum: [PEITO, COSTAS, PERNAS, OMBROS, BRACOS, ABDOMEN, GLUTEOS, PANTURRILHA, ANTEBRACO, TRAPEZIO]
 *         description: Filtrar por grupo muscular
 *       - in: query
 *         name: tipoExercicio
 *         schema:
 *           type: string
 *           enum: [FORCA, AEROBICO, MOBILIDADE, FLEXIBILIDADE, EQUILIBRIO, COORDENACAO]
 *         description: Filtrar por tipo de exercício
 *       - in: query
 *         name: categoria
 *         schema:
 *           type: string
 *           enum: [INICIANTE, INTERMEDIARIO, AVANCADO]
 *         description: Filtrar por categoria/nível
 *       - in: query
 *         name: nomeExercicio
 *         schema:
 *           type: string
 *         description: Buscar por nome do exercício (busca parcial)
 *       - in: query
 *         name: orderBy
 *         schema:
 *           type: string
 *           enum: [nomeExercicio, grupoMuscular, tipoExercicio, categoria, createdAt]
 *           default: nomeExercicio
 *         description: Campo para ordenação
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: asc
 *         description: Direção da ordenação
 *     responses:
 *       200:
 *         description: Lista de exercícios
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 exercicios:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Exercicio'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     total:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *       401:
 *         description: Token de acesso inválido
 */
router.get("/", authenticateToken, requireCoach, queryExercicioValidation, handleValidationErrors, exercicioController.getAll)

/**
 * @swagger
 * /api/exercicios/{id}:
 *   get:
 *     summary: Buscar exercício por ID
 *     tags: [Exercícios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do exercício
 *     responses:
 *       200:
 *         description: Exercício encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Exercicio'
 *       404:
 *         description: Exercício não encontrado
 *       401:
 *         description: Token de acesso inválido
 */
router.get("/:id", authenticateToken, requireCoach, handleValidationErrors, exercicioController.getById)

/**
 * @swagger
 * /api/exercicios/{id}:
 *   put:
 *     summary: Atualizar exercício
 *     tags: [Exercícios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do exercício
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nomeExercicio:
 *                 type: string
 *                 example: "Supino inclinado"
 *               grupoMuscular:
 *                 type: string
 *                 enum: [PEITO, COSTAS, PERNAS, OMBROS, BRACOS, ABDOMEN, GLUTEOS, PANTURRILHA, ANTEBRACO, TRAPEZIO]
 *                 example: "PEITO"
 *               tipoExercicio:
 *                 type: string
 *                 enum: [FORCA, AEROBICO, MOBILIDADE, FLEXIBILIDADE, EQUILIBRIO, COORDENACAO]
 *                 example: "FORCA"
 *               categoria:
 *                 type: string
 *                 enum: [INICIANTE, INTERMEDIARIO, AVANCADO]
 *                 example: "AVANCADO"
 *               linkVideo:
 *                 type: string
 *                 format: uri
 *                 example: "https://www.youtube.com/watch?v=updated"
 *               descricao:
 *                 type: string
 *                 example: "Variação do supino para parte superior do peitoral"
 *     responses:
 *       200:
 *         description: Exercício atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Exercicio'
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Exercício não encontrado
 *       401:
 *         description: Token de acesso inválido
 *       403:
 *         description: Sem permissão para atualizar este exercício
 */
router.put("/:id", authenticateToken, requireCoach, updateExercicioValidation, handleValidationErrors, exercicioController.update)

/**
 * @swagger
 * /api/exercicios/{id}:
 *   delete:
 *     summary: Deletar exercício
 *     tags: [Exercícios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do exercício
 *     responses:
 *       200:
 *         description: Exercício deletado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Exercício deletado com sucesso"
 *       404:
 *         description: Exercício não encontrado
 *       401:
 *         description: Token de acesso inválido
 *       403:
 *         description: Sem permissão para deletar este exercício
 */
router.delete("/:id", authenticateToken, requireCoach, handleValidationErrors, exercicioController.delete)

module.exports = router
