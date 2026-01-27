const fotoRepository = require("../repositories/fotoRepository");
const notificationService = require("../services/notificationService");

class FotoController {
async uploadEvolucao(req, res, next) {
    try {
      console.log("Files recebidos pelo Multer:", req.files);
      console.log("Body recebido:", req.body);

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

      // === NOVA IMPLEMENTAÇÃO: NOTIFICAÇÃO AO COACH ===
      // O req.user é preenchido pelo middleware authenticateToken
      const aluno = req.user; 

      if (aluno && aluno.coachId) {
        console.log(`🔔 Notificando Coach ${aluno.coachId} sobre nova evolução de ${aluno.name}`);
        
        await notificationService.createNotification(
          {
            title: "Nova Evolução Postada! 📸",
            message: `${aluno.name} enviou fotos e atualizou o peso para ${peso}kg.`,
            receiverId: aluno.coachId,
          },
          null // Passamos null no senderId para evitar erro de Chave Estrangeira (FK)
        ).catch(err => {
          console.error("⚠️ Erro ao enviar notificação (processo continuou):", err.message);
        });
      }
      // ===============================================

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