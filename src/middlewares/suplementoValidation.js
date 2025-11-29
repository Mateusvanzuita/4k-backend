// Conteúdo do suplementoValidation.js atualizado

const { body, param, query } = require("express-validator")

// ... (constantes de categoria e tipo devem ser mantidas)

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

  // CAMPOS REMOVIDOS: dosagem, frequencia, momento

  body("observacoes")
    .optional()
    .isLength({ max: 500 })
    .withMessage("Observações deve ter no máximo 500 caracteres"),

  body("contraindicacoes")
    .optional()
    .isLength({ max: 500 })
    .withMessage("Contraindicações deve ter no máximo 500 caracteres"),

  body("nomeSuplemento").custom((value, { req }) => {
    if (req.body.tipo === "SUPLEMENTO" && !value) {
      throw new Error("Para tipo SUPLEMENTO, o nome do suplemento é obrigatório")
    }
    return true
  }),

  body("nomeManipulado").custom((value, { req }) => {
    if (req.body.tipo === "MANIPULADO" && !value) {
      throw new Error("Para tipo MANIPULADO, o nome do manipulado é obrigatório")
    }
    return true
  }),
]

const updateSuplementoValidation = [
  // Deixamos os campos opcionais
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

  // CAMPOS REMOVIDOS: dosagem, frequencia, momento

  body("observacoes")
    .optional()
    .isLength({ max: 500 })
    .withMessage("Observações deve ter no máximo 500 caracteres"),

  body("contraindicacoes")
    .optional()
    .isLength({ max: 500 })
    .withMessage("Contraindicações deve ter no máximo 500 caracteres"),

  // A validação de nome condicional deve ser tratada no service.
]

const getSuplementosValidation = [
  // ... (manter validações de page, limit, orderBy, order)

  query("orderBy")
    .optional()
    // REMOVER 'momento'
    .isIn(["nomeSuplemento", "nomeManipulado", "categoria", "tipo", "createdAt"])
    .withMessage("OrderBy inválido"),

  // REMOVER validação de 'momento'
  /*
  query("momento")
    .optional()
    .isIn(["PRE_TREINO", "POS_TREINO", "MANHA", "TARDE", "NOITE", "JEJUM", "REFEICAO"])
    .withMessage("Momento inválido"),
  */

  // ... (manter validações de categoria e tipo)
]

const getSuplementosByTipoValidation = [
  param("tipo").isIn(["SUPLEMENTO", "MANIPULADO"]).withMessage("Tipo deve ser SUPLEMENTO ou MANIPULADO"),
]

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

module.exports = {
  createSuplementoValidation,
  updateSuplementoValidation,
  getSuplementoValidation: getSuplementosValidation,
  getSuplementosByCategoryValidation,
  getSuplementosByTipoValidation,
  getSuplementosValidation, 
  searchSuplementosValidation: [
    query("nome")
      .notEmpty()
      .withMessage("O nome para busca é obrigatório")
      .isLength({ min: 2 })
      .withMessage("Nome deve ter pelo menos 2 caracteres"),
  ],
}