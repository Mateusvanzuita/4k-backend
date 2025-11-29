const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const userRepository = require("../repositories/userRepository")
const notificationService = require("./notificationService")

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
        title: "Bem-vindo ao 4K Team!",
        message: `Olá ${name}, você foi cadastrado como aluno. Bem-vindo à equipe!`,
        receiverId: newUser.id,
      },
      currentUser.id,
    )
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

const login = async ({ email, password }) => {
  const user = await userRepository.findByEmail(email)
  if (!user) {
    throw new Error("Credenciais inválidas")
  }

  const isPasswordValid = await bcrypt.compare(password, user.password)
  if (!isPasswordValid) {
    throw new Error("Credenciais inválidas")
  }

  const token = generateToken(user.id)

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      userType: user.userType,
      avatar: user.avatar,
    },
    token,
  }
}

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
