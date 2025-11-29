const uploadService = require("../services/uploadService")

const uploadAvatar = async (req, res, next) => {
  try {
    const result = await uploadService.uploadAvatar(req.file, req.user.id)
    res.json(result)
  } catch (error) {
    next(error)
  }
}

module.exports = {
  uploadAvatar,
}
