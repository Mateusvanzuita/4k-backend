// src/repositories/protocoloRepository.js (CONFIRMAÇÃO DO CÓDIGO)

const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient() // 🚨 ESTA INSTÂNCIA DEVE ESTAR AQUI

// Define a estrutura de seleção detalhada para o retorno do Protocolo
const protocoloSelect = {
  id: true,
  nome: true,
  descricao: true,
  status: true,
  alunoId: true,
  coachId: true,
  dataCriacao: true,
  dataAtivacao: true,
  dataValidade: true,
  aluno: {
    select: {
      id: true,
      nomeCompleto: true,
      email: true,
    },
  },
  // Estrutura do Plano Alimentar
  refeicoes: {
    select: {
      id: true,
      nomeRefeicao: true,
      horarioPrevisto: true,
      observacoes: true,
      alimentos: {
        select: {
          id: true,
          quantidade: true,
          unidadeMedida: true,
          observacoes: true,
          alimento: {
            select: { id: true, nome: true, categoria: true }, // Dados do Catálogo
          },
        },
      },
    },
  },
  // Estrutura do Plano de Treino
  planosTreino: {
    select: {
      id: true,
      nomeDivisao: true,
      grupoMuscular: true,
      orientacoes: true,
      exercicios: {
        select: {
          id: true,
          series: true,
          repeticoes: true,
          carga: true,
          intervaloDescanso: true,
          observacoes: true,
          ordem: true,
          exercicio: {
            select: { id: true, nomeExercicio: true, linkVideo: true }, // Dados do Catálogo
          },
        },
      },
    },
  },
  // Estrutura de Suplementos
  suplementosProtocolo: {
    select: {
      id: true,
      quantidade: true,
      formaUso: true,
      observacoes: true,
      suplemento: {
        select: { id: true, nomeSuplemento: true, nomeManipulado: true },
      },
    },
  },
  // Estrutura de Hormônios
  hormoniosProtocolo: {
    select: {
      id: true,
      dosagem: true,
      frequencia: true,
      viaAdministracao: true,
      observacoes: true,
      hormonio: {
        select: { id: true, nomeHormonio: true, tipo: true },
      },
    },
  },
}

class ProtocoloRepository {
async create(data) {
  const {
    alunoId,
    coachId,
    refeicoes,
    planosTreino,
    suplementos,
    hormonios,
    macros,
    status,
    ...rest
  } = data

  return prisma.protocolo.create({
    data: {
      ...rest,

      proteinaPercentual: macros?.p,
      carboidratoPercentual: macros?.c,
      gorduraPercentual: macros?.g,

      alunoId,
      coachId,
      status: status || 'ATIVO',
      dataAtivacao: status === 'ATIVO' ? new Date() : undefined,

      refeicoes: {
        create: refeicoes?.map(ref => ({
          nomeRefeicao: ref.nomeRefeicao,
          horarioPrevisto: ref.horarioPrevisto,
          alimentos: {
            create: ref.alimentos?.map(alim => ({
              alimentoId: alim.alimentoId,
              quantidade: alim.quantidade,
              unidadeMedida: alim.unidadeMedida
            }))
          }
        }))
      },

      planosTreino: {
        create: planosTreino?.map(plano => ({
          nomeDivisao: plano.nomeDivisao,
          orientacoes: plano.orientacoes,
          exercicios: {
            create: plano.exercicios?.map((ex, index) => ({
              exercicioId: ex.exercicioId,
              series: ex.series,
              repeticoes: ex.repeticoes,
              intervaloDescanso: ex.intervaloDescanso,
              observacoes: ex.observacoes,
              ordem: index + 1
            }))
          }
        }))
      },

      suplementosProtocolo: suplementos
        ? {
            create: suplementos.map(s => ({
              suplementoId: s.suplementoId,
              quantidade: s.dose,
              formaUso: s.horario,
              observacoes: s.objetivo
            }))
          }
        : undefined,

      hormoniosProtocolo: hormonios
        ? {
            create: hormonios.map(h => ({
              hormonioId: h.hormonioId,
              dosagem: h.doseSemanal,
              frequencia: h.frequencia,
              observacoes: h.obsAplicacao
            }))
          }
        : undefined
    }
  })
}


async findMany(userId, userType, filters) {
  const { search, status } = filters;
  
  const where = {
    ...(userType === "STUDENT" ? { alunoId: userId } : { coachId: userId }),
    ...(status && { status }),
    ...(search && {
      aluno: {
        nomeCompleto: { contains: search, mode: "insensitive" }
      }
    })
  };

  return await prisma.protocolo.findMany({
    where,
    // 💡 Alteração aqui: Se for aluno, trazemos o objeto completo (protocoloSelect)
    // Se for coach, mantemos o resumo para a listagem não ficar pesada.
    select: userType === "STUDENT" ? protocoloSelect : {
        id: true,
        nome: true,
        status: true,
        dataCriacao: true,
        alunoId: true,
        refeicoes: { select: { id: true }, take: 1 }, 
        planosTreino: { select: { id: true }, take: 1 },
        suplementosProtocolo: { select: { id: true }, take: 1 },
        hormoniosProtocolo: { select: { id: true }, take: 1 },
        aluno: {
            select: { nomeCompleto: true }
        }
    },
    orderBy: { dataCriacao: "desc" }
  });
}

  async findById(id, coachId) {
    return await prisma.protocolo.findFirst({
      where: { id, coachId },
      select: protocoloSelect,
    })
  }
  
  async update(id, coachId, data) {
      return await prisma.protocolo.update({
          where: { id, coachId },
          data: {
              nome: data.nome,
              descricao: data.descricao,
              status: data.status,
              dataValidade: data.dataValidade,
              dataAtivacao: data.status === 'ATIVO' ? new Date() : undefined,
          },
          select: protocoloSelect
      })
  }

  async delete(id, coachId) {
      const protocolo = await this.findById(id, coachId)
      if (!protocolo) return null

      await prisma.protocolo.delete({ where: { id } })
      return true
  }
}

module.exports = new ProtocoloRepository()