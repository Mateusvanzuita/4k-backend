const userRepository = require("../repositories/userRepository")

const getUsers = async (filters = {}) => {
  return await userRepository.findMany(filters)
}

const getUserById = async (id) => {
  const user = await userRepository.findById(id)
  if (!user) {
    throw new Error("Usuário não encontrado")
  }
  return user
}

const updateUser = async (id, updateData, currentUser) => {
  // Verificar permissões
  if (currentUser.role !== "ADMIN" && currentUser.id !== id) {
    throw new Error("Sem permissão para atualizar este usuário")
  }

  const user = await userRepository.update(id, updateData)
  if (!user) {
    throw new Error("Usuário não encontrado")
  }

  return user
}

const deleteUser = async (id, currentUser) => {
  // Apenas ADMINs podem deletar usuários
  if (currentUser.role !== "ADMIN") {
    throw new Error("Sem permissão para deletar usuários")
  }

  await userRepository.delete(id)
}

const getStudentsByCoach = async (coachId) => {
  return await userRepository.findStudentsByCoach(coachId)
}

module.exports = {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  getStudentsByCoach,
}
