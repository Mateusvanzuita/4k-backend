const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

class SuplementoRepository {
  async create(suplementoData) {
    return await prisma.suplemento.create({
      data: suplementoData,
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
  
async getAll(filters, page, limit, orderBy = "nomeSuplemento", order = "asc") {
    const skip = (page - 1) * limit
    
    // Criamos uma cópia dos filtros para não alterar o objeto original
    const whereClause = { ...filters }

    // Se houver filtro de nome, transformamos em busca textual nos dois campos possíveis
    if (whereClause.nome) {
      const searchName = whereClause.nome
      delete whereClause.nome // Removemos a chave 'nome' simples
      
      whereClause.OR = [
        { nomeSuplemento: { contains: searchName, mode: "insensitive" } },
        { nomeManipulado: { contains: searchName, mode: "insensitive" } }
      ]
    }

    const [suplementos, total] = await Promise.all([
      prisma.suplemento.findMany({
        where: whereClause, // Usamos a cláusula montada
        skip,
        take: limit,
        orderBy: { [orderBy]: order },
        include: { coach: { select: { id: true, name: true } } },
      }),
      prisma.suplemento.count({ where: whereClause }),
    ])

    return {
      suplementos,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    }
}

  async getById(id, coachId) {
    return await prisma.suplemento.findFirst({
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
    return await prisma.suplemento.update({
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
    return await prisma.suplemento.delete({
      where: { id },
    })
  }

  async getByCategory(categoria, coachId) {
    return await prisma.suplemento.findMany({
      where: {
        categoria,
        coachId,
      },
      orderBy: {
        nomeSuplemento: "asc",
      },
    })
  }

  async getByTipo(tipo, coachId) {
    return await prisma.suplemento.findMany({
      where: {
        tipo,
        coachId,
      },
      orderBy: {
        nomeSuplemento: "asc",
      },
    })
  }

  async searchByName(nome, coachId) {
    return await prisma.suplemento.findMany({
      where: {
        coachId,
        OR: [
          {
            nomeSuplemento: {
              contains: nome,
              mode: "insensitive",
            },
          },
          {
            nomeManipulado: {
              contains: nome,
              mode: "insensitive",
            },
          },
        ],
      },
      orderBy: {
        nomeSuplemento: "asc",
      },
    })
  }
}

module.exports = new SuplementoRepository()
