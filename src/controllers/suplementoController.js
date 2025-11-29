const suplementoService = require("../services/suplementoService")
const { validationResult } = require("express-validator")

class SuplementoController {
  async createSuplemento(req, res) {
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
      const suplemento = await suplementoService.createSuplemento(req.body, coachId)

      res.status(201).json({
        success: true,
        message: "Suplemento criado com sucesso",
        data: suplemento,
      })
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      })
    }
  }

  async getAllSuplementos(req, res) {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Parâmetros inválidos",
          errors: errors.array(),
        })
      }

      const coachId = req.user.id
      const { page = 1, limit = 10, orderBy = "nomeSuplemento", order = "asc", categoria, tipo, momento } = req.query

      const filters = {}
      if (categoria) filters.categoria = categoria
      if (tipo) filters.tipo = tipo
      if (momento) filters.momento = momento

      const result = await suplementoService.getAllSuplementos(
        coachId,
        filters,
        Number.parseInt(page),
        Number.parseInt(limit),
        orderBy,
        order,
      )

      res.json({
        success: true,
        message: "Suplementos recuperados com sucesso",
        data: result.suplementos,
        pagination: result.pagination,
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      })
    }
  }

  async getSuplementoById(req, res) {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "ID inválido",
          errors: errors.array(),
        })
      }

      const { id } = req.params
      const coachId = req.user.id

      const suplemento = await suplementoService.getSuplementoById(id, coachId)

      res.json({
        success: true,
        message: "Suplemento encontrado",
        data: suplemento,
      })
    } catch (error) {
      const statusCode = error.message === "Suplemento não encontrado" ? 404 : 500
      res.status(statusCode).json({
        success: false,
        message: error.message,
      })
    }
  }

  async updateSuplemento(req, res) {
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

      const suplemento = await suplementoService.updateSuplemento(id, req.body, coachId)

      res.json({
        success: true,
        message: "Suplemento atualizado com sucesso",
        data: suplemento,
      })
    } catch (error) {
      const statusCode = error.message === "Suplemento não encontrado" ? 404 : 400
      res.status(statusCode).json({
        success: false,
        message: error.message,
      })
    }
  }

  async deleteSuplemento(req, res) {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "ID inválido",
          errors: errors.array(),
        })
      }

      const { id } = req.params
      const coachId = req.user.id

      await suplementoService.deleteSuplemento(id, coachId)

      res.json({
        success: true,
        message: "Suplemento excluído com sucesso",
      })
    } catch (error) {
      const statusCode = error.message === "Suplemento não encontrado" ? 404 : 500
      res.status(statusCode).json({
        success: false,
        message: error.message,
      })
    }
  }

  async getSuplementosByCategory(req, res) {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Categoria inválida",
          errors: errors.array(),
        })
      }

      const { categoria } = req.params
      const coachId = req.user.id

      const suplementos = await suplementoService.getSuplementosByCategory(categoria, coachId)

      res.json({
        success: true,
        message: "Suplementos por categoria recuperados com sucesso",
        data: suplementos,
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      })
    }
  }

  async getSuplementosByTipo(req, res) {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Tipo inválido",
          errors: errors.array(),
        })
      }

      const { tipo } = req.params
      const coachId = req.user.id

      const suplementos = await suplementoService.getSuplementosByTipo(tipo, coachId)

      res.json({
        success: true,
        message: "Suplementos por tipo recuperados com sucesso",
        data: suplementos,
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      })
    }
  }

  async searchSuplementos(req, res) {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Parâmetros de busca inválidos",
          errors: errors.array(),
        })
      }

      const { nome } = req.query
      const coachId = req.user.id

      const suplementos = await suplementoService.searchSuplementos(nome, coachId)

      res.json({
        success: true,
        message: "Busca realizada com sucesso",
        data: suplementos,
      })
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      })
    }
  }
}

module.exports = new SuplementoController()
