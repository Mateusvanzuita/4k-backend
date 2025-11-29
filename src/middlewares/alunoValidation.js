const { body } = require("express-validator")

const createStudentValidation = [
  body("nomeAluno")
    .notEmpty()
    .withMessage("Nome do aluno é obrigatório")
    .isLength({ min: 2, max: 100 })
    .withMessage("Nome deve ter entre 2 e 100 caracteres"),

  body("email").isEmail().withMessage("Email deve ser válido").normalizeEmail(),

  body("senha").isLength({ min: 6 }).withMessage("Senha deve ter pelo menos 6 caracteres"),

  body("dataNascimento").optional().isISO8601().withMessage("Data de nascimento deve ser uma data válida"),

  body("sexo").optional().isIn(["MASCULINO", "FEMININO"]).withMessage("Sexo deve ser MASCULINO ou FEMININO"),

  body("tipoPlano")
    .optional()
    .isIn(["DIETA", "TREINO", "FULL"])
    .withMessage("Tipo de plano deve ser DIETA, TREINO ou FULL"),

  body("plano")
    .optional()
    .isIn(["MENSAL", "TRIMESTRAL", "SEMESTRAL", "ANUAL"])
    .withMessage("Plano deve ser MENSAL, TRIMESTRAL, SEMESTRAL ou ANUAL"),

  body("peso").optional().isFloat({ min: 20, max: 300 }).withMessage("Peso deve ser um número entre 20 e 300 kg"),

  body("altura")
    .optional()
    .isFloat({ min: 0.5, max: 2.5 })
    .withMessage("Altura deve ser um número entre 0.5 e 2.5 metros"),

  body("frequenciaFotos")
    .optional()
    .isIn(["SEMANAL", "QUINZENAL", "MENSAL"])
    .withMessage("Frequência de fotos deve ser SEMANAL, QUINZENAL ou MENSAL"),

  body("objetivo").optional().isLength({ max: 500 }).withMessage("Objetivo deve ter no máximo 500 caracteres"),

  body("restricaoAlimentar")
    .optional()
    .isLength({ max: 1000 })
    .withMessage("Restrição alimentar deve ter no máximo 1000 caracteres"),

  body("restricaoExercicio")
    .optional()
    .isLength({ max: 1000 })
    .withMessage("Restrição de exercício deve ter no máximo 1000 caracteres"),

  body("historicoMedico")
    .optional()
    .isLength({ max: 1000 })
    .withMessage("Histórico médico deve ter no máximo 1000 caracteres"),
]

const updateStudentValidation = [
  body("nomeAluno").optional().isLength({ min: 2, max: 100 }).withMessage("Nome deve ter entre 2 e 100 caracteres"),

  body("email").optional().isEmail().withMessage("Email deve ser válido").normalizeEmail(),

  body("senha").optional().isLength({ min: 6 }).withMessage("Senha deve ter pelo menos 6 caracteres"),

  body("dataNascimento").optional().isISO8601().withMessage("Data de nascimento deve ser uma data válida"),

  body("sexo").optional().isIn(["MASCULINO", "FEMININO"]).withMessage("Sexo deve ser MASCULINO ou FEMININO"),

  body("tipoPlano")
    .optional()
    .isIn(["DIETA", "TREINO", "FULL"])
    .withMessage("Tipo de plano deve ser DIETA, TREINO ou FULL"),

  body("plano")
    .optional()
    .isIn(["MENSAL", "TRIMESTRAL", "SEMESTRAL", "ANUAL"])
    .withMessage("Plano deve ser MENSAL, TRIMESTRAL, SEMESTRAL ou ANUAL"),

  body("peso").optional().isFloat({ min: 20, max: 300 }).withMessage("Peso deve ser um número entre 20 e 300 kg"),

  body("altura")
    .optional()
    .isFloat({ min: 0.5, max: 2.5 })
    .withMessage("Altura deve ser um número entre 0.5 e 2.5 metros"),

  body("frequenciaFotos")
    .optional()
    .isIn(["SEMANAL", "QUINZENAL", "MENSAL"])
    .withMessage("Frequência de fotos deve ser SEMANAL, QUINZENAL ou MENSAL"),

  body("objetivo").optional().isLength({ max: 500 }).withMessage("Objetivo deve ter no máximo 500 caracteres"),

  body("restricaoAlimentar")
    .optional()
    .isLength({ max: 1000 })
    .withMessage("Restrição alimentar deve ter no máximo 1000 caracteres"),

  body("restricaoExercicio")
    .optional()
    .isLength({ max: 1000 })
    .withMessage("Restrição de exercício deve ter no máximo 1000 caracteres"),

  body("historicoMedico")
    .optional()
    .isLength({ max: 1000 })
    .withMessage("Histórico médico deve ter no máximo 1000 caracteres"),
]

module.exports = {
  createStudentValidation,
  updateStudentValidation,
}
