// src/repositories/dashboardRepository.js (CORREÇÃO FINAL)

const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

class DashboardRepository {
  async getTotalStudents(coachId) {
    return await prisma.aluno.count({
      where: {
        coachId,
      },
    })
  }

  async getActiveProtocols(coachId) {
    // CORREÇÃO: Certificando-se de que 'not' está usando EXATAMENTE 'null'
    return await prisma.aluno.count({
      where: {
        coachId,
        tipoPlano: {
          not: null, // DEVE ser 'null' (valor literal) para filtrar campos preenchidos
        },
      },
    })
  }

  async getRecentStudents(coachId, limit) {
    return await prisma.aluno.findMany({
      where: {
        coachId,
      },
      select: {
        id: true,
        nomeCompleto: true,
        email: true,
        tipoPlano: true,
        dataCriacao: true,
      },
      orderBy: {
        dataCriacao: "desc",
      },
      take: limit,
    })
  }

  async getNewRegistrations(coachId, days) {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    return await prisma.aluno.findMany({
      where: {
        coachId,
        dataCriacao: {
          gte: startDate,
        },
      },
      select: {
        id: true,
        nomeCompleto: true,
        email: true,
        dataCriacao: true,
      },
      orderBy: {
        dataCriacao: "desc",
      },
    })
  }

  async getStudentStatsByPeriod(coachId, days) {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const [total, newInPeriod, byPlanType] = await Promise.all([
      this.getTotalStudents(coachId),
      
      prisma.aluno.count({
        where: {
          coachId,
          dataCriacao: {
            gte: startDate,
          },
        },
      }),
      
      prisma.aluno.groupBy({
        by: ["tipoPlano"],
        where: {
          coachId,
          tipoPlano: {
            not: null, // DEVE ser 'null' aqui também
          },
        },
        _count: {
          tipoPlano: true,
        },
      }),
    ])

    return {
      total,
      newInPeriod,
      byPlanType: byPlanType.reduce((acc, item) => {
        acc[item.tipoPlano] = item._count.tipoPlano
        return acc
      }, {}),
    }
  }

  async getActiveProtocols(coachId) {
      // Importe o ENUM TipoPlano do Prisma Client
      // const { TipoPlano } = require("@prisma/client"); // <-- ADICIONE ISSO NO TOPO DO ARQUIVO SE PRECISO

      return await prisma.aluno.count({
        where: {
          coachId,
          tipoPlano: {
            // Filtra para incluir apenas os valores que *sabemos* que são válidos.
            // Se TipoPlano for exposto pelo PrismaClient, use-o para a lista de ENUMs.
            // Caso contrário, use a lista de strings.
            in: ['DIETA', 'TREINO', 'FULL'], 
            // Se TipoPlano não for um campo nullable, use where: { tipoPlano: {} }
          },
        },
      });
  }
}

module.exports = new DashboardRepository()