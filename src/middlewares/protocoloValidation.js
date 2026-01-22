// src/middlewares/protocoloValidation.js

const { body } = require("express-validator")

const createProtocoloValidation = [
  body("alunoId").isString().notEmpty().withMessage("O ID do aluno é obrigatório."),
  body("nome").isString().notEmpty().withMessage("O nome do protocolo é obrigatório."),
  body("status").isIn(["RASCUNHO", "ATIVO", "PAUSADO", "CONCLUIDO"]).optional(),

  // Validação das Refeições (Sincronizada com o mapeamento do frontend)
  body("refeicoes").isArray().optional(),
  body("refeicoes.*.nomeRefeicao").notEmpty().withMessage("Nome da refeição é obrigatório."),
  body("refeicoes.*.alimentos").isArray().withMessage("Alimentos deve ser um array."),
  body("refeicoes.*.alimentos.*.alimentoId").isString().notEmpty(),
  body("refeicoes.*.alimentos.*.quantidade").isNumeric(),

  // Validação do Plano de Treino
  body("planosTreino").isArray().optional(),
  body("planosTreino.*.nomeDivisao").notEmpty(),
  body("planosTreino.*.exercicios").isArray(),

  // Suplementos e Hormonas tornados opcionais para evitar erro 400 se vazios
  body("suplementos").isArray().optional(),
  body("hormonios").isArray().optional()
];

const updateProtocoloValidation = [
  body("alunoId").isString().optional(),
  body("nome").isString().optional(),
  body("status").isIn(["RASCUNHO", "ATIVO", "PAUSADO", "CONCLUIDO"]).optional(),
];

module.exports = {
  createProtocoloValidation,
  updateProtocoloValidation,
}