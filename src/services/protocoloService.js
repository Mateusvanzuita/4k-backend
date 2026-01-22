// src/services/protocoloService.js

const protocoloRepository = require("../repositories/protocoloRepository")
const prisma = require("../config/database") // Usamos prisma diretamente para transações complexas

class ProtocoloService {
  
  // Lógica de ativação e criação
  async createProtocolo(data) {
    // Implementar lógica de negócio:
    // 1. Verificar se já existe um protocolo ATIVO para o aluno.
    // 2. Se houver, desativar o protocolo antigo antes de criar o novo ATIVO.
    
    // Por enquanto, apenas cria:
    return await protocoloRepository.create(data)
  }

  async getProtocolos(coachId, filters) {
    return await protocoloRepository.findMany(coachId, filters)
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
      return await protocoloRepository.update(id, coachId, updateData)
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
}

module.exports = new ProtocoloService()