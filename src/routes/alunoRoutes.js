const express = require("express")
const router = express.Router()
const studentController = require("../controllers/alunoController")
const { authenticateToken, requireCoach } = require("../middlewares/auth")
const { createStudentValidation, updateStudentValidation } = require("../middlewares/alunoValidation")

/**
 * @swagger
 * components:
 *   schemas:
 *     Student:
 *       type: object
 *       required:
 *         - nomeAluno
 *         - email
 *         - senha
 *       properties:
 *         nomeAluno:
 *           type: string
 *           description: Nome completo do aluno
 *         email:
 *           type: string
 *           format: email
 *           description: Email do aluno
 *         senha:
 *           type: string
 *           minLength: 6
 *           description: Senha do aluno
 *         dataNascimento:
 *           type: string
 *           format: date
 *           description: Data de nascimento do aluno
 *         sexo:
 *           type: string
 *           enum: [MASCULINO, FEMININO]
 *           description: Sexo do aluno
 *         tipoPlano:
 *           type: string
 *           enum: [DIETA, TREINO, FULL]
 *           description: Tipo de plano do aluno
 *         duracaoPlano:
 *           type: string
 *           enum: [MENSAL, TRIMESTRAL]
 *           description: Duração do plano
 *         peso:
 *           type: number
 *           format: float
 *           minimum: 20
 *           maximum: 300
 *           description: Peso em kg
 *         altura:
 *           type: number
 *           format: float
 *           minimum: 0.5
 *           maximum: 2.5
 *           description: Altura em metros
 *         frequenciaFotos:
 *           type: string
 *           enum: [SEMANAL, QUINZENAL, MENSAL]
 *           description: Frequência de envio de fotos
 *         objetivo:
 *           type: string
 *           maxLength: 500
 *           description: Objetivo do aluno
 *         historicoMedico:
 *           type: string
 *           maxLength: 1000
 *           description: Histórico médico do aluno
 */

/**
 * @swagger
 * /api/students:
 *   post:
 *     summary: Criar novo aluno
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Student'
 *     responses:
 *       201:
 *         description: Aluno criado com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Apenas coaches podem criar alunos
 */
router.get("/profile/me", authenticateToken, studentController.getProfileMe);
router.post("/", authenticateToken, requireCoach, createStudentValidation, studentController.createStudent)

/**
 * @swagger
 * /api/students:
 *   get:
 *     summary: Listar alunos do coach
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número da página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Itens por página
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Buscar por nome ou email
 *       - in: query
 *         name: tipoPlano
 *         schema:
 *           type: string
 *           enum: [DIETA, TREINO, FULL]
 *         description: Filtrar por tipo de plano
 *       - in: query
 *         name: sexo
 *         schema:
 *           type: string
 *           enum: [MASCULINO, FEMININO]
 *         description: Filtrar por sexo
 *       - in: query
 *         name: duracaoPlano
 *         schema:
 *           type: string
 *           enum: [MENSAL, TRIMESTRAL]
 *         description: Filtrar por duração do plano
 *     responses:
 *       200:
 *         description: Lista de alunos
 *       401:
 *         description: Não autorizado
 */
router.get("/", authenticateToken, requireCoach, studentController.getStudents)

/**
 * @swagger
 * /api/students/{id}:
 *   get:
 *     summary: Buscar aluno por ID
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do aluno
 *     responses:
 *       200:
 *         description: Dados do aluno
 *       404:
 *         description: Aluno não encontrado
 *       401:
 *         description: Não autorizado
 */
router.get("/:id", authenticateToken, requireCoach, studentController.getStudentById)

/**
 * @swagger
 * /api/students/{id}:
 *   put:
 *     summary: Atualizar aluno
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do aluno
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Student'
 *     responses:
 *       200:
 *         description: Aluno atualizado com sucesso
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Aluno não encontrado
 *       401:
 *         description: Não autorizado
 */
router.put("/:id", authenticateToken, requireCoach, updateStudentValidation, studentController.updateStudent)

/**
 * @swagger
 * /api/students/{id}:
 *   delete:
 *     summary: Excluir aluno
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do aluno
 *     responses:
 *       200:
 *         description: Aluno excluído com sucesso
 *       404:
 *         description: Aluno não encontrado
 *       401:
 *         description: Não autorizado
 */
router.delete("/:id", authenticateToken, requireCoach, studentController.deleteStudent)

module.exports = router
