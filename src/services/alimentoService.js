const alimentoRepository = require("../repositories/alimentoRepository")

class AlimentoService {
  async create(alimentoData) {
    return await alimentoRepository.create(alimentoData)
  }

  async getAll(filters, page, limit, orderBy, order) {
    return await alimentoRepository.getAll(filters, page, limit, orderBy, order)
  }

  async getById(id, coachId) {
    return await alimentoRepository.getById(id, coachId)
  }

  async update(id, updateData, coachId) {
    const alimento = await alimentoRepository.getById(id, coachId)
    if (!alimento) throw new Error("Alimento não encontrado ou não pertence ao coach")

    return await alimentoRepository.update(id, updateData)
  }

  async delete(id, coachId) {
    const alimento = await alimentoRepository.getById(id, coachId)
    if (!alimento) throw new Error("Alimento não encontrado ou não pertence ao coach")

    return await alimentoRepository.delete(id)
  }

  async getByCategoria(categoria, coachId) {
    return await alimentoRepository.getByCategoria(categoria, coachId)
  }
}

module.exports = new AlimentoService()
