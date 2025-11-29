const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

class AlimentoRepository {
  async create(alimentoData) {
    return await prisma.alimento.create({
      data: alimentoData,
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

  async getAll(filters, page, limit, orderBy = "nomeAlimento", order = "asc") {
    const skip = (page - 1) * limit

    const [alimentos, total] = await Promise.all([
      prisma.alimento.findMany({
        where: filters,
        skip,
        take: limit,
        orderBy: {
          [orderBy]: order,
        },
        include: {
          coach: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      }),
      prisma.alimento.count({
        where: filters,
      }),
    ])

    return {
      alimentos,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    }
  }

  async getById(id, coachId) {
    return await prisma.alimento.findFirst({
      where: {
        id,
        coachId,
      },
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

  async update(id, updateData) {
    return await prisma.alimento.update({
      where: { id },
      data: {
        ...updateData,
        updatedAt: new Date(),
      },
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

  async delete(id) {
    return await prisma.alimento.delete({
      where: { id },
    })
  }

  async getByCategory(categoria, coachId) {
    return await prisma.alimento.findMany({
      where: {
        categoria,
        coachId,
      },
      orderBy: {
        nomeAlimento: "asc",
      },
    })
  }

  async searchByName(nomeAlimento, coachId) {
    return await prisma.alimento.findMany({
      where: {
        coachId,
        nomeAlimento: {
          contains: nomeAlimento,
          mode: "insensitive",
        },
      },
      orderBy: {
        nomeAlimento: "asc",
      },
    })
  }
}

module.exports = new AlimentoRepository()
