const prisma = require("../config/database")

const create = async (notificationData) => {
  return await prisma.notification.create({
    data: notificationData,
    include: {
      sender: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
    },
  })
}

const findById = async (id) => {
  return await prisma.notification.findUnique({
    where: { id },
  })
}

const findByUserId = async (userId, filters = {}) => {
  const { read } = filters

  const where = { receiverId: userId }
  if (read !== undefined) where.read = read === "true"

  return await prisma.notification.findMany({
    where,
    include: {
      sender: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  })
}

const update = async (id, updateData) => {
  return await prisma.notification.update({
    where: { id },
    data: updateData,
  })
}

const delete_ = async (id) => {
  return await prisma.notification.delete({
    where: { id },
  })
}

module.exports = {
  create,
  findById,
  findByUserId,
  update,
  delete: delete_,
}
