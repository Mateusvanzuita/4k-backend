const authService = require("../services/authService")

const register = async (req, res, next) => {
  try {
    const result = await authService.register(req.body, req.user)
    res.status(201).json(result)
  } catch (error) {
    next(error)
  }
}

const login = async (req, res, next) => {
  try {
    const result = await authService.login(req.body)
    res.json(result)
  } catch (error) {
    next(error)
  }
}

const getProfile = async (req, res, next) => {
  try {
    const profile = await authService.getProfile(req.user.id)
    res.json(profile)
  } catch (error) {
    next(error)
  }
}

module.exports = {
  register,
  login,
  getProfile,
}
