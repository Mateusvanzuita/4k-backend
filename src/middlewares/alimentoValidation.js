const { body, param, query } = require("express-validator")

const categorias = ["PROTEINA", "CARBOIDRATO", "GORDURA", "FRUTA", "VEGETAL", "LATICINIO", "OUTRO"]

const createAlimentoValidation = [
  body("nome")
    .notEmpty()
    .withMessage("Nome do alimento é obrigatório")
    .isLength({ min: 2, max: 100 })
    .withMessage("Nome deve ter entre 2 e 100 caracteres"),

  body("categoria")
    .isIn(categorias)
    .withMessage(`Categoria deve ser uma das opções: ${categorias.join(", ")}`),

  body("observacoes")
    .optional()
    .isLength({ max: 500 })
    .withMessage("Observações não podem exceder 500 caracteres"),
]

const updateAlimentoValidation = [
  param("id")
    .isString()
    .notEmpty()
    .withMessage("ID do alimento é obrigatório"),

  body("nome")
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage("Nome deve ter entre 2 e 100 caracteres"),

  body("categoria")
    .optional()
    .isIn(categorias)
    .withMessage(`Categoria deve ser uma das opções: ${categorias.join(", ")}`),

  body("observacoes")
    .optional()
    .isLength({ max: 500 })
    .withMessage("Observações não podem exceder 500 caracteres"),
]

const getAlimentoValidation = [
  param("id").isString().notEmpty().withMessage("ID é obrigatório"),
]

const queryAlimentoValidation = [
  query("page").optional().isInt({ min: 1 }).withMessage("Página inválida"),
  query("limit").optional().isInt({ min: 1, max: 100 }),
  query("nome").optional().isString(),
  query("categoria").optional().isIn(categorias),
  query("orderBy").optional().isIn(["nome", "categoria", "createdAt"]),
  query("order").optional().isIn(["asc", "desc"]),
]

module.exports = {
  createAlimentoValidation,
  updateAlimentoValidation,
  getAlimentoValidation,
  queryAlimentoValidation,
}
