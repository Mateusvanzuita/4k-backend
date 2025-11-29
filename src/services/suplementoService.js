const suplementoRepository = require("../repositories/suplementoRepository")

class SuplementoService {
  async createSuplemento(suplementoData, coachId) {
    // Validação: deve ter pelo menos um nome (suplemento ou manipulado)
    if (!suplementoData.nomeSuplemento && !suplementoData.nomeManipulado) {
      throw new Error("Deve ser informado o nome do suplemento ou manipulado")
    }

    // Validação: se tipo é SUPLEMENTO, deve ter nomeSuplemento
    if (suplementoData.tipo === "SUPLEMENTO" && !suplementoData.nomeSuplemento) {
      throw new Error("Para tipo SUPLEMENTO, o nome do suplemento é obrigatório")
    }

    // Validação: se tipo é MANIPULADO, deve ter nomeManipulado
    if (suplementoData.tipo === "MANIPULADO" && !suplementoData.nomeManipulado) {
      throw new Error("Para tipo MANIPULADO, o nome do manipulado é obrigatório")
    }

    const data = {
      ...suplementoData,
      coachId,
    }

    return await suplementoRepository.create(data)
  }

  async getAllSuplementos(coachId, filters = {}, page = 1, limit = 10, orderBy = "nomeSuplemento", order = "asc") {
    const whereClause = {
      coachId,
      ...filters,
    }

    return await suplementoRepository.getAll(whereClause, page, limit, orderBy, order)
  }

  async getSuplementoById(id, coachId) {
    const suplemento = await suplementoRepository.getById(id, coachId)

    if (!suplemento) {
      throw new Error("Suplemento não encontrado")
    }

    return suplemento
  }

  async updateSuplemento(id, updateData, coachId) {
    // Verificar se o suplemento existe e pertence ao coach
    const existingSuplemento = await suplementoRepository.getById(id, coachId)
    if (!existingSuplemento) {
      throw new Error("Suplemento não encontrado")
    }

    // Validações similares ao create
    if (updateData.tipo === "SUPLEMENTO" && !updateData.nomeSuplemento && !existingSuplemento.nomeSuplemento) {
      throw new Error("Para tipo SUPLEMENTO, o nome do suplemento é obrigatório")
    }

    if (updateData.tipo === "MANIPULADO" && !updateData.nomeManipulado && !existingSuplemento.nomeManipulado) {
      throw new Error("Para tipo MANIPULADO, o nome do manipulado é obrigatório")
    }

    return await suplementoRepository.update(id, updateData)
  }

  async deleteSuplemento(id, coachId) {
    // Verificar se o suplemento existe e pertence ao coach
    const existingSuplemento = await suplementoRepository.getById(id, coachId)
    if (!existingSuplemento) {
      throw new Error("Suplemento não encontrado")
    }

    return await suplementoRepository.delete(id)
  }

  async getSuplementosByCategory(categoria, coachId) {
    return await suplementoRepository.getByCategory(categoria, coachId)
  }

  async getSuplementosByTipo(tipo, coachId) {
    return await suplementoRepository.getByTipo(tipo, coachId)
  }

  async searchSuplementos(nome, coachId) {
    if (!nome || nome.trim().length < 2) {
      throw new Error("O termo de busca deve ter pelo menos 2 caracteres")
    }

    return await suplementoRepository.searchByName(nome.trim(), coachId)
  }
}

module.exports = new SuplementoService()
