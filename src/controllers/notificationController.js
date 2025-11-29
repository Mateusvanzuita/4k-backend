const notificationService = require("../services/notificationService")

const createNotification = async (req, res, next) => {
  try {
    const notification = await notificationService.createNotification(req.body, req.user.id)
    res.status(201).json(notification)
  } catch (error) {
    next(error)
  }
}

const getNotifications = async (req, res, next) => {
  try {
    const notifications = await notificationService.getNotifications(req.user.id, req.query)
    res.json(notifications)
  } catch (error) {
    next(error)
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
