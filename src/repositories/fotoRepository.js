// src/repositories/fotoRepository.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class FotoRepository {
  async createRegistro(alunoId, data) {
    const { peso, observacao, fotos } = data;
    return await prisma.registroEvolucao.create({
      data: {
        alunoId,
        peso: parseFloat(peso),
        observacao,
        fotos: {
          // 💡 .replace(/\\/g, '/') converte as barras \ em / antes de salvar no banco
          create: fotos.map(path => ({ 
            url: `/uploads/fotos/${path.replace(/\\/g, '/')}` 
          }))
        }
      },
      include: { fotos: true }
    });
  }

  async getHistoricoByAluno(alunoId) {
    return await prisma.registroEvolucao.findMany({
      where: { alunoId },
      include: { fotos: true },
      orderBy: { dataCriacao: 'desc' }
    });
  }
}

module.exports = new FotoRepository();