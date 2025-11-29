const { body, param, query } = require("express-validator")

const categorias = ["PROTEINA", "CARBOIDRATO", "GORDURA", "FRUTA", "VEGETAL", "LATICINIO", "OUTRO"]
const unidades = ["GRAMAS", "MILILITROS", "UNIDADE", "COLHER", "XICARA", "PORCAO"]

const createAlimentoValidation = [
  body("nomeAlimento")
    .notEmpty()
    .withMessage("Nome do alimento é obrigatório")
    .isLength({ min: 2, max: 100 })
    .withMessage("Nome deve ter entre 2 e 100 caracteres"),

  body("categoria")
    .isIn(categorias)
    .withMessage(`Categoria deve ser uma das opções: ${categorias.join(", ")}`),

  body("quantidade").isFloat({ min: 0.1 }).withMessage("Quantidade deve ser um número positivo"),

  body("unidade")
    .isIn(unidades)
    .withMessage(`Unidade deve ser uma das opções: ${unidades.join(", ")}`),

  body("calorias").isFloat({ min: 0 }).withMessage("Calorias deve ser um número não negativo"),

  body("proteinas").isFloat({ min: 0 }).withMessage("Proteínas deve ser um número não negativo"),

  body("carboidratos").isFloat({ min: 0 }).withMessage("Carboidratos deve ser um número não negativo"),

  body("gorduras").isFloat({ min: 0 }).withMessage("Gorduras deve ser um número não negativo"),

  body("fibras").optional().isFloat({ min: 0 }).withMessage("Fibras deve ser um número não negativo"),

  body("observacoes").optional().isLength({ max: 500 }).withMessage("Observações não podem exceder 500 caracteres"),
]

const updateAlimentoValidation = [
  param("id").isString().notEmpty().withMessage("ID do alimento é obrigatório"),

  body("nomeAlimento").optional().isLength({ min: 2, max: 100 }).withMessage("Nome deve ter entre 2 e 100 caracteres"),

  body("categoria")
    .optional()
    .isIn(categorias)
    .withMessage(`Categoria deve ser uma das opções: ${categorias.join(", ")}`),

  body("quantidade").optional().isFloat({ min: 0.1 }).withMessage("Quantidade deve ser um número positivo"),

  body("unidade")
    .optional()
    .isIn(unidades)
    .withMessage(`Unidade deve ser uma das opções: ${unidades.join(", ")}`),

  body("calorias").optional().isFloat({ min: 0 }).withMessage("Calorias deve ser um número não negativo"),

  body("proteinas").optional().isFloat({ min: 0 }).withMessage("Proteínas deve ser um número não negativo"),

  body("carboidratos").optional().isFloat({ min: 0 }).withMessage("Carboidratos deve ser um número não negativo"),

  body("gorduras").optional().isFloat({ min: 0 }).withMessage("Gorduras deve ser um número não negativo"),

  body("fibras").optional().isFloat({ min: 0 }).withMessage("Fibras deve ser um número não negativo"),

  body("observacoes").optional().isLength({ max: 500 }).withMessage("Observações não podem exceder 500 caracteres"),
]

const getAlimentoValidation = [param("id").isString().notEmpty().withMessage("ID do alimento é obrigatório")]

const queryAlimentoValidation = [
  query("page").optional().isInt({ min: 1 }).withMessage("Página deve ser um número inteiro positivo"),

  query("limit").optional().isInt({ min: 1, max: 100 }).withMessage("Limite deve ser um número entre 1 e 100"),

  query("categoria")
    .optional()
    .isIn(categorias)
    .withMessage(`Categoria deve ser uma das opções: ${categorias.join(", ")}`),

  query("orderBy")
    .optional()
    .isIn(["nomeAlimento", "categoria", "calorias", "createdAt"])
    .withMessage("Ordenação deve ser por: nomeAlimento, categoria, calorias ou createdAt"),

  query("order").optional().isIn(["asc", "desc"]).withMessage("Ordem deve ser asc ou desc"),
]

module.exports = {
  createAlimentoValidation,
  updateAlimentoValidation,
  getAlimentoValidation,
  queryAlimentoValidation,
}
