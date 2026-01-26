const relatorioRepository = require("../repositories/relatorioRepository");

class RelatorioService {
  async getDadosCompletos(coachId, filtros) {
    const stats = await relatorioRepository.getDashboardStats(coachId);
    
    // Adiciona lógica de filtragem por período se necessário
    return stats;
  }
}

module.exports = new RelatorioService();