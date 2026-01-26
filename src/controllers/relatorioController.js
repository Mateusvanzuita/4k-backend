const relatorioService = require("../services/relatorioService");

class RelatorioController {
  async getRelatorios(req, res, next) {
    try {
      const coachId = req.user.id;
      const dados = await relatorioService.getDadosCompletos(coachId, req.query);
      res.json({ success: true, data: dados });
    } catch (error) {
      next(error);
    }
  }

  async exportarPDF(req, res, next) {
    try {
      // Implementação futura do gerador de PDF
      res.status(501).json({ message: "Funcionalidade de PDF em desenvolvimento" });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new RelatorioController();