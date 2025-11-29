const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

class ExercicioRepository {
  async create(exercicioData) {
    return await prisma.exercicio.create({
      data: exercicioData,
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

  async getAll(filters, page, limit, orderBy = "nomeExercicio", order = "asc") {
    const skip = (page - 1) * limit

    const [exercicios, total] = await Promise.all([
      prisma.exercicio.findMany({
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
      prisma.exercicio.count({
        where: filters,
      }),
    ])

    return {
      exercicios,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    }
  }

  async getById(id, coachId) {
    return await prisma.exercicio.findFirst({
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
    return await prisma.exercicio.update({
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
    return await prisma.exercicio.delete({
      where: { id },
    })
  }

  async getByCategory(categoria, coachId) {
    return await prisma.exercicio.findMany({
      where: {
        categoria,
        coachId,
      },
      orderBy: {
        nomeExercicio: "asc",
      },
    })
  }

  async searchByName(nomeExercicio, coachId) {
    return await prisma.exercicio.findMany({
      where: {
        coachId,
        nomeExercicio: {
          contains: nomeExercicio,
          mode: "insensitive",
        },
      },
      orderBy: {
        nomeExercicio: "asc",
      },
    })
  }
}

module.exports = new ExercicioRepository()
