const { body, param, query } = require("express-validator")

const createHormonioValidation = [
  body("nomeHormonio")
    .notEmpty()
    .withMessage("Nome do hormônio é obrigatório")
    .isLength({ min: 2, max: 100 })
    .withMessage("Nome do hormônio deve ter entre 2 e 100 caracteres"),

  body("tipo")
    .isIn(["PEPTIDEO", "ESTEROIDE", "TIREOIDE", "CRESCIMENTO", "INSULINA", "CORTISOL", "TESTOSTERONA", "OUTRO"])
    .withMessage("Tipo deve ser um dos valores válidos"),

  body("categoria")
    .isIn([
      "GH_RELEASING",
      "INSULINA_LIKE",
      "PEPTIDEO_TERAPEUTICO",
      "ANABOLICO",
      "ANDROGENICO",
      "CORTICOSTEROIDE",
      "T3",
      "T4",
      "TSH",
      "SOMATOTROPINA",
      "IGF",
      "RAPIDA",
      "LENTA",
      "INTERMEDIARIA",
      "MODULADOR_HORMONAL",
      "OUTRO",
    ])
    .withMessage("Categoria deve ser um dos valores válidos"),

  body("dosagem")
    .notEmpty()
    .withMessage("Dosagem é obrigatória")
    .isLength({ max: 50 })
    .withMessage("Dosagem deve ter no máximo 50 caracteres"),

  body("frequencia")
    .isIn(["DIARIA", "DIA_SIM_DIA_NAO", "DUAS_VEZES_SEMANA", "SEMANAL", "QUINZENAL", "MENSAL", "CONFORME_NECESSARIO"])
    .withMessage("Frequência deve ser um dos valores válidos"),

  body("viaAdministracao")
    .isIn(["SUBCUTANEA", "INTRAMUSCULAR", "ORAL", "TOPICA", "NASAL", "INTRAVENOSA"])
    .withMessage("Via de administração deve ser um dos valores válidos"),

  body("duracaoUso")
    .isIn([
      "DUAS_SEMANAS",
      "QUATRO_SEMANAS",
      "SEIS_SEMANAS",
      "OITO_SEMANAS",
      "DOZE_SEMANAS",
      "DEZESSEIS_SEMANAS",
      "VINTE_SEMANAS",
      "CONTINUO",
    ])
    .withMessage("Duração de uso deve ser um dos valores válidos"),

  body("observacoes").optional().isLength({ max: 500 }).withMessage("Observações devem ter no máximo 500 caracteres"),

  body("contraindicacoes")
    .optional()
    .isLength({ max: 500 })
    .withMessage("Contraindicações devem ter no máximo 500 caracteres"),

  body("efeitosColaterais")
    .optional()
    .isLength({ max: 500 })
    .withMessage("Efeitos colaterais devem ter no máximo 500 caracteres"),
]

