const studentRepository = require("../repositories/alunoRepository")
const bcrypt = require("bcryptjs")

class StudentService {
  async createStudent(studentData) {
    if (studentData.dataNascimento) {
      const dateStr = studentData.dataNascimento
      const fullDateStr = dateStr.includes("T") ? dateStr : `${dateStr}T00:00:00.000Z`

      const birthDate = new Date(fullDateStr)
      const today = new Date()

      let age = today.getFullYear() - birthDate.getFullYear()
      const monthDiff = today.getMonth() - birthDate.getMonth()

      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--
      }

      studentData.idade = age
      studentData.dataNascimento = birthDate
    }

    // ===== Criar hash da senha =====
    if (studentData.senha) {
      studentData.senha = await bcrypt.hash(studentData.senha, 10)
    }

    // ===== Ajustar nome =====
    studentData.nomeCompleto = studentData.nomeAluno

    return await studentRepository.create(studentData)
  }

  async getStudents(filters, pagination) {
    return await studentRepository.findMany(filters, pagination)
  }

  async getStudentById(id, coachId) {
    return await studentRepository.findById(id, coachId)
  }

  async updateStudent(id, updateData, coachId) {
    if (updateData.dataNascimento) {
      const dateStr = updateData.dataNascimento
      const fullDateStr = dateStr.includes("T") ? dateStr : `${dateStr}T00:00:00.000Z`

      const birthDate = new Date(fullDateStr)
      const today = new Date()

      let age = today.getFullYear() - birthDate.getFullYear()
      const monthDiff = today.getMonth() - birthDate.getMonth()

      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--
      }

      updateData.idade = age
      updateData.dataNascimento = birthDate
    }

    // Hash se trocar senha
    if (updateData.senha) {
      updateData.senha = await bcrypt.hash(updateData.senha, 10)
    }

    // Nome atualizado
    if (updateData.nomeAluno) {
      updateData.nomeCompleto = updateData.nomeAluno
    }

    return await studentRepository.update(id, updateData, coachId)
  }

  async deleteStudent(id, coachId) {
    return await studentRepository.delete(id, coachId)
  }
}

module.exports = new StudentService()
