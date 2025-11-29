const path = require("path")
const fs = require("fs").promises
const userRepository = require("../repositories/userRepository")

const uploadAvatar = async (file, userId) => {
  if (!file) {
    throw new Error("Nenhum arquivo enviado")
  }

  // Validar tipo de arquivo
  const allowedTypes = ["image/jpeg", "image/png", "image/gif"]
  if (!allowedTypes.includes(file.mimetype)) {
    throw new Error("Tipo de arquivo não permitido. Use JPEG, PNG ou GIF.")
  }

  // Gerar nome único para o arquivo
  const fileExtension = path.extname(file.originalname)
  const fileName = `avatar_${userId}_${Date.now()}${fileExtension}`
  const filePath = `/uploads/avatars/${fileName}`

  // Criar diretório se não existir
  const uploadDir = path.join(process.cwd(), "uploads", "avatars")
  try {
    await fs.access(uploadDir)
  } catch {
    await fs.mkdir(uploadDir, { recursive: true })
  }

  // Salvar arquivo
  const fullPath = path.join(uploadDir, fileName)
  await fs.writeFile(fullPath, file.buffer)

  // Atualizar usuário com novo avatar
  const user = await userRepository.update(userId, { avatar: filePath })

  return {
    message: "Avatar atualizado com sucesso",
    avatar: filePath,
    user: {
      id: user.id,
      name: user.name,
      avatar: user.avatar,
    },
  }
}

module.exports = {
  uploadAvatar,
}
