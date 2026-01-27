const hormonioRepository = require("../repositories/hormonioRepository")

class HormonioService {
  async createHormonio(hormonioData) {
    this.validateCategoriaByTipo(hormonioData.tipo, hormonioData.categoria)
    return await hormonioRepository.create(hormonioData)
  }

async getAllHormonios(coachId, filters = {}, page = 1, limit = 10, orderBy = "nomeHormonio", order = "asc") {
    const whereClause = { coachId };

    // Tratamento dinâmico de filtros
    if (filters.categoria) {
        whereClause.categoria = filters.categoria;
    }

    // ✅ CORREÇÃO: Se houver 'nome', transforma em busca textual no Prisma
    if (filters.nome) {
        whereClause.nomeHormonio = {
            contains: filters.nome,
            mode: 'insensitive' // Busca sem diferenciar maiúsculas/minúsculas
        };
    }

    return await hormonioRepository.getAll(whereClause, page, limit, orderBy, order);
}

  async getHormonioById(id, coachId) {
    const hormonio = await hormonioRepository.getById(id, coachId)
    if (!hormonio) { throw new Error("Hormônio não encontrado") }
    return hormonio
  }

  async updateHormonio(id, updateData, coachId) {
    const existingHormonio = await hormonioRepository.getById(id, coachId)
    if (!existingHormonio) { throw new Error("Hormônio não encontrado") }

    if (
      updateData.nomeHormonio !== undefined &&
      (!updateData.nomeHormonio || updateData.nomeHormonio.trim().length === 0)
    ) {
      throw new Error("Nome do hormônio é obrigatório")
    }

    // REMOVIDO: Verificação de updateData.dosagem

    if (updateData.tipo && updateData.categoria) {
      this.validateCategoriaByTipo(updateData.tipo, updateData.categoria)
    }

    return await hormonioRepository.update(id, updateData)
  }

  async deleteHormonio(id, coachId) {
    const existingHormonio = await hormonioRepository.getById(id, coachId)
    if (!existingHormonio) { throw new Error("Hormônio não encontrado") }
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

  // REMOVIDO: async getHormoniosByFrequencia(frequencia, coachId)

  async searchHormonios(nome, coachId) {
    if (!nome || nome.trim().length < 2) {
      throw new Error("O termo de busca deve ter pelo menos 2 caracteres")
    }
    return await hormonioRepository.searchByName(nome.trim(), coachId)
  }

  validateCategoriaByTipo(tipo, categoria) {
    // ... (Mantém a lógica de validação de categoria/tipo existente)
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