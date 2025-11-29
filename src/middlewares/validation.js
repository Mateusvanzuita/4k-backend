const { body, validationResult } = require("express-validator")

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: "Dados inválidos",
      details: errors.array(),
    })
  }
  next()
}

const validateRegister = [
  body("email").isEmail().withMessage("Email inválido"),
  body("password").isLength({ min: 6 }).withMessage("Senha deve ter pelo menos 6 caracteres"),
  body("name").notEmpty().withMessage("Nome é obrigatório"),
  body("userType").isIn(["COACH", "STUDENT"]).withMessage("Tipo de usuário inválido"),
  handleValidationErrors,
]

const validateLogin = [
  body("email").isEmail().withMessage("Email inválido"),
  body("password").notEmpty().withMessage("Senha é obrigatória"),
  handleValidationErrors,
]

const validateNotification = [
  body("title").notEmpty().withMessage("Título é obrigatório"),
  body("message").notEmpty().withMessage("Mensagem é obrigatória"),
  body("receiverId").notEmpty().withMessage("ID do destinatário é obrigatório"),
  handleValidationErrors,
]

module.exports = {
  validateRegister,
  validateLogin,
  validateNotification,
  handleValidationErrors,
}
