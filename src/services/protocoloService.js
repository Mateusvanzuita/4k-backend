// src/services/protocoloService.js

const protocoloRepository = require("../repositories/protocoloRepository")
const notificationService = require("./notificationService")

class ProtocoloService {
  
  // Lógica de ativação e criação
  async createProtocolo(data) {
    // Implementar lógica de negócio:
    // 1. Verificar se já existe um protocolo ATIVO para o aluno.
    // 2. Se houver, desativar o protocolo antigo antes de criar o novo ATIVO.
    
    // Por enquanto, apenas cria:
const protocolo = await protocoloRepository.create(data);

    if (protocolo) {
      // 🚀 Notificação de Criação
      await notificationService.createNotification({
        title: "Seu protocolo está disponível!",
        message: "Confira na tela de protocolos. Bons resultados! 🚀",
        receiverId: protocolo.alunoId,
        isStudent: true // 💡 Importante para o seu middleware identificar que o destino é a tabela Aluno
      }, null).catch(err => console.error("Erro ao notificar aluno (Criação):", err.message));
    }

    return protocolo;
  }

async getProtocolos(userId, userType, filters) {
  return await protocoloRepository.findMany(userId, userType, filters);
}

  async getProtocoloById(id, coachId) {
    return await protocoloRepository.findById(id, coachId)
  }

  // ATENÇÃO: A atualização de protocolos é a mais complexa,
  // pois envolve deletar e recriar as relações aninhadas (refeições, exercícios, etc.)
  async updateProtocolo(id, coachId, updateData) {
      // Lógica de atualização complexa aqui, geralmente usando transações
      // para garantir que todas as relações sejam limpas e recriadas.
      
      // Exemplo básico (apenas para o cabeçalho):
const protocolo = await protocoloRepository.update(id, coachId, updateData);

    if (protocolo) {
      // 🚀 Notificação de Atualização
      await notificationService.createNotification({
        title: "Protocolo Atualizado! 🔄",
        message: `Seu protocolo "${protocolo.nome}" foi atualizado com novas informações. Confira agora!`,
        receiverId: protocolo.alunoId,
        isStudent: true
      }, null).catch(err => console.error("Erro ao notificar aluno (Atualização):", err.message));
    }

    return protocolo;
  }

  // Lógica de Clonagem
  async cloneProtocolo(id, coachId) {
    const original = await protocoloRepository.findById(id, coachId)
    if (!original) return null

    // Remove campos que devem ser novos
    const { 
        id: originalId, 
        dataCriacao, 
        dataAtivacao, 
        dataValidade, 
        status, 
        aluno, 
        coach, 
        ...dataToClone 
    } = original

    // Modifica o status e nome para indicar que é um rascunho clonado
    const newName = `Cópia de ${original.nome}`
    
    // Chama o Repositório para criar a nova estrutura (reaproveitando o nested create)
    // Nota: Os dados aninhados já vêm formatados no objeto 'original' (refeicoes, planosTreino, etc.)
    return await protocoloRepository.create({
        ...dataToClone,
        nome: newName,
        status: 'RASCUNHO', // Sempre cria como rascunho
        alunoId: original.alunoId,
        coachId: coachId,
    })
  }

  async deleteProtocolo(id, coachId) {
    return await protocoloRepository.delete(id, coachId)
  }

async cloneProtocolo(id, coachId) {
    const original = await protocoloRepository.findById(id, coachId);
    if (!original) return null;

    // Remove campos de sistema e metadados
    const { 
        id: originalId, 
        dataCriacao, 
        dataAtivacao, 
        dataValidade, 
        status, 
        aluno, 
        coach, 
        ...rest 
    } = original;

    // 🚨 MAPEAMENTO CRÍTICO: Transforma os objetos aninhados de volta em IDs simples
    const dataToCreate = {
        ...rest,
        nome: `Cópia de ${original.nome} V2`,
        status: 'RASCUNHO',
        alunoId: original.alunoId,
        coachId: coachId,
        
        // Mapeia refeições e extrai o alimentoId do objeto aninhado
        refeicoes: original.refeicoes?.map(ref => ({
            nomeRefeicao: ref.nomeRefeicao,
            horarioPrevisto: ref.horarioPrevisto,
            alimentos: ref.alimentos?.map(a => ({
                alimentoId: a.alimento?.id, // Pega o ID de dentro do objeto expandido
                quantidade: a.quantidade,
                unidadeMedida: a.unidadeMedida
            }))
        })),

        // Mapeia planos de treino e extrai o exercicioId
        planosTreino: original.planosTreino?.map(plano => ({
            nomeDivisao: plano.nomeDivisao,
            orientacoes: plano.orientacoes,
            exercicios: plano.exercicios?.map(ex => ({
                exercicioId: ex.exercicio?.id, // Pega o ID de dentro do objeto expandido
                series: ex.series,
                repeticoes: ex.repeticoes,
                intervaloDescanso: ex.intervaloDescanso,
                observacoes: ex.observacoes
            }))
        })),

        // Mapeia suplementos
        suplementos: original.suplementosProtocolo?.map(s => ({
            suplementoId: s.suplemento?.id,
            dose: s.quantidade,
            horario: s.formaUso,
            objetivo: s.observacoes
        })),

        // Mapeia hormônios
        hormonios: original.hormoniosProtocolo?.map(h => ({
            hormonioId: h.hormonio?.id,
            doseSemanal: h.dosagem,
            frequencia: h.frequencia,
            obsAplicacao: h.observacoes
        }))
    };

    return await protocoloRepository.create(dataToCreate);
}
}

module.exports = new ProtocoloService()