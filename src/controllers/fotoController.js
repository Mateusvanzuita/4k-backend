const fotoRepository = require("../repositories/fotoRepository");

class FotoController {
  async uploadEvolucao(req, res, next) {
try {
    console.log("Files recebidos pelo Multer:", req.files); // 💡 Adicione este log
    console.log("Body recebido:", req.body); // O peso deve estar aqui

    const alunoId = req.user.id;
    const { peso, observacao } = req.body;
    const files = req.files;

    // Se o Multer falhar, 'files' será undefined ou vazio
    if (!files || files.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: "Pelo menos uma foto é obrigatória." 
      });
    }

      const fotosPaths = files.map(file => file.filename);
      const registro = await fotoRepository.createRegistro(alunoId, { peso, observacao, fotos: fotosPaths });

      res.status(201).json({ success: true, data: registro });
    } catch (error) {
      next(error);
    }
  }

  async getHistorico(req, res, next) {
    try {
      const alunoId = req.user.id;
      const historico = await fotoRepository.getHistoricoByAluno(alunoId);
      res.json({ success: true, data: historico });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new FotoController();