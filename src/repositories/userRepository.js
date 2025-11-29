const prisma = require("../config/database")

const create = async (userData) => {
  return await prisma.user.create({
    data: userData,
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      userType: true,
      avatar: true,
      createdAt: true,
    },
  })
}

const findByEmail = async (email) => {
  return await prisma.user.findUnique({
    where: { email },
  })
}

const findById = async (id) => {
  return await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      userType: true,
      avatar: true,
      createdAt: true,
      updatedAt: true,
    },
  })
}

const findMany = async (filters = {}) => {
  const { userType, role, search } = filters

  const where = {}

  if (userType) where.userType = userType
  if (role) where.role = role
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
    ]
  }

  return await prisma.user.findMany({
    where,
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      userType: true,
      avatar: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  })
}

const update = async (id, updateData) => {
  return await prisma.user.update({
    where: { id },
    data: updateData,
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      userType: true,
      avatar: true,
      updatedAt: true,
    },
  })
}

const delete_ = async (id) => {
  return await prisma.user.delete({
    where: { id },
  })
}

const findStudentsByCoach = async (coachId) => {
  return await prisma.user.findMany({
    where: {
      coachId,
      userType: "STUDENT",
    },
    select: {
      id: true,
      email: true,
      name: true,
      avatar: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  })
}

module.exports = {
  create,
  findByEmail,
  findById,
  findMany,
  update,
  delete: delete_,
  findStudentsByCoach,
}
