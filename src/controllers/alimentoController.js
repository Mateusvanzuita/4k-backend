const alimentoService = require("../services/alimentoService")

class AlimentoController {
  async create(req, res, next) {
    try {
      const coachId = req.user.id
      const alimentoData = { ...req.body, coachId }

      const alimento = await alimentoService.create(alimentoData)

      res.status(201).json({
        success: true,
        message: "Alimento criado com sucesso",
        data: alimento,
      })
    } catch (error) {
      next(error)
    }
  }

  async getAll(req, res, next) {
    try {
      const coachId = req.user.id
      const { page = 1, limit = 10, categoria, nome, orderBy = "createdAt", 
      order = "desc" } = req.query

      const filters = {
        coachId,
        ...(categoria && { categoria }),
        ...(nome && {
          nome: {
            contains: nome,
            mode: "insensitive",
          },
        }),
      }

      const alimentos = await alimentoService.getAll(
        filters,
        Number(page),
        Number(limit),
        orderBy,
        order,
      )

      res.json({
        success: true,
        data: alimentos,
      })
    } catch (error) {
      next(error)
    }
  }

  async getById(req, res, next) {
    try {
      const { id } = req.params
      const coachId = req.user.id

      const alimento = await alimentoService.getById(id, coachId)

      if (!alimento) {
        return res.status(404).json({
          success: false,
          message: "Alimento não encontrado",
        })
      }

      res.json({
        success: true,
        data: alimento,
      })
    } catch (error) {
      next(error)
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params
      const coachId = req.user.id

      const alimento = await alimentoService.update(id, req.body, coachId)

      res.json({
        success: true,
        message: "Alimento atualizado com sucesso",
        data: alimento,
      })
    } catch (error) {
      next(error)
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params
      const coachId = req.user.id

      await alimentoService.delete(id, coachId)

      res.json({
        success: true,
        message: "Alimento excluído com sucesso",
      })
    } catch (error) {
      next(error)
    }
  }

  async getByCategoria(req, res, next) {
    try {
      const { categoria } = req.params
      const coachId = req.user.id

      const alimentos = await alimentoService.getByCategoria(categoria, coachId)

      res.json({
        success: true,
        data: alimentos,
      })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = new AlimentoController()
