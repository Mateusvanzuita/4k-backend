const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

class DashboardRepository {
  async getTotalStudents(coachId) {
    return await prisma.user.count({
      where: {
        coachId,
        userType: "STUDENT",
      },
    })
  }

  async getActiveProtocols(coachId) {
    // Considerando protocolos ativos como alunos com planos ativos
    return await prisma.user.count({
      where: {
        coachId,
        userType: "STUDENT",
        tipoPlano: {
          not: null,
        },
      },
    })
  }

  async getRecentStudents(coachId, limit) {
    return await prisma.user.findMany({
      where: {
        coachId,
        userType: "STUDENT",
      },
      select: {
        id: true,
        nomeAluno: true,
        email: true,
        tipoPlano: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
    })
  }

  async getNewRegistrations(coachId, days) {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    return await prisma.user.findMany({
      where: {
        coachId,
        userType: "STUDENT",
        createdAt: {
          gte: startDate,
        },
      },
      select: {
        id: true,
        nomeAluno: true,
        email: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })
  }

  async getStudentStatsByPeriod(coachId, days) {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const [total, newInPeriod, byPlanType] = await Promise.all([
      this.getTotalStudents(coachId),
      prisma.user.count({
        where: {
          coachId,
          userType: "STUDENT",
          createdAt: {
            gte: startDate,
          },
        },
      }),
      prisma.user.groupBy({
        by: ["tipoPlano"],
        where: {
          coachId,
          userType: "STUDENT",
          tipoPlano: {
            not: null,
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
}

module.exports = new DashboardRepository()
