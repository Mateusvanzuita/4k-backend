const notificationRepository = require("../repositories/notificationRepository")

const createNotification = async (notificationData, senderId) => {
  const { title, message, receiverId } = notificationData

  return await notificationRepository.create({
    title,
    message,
    receiverId,
    senderId,
  })
}

const getNotifications = async (userId, filters = {}) => {
  return await notificationRepository.findByUserId(userId, filters)
}

const markAsRead = async (notificationId, userId) => {
  const notification = await notificationRepository.findById(notificationId)

  if (!notification || notification.receiverId !== userId) {
    throw new Error("Notificação não encontrada")
  }

  return await notificationRepository.update(notificationId, { read: true })
}

const deleteNotification = async (notificationId, userId) => {
  const notification = await notificationRepository.findById(notificationId)

  if (!notification || notification.receiverId !== userId) {
    throw new Error("Notificação não encontrada")
  }

  await notificationRepository.delete(notificationId)
}

module.exports = {
  createNotification,
  getNotifications,
  markAsRead,
  deleteNotification,
}
