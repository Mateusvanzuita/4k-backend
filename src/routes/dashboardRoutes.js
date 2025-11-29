const express = require("express")
const router = express.Router()
const dashboardController = require("../controllers/dashboardController")
const { authenticateToken, requireCoach } = require("../middlewares/auth")

/**
 * @swagger
 * /api/dashboard:
 *   get:
 *     summary: Obter dashboard do coach
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard obtido com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     indicators:
 *                       type: object
 *                       properties:
 *                         totalStudents:
 *                           type: integer
 *                         activeProtocols:
 *                           type: integer
 *                         newRegistrations:
 *                           type: integer
 *                     recentStudents:
 *                       type: array
 *                     newRegistrations:
 *                       type: array
 */
router.get("/", authenticateToken, requireCoach, dashboardController.getCoachDashboard)

/**
 * @swagger
 * /api/dashboard/students/stats:
 *   get:
 *     summary: Obter estatísticas de alunos por período
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: period
 *         schema:
 *           type: integer
 *           default: 30
 *         description: Período em dias
 *     responses:
 *       200:
 *         description: Estatísticas obtidas com sucesso
 */
router.get("/students/stats", authenticateToken, requireCoach, dashboardController.getStudentStats)

/**
 * @swagger
 * /api/dashboard/students/recent:
 *   get:
 *     summary: Obter alunos recentes
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 5
 *         description: Limite de alunos
 *     responses:
 *       200:
 *         description: Alunos recentes obtidos com sucesso
 */
router.get("/students/recent", authenticateToken, requireCoach, dashboardController.getRecentStudents)

module.exports = router
