const express = require("express")
const userController = require("../controllers/userController")
const { authenticateToken, requireAdmin, requireCoach } = require("../middlewares/auth")

const router = express.Router()

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Listar usuários
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: userType
 *         schema:
 *           type: string
 *           enum: [COACH, STUDENT]
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de usuários
 */
router.get("/", authenticateToken, requireAdmin, userController.getUsers)

/**
 * @swagger
 * /api/users/my-students:
 *   get:
 *     summary: Listar alunos do coach
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de alunos
 */
router.get("/my-students", authenticateToken, requireCoach, userController.getStudentsByCoach)

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Obter usuário por ID
 *     tags: [Users]
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
 *         description: Dados do usuário
 */
router.get("/:id", authenticateToken, userController.getUserById)

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Atualizar usuário
 *     tags: [Users]
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
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Usuário atualizado
 */
router.put("/:id", authenticateToken, userController.updateUser)

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Deletar usuário
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Usuário deletado
 */
router.delete("/:id", authenticateToken, requireAdmin, userController.deleteUser)

module.exports = router
