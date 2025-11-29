const express = require("express")
const authController = require("../controllers/authController")
const { authenticateToken, requireCoach } = require("../middlewares/auth")
const { validateRegister, validateLogin } = require("../middlewares/validation")

const router = express.Router()

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registrar novo usuário
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               name:
 *                 type: string
 *               userType:
 *                 type: string
 *                 enum: [COACH, STUDENT]
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 */
router.post("/register", authenticateToken, requireCoach, validateRegister, authController.register)

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Fazer login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 */
router.post("/login", validateLogin, authController.login)

/**
 * @swagger
 * /api/auth/profile:
 *   get:
 *     summary: Obter perfil do usuário
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil do usuário
 */
router.get("/profile", authenticateToken, authController.getProfile)

module.exports = router
