const prisma = require("../config/database")

const create = async (notificationData) => {
  console.log("💾 Persistindo no banco. Dados recebidos:", notificationData);
  
  const { title, message, receiverId, senderId, isStudent } = notificationData;

  try {
    const result = await prisma.notification.create({
      data: {
        title,
        message,
        senderId,
        // 💡 Mapeia para o campo correto baseado no tipo de destinatário 
        receiverAlunoId: isStudent ? receiverId : null,
        receiverUserId: !isStudent ? receiverId : null,
      },
    });
    console.log("🚀 Notificação gravada com sucesso no BD:", result.id);
    return result;
  } catch (error) {
    console.error("🚨 ERRO CRÍTICO no Prisma ao criar notificação:");
    console.error("Mensagem:", error.message);
    console.error("Código do Erro:", error.code);
    throw error;
  }
}

const findById = async (id) => {
  return await prisma.notification.findUnique({
    where: { id },
  })
}

const findByUserId = async (userId, filters = {}) => {
  const { read } = filters

  // 💡 Busca o ID em ambos os campos possíveis 
  const where = {
    OR: [
      { receiverUserId: userId },
      { receiverAlunoId: userId }
    ]
  }
  
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