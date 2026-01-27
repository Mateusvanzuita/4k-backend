// src/repositories/dashboardRepository.js

const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

class DashboardRepository {
  async getTotalStudents(coachId) {
    return await prisma.aluno.count({
      where: { coachId },
    })
  }

  // ✅ CORREÇÃO DEFINITIVA: Conta apenas registros na tabela de protocolos
  async getActiveProtocols(coachId) {
    try {
      // Esta contagem olha para a tabela 'protocolo' que você mencionou ter 2 registros
      return await prisma.protocolo.count({
        where: { coachId }
      })
    } catch (error) {
      console.error("Erro ao contar protocolos:", error);
      return 0;
    }
  }

  async getRecentStudents(coachId, limit) {
    return await prisma.aluno.findMany({
      where: { coachId },
      select: {
        id: true,
        nomeCompleto: true,
        email: true,
        tipoPlano: true,
        dataCriacao: true,
      },
      orderBy: { dataCriacao: "desc" },
      take: limit,
    })
  }

  async getNewRegistrations(coachId, days) {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    return await prisma.aluno.findMany({
      where: {
        coachId,
        dataCriacao: { gte: startDate },
      },
      select: {
        id: true,
        nomeCompleto: true,
        email: true,
        dataCriacao: true,
      },
      orderBy: { dataCriacao: "desc" },
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
          dataCriacao: { gte: startDate },
        },
      }),
      prisma.aluno.groupBy({
        by: ["tipoPlano"],
        where: {
          coachId,
          tipoPlano: { not: null },
        },
        _count: { tipoPlano: true },
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
}

module.exports = new DashboardRepository()