const updateHormonioValidation = [
  param("id").isString().withMessage("ID deve ser uma string válida"),

  body("nomeHormonio")
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage("Nome do hormônio deve ter entre 2 e 100 caracteres"),

  body("tipo")
    .optional()
    .isIn(["PEPTIDEO", "ESTEROIDE", "TIREOIDE", "CRESCIMENTO", "INSULINA", "CORTISOL", "TESTOSTERONA", "OUTRO"])
    .withMessage("Tipo deve ser um dos valores válidos"),

  body("categoria")
    .optional()
    .isIn([
      "GH_RELEASING",
      "INSULINA_LIKE",
      "PEPTIDEO_TERAPEUTICO",
      "ANABOLICO",
      "ANDROGENICO",
      "CORTICOSTEROIDE",
      "T3",
      "T4",
      "TSH",
      "SOMATOTROPINA",
      "IGF",
      "RAPIDA",
      "LENTA",
      "INTERMEDIARIA",
      "MODULADOR_HORMONAL",
      "OUTRO",
    ])
    .withMessage("Categoria deve ser um dos valores válidos"),

  body("dosagem").optional().isLength({ max: 50 }).withMessage("Dosagem deve ter no máximo 50 caracteres"),

  body("frequencia")
    .optional()
    .isIn(["DIARIA", "DIA_SIM_DIA_NAO", "DUAS_VEZES_SEMANA", "SEMANAL", "QUINZENAL", "MENSAL", "CONFORME_NECESSARIO"])
    .withMessage("Frequência deve ser um dos valores válidos"),

  body("viaAdministracao")
    .optional()
    .isIn(["SUBCUTANEA", "INTRAMUSCULAR", "ORAL", "TOPICA", "NASAL", "INTRAVENOSA"])
    .withMessage("Via de administração deve ser um dos valores válidos"),

  body("duracaoUso")
    .optional()
    .isIn([
      "DUAS_SEMANAS",
      "QUATRO_SEMANAS",
      "SEIS_SEMANAS",
      "OITO_SEMANAS",
      "DOZE_SEMANAS",
      "DEZESSEIS_SEMANAS",
      "VINTE_SEMANAS",
      "CONTINUO",
    ])
    .withMessage("Duração de uso deve ser um dos valores válidos"),

  body("observacoes").optional().isLength({ max: 500 }).withMessage("Observações devem ter no máximo 500 caracteres"),

  body("contraindicacoes")
    .optional()
    .isLength({ max: 500 })
    .withMessage("Contraindicações devem ter no máximo 500 caracteres"),

  body("efeitosColaterais")
    .optional()
    .isLength({ max: 500 })
    .withMessage("Efeitos colaterais devem ter no máximo 500 caracteres"),
]

const getHormonioValidation = [param("id").isString().withMessage("ID deve ser uma string válida")]

const queryValidation = [
  query("page").optional().isInt({ min: 1 }).withMessage("Página deve ser um número inteiro maior que 0"),

  query("limit").optional().isInt({ min: 1, max: 100 }).withMessage("Limite deve ser um número inteiro entre 1 e 100"),

  query("orderBy")
    .optional()
    .isIn(["nomeHormonio", "tipo", "categoria", "createdAt", "updatedAt"])
    .withMessage("Campo de ordenação inválido"),

  query("order").optional().isIn(["asc", "desc"]).withMessage("Ordem deve ser 'asc' ou 'desc'"),

  query("tipo")
    .optional()
    .isIn(["PEPTIDEO", "ESTEROIDE", "TIREOIDE", "CRESCIMENTO", "INSULINA", "CORTISOL", "TESTOSTERONA", "OUTRO"])
    .withMessage("Tipo deve ser um dos valores válidos"),

  query("categoria")
    .optional()
    .isIn([
      "GH_RELEASING",
      "INSULINA_LIKE",
      "PEPTIDEO_TERAPEUTICO",
      "ANABOLICO",
      "ANDROGENICO",
      "CORTICOSTEROIDE",
      "T3",
      "T4",
      "TSH",
      "SOMATOTROPINA",
      "IGF",
      "RAPIDA",
      "LENTA",
      "INTERMEDIARIA",
      "MODULADOR_HORMONAL",
      "OUTRO",
    ])
    .withMessage("Categoria deve ser um dos valores válidos"),

  query("frequencia")
    .optional()
    .isIn(["DIARIA", "DIA_SIM_DIA_NAO", "DUAS_VEZES_SEMANA", "SEMANAL", "QUINZENAL", "MENSAL", "CONFORME_NECESSARIO"])
    .withMessage("Frequência deve ser um dos valores válidos"),

  query("viaAdministracao")
    .optional()
    .isIn(["SUBCUTANEA", "INTRAMUSCULAR", "ORAL", "TOPICA", "NASAL", "INTRAVENOSA"])
    .withMessage("Via de administração deve ser um dos valores válidos"),
]

const searchValidation = [
  query("nome")
    .notEmpty()
    .withMessage("Nome para busca é obrigatório")
    .isLength({ min: 2 })
    .withMessage("Nome para busca deve ter pelo menos 2 caracteres"),
]

module.exports = {
  createHormonioValidation,
  updateHormonioValidation,
  getHormonioValidation,
  queryValidation,
  searchValidation,
}
