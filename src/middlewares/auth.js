// src/middlewares/auth.js
const jwt = require("jsonwebtoken")
const prisma = require("../config/database")

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"]
    const token = authHeader && authHeader.split(" ")[1]

    if (!token) {
      console.log("⚠️ Autenticação falhou: Nenhum token fornecido.");
      return res.status(401).json({ error: "Token de acesso requerido" })
    }

    // 💡 LOG: Verificar se a Secret existe
    if (!process.env.JWT_SECRET) {
      console.error("❌ ERRO CRÍTICO: JWT_SECRET não definida no .env do backend!");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    
    // 💡 LOG: Ver o que tem dentro do token decodificado
    console.log("🔑 Token decodificado com sucesso:", decoded);
    
    const currentId = decoded.id || decoded.userId || decoded.sub;
    console.log("🆔 ID extraído para busca:", currentId);

    if (!currentId) {
      console.error("❌ Erro: O token não contém 'id' ou 'userId'. Verifique o authService.login");
      return res.status(403).json({ error: "Token inválido: payload incompleto" });
    }

    // 1. Tenta buscar na tabela de Usuários (Coach/Admin)
    let user = await prisma.user.findUnique({
      where: { id: currentId },
      select: { id: true, email: true, name: true, role: true, userType: true, avatar: true }
    })

    // 2. Se não encontrar, busca na tabela de Alunos (Caso da Maria Julia)
    if (!user) {
      console.log(`🔎 Usuário não encontrado em 'users', buscando id ${currentId} em 'alunos'...`);
      const aluno = await prisma.aluno.findUnique({
        where: { id: currentId },
        select: { id: true, email: true, nomeCompleto: true, plano: true, coachId: true }
      })

      if (aluno) {
        console.log("✅ Aluno Maria Julia encontrado!");
        user = {
          id: aluno.id,
          email: aluno.email,
          name: aluno.nomeCompleto,
          coachId: aluno.coachId,
          role: "USER",
          userType: "STUDENT" 
        }
      }
    }

    if (!user) {
      console.log(`❌ FIM: Usuário com ID ${currentId} não existe em nenhuma tabela.`);
      return res.status(401).json({ error: "Usuário não encontrado" })
    }

    req.user = user
    next()
  } catch (error) {
    console.error("🚫 Erro na validação do JWT:", error.message);
    return res.status(403).json({ error: "Token inválido ou expirado" })
  }
}

// ... restante dos middlewares (requireAdmin, etc) permanecem iguais

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
