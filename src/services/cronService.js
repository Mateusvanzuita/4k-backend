const cron = require('node-cron');
const prisma = require('../config/database');
const notificationService = require('./notificationService');

// Função para verificar e disparar notificações
const checkPhotoFrequencies = async () => {
  console.log("🕒 Iniciando verificação de frequência de fotos...");
  
  try {
    const alunos = await prisma.aluno.findMany({
      where: {
        frequenciaFotos: { in: ['SEMANAL', 'QUINZENAL', 'MENSAL'] }
      }
    });

    const hoje = new Date();

    for (const aluno of alunos) {
      // 1. Busca a última foto enviada
      const ultimaFoto = await prisma.registroEvolucao.findFirst({
        where: { alunoId: aluno.id },
        orderBy: { dataCriacao: 'desc' }
      });

      // Se nunca enviou, usa a data de criação do aluno como base
      const dataReferencia = ultimaFoto ? new Date(ultimaFoto.dataCriacao) : new Date(aluno.createdAt);
      
      const diferencaDias = Math.floor((hoje - dataReferencia) / (1000 * 60 * 60 * 24));

      let deveNotificar = false;
      if (aluno.frequenciaFotos === 'SEMANAL' && diferencaDias >= 7) deveNotificar = true;
      else if (aluno.frequenciaFotos === 'QUINZENAL' && diferencaDias >= 15) deveNotificar = true;
      else if (aluno.frequenciaFotos === 'MENSAL' && diferencaDias >= 30) deveNotificar = true;

      if (deveNotificar) {
        await notificationService.createNotification({
          title: "Dia de Atualização! 📸",
          message: `Olá ${aluno.nomeCompleto}, hoje é o dia de enviar suas fotos de evolução conforme seu plano ${aluno.frequenciaFotos.toLowerCase()}.`,
          receiverId: aluno.id
        }, null);
        console.log(`✅ Notificação enviada para o aluno: ${aluno.nomeCompleto}`);
      }
    }
  } catch (error) {
    console.error("❌ Erro no Cron de Fotos:", error);
  }
};

// Agenda para rodar todo dia às 09:00 da manhã
// Formato: minuto hora dia mes dia-da-semana
cron.schedule('0 9 * * *', checkPhotoFrequencies);

module.exports = { checkPhotoFrequencies };