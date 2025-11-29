const exercicioRepository = require("../repositories/exercicioRepository")

class ExercicioService {
  async create(exercicioData) {
    // Validar link do YouTube se fornecido
    this.validateYouTubeLink(exercicioData)

    return await exercicioRepository.create(exercicioData)
  }

  async getAll(filters, page, limit, orderBy, order) {
    return await exercicioRepository.getAll(filters, page, limit, orderBy, order)
  }

  async getById(id, coachId) {
    return await exercicioRepository.getById(id, coachId)
  }

  async update(id, updateData, coachId) {
    // Verificar se o exercício existe e pertence ao coach
    const existingExercicio = await exercicioRepository.getById(id, coachId)
    if (!existingExercicio) {
      throw new Error("Exercício não encontrado ou não pertence a este coach")
    }

    // Validar link do YouTube se fornecido
    if (updateData.linkVideo) {
      this.validateYouTubeLink(updateData)
    }

    return await exercicioRepository.update(id, updateData)
  }

  async delete(id, coachId) {
    // Verificar se o exercício existe e pertence ao coach
    const existingExercicio = await exercicioRepository.getById(id, coachId)
    if (!existingExercicio) {
      throw new Error("Exercício não encontrado ou não pertence a este coach")
    }

    return await exercicioRepository.delete(id)
  }

  async getByCategory(categoria, coachId) {
    return await exercicioRepository.getByCategory(categoria, coachId)
  }

  validateYouTubeLink(data) {
    const { linkVideo } = data

    if (linkVideo) {
      const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/
      if (!youtubeRegex.test(linkVideo)) {
        throw new Error("Link do YouTube inválido")
      }
    }
  }
}

module.exports = new ExercicioService()
