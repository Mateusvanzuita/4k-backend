const express = require("express")
const multer = require("multer")
const uploadController = require("../controllers/uploadController")
const { authenticateToken } = require("../middlewares/auth")

const router = express.Router()

// Configuração do multer para upload em memória
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: Number.parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"]
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error("Tipo de arquivo não permitido"), false)
    }
  },
})

/**
 * @swagger
 * /api/upload/avatar:
 *   post:
 *     summary: Upload de avatar
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               avatar:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Avatar atualizado com sucesso
 */
router.post("/avatar", authenticateToken, upload.single("avatar"), uploadController.uploadAvatar)

module.exports = router
