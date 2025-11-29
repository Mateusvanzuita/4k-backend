const errorHandler = (err, req, res, next) => {
  console.error(err.stack)

  // Prisma errors
  if (err.code === "P2002") {
    return res.status(400).json({
      error: "Dados duplicados",
      message: "Este registro já existe no sistema",
    })
  }

  if (err.code === "P2025") {
    return res.status(404).json({
      error: "Registro não encontrado",
    })
  }

  // Validation errors
  if (err.name === "ValidationError") {
    return res.status(400).json({
      error: "Dados inválidos",
      details: err.errors,
    })
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      error: "Token inválido",
    })
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      error: "Token expirado",
    })
  }

  // Default error
  res.status(500).json({
    error: "Erro interno do servidor",
    message: process.env.NODE_ENV === "development" ? err.message : "Algo deu errado",
  })
}

module.exports = errorHandler
