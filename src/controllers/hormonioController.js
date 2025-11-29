const hormonioService = require("../services/hormonioService")
const { validationResult } = require("express-validator")

class HormonioController {
  async create(req, res, next) {
    try {
      const coachId = req.user.id
      const hormonioData = { ...req.body, coachId }

      const hormonio = await hormonioService.createHormonio(hormonioData)

      res.status(201).json({
        success: true,
        message: "Hormônio criado com sucesso",
        data: hormonio,
      })
    } catch (error) {
      next(error)
    }
  }

  async getAllHormonios(req, res) {
    try {
      // Verificar erros de validação
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: "Parâmetros inválidos",
          details: errors.array(),
        })
      }

      const coachId = req.user.userId
      const { page = 1, limit = 10, orderBy = "nomeHormonio", order = "asc", ...filters } = req.query

      const result = await hormonioService.getAllHormonios(
        coachId,
        filters,
        Number.parseInt(page),
        Number.parseInt(limit),
        orderBy,
        order,
      )

      res.json({
        message: "Hormônios recuperados com sucesso",
        data: result,
      })
    } catch (error) {
      console.error("Erro ao buscar hormônios:", error)
      res.status(500).json({
        error: "Erro interno do servidor",
        message: error.message,
      })
    }
  }

  async getHormonioById(req, res) {
    try {
      // Verificar erros de validação
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: "ID inválido",
          details: errors.array(),
        })
      }

      const coachId = req.user.userId
      const { id } = req.params

      const hormonio = await hormonioService.getHormonioById(id, coachId)

      res.json({
        message: "Hormônio encontrado",
        data: hormonio,
      })
    } catch (error) {
      console.error("Erro ao buscar hormônio:", error)

      if (error.message === "Hormônio não encontrado") {
        return res.status(404).json({
          error: "Não encontrado",
          message: error.message,
        })
      }

      res.status(500).json({
        error: "Erro interno do servidor",
        message: error.message,
      })
    }
  }

  async updateHormonio(req, res) {
    try {
      // Verificar erros de validação
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: "Dados inválidos",
          details: errors.array(),
        })
      }

      const coachId = req.user.userId
      const { id } = req.params

      const hormonio = await hormonioService.updateHormonio(id, req.body, coachId)

      res.json({
        message: "Hormônio atualizado com sucesso",
        data: hormonio,
      })
    } catch (error) {
      console.error("Erro ao atualizar hormônio:", error)

      if (error.message === "Hormônio não encontrado") {
        return res.status(404).json({
          error: "Não encontrado",
          message: error.message,
        })
      }

      if (error.message.includes("obrigatório") || error.message.includes("válida")) {
        return res.status(400).json({
          error: "Dados inválidos",
          message: error.message,
        })
      }

      res.status(500).json({
        error: "Erro interno do servidor",
        message: error.message,
      })
    }
  }

  async deleteHormonio(req, res) {
    try {
      // Verificar erros de validação
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: "ID inválido",
          details: errors.array(),
        })
      }

      const coachId = req.user.userId
      const { id } = req.params

      await hormonioService.deleteHormonio(id, coachId)

      res.json({
        message: "Hormônio excluído com sucesso",
      })
    } catch (error) {
      console.error("Erro ao excluir hormônio:", error)

      if (error.message === "Hormônio não encontrado") {
        return res.status(404).json({
          error: "Não encontrado",
          message: error.message,
        })
      }

      res.status(500).json({
        error: "Erro interno do servidor",
        message: error.message,
      })
    }
  }

  async getHormoniosByCategory(req, res) {
    try {
      const coachId = req.user.userId
      const { categoria } = req.params

      const hormonios = await hormonioService.getHormoniosByCategory(categoria, coachId)

      res.json({
        message: "Hormônios por categoria recuperados com sucesso",
        data: hormonios,
      })
    } catch (error) {
      console.error("Erro ao buscar hormônios por categoria:", error)
      res.status(500).json({
        error: "Erro interno do servidor",
        message: error.message,
      })
    }
  }

  async getHormoniosByTipo(req, res) {
    try {
      const coachId = req.user.userId
      const { tipo } = req.params

      const hormonios = await hormonioService.getHormoniosByTipo(tipo, coachId)

      res.json({
        message: "Hormônios por tipo recuperados com sucesso",
        data: hormonios,
      })
    } catch (error) {
      console.error("Erro ao buscar hormônios por tipo:", error)
      res.status(500).json({
        error: "Erro interno do servidor",
        message: error.message,
      })
    }
  }

  async getHormoniosByViaAdministracao(req, res) {
    try {
      const coachId = req.user.userId
      const { viaAdministracao } = req.params

      const hormonios = await hormonioService.getHormoniosByViaAdministracao(viaAdministracao, coachId)

      res.json({
        message: "Hormônios por via de administração recuperados com sucesso",
        data: hormonios,
      })
    } catch (error) {
      console.error("Erro ao buscar hormônios por via de administração:", error)
      res.status(500).json({
        error: "Erro interno do servidor",
        message: error.message,
      })
    }
  }

  async getHormoniosByFrequencia(req, res) {
    try {
      const coachId = req.user.userId
      const { frequencia } = req.params

      const hormonios = await hormonioService.getHormoniosByFrequencia(frequencia, coachId)

      res.json({
        message: "Hormônios por frequência recuperados com sucesso",
        data: hormonios,
      })
    } catch (error) {
      console.error("Erro ao buscar hormônios por frequência:", error)
      res.status(500).json({
        error: "Erro interno do servidor",
        message: error.message,
      })
    }
  }

  async searchHormonios(req, res) {
    try {
      // Verificar erros de validação
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: "Parâmetros de busca inválidos",
          details: errors.array(),
        })
      }

      const coachId = req.user.userId
      const { nome } = req.query

      const hormonios = await hormonioService.searchHormonios(nome, coachId)

      res.json({
        message: "Busca realizada com sucesso",
        data: hormonios,
      })
    } catch (error) {
      console.error("Erro ao buscar hormônios:", error)

      if (error.message.includes("caracteres")) {
        return res.status(400).json({
          error: "Parâmetros inválidos",
          message: error.message,
        })
      }

      res.status(500).json({
        error: "Erro interno do servidor",
        message: error.message,
      })
    }
  }
}

module.exports = new HormonioController()
