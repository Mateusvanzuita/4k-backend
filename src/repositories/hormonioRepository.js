const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

class HormonioRepository {
  async create(hormonioData) {
    return await prisma.hormonio.create({
      data: hormonioData,
      include: {
        coach: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })
  }

  async getAll(whereClause, page = 1, limit = 10, orderBy = "nomeHormonio", order = "asc") {
    const skip = (page - 1) * limit

    const [hormonios, total] = await Promise.all([
      prisma.hormonio.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: {
          [orderBy]: order,
        },
      }),
      prisma.hormonio.count({
        where: whereClause,
      }),
    ])

    return {
      hormonios,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    }
  }

  async getById(id, coachId) {
    return await prisma.hormonio.findFirst({
      where: {
        id,
        coachId,
      },
    })
  }

  async update(id, data) {
    return await prisma.hormonio.update({
      where: { id },
      data,
    })
  }

  async delete(id) {
    return await prisma.hormonio.delete({
      where: { id },
    })
  }

  async getByCategory(categoria, coachId) {
    return await prisma.hormonio.findMany({
      where: {
        categoria,
        coachId,
      },
      orderBy: {
        nomeHormonio: "asc",
      },
    })
  }

  async getByTipo(tipo, coachId) {
    return await prisma.hormonio.findMany({
      where: {
        tipo,
        coachId,
      },
      orderBy: {
        nomeHormonio: "asc",
      },
    })
  }

  async searchByName(nome, coachId) {
    return await prisma.hormonio.findMany({
      where: {
        coachId,
        nomeHormonio: {
          contains: nome,
          mode: "insensitive",
        },
      },
      orderBy: {
        nomeHormonio: "asc",
      },
    })
  }

  async getByViaAdministracao(viaAdministracao, coachId) {
    return await prisma.hormonio.findMany({
      where: {
        viaAdministracao,
        coachId,
      },
      orderBy: {
        nomeHormonio: "asc",
      },
    })
  }

}

module.exports = new HormonioRepository()
