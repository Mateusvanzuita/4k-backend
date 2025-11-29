const jwt = require("jsonwebtoken")
const prisma = require("../config/database")

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"]
    const token = authHeader && authHeader.split(" ")[1]

    if (!token) {
      return res.status(401).json({ error: "Token de acesso requerido" })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        userType: true,
        avatar: true,
      },
    })

    if (!user) {
      return res.status(401).json({ error: "Usuário não encontrado" })
    }

    req.user = user
    next()
  } catch (error) {
    return res.status(403).json({ error: "Token inválido" })
  }
}

const requireAdmin = (req, res, next) => {
  if (req.user.role !== "ADMIN") {
    return res.status(403).json({ error: "Acesso negado. Apenas administradores." })
  }
  next()
}

const requireCoach = (req, res, next) => {
  if (req.user.userType !== "COACH") {
    return res.status(403).json({ error: "Acesso negado. Apenas coaches." })
  }
  next()
}

module.exports = {
  authenticateToken,
  requireAdmin,
  requireCoach,
}
