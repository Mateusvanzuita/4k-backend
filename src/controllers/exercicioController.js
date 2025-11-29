const exercicioService = require("../services/exercicioService")

class ExercicioController {
  async create(req, res, next) {
    try {
      const coachId = req.user.id
      const exercicioData = { ...req.body, coachId }

      const exercicio = await exercicioService.create(exercicioData)

      res.status(201).json({
        success: true,
        message: "Exercício criado com sucesso",
        data: exercicio,
      })
    } catch (error) {
      next(error)
    }
  }

  async getAll(req, res, next) {
    try {
      const coachId = req.user.id
      const {
        page = 1,
        limit = 10,
        categoria,
        grupoMuscular,
        tipoExercicio,
        nomeExercicio,
        orderBy = "nomeExercicio",
        order = "asc",
      } = req.query

      const filters = {
        coachId,
        ...(categoria && { categoria }),
        ...(grupoMuscular && { grupoMuscular }),
        ...(tipoExercicio && { tipoExercicio }),
        ...(nomeExercicio && {
          nomeExercicio: {
            contains: nomeExercicio,
            mode: "insensitive",
          },
        }),
      }

      const exercicios = await exercicioService.getAll(
        filters,
        Number.parseInt(page),
        Number.parseInt(limit),
        orderBy,
        order,
      )

      res.json({
        success: true,
        data: exercicios,
      })
    } catch (error) {
      next(error)
    }
  }

  async getById(req, res, next) {
    try {
      const { id } = req.params
      const coachId = req.user.id

      const exercicio = await exercicioService.getById(id, coachId)

      if (!exercicio) {
        return res.status(404).json({
          success: false,
          message: "Exercício não encontrado",
        })
      }

      res.json({
        success: true,
        data: exercicio,
      })
    } catch (error) {
      next(error)
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params
      const coachId = req.user.id

      const exercicio = await exercicioService.update(id, req.body, coachId)

      res.json({
        success: true,
        message: "Exercício atualizado com sucesso",
        data: exercicio,
      })
    } catch (error) {
      next(error)
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params
      const coachId = req.user.id

      await exercicioService.delete(id, coachId)

      res.json({
        success: true,
        message: "Exercício excluído com sucesso",
      })
    } catch (error) {
      next(error)
    }
  }

  async getByCategory(req, res, next) {
    try {
      const { categoria } = req.params
      const coachId = req.user.id

      const exercicios = await exercicioService.getByCategory(categoria, coachId)

      res.json({
        success: true,
        data: exercicios,
      })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = new ExercicioController()
