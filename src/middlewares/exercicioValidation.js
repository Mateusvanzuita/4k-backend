const { body, query } = require("express-validator")

const grupoMuscularValues = [
  "PEITO",
  "COSTAS",
  "PERNAS",
  "OMBROS",
  "BRACOS",
  "ABDOMEN",
  "GLUTEOS",
  "PANTURRILHA",
  "ANTEBRACO",
  "TRAPEZIO",
  "CORPO_INTEIRO",
]

const tipoExercicioValues = ["FORCA", "AEROBICO", "MOBILIDADE", "FLEXIBILIDADE", "FUNCIONAL", "CARDIO"]

const categoriaExercicioValues = ["INICIANTE", "INTERMEDIARIO", "AVANCADO"]

const createExercicioValidation = [
  body("nomeExercicio")
    .notEmpty()
    .withMessage("Nome do exercício é obrigatório")
    .isLength({ min: 2, max: 100 })
    .withMessage("Nome do exercício deve ter entre 2 e 100 caracteres")
    .trim(),

  body("grupoMuscular")
    .notEmpty()
    .withMessage("Grupo muscular é obrigatório")
    .isIn(grupoMuscularValues)
    .withMessage(`Grupo muscular deve ser um dos seguintes: ${grupoMuscularValues.join(", ")}`),

  body("tipoExercicio")
    .notEmpty()
    .withMessage("Tipo de exercício é obrigatório")
    .isIn(tipoExercicioValues)
    .withMessage(`Tipo de exercício deve ser um dos seguintes: ${tipoExercicioValues.join(", ")}`),

  body("categoria")
    .notEmpty()
    .withMessage("Categoria é obrigatória")
    .isIn(categoriaExercicioValues)
    .withMessage(`Categoria deve ser uma das seguintes: ${categoriaExercicioValues.join(", ")}`),

  body("linkVideo")
    .optional()
    .isURL()
    .withMessage("Link do vídeo deve ser uma URL válida")
    .custom((value) => {
      if (value) {
        const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/
        if (!youtubeRegex.test(value)) {
          throw new Error("Link deve ser do YouTube")
        }
      }
      return true
    }),

  body("descricao")
    .optional()
    .isLength({ max: 1000 })
    .withMessage("Descrição deve ter no máximo 1000 caracteres")
    .trim(),
]

const updateExercicioValidation = [
  body("nomeExercicio")
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage("Nome do exercício deve ter entre 2 e 100 caracteres")
    .trim(),

  body("grupoMuscular")
    .optional()
    .isIn(grupoMuscularValues)
    .withMessage(`Grupo muscular deve ser um dos seguintes: ${grupoMuscularValues.join(", ")}`),

  body("tipoExercicio")
    .optional()
    .isIn(tipoExercicioValues)
    .withMessage(`Tipo de exercício deve ser um dos seguintes: ${tipoExercicioValues.join(", ")}`),

  body("categoria")
    .optional()
    .isIn(categoriaExercicioValues)
    .withMessage(`Categoria deve ser uma das seguintes: ${categoriaExercicioValues.join(", ")}`),

  body("linkVideo")
    .optional()
    .isURL()
    .withMessage("Link do vídeo deve ser uma URL válida")
    .custom((value) => {
      if (value) {
        const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/
        if (!youtubeRegex.test(value)) {
          throw new Error("Link deve ser do YouTube")
        }
      }
      return true
    }),

  body("descricao")
    .optional()
    .isLength({ max: 1000 })
    .withMessage("Descrição deve ter no máximo 1000 caracteres")
    .trim(),
]

const queryExercicioValidation = [
  query("grupoMuscular")
    .optional()
    .isIn(grupoMuscularValues)
    .withMessage(`Grupo muscular deve ser um dos seguintes: ${grupoMuscularValues.join(", ")}`),

  query("tipoExercicio")
    .optional()
    .isIn(tipoExercicioValues)
    .withMessage(`Tipo de exercício deve ser um dos seguintes: ${tipoExercicioValues.join(", ")}`),

  query("categoria")
    .optional()
    .isIn(categoriaExercicioValues)
    .withMessage(`Categoria deve ser uma das seguintes: ${categoriaExercicioValues.join(", ")}`),

  query("search")
    .optional()
    .isLength({ min: 1, max: 100 })
    .withMessage("Busca deve ter entre 1 e 100 caracteres")
    .trim(),

  query("orderBy")
    .optional()
    .isIn(["nomeExercicio", "grupoMuscular", "tipoExercicio", "categoria", "createdAt"])
    .withMessage("Campo de ordenação inválido"),

  query("orderDirection").optional().isIn(["asc", "desc"]).withMessage('Direção de ordenação deve ser "asc" ou "desc"'),
]

module.exports = {
  createExercicioValidation,
  updateExercicioValidation,
  queryExercicioValidation,
  grupoMuscularValues,
  tipoExercicioValues,
  categoriaExercicioValues,
}
