const { body, param, query } = require("express-validator")

const createSuplementoValidation = [
  body("tipo").isIn(["SUPLEMENTO", "MANIPULADO"]).withMessage("Tipo deve ser SUPLEMENTO ou MANIPULADO"),

  body("categoria")
    .isIn([
      "TERMOGENICO",
      "PRE_TREINO",
      "HORMONAL",
      "ANTIOXIDANTE",
      "DIGESTIVO",
      "SONO",
      "VITAMINA",
      "MINERAL",
      "PROTEINA",
      "CREATINA",
      "BCAA",
      "OUTRO",
    ])
    .withMessage("Categoria inválida"),

  body("momento")
    .isIn(["PRE_TREINO", "POS_TREINO", "MANHA", "TARDE", "NOITE", "JEJUM", "REFEICAO"])
    .withMessage("Momento inválido"),

  body("dosagem")
    .notEmpty()
    .withMessage("Dosagem é obrigatória")
    .isLength({ min: 1, max: 100 })
    .withMessage("Dosagem deve ter entre 1 e 100 caracteres"),

  body("frequencia")
    .notEmpty()
    .withMessage("Frequência é obrigatória")
    .isLength({ min: 1, max: 100 })
    .withMessage("Frequência deve ter entre 1 e 100 caracteres"),

  body("nomeSuplemento")
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage("Nome do suplemento deve ter entre 2 e 100 caracteres"),

  body("nomeManipulado")
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage("Nome do manipulado deve ter entre 2 e 100 caracteres"),

  body("observacoes").optional().isLength({ max: 500 }).withMessage("Observações deve ter no máximo 500 caracteres"),

  body("contraindicacoes")
    .optional()
    .isLength({ max: 500 })
    .withMessage("Contraindicações deve ter no máximo 500 caracteres"),
]

const updateSuplementoValidation = [
  param("id").isString().withMessage("ID deve ser uma string válida"),

  body("tipo").optional().isIn(["SUPLEMENTO", "MANIPULADO"]).withMessage("Tipo deve ser SUPLEMENTO ou MANIPULADO"),

  body("categoria")
    .optional()
    .isIn([
      "TERMOGENICO",
      "PRE_TREINO",
      "HORMONAL",
      "ANTIOXIDANTE",
      "DIGESTIVO",
      "SONO",
      "VITAMINA",
      "MINERAL",
      "PROTEINA",
      "CREATINA",
      "BCAA",
      "OUTRO",
    ])
    .withMessage("Categoria inválida"),

  body("momento")
    .optional()
    .isIn(["PRE_TREINO", "POS_TREINO", "MANHA", "TARDE", "NOITE", "JEJUM", "REFEICAO"])
    .withMessage("Momento inválido"),

  body("dosagem").optional().isLength({ min: 1, max: 100 }).withMessage("Dosagem deve ter entre 1 e 100 caracteres"),

  body("frequencia")
    .optional()
    .isLength({ min: 1, max: 100 })
    .withMessage("Frequência deve ter entre 1 e 100 caracteres"),

  body("nomeSuplemento")
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage("Nome do suplemento deve ter entre 2 e 100 caracteres"),

  body("nomeManipulado")
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage("Nome do manipulado deve ter entre 2 e 100 caracteres"),

  body("observacoes").optional().isLength({ max: 500 }).withMessage("Observações deve ter no máximo 500 caracteres"),

  body("contraindicacoes")
    .optional()
    .isLength({ max: 500 })
    .withMessage("Contraindicações deve ter no máximo 500 caracteres"),
]

const getSuplementoValidation = [param("id").isString().withMessage("ID deve ser uma string válida")]

const getSuplementosByCategoryValidation = [
  param("categoria")
    .isIn([
      "TERMOGENICO",
      "PRE_TREINO",
      "HORMONAL",
      "ANTIOXIDANTE",
      "DIGESTIVO",
      "SONO",
      "VITAMINA",
      "MINERAL",
      "PROTEINA",
      "CREATINA",
      "BCAA",
      "OUTRO",
    ])
    .withMessage("Categoria inválida"),
]

const getSuplementosByTipoValidation = [
  param("tipo").isIn(["SUPLEMENTO", "MANIPULADO"]).withMessage("Tipo deve ser SUPLEMENTO ou MANIPULADO"),
]

const searchSuplementosValidation = [
  query("nome")
    .notEmpty()
    .withMessage("Nome é obrigatório para busca")
    .isLength({ min: 2 })
    .withMessage("Nome deve ter pelo menos 2 caracteres"),
]

const getSuplementosValidation = [
  query("page").optional().isInt({ min: 1 }).withMessage("Página deve ser um número inteiro maior que 0"),

  query("limit").optional().isInt({ min: 1, max: 100 }).withMessage("Limit deve ser um número inteiro entre 1 e 100"),

  query("orderBy")
    .optional()
    .isIn(["nomeSuplemento", "nomeManipulado", "categoria", "tipo", "momento", "createdAt"])
    .withMessage("OrderBy inválido"),

  query("order").optional().isIn(["asc", "desc"]).withMessage("Order deve ser 'asc' ou 'desc'"),

  query("categoria")
    .optional()
    .isIn([
      "TERMOGENICO",
      "PRE_TREINO",
      "HORMONAL",
      "ANTIOXIDANTE",
      "DIGESTIVO",
      "SONO",
      "VITAMINA",
      "MINERAL",
      "PROTEINA",
      "CREATINA",
      "BCAA",
      "OUTRO",
    ])
    .withMessage("Categoria inválida"),

  query("tipo").optional().isIn(["SUPLEMENTO", "MANIPULADO"]).withMessage("Tipo deve ser SUPLEMENTO ou MANIPULADO"),

  query("momento")
    .optional()
    .isIn(["PRE_TREINO", "POS_TREINO", "MANHA", "TARDE", "NOITE", "JEJUM", "REFEICAO"])
    .withMessage("Momento inválido"),
]

module.exports = {
  createSuplementoValidation,
  updateSuplementoValidation,
  getSuplementoValidation,
  getSuplementosByCategoryValidation,
  getSuplementosByTipoValidation,
  searchSuplementosValidation,
  getSuplementosValidation,
}
