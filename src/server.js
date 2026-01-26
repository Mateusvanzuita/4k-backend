require("dotenv").config()
const express = require("express")
const cors = require("cors")
const helmet = require("helmet")
const rateLimit = require("express-rate-limit")
const swaggerJsdoc = require("swagger-jsdoc")
const swaggerUi = require("swagger-ui-express")

const authRoutes = require("./routes/authRoutes")
const userRoutes = require("./routes/userRoutes")
const notificationRoutes = require("./routes/notificationRoutes")
const uploadRoutes = require("./routes/uploadRoutes")
const studentRoutes = require("./routes/alunoRoutes")
const dashboardRoutes = require("./routes/dashboardRoutes")
const alimentoRoutes = require("./routes/alimentoRoutes")
const exercicioRoutes = require("./routes/exercicioRoutes")
const suplementoRoutes = require("./routes/suplementoRoutes")
const hormonioRoutes = require("./routes/hormonioRoutes")
const protocoloRoutes = require("./routes/protocoloRoutes")
const relatorioRoutes = require("./routes/relatorioRoutes");
const evolucaoRoutes = require("./routes/evolucaoRoutes");

const errorHandler = require("./middlewares/errorHandler")

const app = express()
const PORT = process.env.PORT || 3000

// Middlewares de segurança
app.use(helmet())
app.use(cors())

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requests por IP
})
app.use(limiter)

// Middlewares
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true }))

// Servir arquivos estáticos (uploads)
const path = require('path'); // Verifique se já existe no topo, se não, adicione

// Substitua a linha app.use("/uploads", express.static("uploads")) por:
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }, // 💡 Permite carregar fotos em domínios diferentes
    crossOriginOpenerPolicy: { policy: "unsafe-none" },    // 💡 Resolve o erro NotSameOrigin dos logs
  })
);

// Mantenha a configuração de arquivos estáticos que já fizemos
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "4K Team API",
      version: "1.0.0",
      description: "API para gerenciamento de equipes 4K",
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: "Servidor de desenvolvimento",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./src/routes/*.js"],
}

const specs = swaggerJsdoc(swaggerOptions)
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs))

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/notifications", notificationRoutes)
app.use("/api/upload", uploadRoutes)
app.use("/api/students", studentRoutes)
app.use("/api/dashboard", dashboardRoutes)
app.use("/api/alimentos", alimentoRoutes)
app.use("/api/exercicios", exercicioRoutes)
app.use("/api/suplementos", suplementoRoutes)
app.use("/api/hormonios", hormonioRoutes)
app.use("/api/protocolos", protocoloRoutes)
app.use("/api/relatorios", relatorioRoutes);
app.use("/api/evolucao", evolucaoRoutes);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() })
})

// Error handler
app.use(errorHandler)

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ error: "Rota não encontrada" })
})

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`)
  console.log(`📚 Documentação disponível em http://localhost:${PORT}/api-docs`)
})
