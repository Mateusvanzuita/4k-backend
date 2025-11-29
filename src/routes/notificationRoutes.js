const express = require("express")
const notificationController = require("../controllers/notificationController")
const { authenticateToken } = require("../middlewares/auth")
const { validateNotification } = require("../middlewares/validation")

const router = express.Router()

/**
 * @swagger
 * /api/notifications:
 *   post:
 *     summary: Criar notificação
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               message:
 *                 type: string
 *               receiverId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Notificação criada
 */
router.post("/", authenticateToken, validateNotification, notificationController.createNotification)

/**
 * @swagger
 * /api/notifications:
 *   get:
 *     summary: Listar notificações do usuário
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: read
 *         schema:
 *           type: string
 *           enum: [true, false]
 *     responses:
 *       200:
 *         description: Lista de notificações
 */
router.get("/", authenticateToken, notificationController.getNotifications)

/**
 * @swagger
 * /api/notifications/{id}/read:
 *   patch:
 *     summary: Marcar notificação como lida
 *     tags: [Notifications]
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
 *         description: Notificação marcada como lida
 */
router.patch("/:id/read", authenticateToken, notificationController.markAsRead)

/**
 * @swagger
 * /api/notifications/{id}:
 *   delete:
 *     summary: Deletar notificação
 *     tags: [Notifications]
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
 *         description: Notificação deletada
 */
router.delete("/:id", authenticateToken, notificationController.deleteNotification)

module.exports = router
