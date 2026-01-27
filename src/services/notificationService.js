const notificationRepository = require("../repositories/notificationRepository");
const pushService = require("./pushService"); // Importa o serviço de Web Push
const prisma = require("../config/database"); // Necessário para buscar o pushSubscription

const createNotification = async (notificationData, senderId) => {
  const { title, message, receiverId, isStudent } = notificationData;

  // 1. Cria a notificação no Banco de Dados (In-app)
  const notification = await notificationRepository.create({
    title,
    message,
    receiverId,
    senderId,
    isStudent: isStudent || false
  });

  // 2. Tenta enviar a Notificação Push para o celular
  try {
    let target = null;

    if (isStudent) {
      // Busca a assinatura do Aluno
      target = await prisma.aluno.findUnique({
        where: { id: receiverId },
        select: { pushSubscription: true }
      });
    } else {
      // Busca a assinatura do Coach/User
      target = await prisma.user.findUnique({
        where: { id: receiverId },
        select: { pushSubscription: true } // Certifique-se de que User também tenha este campo no Prisma
      });
    }

    // Se houver uma inscrição válida, envia o Push
    if (target && target.pushSubscription) {
      // O pushSubscription deve ser o objeto JSON gerado pelo navegador
      await pushService.sendPush(target.pushSubscription, title, message);
    }
  } catch (pushError) {
    // Usamos um log de aviso para que um erro no Push não trave a aplicação
    console.warn("⚠️ Notificação gravada, mas o Push falhou:", pushError.message);
  }

  return notification;
};

const getNotifications = async (userId, filters = {}) => {
  return await notificationRepository.findByUserId(userId, filters);
};

const markAsRead = async (notificationId, userId) => {
  const notification = await notificationRepository.findById(notificationId);

  if (!notification || (notification.receiverUserId !== userId && notification.receiverAlunoId !== userId)) {
    throw new Error("Notificação não encontrada");
  }

  return await notificationRepository.update(notificationId, { read: true });
};

const deleteNotification = async (notificationId, userId) => {
  const notification = await notificationRepository.findById(notificationId);

  if (!notification || (notification.receiverUserId !== userId && notification.receiverAlunoId !== userId)) {
    throw new Error("Notificação não encontrada");
  }

  await notificationRepository.delete(notificationId);
};

module.exports = {
  createNotification,
  getNotifications,
  markAsRead,
  deleteNotification,
};