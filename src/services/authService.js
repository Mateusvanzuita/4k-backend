const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const userRepository = require("../repositories/userRepository")
const notificationService = require("./notificationService")
const studentRepository = require("../repositories/alunoRepository");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();


const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  })
}

const register = async (userData, currentUser) => {
  const { email, password, name, userType } = userData

  // Verificar se apenas coaches podem cadastrar alunos
  if (userType === "STUDENT" && (!currentUser || currentUser.userType !== "COACH")) {
    throw new Error("Apenas coaches podem cadastrar alunos")
  }

  // Verificar se email já existe
  const existingUser = await userRepository.findByEmail(email)
  if (existingUser) {
    throw new Error("Email já está em uso")
  }

  // Hash da senha
  const hashedPassword = await bcrypt.hash(password, 10)

  // Criar usuário
  const newUser = await userRepository.create({
    email,
    password: hashedPassword,
    name,
    userType,
    role: userType === "COACH" ? "USER" : "USER", // Apenas Gabriel e Ingrid são ADMIN
    coachId: userType === "STUDENT" ? currentUser?.id : null,
  })

  // Enviar notificação de boas-vindas
  if (userType === "STUDENT") {
    await notificationService.createNotification(
        {
          title: "Primeiro Acesso Realizado! 🚀",
          message: `${student.nomeCompleto} acabou de entrar no app pela primeira vez!`,
          receiverId: student.coachId,
        },
        null // Passamos null aqui para evitar o erro de chave estrangeira
      );
  }

  const token = generateToken(newUser.id)

  return {
    user: {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
      userType: newUser.userType,
    },
    token,
  }
}

// src/services/authService.js

const login = async ({ email, password }) => {
  // 1. Tenta buscar primeiro na tabela de usuários (Coach/Admin)
  let user = await userRepository.findByEmail(email);
  let dbPassword = user?.password;
  let userTypeFound = user?.userType;
  let coachIdToNotify = null; // Para guardar o ID do coach caso seja aluno

  // 2. Se NÃO achar em 'users', tenta buscar na tabela de 'alunos'
  if (!user) {
    // 💡 IMPORTANTE: Incluímos o coachId na busca para saber quem notificar
    const student = await prisma.aluno.findUnique({ where: { email } });
    
    if (!student) {
      throw new Error("Credenciais inválidas");
    }

    // Lógica de Primeiro Acesso
    if (student.primeiroAcesso === false) {
      await studentRepository.updateFirstAccess(student.id);
      
      await notificationService.createNotification(
        {
          title: "Primeiro Acesso Realizado! 🚀",
          message: `${student.nomeCompleto} acabou de entrar no app pela primeira vez!`,
          receiverId: student.coachId,
        },
        null // 💡 ALTERAÇÃO: Mude de student.id para null aqui
      ).catch(err => console.error("Erro ao enviar notificação:", err));
    }

    user = {
      id: student.id,
      email: student.email,
      name: student.nomeCompleto,
      userType: "STUDENT",
      role: "USER"
    };
    dbPassword = student.senha;
    userTypeFound = "STUDENT";
  }

  // 3. Compara a senha (continua igual...)
  const isPasswordValid = await bcrypt.compare(password, dbPassword);
  if (!isPasswordValid) {
    throw new Error("Credenciais inválidas");
  }

  const token = generateToken(user.id);

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      userType: userTypeFound,
      avatar: user.avatar || null,
    },
    token,
  };
};

const getProfile = async (userId) => {
  const user = await userRepository.findById(userId)
  if (!user) {
    throw new Error("Usuário não encontrado")
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    userType: user.userType,
    avatar: user.avatar,
    createdAt: user.createdAt,
  }
}

module.exports = {
  register,
  login,
  getProfile,
}
