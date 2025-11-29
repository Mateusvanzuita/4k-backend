const userService = require("../services/userService")

const getUsers = async (req, res, next) => {
  try {
    const users = await userService.getUsers(req.query)
    res.json(users)
  } catch (error) {
    next(error)
  }
}

const getUserById = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.params.id)
    res.json(user)
  } catch (error) {
    next(error)
  }
}

const updateUser = async (req, res, next) => {
  try {
    const user = await userService.updateUser(req.params.id, req.body, req.user)
    res.json(user)
  } catch (error) {
    next(error)
  }
}

const deleteUser = async (req, res, next) => {
  try {
    await userService.deleteUser(req.params.id, req.user)
    res.status(204).send()
  } catch (error) {
    next(error)
  }
}

const getStudentsByCoach = async (req, res, next) => {
  try {
    const students = await userService.getStudentsByCoach(req.user.id)
    res.json(students)
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  getStudentsByCoach,
}
