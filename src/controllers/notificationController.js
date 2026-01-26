const notificationService = require("../services/notificationService")

const createNotification = async (notificationData, senderId) => {
  const { title, message, receiverId } = notificationData;
  console.log("🔔 Tentando criar notificação para:", receiverId);

  const result = await notificationRepository.create({
    title,
    message,
    receiverId,
    senderId, // Se o senderId for de um ALUNO, isso pode causar erro se o Prisma esperar um USER
  });
  
  console.log("✅ Notificação criada com ID:", result.id);
  return result;
}

// Em notificationController.js
const getNotifications = async (req, res, next) => {
  try {
    console.log("📡 Coach solicitando notificações. ID do Coach logado:", req.user.id);
    const notifications = await notificationService.getNotifications(req.user.id, req.query);
    console.log(`📊 Total de notificações encontradas para este ID: ${notifications.length}`);
    res.json(notifications);
  } catch (error) {
    next(error);
  }
}

const markAsRead = async (req, res, next) => {
  try {
    const notification = await notificationService.markAsRead(req.params.id, req.user.id)
    res.json(notification)
  } catch (error) {
    next(error)
  }
}

const deleteNotification = async (req, res, next) => {
  try {
    await notificationService.deleteNotification(req.params.id, req.user.id)
    res.status(204).send()
  } catch (error) {
    next(error)
  }
}

module.exports = {
  createNotification,
  getNotifications,
  markAsRead,
  deleteNotification,
}
