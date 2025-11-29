const studentService = require("../services/alunoService")
const { validationResult } = require("express-validator")

class StudentController {
  async createStudent(req, res, next) {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Dados inválidos",
          errors: errors.array(),
        })
      }

      const coachId = req.user.id
      const studentData = { ...req.body, coachId }

      const student = await studentService.createStudent(studentData)

      res.status(201).json({
        success: true,
        message: "Aluno criado com sucesso",
        data: student,
      })
    } catch (error) {
      next(error)
    }
  }

  async getStudents(req, res, next) {
    try {
      const coachId = req.user.id
      const { page = 1, limit = 10, search, tipoPlano, sexo, duracaoPlano } = req.query

      const filters = {
        coachId,
        search,
        tipoPlano,
        sexo,
        duracaoPlano,
      }

      const result = await studentService.getStudents(filters, {
        page: Number.parseInt(page),
        limit: Number.parseInt(limit),
      })

      res.json({
        success: true,
        data: result.students,
        pagination: {
          page: Number.parseInt(page),
          limit: Number.parseInt(limit),
          total: result.total,
          totalPages: Math.ceil(result.total / limit),
        },
      })
    } catch (error) {
      next(error)
    }
  }

  async getStudentById(req, res, next) {
    try {
      const { id } = req.params
      const coachId = req.user.id

      const student = await studentService.getStudentById(id, coachId)

      if (!student) {
        return res.status(404).json({
          success: false,
          message: "Aluno não encontrado",
        })
      }

      res.json({
        success: true,
        data: student,
      })
    } catch (error) {
      next(error)
    }
  }

  async updateStudent(req, res, next) {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Dados inválidos",
          errors: errors.array(),
        })
      }

      const { id } = req.params
      const coachId = req.user.id

      const student = await studentService.updateStudent(id, req.body, coachId)

      if (!student) {
        return res.status(404).json({
          success: false,
          message: "Aluno não encontrado",
        })
      }

      res.json({
        success: true,
        message: "Aluno atualizado com sucesso",
        data: student,
      })
    } catch (error) {
      next(error)
    }
  }

  async deleteStudent(req, res, next) {
    try {
      const { id } = req.params
      const coachId = req.user.id

      const deleted = await studentService.deleteStudent(id, coachId)

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: "Aluno não encontrado",
        })
      }

      res.json({
        success: true,
        message: "Aluno excluído com sucesso",
      })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = new StudentController()
