const hormonioRepository = require("../repositories/hormonioRepository")

class HormonioService {
  async createHormonio(hormonioData) {
    
    this.validateCategoriaByTipo(hormonioData.tipo, hormonioData.categoria)

    return await hormonioRepository.create(hormonioData)
  }

  async getAllHormonios(coachId, filters = {}, page = 1, limit = 10, orderBy = "nomeHormonio", order = "asc") {
    const whereClause = {
      coachId,
      ...filters,
    }

    return await hormonioRepository.getAll(whereClause, page, limit, orderBy, order)
  }

  async getHormonioById(id, coachId) {
    const hormonio = await hormonioRepository.getById(id, coachId)

    if (!hormonio) {
      throw new Error("Hormônio não encontrado")
    }

    return hormonio
  }

  async updateHormonio(id, updateData, coachId) {
    // Verificar se o hormônio existe e pertence ao coach
    const existingHormonio = await hormonioRepository.getById(id, coachId)
    if (!existingHormonio) {
      throw new Error("Hormônio não encontrado")
    }

    // Validações
    if (
      updateData.nomeHormonio !== undefined &&
      (!updateData.nomeHormonio || updateData.nomeHormonio.trim().length === 0)
    ) {
      throw new Error("Nome do hormônio é obrigatório")
    }

    if (updateData.dosagem !== undefined && (!updateData.dosagem || updateData.dosagem.trim().length === 0)) {
      throw new Error("Dosagem é obrigatória")
    }

    // Validar categoria se tipo foi alterado
    if (updateData.tipo && updateData.categoria) {
      this.validateCategoriaByTipo(updateData.tipo, updateData.categoria)
    }

    return await hormonioRepository.update(id, updateData)
  }

  async deleteHormonio(id, coachId) {
    // Verificar se o hormônio existe e pertence ao coach
    const existingHormonio = await hormonioRepository.getById(id, coachId)
    if (!existingHormonio) {
      throw new Error("Hormônio não encontrado")
    }

    return await hormonioRepository.delete(id)
  }

  async getHormoniosByCategory(categoria, coachId) {
    return await hormonioRepository.getByCategory(categoria, coachId)
  }

  async getHormoniosByTipo(tipo, coachId) {
    return await hormonioRepository.getByTipo(tipo, coachId)
  }

  async getHormoniosByViaAdministracao(viaAdministracao, coachId) {
    return await hormonioRepository.getByViaAdministracao(viaAdministracao, coachId)
  }

  async getHormoniosByFrequencia(frequencia, coachId) {
    return await hormonioRepository.getByFrequencia(frequencia, coachId)
  }

  async searchHormonios(nome, coachId) {
    if (!nome || nome.trim().length < 2) {
      throw new Error("O termo de busca deve ter pelo menos 2 caracteres")
    }

    return await hormonioRepository.searchByName(nome.trim(), coachId)
  }

  // Método privado para validar categoria por tipo
  validateCategoriaByTipo(tipo, categoria) {
    const categoriasPorTipo = {
      PEPTIDEO: ["GH_RELEASING", "INSULINA_LIKE", "PEPTIDEO_TERAPEUTICO", "OUTRO"],
      ESTEROIDE: ["ANABOLICO", "ANDROGENICO", "CORTICOSTEROIDE", "OUTRO"],
      TIREOIDE: ["T3", "T4", "TSH", "OUTRO"],
      CRESCIMENTO: ["SOMATOTROPINA", "IGF", "OUTRO"],
      INSULINA: ["RAPIDA", "LENTA", "INTERMEDIARIA", "OUTRO"],
      CORTISOL: ["MODULADOR_HORMONAL", "OUTRO"],
      TESTOSTERONA: ["MODULADOR_HORMONAL", "OUTRO"],
      OUTRO: ["MODULADOR_HORMONAL", "OUTRO"],
    }

    if (!categoriasPorTipo[tipo] || !categoriasPorTipo[tipo].includes(categoria)) {
      throw new Error(`Categoria ${categoria} não é válida para o tipo ${tipo}`)
    }
  }
}

module.exports = new HormonioService()
